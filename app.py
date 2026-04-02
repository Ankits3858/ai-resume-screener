"""
AI-Powered Resume Screener
Author: Ankit Kumar
Email: ankit.a0523114022@gmail.com
LinkedIn: https://www.linkedin.com/in/ankit-kumar-58673221b/

A Flask application that uses NLP to scan and rank resumes against job descriptions.
"""

import os
import uuid
from flask import Flask, render_template, request, jsonify
from werkzeug.utils import secure_filename
from resume_analyzer import ResumeAnalyzer

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24).hex()
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'txt'}

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize the resume analyzer
analyzer = ResumeAnalyzer()


def allowed_file(filename):
    """Check if the file extension is allowed."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def cleanup_file(filepath):
    """Safely remove a file if it exists."""
    try:
        if os.path.exists(filepath):
            os.remove(filepath)
    except Exception as e:
        app.logger.error(f"Error cleaning up file {filepath}: {e}")


@app.route('/')
def index():
    """Render the main page."""
    return render_template('index.html')


@app.route('/analyze', methods=['POST'])
def analyze_resumes():
    """
    Analyze uploaded resumes against a job description.
    
    Expected form data:
    - job_description: Text of the job description
    - resumes: One or more resume files
    
    Returns:
    - JSON with ranked results and analysis
    """
    try:
        # Validate job description
        job_description = request.form.get('job_description', '').strip()
        if not job_description:
            return jsonify({
                'success': False,
                'error': 'Job description is required'
            }), 400
        
        if len(job_description) < 50:
            return jsonify({
                'success': False,
                'error': 'Job description should be at least 50 characters'
            }), 400
        
        # Validate files
        if 'resumes' not in request.files:
            return jsonify({
                'success': False,
                'error': 'No resume files uploaded'
            }), 400
        
        files = request.files.getlist('resumes')
        if not files or all(f.filename == '' for f in files):
            return jsonify({
                'success': False,
                'error': 'No resume files selected'
            }), 400
        
        # Process each resume
        results = []
        uploaded_files = []
        
        for file in files:
            if file and file.filename and allowed_file(file.filename):
                # Generate unique filename to prevent conflicts
                original_filename = secure_filename(file.filename)
                unique_filename = f"{uuid.uuid4().hex}_{original_filename}"
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
                
                try:
                    file.save(filepath)
                    uploaded_files.append(filepath)
                    
                    # Analyze the resume
                    analysis = analyzer.analyze_resume(filepath, job_description)
                    analysis['filename'] = original_filename
                    results.append(analysis)
                    
                except Exception as e:
                    app.logger.error(f"Error processing {original_filename}: {e}")
                    results.append({
                        'filename': original_filename,
                        'error': f'Failed to process: {str(e)}',
                        'score': 0
                    })
            elif file and file.filename:
                results.append({
                    'filename': file.filename,
                    'error': 'Unsupported file format. Please use PDF, DOCX, DOC, or TXT.',
                    'score': 0
                })
        
        # Clean up uploaded files
        for filepath in uploaded_files:
            cleanup_file(filepath)
        
        if not results:
            return jsonify({
                'success': False,
                'error': 'No valid resume files were processed'
            }), 400
        
        # Sort results by score (highest first)
        results.sort(key=lambda x: x.get('score', 0), reverse=True)
        
        # Add rank to each result
        for i, result in enumerate(results):
            result['rank'] = i + 1
        
        return jsonify({
            'success': True,
            'results': results,
            'total_analyzed': len([r for r in results if 'error' not in r])
        })
        
    except Exception as e:
        app.logger.error(f"Error in analyze_resumes: {e}")
        return jsonify({
            'success': False,
            'error': f'An unexpected error occurred: {str(e)}'
        }), 500


@app.route('/health')
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'message': 'Resume Screener is running'})


@app.errorhandler(413)
def too_large(e):
    """Handle file too large error."""
    return jsonify({
        'success': False,
        'error': 'File too large. Maximum size is 16MB.'
    }), 413


@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors."""
    return jsonify({
        'success': False,
        'error': 'Resource not found'
    }), 404


@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors."""
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500


if __name__ == '__main__':
    print("=" * 60)
    print("AI-Powered Resume Screener")
    print("Author: Ankit Kumar")
    print("=" * 60)
    print("\nStarting server at http://localhost:5000")
    print("Press Ctrl+C to stop the server\n")
    app.run(debug=True, host='0.0.0.0', port=5000)
