from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
from database import add_user, verify_user
import Fit
import Hire

app = Flask(__name__)

# Add these imports at the top of your file if not already present
from flask_cors import CORS

# After creating your Flask app, add this line
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Remove the previous @app.after_request decorator
# and replace with this one
@app.after_request
def add_cors_headers(response):
    origin = request.headers.get('Origin')
    if origin:
        response.headers['Access-Control-Allow-Origin'] = origin
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# JWT configuration
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # Change this in production
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False  # Tokens don't expire
jwt = JWTManager(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'jpg', 'jpeg', 'png'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

COMMON_SKILLS = [
    "Python", "JavaScript", "Java", "C++", "React", "Angular", "Vue.js",
    "Node.js", "Django", "Flask", "SQL", "MongoDB", "AWS", "Docker",
    "Kubernetes", "Git", "CI/CD", "Agile", "Scrum", "REST API",
    "Machine Learning", "Data Analysis", "Problem Solving",
    "Team Leadership", "Project Management", "Communication"
]

JOB_ROLE_SKILLS = {
    "Software Developer": [
        "Python", "JavaScript", "Java", "C++", "React", "Angular", "Vue.js",
        "Node.js", "Django", "Flask", "SQL", "Git", "Docker", "REST API"
    ],
    "Data Scientist": [
        "Python", "R", "SQL", "Machine Learning", "Deep Learning", "TensorFlow",
        "PyTorch", "Data Visualization", "Statistics", "Pandas", "NumPy"
    ],
    "DevOps Engineer": [
        "Docker", "Kubernetes", "AWS", "Azure", "Jenkins", "Git", "Linux",
        "Shell Scripting", "Ansible", "Terraform", "CI/CD"
    ],
    "Frontend Developer": [
        "HTML", "CSS", "JavaScript", "React", "Angular", "Vue.js", "TypeScript",
        "Webpack", "Redux", "REST API", "Responsive Design"
    ],
    "Backend Developer": [
        "Python", "Java", "Node.js", "SQL", "MongoDB", "Redis", "REST API",
        "Django", "Spring Boot", "Express.js", "Microservices"
    ],
    "Full Stack Developer": [
        "JavaScript", "Python", "React", "Node.js", "SQL", "MongoDB",
        "HTML", "CSS", "Git", "REST API", "Docker", "AWS"
    ]
}

def allowed_file(filename):
    """Check if the file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def structure_fit_response(analysis_text, ats_score):
    """Structure the response for fit analysis"""
    # Extract sections from analysis text
    sections = {
        "name": "",
        "job_role": "",
        "skills": "",
        "personal_info": "",
        "career_objective": "",
        "experience": "",
        "education": "",
        "additional_sections": "",
        "structure_formatting": "",
        "grammar_language": ""
    }
    
    # Parse the analysis text to populate sections
    current_section = ""
    lines = analysis_text.split('\n')
    for line in lines:
        if "Name:" in line:
            current_section = "name"
            sections["name"] = line.split("Name:")[1].strip()
        elif "Personal Information:" in line:
            current_section = "personal_info"
        elif "Career Objective / Summary:" in line:
            current_section = "career_objective"
        elif "Skills:" in line:
            current_section = "skills"
        elif "Experience:" in line:
            current_section = "experience"
        elif "Education:" in line:
            current_section = "education"
        elif "Additional Sections:" in line:
            current_section = "additional_sections"
        elif "Overall Structure and Formatting:" in line:
            current_section = "structure_formatting"
        elif "Grammar and Language:" in line:
            current_section = "grammar_language"
        elif current_section and line.strip():
            sections[current_section] += line.strip() + "\n"

    return {
        "ats_analysis": {
            "score": ats_score["score"],
            "strengths": ats_score["strengths"],
            "weaknesses": ats_score["weaknesses"],
            "keyword_score": ats_score["keyword_score"],
            "skill_score": ats_score["skill_score"],
            "structure_score": ats_score["structure_score"],
            "missing_skills": ats_score["missing_skills"]
        },
        "detailed_analysis": sections
    }

def structure_hire_response(analysis_text, ats_score):
    """Structure the response for hire analysis"""
    sections = {
        "candidate_overview": "",
        "technical_qualification": "",
        "professional_experience": "",
        "education_certifications": "",
        "red_flags": "",
        "candidate_strengths": "",
        "interview_recommendations": "",
        "hiring_recommendation": ""
    }
    
    current_section = ""
    lines = analysis_text.split('\n')
    for line in lines:
        if "Candidate Overview:" in line:
            current_section = "candidate_overview"
        elif "Technical Qualification Assessment:" in line:
            current_section = "technical_qualification"
        elif "Professional Experience:" in line:
            current_section = "professional_experience"
        elif "Education and Certifications:" in line:
            current_section = "education_certifications"
        elif "Red Flags and Concerns:" in line:
            current_section = "red_flags"
        elif "Candidate Strengths:" in line:
            current_section = "candidate_strengths"
        elif "Interview Recommendations:" in line:
            current_section = "interview_recommendations"
        elif "Hiring Recommendation:" in line:
            current_section = "hiring_recommendation"
        elif current_section and line.strip():
            sections[current_section] += line.strip() + "\n"

    return {
        "ats_analysis": {
            "score": ats_score["score"],
            "strengths": ats_score["strengths"],
            "weaknesses": ats_score["weaknesses"],
            "keyword_score": ats_score["keyword_score"],
            "skill_score": ats_score["skill_score"],
            "structure_score": ats_score["structure_score"],
            "missing_skills": ats_score["missing_skills"]
        },
        "recruitment_analysis": sections
    }


@app.route('/api/analyze-resume', methods=['POST'])
def analyze_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
        
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400

    try:
        # Get parameters
        role = request.form.get('role', request.form.get('jobRole', 'Software Developer'))
        skills = request.form.get('skills', None)
        mode = request.form.get('mode', 'fit')
        
        # Add UX Designer and Product Manager to JOB_ROLES if they don't exist
        if "UX Designer" not in Fit.JOB_ROLES:
            Fit.JOB_ROLES["UX Designer"] = {
                "keywords": [
                    "user experience", "user interface", "wireframing", "prototyping", "usability testing",
                    "user research", "information architecture", "interaction design", "UX", "UI",
                    "user-centered design", "personas", "journey mapping", "accessibility", "responsive design"
                ],
                "skills": [
                    "Figma", "Sketch", "Adobe XD", "InVision", "Axure", "Balsamiq", "Zeplin",
                    "user research", "wireframing", "prototyping", "usability testing", "interaction design",
                    "visual design", "information architecture", "responsive design", "accessibility",
                    "HTML", "CSS", "JavaScript", "design thinking", "user-centered design"
                ]
            }
        
        if "Product Manager" not in Fit.JOB_ROLES:
            Fit.JOB_ROLES["Product Manager"] = {
                "keywords": [
                    "product strategy", "roadmap", "user stories", "market research", "competitive analysis",
                    "product development", "agile", "scrum", "sprint", "backlog", "prioritization",
                    "stakeholder management", "product lifecycle", "KPI", "metrics", "A/B testing"
                ],
                "skills": [
                    "product strategy", "roadmap planning", "user stories", "market research",
                    "competitive analysis", "agile methodologies", "scrum", "sprint planning",
                    "backlog management", "stakeholder communication", "data analysis",
                    "A/B testing", "product lifecycle management", "prioritization",
                    "JIRA", "Confluence", "product requirements", "user interviews", "wireframing"
                ]
            }
        
        # Process custom skills
        if skills:
            custom_skills = [skill.strip() for skill in skills.split(',')]
        else:
            # If no custom skills provided, use role-specific skills
            if role in JOB_ROLE_SKILLS:
                custom_skills = JOB_ROLE_SKILLS[role]
            else:
                custom_skills = None

        # Save file
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
            # Process resume based on mode
            if mode == 'hire':
                result = Hire.process_resume(filepath, role, custom_skills)
                structured_response = structure_hire_response(result['analysis'], result['ats_score'])
            else:
                result = Fit.process_resume(filepath, role, custom_skills)
                structured_response = structure_fit_response(result['analysis'], result['ats_score'])

            # Add job role to response for frontend reference
            structured_response['job_role'] = role
            
            # Clean up uploaded file
            os.remove(filepath)
            
            return jsonify(structured_response)

        except Exception as e:
            # Clean up file in case of processing error
            if os.path.exists(filepath):
                os.remove(filepath)
            print(f"Error processing resume for role '{role}': {str(e)}")
            raise e

    except Exception as e:
        print(f"Error in analyze_resume endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/job-roles', methods=['GET'])
def get_job_roles():
    """Return available job roles"""
    try:
        return jsonify(list(Fit.JOB_ROLES.keys()))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/role-details/<role>', methods=['GET'])
def get_role_details(role):
    """Return details for a specific job role"""
    try:
        if role not in Fit.JOB_ROLES:
            return jsonify({'error': 'Role not found'}), 404
            
        return jsonify(Fit.JOB_ROLES[role])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/skills', methods=['GET'])
def get_skills():
    """Return available skills, optionally filtered by role"""
    try:
        role = request.args.get('role')
        if role and role in JOB_ROLE_SKILLS:
            return jsonify(JOB_ROLE_SKILLS[role])
        return jsonify(COMMON_SKILLS)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        username = data.get('username', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        # Validate input
        if not all([username, email, password]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Password must be at least 6 characters'}), 400
        
        if '@' not in email:
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Try to add user
        if add_user(username, email, password):
            return jsonify({
                'message': 'Registration successful',
                'username': username,
                'email': email
            }), 201
        else:
            return jsonify({'error': 'Email or username already exists'}), 409
            
    except Exception as e:
        print(f"Registration error: {str(e)}")  # For debugging
        return jsonify({'error': 'Registration failed'}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
            
        email = data.get('email', '').strip()
        password = data.get('password', '').strip()
        
        # Validate input
        if not all([email, password]):
            return jsonify({'error': 'Missing email or password'}), 400
            
        # Verify user
        user = verify_user(email, password)
        if user:
            access_token = create_access_token(identity=user['id'])
            return jsonify({
                'token': access_token,
                'username': user['username'],
                'message': 'Login successful'
            }), 200
        return jsonify({'error': 'Invalid credentials'}), 401
        
    except Exception as e:
        print(f"Login error: {str(e)}")  # For debugging
        return jsonify({'error': 'Login failed'}), 500

from report import generate_report_from_analysis

# Make sure this endpoint exists and is properly defined
@app.route('/api/reports/generate', methods=['POST'])
def generate_report_endpoint():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided", "success": False}), 400
        
    analysis_data = data.get('analysisData')
    job_description = data.get('jobDescription')
    
    if not analysis_data:
        return jsonify({"error": "Missing analysis data", "success": False}), 400
        
    if not job_description:
        return jsonify({"error": "Missing job description", "success": False}), 400
    
    try:
        # Print the received data for debugging
        print(f"Received analysis data: {type(analysis_data)}")
        print(f"Received job description: {job_description[:100]}...")
        
        # Extract the detailed analysis if it exists in the structure
        detailed_analysis = None
        if isinstance(analysis_data, dict):
            if 'detailed_analysis' in analysis_data:
                detailed_analysis = analysis_data['detailed_analysis']
            elif 'ats_analysis' in analysis_data and any(key in analysis_data for key in ['detailed_analysis', 'recruitment_analysis']):
                # Handle both fit and hire analysis formats
                detailed_analysis = analysis_data.get('detailed_analysis') or analysis_data.get('recruitment_analysis')
        
        # Use the appropriate data for report generation
        report_data = detailed_analysis if detailed_analysis else analysis_data
        
        # Generate the report
        report = generate_report_from_analysis(report_data, job_description)
        
        return jsonify({
            "success": True,
            "report": report
        })
    except Exception as e:
        print(f"Error generating report: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e), "success": False}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)