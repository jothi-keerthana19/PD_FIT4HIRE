# Fit4Hire - AI Resume Analyzer

## Introduction
Fit4Hire is an AI-powered resume analysis platform that helps job seekers optimize their resumes for Applicant Tracking Systems (ATS). The platform specializes in analyzing resumes for five key tech roles, providing instant feedback and actionable suggestions for improvement.

## Features
- **ATS Compatibility Analysis**: Evaluates resumes using a sophisticated scoring system
- **Role-Specific Analysis**: Specialized evaluation for Software Developer, Data Scientist, UX/UI Designer, Frontend Developer, and Product Manager roles
- **Multi-Format Support**: Processes PDF and DOCX files
- **Detailed Feedback**: Provides comprehensive analysis of resume structure, keywords, and skills
- **Smart Scoring**: Weighted evaluation system (Keywords: 30%, Skills: 50%, Structure: 20%)

## Tech Stack
### Backend
- Python 3.x
- Flask (Web Framework)
- Groq (AI Model Integration)
- PyPDF2 & python-docx (Document Processing)
- pytesseract (OCR Capabilities)

### Frontend
- React.js
- Material-UI
- Axios

## Installation Guide

### Prerequisites
- Python 3.x
- Node.js and npm
- Tesseract OCR
- Groq API Key

### Backend Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/fit4hire.git
cd fit4hire
```

2. Create and activate virtual environment
```bash
python -m venv venv
.\venv\Scripts\activate
```

3. Install dependencies
```bash
cd backend
pip install -r requirements.txt
```

4. Set up environment variables
Create a `.env` file in the backend directory:
```plaintext
GROQ_API_KEY=your_groq_api_key
FLASK_APP=app.py
FLASK_ENV=development
```

5. Run the backend server
```bash
flask run
```

### Frontend Setup
1. Navigate to frontend directory
```bash
cd ../frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

## Usage
1. Access the application at `http://localhost:3000`
2. Upload a resume in PDF or DOCX format
3. Select the target job role
4. Click "Analyze" to receive detailed feedback

## API Endpoints
- `POST /api/analyze`: Analyze resume
- `GET /api/roles`: Get available job roles
- `POST /api/feedback`: Submit feedback

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact
Your Name - [@yourtwitter](https://twitter.com/yourtwitter)
Project Link: [https://github.com/yourusername/fit4hire](https://github.com/yourusername/fit4hire)

## Acknowledgments
- Groq API for AI capabilities
- Tesseract OCR for image processing
- All contributors who have helped this project grow
