import os
import re
import json
from groq import Groq
import sys

# Initialize Groq client
client = Groq(api_key="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")

def generate_report_from_analysis(analysis_data, job_description):
    """
    Generate a comprehensive report comparing resume analysis to job description
    
    Args:
        analysis_data (dict): The detailed analysis of the resume
        job_description (str): The job description text
        
    Returns:
        dict: A structured report with match score, skills comparison, and recommendations
    """
    try:
        # Convert analysis_data to string if it's a dict
        analysis_text = json.dumps(analysis_data) if isinstance(analysis_data, dict) else analysis_data
        
        # Prepare prompt for Groq
        prompt = f"""
        You are an expert resume analyst and career coach with deep knowledge of ATS systems and industry hiring practices. I will provide you with a detailed analysis of a resume and a job description.
        Your task is to create a comprehensive, actionable report comparing the resume to the job requirements.
        
        Resume Analysis:
        {analysis_text}
        
        Job Description:
        {job_description}
        
        Please generate a detailed report in JSON format with the following structure:
        {{
            "candidateName": "Full name extracted from the resume",
            "candidateEmail": "Email address if available",
            "candidatePhone": "Phone number if available",
            "candidateLinkedIn": "LinkedIn profile URL if available",
            "candidateLocation": "Location if available",
            "matchScore": "A percentage (0-100) indicating how well the resume matches the job requirements",
            "atsScore": "Estimated ATS score percentage based on keyword matching and resume structure",
            "matchedSkills": ["List of skills that match the job requirements"],
            "missingSkills": ["List of important skills mentioned in the job description but missing from the resume"],
            "keywordAnalysis": "Analysis of how well the resume's keywords align with the job description",
            "experienceAnalysis": "Detailed analysis of how the candidate's experience aligns with the job requirements, including specific strengths and gaps",
            "educationDetails": {{
                "degree": "Degree obtained or pursuing",
                "institution": "Educational institution name",
                "graduationYear": "Year of graduation or expected graduation",
                "relevantCoursework": ["List of relevant courses if available"]
            }},
            "educationAnalysis": "Analysis of how the candidate's education aligns with the job requirements",
            "resumeStructureImprovements": [
                {{
                    "section": "Section name (e.g., 'Experience', 'Skills', 'Summary')",
                    "issue": "Description of the structural issue",
                    "recommendation": "Specific recommendation to improve this section",
                    "example": "Concrete example of the improved version"
                }}
            ],
            "contentImprovements": [
                {{
                    "section": "Section name",
                    "issue": "Description of the content issue",
                    "recommendation": "Specific recommendation to improve the content",
                    "example": "Concrete example of the improved version"
                }}
            ],
            "actionableRecommendations": [
                {{
                    "title": "Clear, actionable recommendation title",
                    "description": "Detailed description of the recommendation",
                    "priority": "High/Medium/Low",
                    "impact": "Description of how this change will improve ATS score or recruiter perception"
                }}
            ],
            "projectSuggestions": [
                {{
                    "title": "Specific project title",
                    "description": "Detailed description of the project that would enhance the candidate's portfolio",
                    "skills": ["Skills that would be demonstrated by this project"],
                    "difficulty": "Beginner/Intermediate/Advanced",
                    "resources": ["Links to tutorials or resources to help with this project"],
                    "example": "Brief example of what the completed project might look like"
                }}
            ],
            "courseSuggestions": [
                {{
                    "title": "Specific course or certification title",
                    "provider": "Course provider (e.g., Coursera, Udemy, LinkedIn Learning)",
                    "link": "Direct URL to the course",
                    "description": "Why this course would be beneficial for this specific role",
                    "duration": "Estimated time to complete",
                    "cost": "Free or estimated cost range"
                }}
            ],
            "atsOptimizationTips": [
                {{
                    "title": "Specific ATS optimization tip",
                    "description": "Detailed explanation of how to implement this tip",
                    "example": "Before/after example showing the improvement"
                }}
            ],
            "careerPathInsights": "Analysis of how this role fits into the candidate's career trajectory and potential future paths",
            "industrySpecificAdvice": "Advice specific to the industry of the job description"
        }}
        
        Important guidelines:
        1. Be extremely specific and actionable in all recommendations
        2. For course suggestions, include actual course names and real links from platforms like Coursera, Udemy, LinkedIn Learning, etc.
        3. For project suggestions, provide detailed project ideas that would genuinely enhance the candidate's portfolio for this specific role
        4. For resume structure improvements, provide concrete examples of before/after changes
        5. Focus heavily on ATS optimization - provide specific keyword suggestions and formatting tips
        6. Ensure all advice is tailored to the specific job description and industry
        7. Include specific examples wherever possible
        8. Make all recommendations practical and implementable
        9. Prioritize recommendations that will have the highest impact on ATS score and recruiter perception
        10. Be honest but constructive about the candidate's chances for this role
        
        The goal is to provide a comprehensive, actionable report that helps the candidate significantly improve their resume and chances of getting an interview for this specific role.
        """
        
        # Call Groq API
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "You are an expert resume analyst and career coach with deep knowledge of ATS systems and industry hiring practices."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=4000
        )
        
        # Extract and parse the JSON response
        report_text = response.choices[0].message.content
        print(f"Raw response: {report_text[:100]}...") # Debug: Print first 100 chars of response
        
        try:
            # First try: Find JSON content using regex for markdown code blocks
            json_match = re.search(r'```(?:json)?\n(.*?)\n```', report_text, re.DOTALL)
            if json_match:
                report_json = json.loads(json_match.group(1))
            else:
                # Second try: Look for JSON object pattern
                json_match = re.search(r'({[\s\S]*})', report_text, re.DOTALL)
                if json_match:
                    report_json = json.loads(json_match.group(1))
                else:
                    # Third try: Clean the text and attempt to parse
                    cleaned_text = report_text.strip()
                    if cleaned_text.startswith('{') and cleaned_text.endswith('}'):
                        report_json = json.loads(cleaned_text)
                    else:
                        # If all parsing attempts fail, create a fallback report
                        raise ValueError("Could not extract valid JSON from the response")
        except Exception as json_error:
            print(f"JSON parsing error: {str(json_error)}")
            # Create a structured report with the error and raw text for debugging
            report_json = {
                "error": f"Failed to parse response: {str(json_error)}",
                "candidateName": "Error processing report",
                "matchScore": 0,
                "atsScore": 0,
                "rawResponse": report_text[:500] + "..." if len(report_text) > 500 else report_text,
                "matchedSkills": [],
                "missingSkills": [],
                "educationDetails": {
                    "degree": "Unknown",
                    "institution": "Unknown",
                    "graduationYear": "Unknown",
                    "relevantCoursework": []
                },
                "experienceAnalysis": "Error generating report. Please try again.",
                "educationAnalysis": "Error generating education analysis.",
                "resumeStructureImprovements": [],
                "contentImprovements": [],
                "actionableRecommendations": [{"title": "Error", "description": "Could not generate recommendations due to an error."}],
                "projectSuggestions": [],
                "courseSuggestions": [],
                "atsOptimizationTips": [],
                "careerPathInsights": "Error generating career insights.",
                "reportFormatting": {
                    "centerContent": True,
                    "sectionTitleAlignment": "center",
                    "contentAlignment": "center",
                    "useHighlightedSections": True,
                    "pdfOptimized": True,
                    "darkTheme": True
                }
            }
        
        # Add formatting information if not present
        if "reportFormatting" not in report_json:
            report_json["reportFormatting"] = {
                "centerContent": True,
                "sectionTitleAlignment": "center",
                "contentAlignment": "center",
                "useHighlightedSections": True,
                "pdfOptimized": True,
                "darkTheme": True,
                "backgroundColor": "rgba(94, 234, 212, 0.3)",
                "textColor": "#ffffff"
            }
        
        # Ensure theme settings are applied even if reportFormatting exists
        if "reportFormatting" in report_json:
            report_json["reportFormatting"]["backgroundColor"] = "rgba(94, 234, 212, 0.3)"
            report_json["reportFormatting"]["textColor"] = "#ffffff"
            report_json["reportFormatting"]["darkTheme"] = True
        
        return report_json
        
    except Exception as e:
        print(f"Error in generate_report_from_analysis: {str(e)}")
        import traceback
        traceback.print_exc()
        return {
            "error": str(e),
            "candidateName": "Error processing report",
            "matchScore": 0,
            "atsScore": 0,
            "matchedSkills": [],
            "missingSkills": [],
            "educationDetails": {
                "degree": "Unknown",
                "institution": "Unknown",
                "graduationYear": "Unknown",
                "relevantCoursework": []
            },
            "experienceAnalysis": "Error generating report. Please try again.",
            "educationAnalysis": "Error generating education analysis.",
            "resumeStructureImprovements": [],
            "contentImprovements": [],
            "actionableRecommendations": [{"title": "Error", "description": "Could not generate recommendations due to an error."}],
            "projectSuggestions": [],
            "courseSuggestions": [],
            "atsOptimizationTips": [],
            "careerPathInsights": "Error generating career insights."
        }