const Report = require('../models/Report');
const { Groq } = require('groq-sdk');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Generate report using Groq API
exports.generateReport = async (req, res) => {
  try {
    const { analysisData, resumeData, jobDescription } = req.body;
    
    // Prepare prompt for Groq API
    const prompt = `
      Generate a comprehensive resume analysis report based on the following data:
      
      Resume Information:
      ${JSON.stringify(analysisData.resumeData)}
      
      Job Description:
      ${jobDescription}
      
      Analysis Results:
      ${JSON.stringify(analysisData.results)}
      
      Please provide:
      1. A match score (percentage) between the resume and job description
      2. List of matched skills
      3. List of missing skills
      4. Experience analysis
      5. Education analysis
      6. Specific recommendations for improvement
      7. Areas that need enhancement
      
      Format the response as a JSON object with the following structure:
      {
        "matchScore": number,
        "matchedSkills": string[],
        "missingSkills": string[],
        "experienceAnalysis": string,
        "educationAnalysis": string,
        "recommendations": [{ "title": string, "description": string }],
        "improvementAreas": string[]
      }
    `;
    
    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are an expert resume analyst and career advisor." },
        { role: "user", content: prompt }
      ],
      model: "llama3-70b-8192",
      temperature: 0.5,
      max_tokens: 4000,
    });
    
    // Parse the response
    const responseContent = completion.choices[0].message.content;
    const reportData = JSON.parse(responseContent);
    
    // Create a new report in the database
    const report = new Report({
      resumeFilePath: analysisData.resumeFilePath || "Not available",
      jobDescription,
      candidateName: analysisData.resumeData.name || "Candidate",
      candidateEmail: analysisData.resumeData.email || "",
      candidatePhone: analysisData.resumeData.phone || "",
      candidateLinkedIn: analysisData.resumeData.linkedin || "",
      matchScore: reportData.matchScore,
      matchedSkills: reportData.matchedSkills,
      missingSkills: reportData.missingSkills,
      experienceAnalysis: reportData.experienceAnalysis,
      educationAnalysis: reportData.educationAnalysis,
      recommendations: reportData.recommendations,
      improvementAreas: reportData.improvementAreas
    });
    
    await report.save();
    
    res.status(201).json({
      success: true,
      reportId: report._id
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
};