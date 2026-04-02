/**
 * AI Resume Screener - Main JavaScript
 * Author: Ankit Kumar
 * 
 * Handles form submissions, file uploads, and display of analysis results.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

/**
 * Initialize all application components
 */
function initializeApp() {
    initFileUpload();
    initFormSubmission();
    initCharacterCounter();
    initSmoothScroll();
    initEmailLinks();
}

/**
 * Initialize email link handlers to ensure mailto works
 */
function initEmailLinks() {
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const email = this.getAttribute('href');
            window.location.href = email;
        });
    });
}

/**
 * Initialize file upload functionality with drag and drop
 */
function initFileUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('resumeFiles');
    const fileList = document.getElementById('fileList');
    
    if (!uploadZone || !fileInput) return;
    
    // Store selected files
    let selectedFiles = new DataTransfer();
    
    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // Highlight drop zone
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => {
            uploadZone.classList.add('dragover');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, () => {
            uploadZone.classList.remove('dragover');
        }, false);
    });
    
    // Handle dropped files
    uploadZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        handleFiles(files);
    }, false);
    
    // Handle file selection via click
    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });
    
    /**
     * Process and display selected files
     */
    function handleFiles(files) {
        const allowedTypes = [
            'application/pdf', 
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'text/plain'
        ];
        
        const allowedExtensions = ['pdf', 'docx', 'doc', 'txt'];
        
        Array.from(files).forEach(file => {
            const extension = file.name.split('.').pop().toLowerCase();
            
            // Validate file type
            if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(extension)) {
                showError(`File "${file.name}" is not supported. Please use PDF, DOCX, DOC, or TXT files.`);
                return;
            }
            
            // Validate file size (16MB max)
            if (file.size > 16 * 1024 * 1024) {
                showError(`File "${file.name}" is too large. Maximum size is 16MB.`);
                return;
            }
            
            // Check for duplicates
            let isDuplicate = false;
            for (let i = 0; i < selectedFiles.files.length; i++) {
                if (selectedFiles.files[i].name === file.name) {
                    isDuplicate = true;
                    break;
                }
            }
            
            if (!isDuplicate) {
                selectedFiles.items.add(file);
            }
        });
        
        // Update the file input
        fileInput.files = selectedFiles.files;
        
        // Update the display
        updateFileList();
    }
    
    /**
     * Update the file list display
     */
    function updateFileList() {
        fileList.innerHTML = '';
        
        if (selectedFiles.files.length === 0) {
            return;
        }
        
        Array.from(selectedFiles.files).forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div>
                    <i class="bi bi-file-earmark-text"></i>
                    <span>${escapeHtml(file.name)}</span>
                    <span class="file-size">(${formatFileSize(file.size)})</span>
                </div>
                <span class="remove-file" data-index="${index}" title="Remove file">
                    <i class="bi bi-x-lg"></i>
                </span>
            `;
            fileList.appendChild(fileItem);
        });
        
        // Add remove handlers
        document.querySelectorAll('.remove-file').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                removeFile(index);
            });
        });
    }
    
    /**
     * Remove a file from the selection
     */
    function removeFile(index) {
        const newFiles = new DataTransfer();
        
        Array.from(selectedFiles.files).forEach((file, i) => {
            if (i !== index) {
                newFiles.items.add(file);
            }
        });
        
        selectedFiles = newFiles;
        fileInput.files = selectedFiles.files;
        updateFileList();
    }
    
    // Expose for form reset
    window.resetFileUpload = function() {
        selectedFiles = new DataTransfer();
        fileInput.files = selectedFiles.files;
        fileList.innerHTML = '';
    };
}

/**
 * Initialize form submission handling
 */
function initFormSubmission() {
    const form = document.getElementById('analyzerForm');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const loadingIndicator = document.getElementById('loadingIndicator');
    const resultsSection = document.getElementById('resultsSection');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsCount = document.getElementById('resultsCount');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form data
        const jobDescription = document.getElementById('jobDescription').value.trim();
        const files = document.getElementById('resumeFiles').files;
        
        // Validation
        if (!jobDescription) {
            showError('Please enter a job description.');
            return;
        }
        
        if (jobDescription.length < 50) {
            showError('Job description should be at least 50 characters for accurate analysis.');
            return;
        }
        
        if (files.length === 0) {
            showError('Please upload at least one resume.');
            return;
        }
        
        // Prepare form data
        const formData = new FormData();
        formData.append('job_description', jobDescription);
        
        for (let i = 0; i < files.length; i++) {
            formData.append('resumes', files[i]);
        }
        
        // Show loading state
        analyzeBtn.disabled = true;
        analyzeBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Analyzing...';
        loadingIndicator.style.display = 'block';
        resultsSection.style.display = 'none';
        
        try {
            const response = await fetch('/analyze', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                displayResults(data.results, data.total_analyzed);
            } else {
                showError(data.error || 'An error occurred during analysis.');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Failed to connect to the server. Please try again.');
        } finally {
            // Reset button state
            analyzeBtn.disabled = false;
            analyzeBtn.innerHTML = '<i class="bi bi-search me-2"></i>Analyze Resumes';
            loadingIndicator.style.display = 'none';
        }
    });
}

/**
 * Display analysis results
 */
function displayResults(results, totalAnalyzed) {
    const resultsSection = document.getElementById('resultsSection');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsCount = document.getElementById('resultsCount');
    
    resultsSection.style.display = 'block';
    resultsCount.textContent = `${totalAnalyzed} resume${totalAnalyzed !== 1 ? 's' : ''} analyzed successfully`;
    resultsContainer.innerHTML = '';
    
    results.forEach((result, index) => {
        const card = createResultCard(result, index);
        resultsContainer.appendChild(card);
    });
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Create a result card element
 */
function createResultCard(result, index) {
    const card = document.createElement('div');
    
    if (result.error) {
        card.className = 'result-card result-error';
        card.innerHTML = `
            <div class="result-header">
                <div class="result-rank">
                    <div class="rank-badge rank-default">${result.rank || '-'}</div>
                    <div class="result-filename">${escapeHtml(result.filename)}</div>
                </div>
            </div>
            <div class="error-message">
                <i class="bi bi-exclamation-circle"></i>
                <span>${escapeHtml(result.error)}</span>
            </div>
        `;
        return card;
    }
    
    const rankClass = result.rank <= 3 ? `rank-${result.rank}` : 'rank-default';
    const scoreClass = result.recommendation_class || 'moderate';
    
    card.className = 'result-card';
    card.innerHTML = `
        <div class="result-header">
            <div class="result-rank">
                <div class="rank-badge ${rankClass}">${result.rank}</div>
                <div class="result-filename">${escapeHtml(result.filename)}</div>
            </div>
            <div class="result-score">
                <div class="score-value ${scoreClass}">${result.score}%</div>
                <div class="score-label ${scoreClass}">${result.recommendation}</div>
            </div>
        </div>
        <div class="result-body">
            <!-- Metrics Grid -->
            <div class="metrics-grid">
                <div class="metric-item">
                    <div class="metric-value">${result.metrics?.semantic_similarity || 0}%</div>
                    <div class="metric-label">Semantic Match</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${result.metrics?.keyword_match || 0}%</div>
                    <div class="metric-label">Keyword Match</div>
                </div>
                <div class="metric-item">
                    <div class="metric-value">${result.metrics?.skill_match || 0}%</div>
                    <div class="metric-label">Skill Match</div>
                </div>
            </div>
            
            <!-- Skills Section -->
            ${createSkillsSection(result.skills)}
            
            <!-- Experience & Education -->
            <div class="mb-3">
                <span class="badge bg-primary me-2">
                    <i class="bi bi-briefcase me-1"></i>
                    ${result.experience_years || 0}+ Years Experience
                </span>
                ${createEducationBadges(result.education)}
            </div>
            
            <!-- Keywords Section -->
            <div class="keywords-section">
                <div class="keywords-column">
                    <h6><i class="bi bi-check-circle text-success"></i> Matched Keywords</h6>
                    <div class="keywords-list">
                        ${(result.keywords?.matched || []).slice(0, 10).map(k => 
                            `<span class="keyword">${escapeHtml(k)}</span>`
                        ).join('') || '<span class="text-muted">None found</span>'}
                    </div>
                </div>
                <div class="keywords-column">
                    <h6><i class="bi bi-exclamation-circle text-warning"></i> Missing Keywords</h6>
                    <div class="keywords-list">
                        ${(result.keywords?.missing || []).slice(0, 8).map(k => 
                            `<span class="keyword">${escapeHtml(k)}</span>`
                        ).join('') || '<span class="text-muted">None missing</span>'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * Create skills section HTML
 */
function createSkillsSection(skills) {
    if (!skills) return '';
    
    const matchedSkills = skills.matched_with_job || [];
    const missingSkills = skills.missing_from_resume || [];
    
    if (matchedSkills.length === 0 && missingSkills.length === 0) {
        return '';
    }
    
    let html = '<div class="skills-section">';
    
    if (matchedSkills.length > 0) {
        html += `
            <div class="mb-2">
                <span class="skills-title">Matched Skills:</span>
                <div class="skill-tags">
                    ${matchedSkills.slice(0, 10).map(skill => 
                        `<span class="skill-tag matched"><i class="bi bi-check"></i>${escapeHtml(skill)}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    if (missingSkills.length > 0) {
        html += `
            <div class="mb-2">
                <span class="skills-title">Missing Skills:</span>
                <div class="skill-tags">
                    ${missingSkills.slice(0, 8).map(skill => 
                        `<span class="skill-tag missing"><i class="bi bi-x"></i>${escapeHtml(skill)}</span>`
                    ).join('')}
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    return html;
}

/**
 * Create education badges
 */
function createEducationBadges(education) {
    if (!education) return '';
    
    const badges = [];
    
    if (education.phd) badges.push('<span class="badge bg-success">Ph.D.</span>');
    else if (education.masters) badges.push('<span class="badge bg-info">Master\'s</span>');
    else if (education.bachelors) badges.push('<span class="badge bg-secondary">Bachelor\'s</span>');
    else if (education.associate) badges.push('<span class="badge bg-secondary">Associate</span>');
    
    return badges.join(' ');
}

/**
 * Initialize character counter for job description
 */
function initCharacterCounter() {
    const jobDescription = document.getElementById('jobDescription');
    const charCount = document.getElementById('charCount');
    
    if (!jobDescription || !charCount) return;
    
    function updateCount() {
        charCount.textContent = jobDescription.value.length;
    }
    
    jobDescription.addEventListener('input', updateCount);
    updateCount();
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Show error message
 */
function showError(message) {
    // Create error toast
    const toast = document.createElement('div');
    toast.className = 'position-fixed top-0 end-0 p-3';
    toast.style.zIndex = '9999';
    toast.innerHTML = `
        <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-danger text-white">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong class="me-auto">Error</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
                ${escapeHtml(message)}
            </div>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
    
    // Add close button functionality
    toast.querySelector('.btn-close').addEventListener('click', () => {
        toast.remove();
    });
}

/**
 * Format file size for display
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    if (!text) return '';
    
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
