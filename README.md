# 🤖 AI-Powered Resume Screener

<div align="center">

![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![NLP](https://img.shields.io/badge/NLP-NLTK%20%7C%20scikit--learn-orange.svg)

**An intelligent resume screening tool that uses Natural Language Processing (NLP) to analyze and rank resumes against job descriptions.**

[Features](#-features) •
[Demo](#-demo) •
[Installation](#-installation) •
[Usage](#-usage) •
[Deployment](#-deployment) •
[Contributing](#-contributing)

</div>

---

## 📋 Overview

AI Resume Screener is a web-based application that helps recruiters and HR professionals quickly screen and rank candidate resumes against specific job requirements. Using advanced NLP techniques, it goes beyond simple keyword matching to understand the semantic context of both resumes and job descriptions.

### Why Use This Tool?

- **Save Time**: Screen hundreds of resumes in minutes instead of hours
- **Reduce Bias**: Objective, data-driven candidate ranking
- **Better Matches**: Find candidates you might have missed with manual screening
- **Actionable Insights**: Detailed breakdown of skills, keywords, and match scores

---

## ✨ Features

### Core Features

- 🔍 **Semantic Analysis** - TF-IDF vectorization for context-aware matching
- 🎯 **Multi-Factor Scoring** - Combines multiple metrics for accurate ranking
- 📊 **Detailed Reports** - Skills, keywords, experience, and education extraction
- 📁 **Multi-Format Support** - PDF, DOCX, DOC, and TXT files
- 🔄 **Batch Processing** - Upload and analyze multiple resumes at once
- 🔒 **Privacy First** - All processing happens locally, no data stored

### Analysis Metrics

| Metric | Weight | Description |
|--------|--------|-------------|
| Semantic Similarity | 30% | Contextual relevance using TF-IDF |
| Keyword Match | 25% | Direct keyword overlap |
| Skill Match | 30% | Technical and soft skill alignment |
| Experience | 15% | Years of relevant experience |

### Skill Categories Detected

- **Programming Languages**: Python, Java, JavaScript, C++, and 20+ more
- **Frameworks**: React, Django, Flask, Spring, Node.js, etc.
- **Databases**: MySQL, PostgreSQL, MongoDB, Redis, etc.
- **Cloud Platforms**: AWS, Azure, GCP, Docker, Kubernetes
- **Tools**: Git, Jenkins, Jira, and more
- **Soft Skills**: Leadership, Communication, Teamwork, etc.

---

## 🖥️ Demo

### Home Page
The modern, responsive interface makes it easy to get started.

### Analysis Results
View detailed rankings with comprehensive match breakdowns.

---

## 🚀 Installation

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ankits3858/ai-resume-screener.git
   cd ai-resume-screener
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Download NLTK data**
   ```bash
   python setup_nltk.py
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Open in browser**
   ```
   http://localhost:5000
   ```

---

## 📖 Usage

### Step 1: Enter Job Description
Paste the complete job description including:
- Required skills and qualifications
- Years of experience needed
- Education requirements
- Job responsibilities

### Step 2: Upload Resumes
- Drag and drop or click to upload
- Supports PDF, DOCX, DOC, and TXT formats
- Upload multiple files for batch processing
- Maximum file size: 16MB per file

### Step 3: Analyze
Click "Analyze Resumes" and wait for the AI to process your files.

### Step 4: Review Results
- Resumes are ranked by overall match score
- View detailed metrics for each candidate
- See matched and missing skills/keywords
- Export or use results for your hiring decisions

---

## 🌐 Deployment

### Deploy to GitHub Pages (Frontend Only)

For the static frontend, you can use GitHub Pages. However, this application requires a Python backend, so consider the following options:

### Option 1: Deploy to Heroku (Recommended)

1. **Create a Heroku account** at [heroku.com](https://heroku.com)

2. **Install Heroku CLI**
   ```bash
   # Windows (PowerShell)
   winget install Heroku.HerokuCLI

   # macOS
   brew tap heroku/brew && brew install heroku
   ```

3. **Login and create app**
   ```bash
   heroku login
   heroku create your-app-name
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Open your app**
   ```bash
   heroku open
   ```

### Option 2: Deploy to Render

1. Create account at [render.com](https://render.com)
2. Connect your GitHub repository
3. Create a new "Web Service"
4. Configure:
   - **Build Command**: `pip install -r requirements.txt && python setup_nltk.py`
   - **Start Command**: `gunicorn app:app`
5. Deploy automatically on push

### Option 3: Deploy to Railway

1. Visit [railway.app](https://railway.app)
2. Connect GitHub repository
3. Railway auto-detects Python and deploys
4. Custom domain available on paid plans

### Option 4: Deploy to PythonAnywhere

1. Create account at [pythonanywhere.com](https://pythonanywhere.com)
2. Upload your code via Git
3. Configure WSGI file
4. Free tier available!

---

## 📂 Project Structure

```
ai-resume-screener/
├── app.py                 # Main Flask application
├── resume_analyzer.py     # NLP analysis engine
├── requirements.txt       # Python dependencies
├── setup_nltk.py         # NLTK data downloader
├── Procfile              # Heroku deployment config
├── runtime.txt           # Python version for Heroku
├── .gitignore            # Git ignore rules
├── README.md             # This file
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Custom styles
│   └── js/
│       └── main.js       # Frontend JavaScript
└── uploads/              # Temporary file storage (gitignored)
```

---

## 🛠️ Technical Details

### NLP Techniques Used

1. **TF-IDF Vectorization**
   - Converts text to numerical vectors
   - Weights terms by importance
   - Enables semantic comparison

2. **Cosine Similarity**
   - Measures document similarity
   - Scale: 0 (no match) to 1 (identical)

3. **Named Entity Recognition**
   - Extracts skills, education, experience
   - Pattern matching for specific keywords

4. **Lemmatization**
   - Reduces words to base form
   - Improves matching accuracy

### Technologies Stack

| Component | Technology |
|-----------|------------|
| Backend | Python 3.11, Flask |
| NLP | NLTK, scikit-learn |
| Document Parsing | PyPDF2, python-docx |
| Frontend | HTML5, CSS3, JavaScript |
| UI Framework | Bootstrap 5 |
| Icons | Bootstrap Icons |
| Deployment | Gunicorn, Heroku |

---

## 🔒 Privacy & Security

- ✅ All processing happens locally on the server
- ✅ Uploaded files are immediately deleted after analysis
- ✅ No data is stored or transmitted to third parties
- ✅ No tracking or analytics
- ✅ Open source - verify the code yourself

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Ideas for Contribution

- [ ] Add more file format support (ODT, RTF)
- [ ] Implement user authentication
- [ ] Add export to CSV/PDF functionality
- [ ] Create API endpoints for integration
- [ ] Add multi-language support
- [ ] Implement resume parsing improvements

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

<div align="center">

**Ankit Kumar**

[![GitHub](https://img.shields.io/badge/GitHub-Ankits3858-181717?style=for-the-badge&logo=github)](https://github.com/Ankits3858)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ankit%20Kumar-0077B5?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/ankit-kumar-58673221b/)
[![Email](https://img.shields.io/badge/Email-ankit.a0523114022%40gmail.com-D14836?style=for-the-badge&logo=gmail)](mailto:ankit.a0523114022@gmail.com)

</div>

---

## 🙏 Acknowledgments

- [NLTK](https://www.nltk.org/) - Natural Language Toolkit
- [scikit-learn](https://scikit-learn.org/) - Machine Learning in Python
- [Flask](https://flask.palletsprojects.com/) - Web Framework
- [Bootstrap](https://getbootstrap.com/) - CSS Framework
- [PyPDF2](https://pypdf2.readthedocs.io/) - PDF Processing

---

<div align="center">

**⭐ If you find this project useful, please give it a star! ⭐**

Made with ❤️ by [Ankit Kumar](https://github.com/Ankits3858)

</div>
