# Fit4Hire - AI Resume Analyzer 🎯

## Overview
Fit4Hire is an intelligent resume analysis platform that helps optimize resumes for ATS systems. Our platform specializes in analyzing resumes for five key tech roles, providing instant feedback and actionable suggestions for improvement.


## Project Structure
```
d:\fitvss\F4F\
├── backend/
│   ├── static/
│   │   ├── uploads/     # Temporary storage for uploaded resumes
│   │   └── assets/      # Static assets
│   ├── templates/
│   │   └── index.html   # Backend template
│   ├── Fit.py          # Core analysis engine
│   ├── app.py          # Flask application
│   ├── config.py       # Configuration settings
│   └── requirements.txt # Python dependencies
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── assets/     # Frontend static assets
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── styles/     # CSS styles
│   │   ├── utils/      # Utility functions
│   │   └── App.js      # Main React component
│   ├── package.json
│   └── README.md       # Frontend documentation
└── README.md           # Main project documentation
```



## ✨ Key Features
- 📊 **ATS Compatibility Analysis**
  - Keyword analysis (30% weight)
  - Skills assessment (50% weight)
  - Structure evaluation (20% weight)
- 🎯 **Role-Specific Analysis** for:
  - Software Developer
  - Data Scientist
  - UX/UI Designer
  - Frontend Developer
  - Product Manager
- 📝 **Document Support**
  - PDF files
  - DOCX files
- 💡 **Smart Feedback System**
  - Strength identification
  - Weakness analysis
  - Missing skills detection
  - Structure recommendations

## 🛠️ Tech Stack
- **Backend**
  - Python 3.x
  - Flask
  - Groq API
  - PyPDF2
  - python-docx
  - pytesseract

- **Frontend**
  - React.js
  - Material-UI
  - Axios

## 🚀 Getting Started

### Prerequisites
1. Install Python 3.x
2. Install Node.js and npm
3. Install Tesseract OCR
4. Get Groq API key

### Backend Setup
```bash
# Navigate to backend directory
cd d:\fitvss\F4F\backend

# Create virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Add the following content:
# GROQ_API_KEY=your_key
# FLASK_APP=app.py
# FLASK_ENV=development

# Start Flask server
flask run
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd d:\fitvss\F4F\frontend

# Install dependencies
npm install

# Start development server
npm start
```

## 📱 Usage Guide

1. **Upload Resume**
   - Support for PDF/DOCX formats
   - File size limit: 10MB

2. **Select Job Role**
   - Choose from 5 specialized tech roles
   - Custom skill requirements option

3. **View Analysis**
   - Overall ATS score
   - Keyword match analysis
   - Skills assessment
   - Structure evaluation
   - Improvement suggestions

## 🔧 Configuration

### Backend Configuration
- Set environment variables in `.env`
- Adjust file upload settings in `config.py`
- Configure Groq API settings

### Frontend Configuration
- API endpoint configuration in `.env`
- Theme customization in `src/styles`
- Component settings in `src/config`

## 📈 Development

### Running Tests
```bash
# Backend tests
cd F4F
cd backend
python -m pytest

# Frontend tests
cd F4F
cd frontend
npm test
```

### Code Style
- Backend: PEP 8
- Frontend: ESLint + Prettier

## 🤝 Contributing
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request




---
Made with ❤️ by Team Fit4Hire
