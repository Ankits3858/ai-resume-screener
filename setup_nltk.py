"""
Setup script for AI Resume Screener
Downloads required NLTK data packages
"""

import nltk

def setup_nltk():
    """Download required NLTK data packages."""
    print("Downloading NLTK data packages...")
    
    packages = [
        'punkt',
        'punkt_tab',
        'stopwords',
        'wordnet',
        'averaged_perceptron_tagger'
    ]
    
    for package in packages:
        print(f"  Downloading {package}...", end=" ")
        try:
            nltk.download(package, quiet=True)
            print("✓")
        except Exception as e:
            print(f"✗ ({e})")
    
    print("\nSetup complete!")

if __name__ == '__main__':
    setup_nltk()
