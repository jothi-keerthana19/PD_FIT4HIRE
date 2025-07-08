import React from 'react';
import './ReportDisplay.css';

// Add this to your imports if needed
import { useEffect, useState } from 'react';

const ReportDisplay = ({ report }) => {
  if (!report) return null;
  
  // Calculate color based on match score
  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success, #4caf50)';
    if (score >= 60) return 'var(--warning, #ff9800)';
    return 'var(--danger, #f44336)';
  };

  // Format education details
  const formatEducation = () => {
    if (!report.educationDetails) return 'No education details available';
    
    const { degree, institution, graduationYear, relevantCoursework } = report.educationDetails;
    
    return (
      <div className="education-details">
        {degree && <p><strong>Degree:</strong> {degree}</p>}
        {institution && <p><strong>Institution:</strong> {institution}</p>}
        {graduationYear && <p><strong>Graduation:</strong> {graduationYear}</p>}
        {relevantCoursework && relevantCoursework.length > 0 && (
          <div>
            <p><strong>Relevant Coursework:</strong></p>
            <ul className="coursework-list">
              {relevantCoursework.map((course, index) => (
                <li key={index}>{course}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  // Get priority class
  const getPriorityClass = (priority) => {
    if (!priority) return '';
    switch (priority.toLowerCase()) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  // Get difficulty class
  const getDifficultyClass = (difficulty) => {
    if (!difficulty) return '';
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'difficulty-beginner';
      case 'intermediate': return 'difficulty-intermediate';
      case 'advanced': return 'difficulty-advanced';
      default: return '';
    }
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <h1>Resume Analysis Report</h1>
        <p className="report-date">Generated on: {new Date().toLocaleString()}</p>
      </div>

      <div className="report-section profile-section">
        <h2>Candidate Profile</h2>
        <div className="profile-details">
          <div className="profile-info">
            <p><strong>Name:</strong> {report.candidateName || 'Not specified'}</p>
            {report.candidateEmail && <p><strong>Email:</strong> {report.candidateEmail}</p>}
            {report.candidatePhone && <p><strong>Phone:</strong> {report.candidatePhone}</p>}
            {report.candidateLocation && <p><strong>Location:</strong> {report.candidateLocation}</p>}
            {report.candidateLinkedIn && <p><strong>LinkedIn:</strong> {report.candidateLinkedIn}</p>}
          </div>
        </div>
      </div>

      <div className="report-section score-section">
        <h2>Match Analysis</h2>
        <div className="scores-container">
          <div className="match-score">
            <h3>Job Match Score</h3>
            <div className="score-circle" style={{ 
              background: `conic-gradient(${getScoreColor(report.matchScore)} ${report.matchScore}%, #0f0f1a 0)` 
            }}>
              <span>{report.matchScore}%</span>
            </div>
            <p className="score-description">
              {report.matchScore >= 80 ? 'Excellent match for this position' : 
               report.matchScore >= 60 ? 'Good match with some improvements needed' : 
               report.matchScore >= 40 ? 'Average match with significant improvements needed' : 'Below average match'}
            </p>
          </div>
          
          {report.atsScore && (
            <div className="match-score">
              <h3>ATS Score</h3>
              <div className="score-circle" style={{ 
                background: `conic-gradient(${getScoreColor(report.atsScore)} ${report.atsScore}%, #0f0f1a 0)` 
              }}>
                <span>{report.atsScore}%</span>
              </div>
              <p className="score-description">
                {report.atsScore >= 80 ? 'Excellent ATS optimization' : 
                 report.atsScore >= 60 ? 'Good ATS optimization with some improvements needed' : 
                 report.atsScore >= 40 ? 'Average ATS optimization with significant improvements needed' : 'Poor ATS optimization'}
              </p>
            </div>
          )}
        </div>
        
        {report.keywordAnalysis && (
          <div className="keyword-analysis">
            <h3>Keyword Analysis</h3>
            <p>{report.keywordAnalysis}</p>
          </div>
        )}
      </div>

      <div className="report-section skills-section">
        <h2>Skills Analysis</h2>
        <div className="skills-comparison">
          <div className="skills-matched">
            <h3>Matched Skills</h3>
            <ul className="skills-list matched">
              {report.matchedSkills && report.matchedSkills.length > 0 ? (
                report.matchedSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))
              ) : (
                <li className="no-skills">No matched skills found</li>
              )}
            </ul>
          </div>
          <div className="skills-missing">
            <h3>Missing Skills</h3>
            <ul className="skills-list missing">
              {report.missingSkills && report.missingSkills.length > 0 ? (
                report.missingSkills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))
              ) : (
                <li className="no-skills">No missing skills identified</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="report-section education-section">
        <h2>Education</h2>
        {formatEducation()}
        <div className="education-analysis">
          <h3>Education Analysis</h3>
          <p>{report.educationAnalysis || 'No education analysis available'}</p>
        </div>
      </div>

      <div className="report-section experience-section">
        <h2>Experience Analysis</h2>
        <p>{report.experienceAnalysis || 'No experience analysis available'}</p>
      </div>

      {report.resumeStructureImprovements && report.resumeStructureImprovements.length > 0 && (
        <div className="report-section structure-section">
          <h2>Resume Structure Improvements</h2>
          <div className="structure-improvements">
            {report.resumeStructureImprovements.map((improvement, index) => (
              <div key={index} className="improvement-card">
                <h3>{improvement.section}</h3>
                <div className="improvement-content">
                  <p><strong>Issue:</strong> {improvement.issue}</p>
                  <p><strong>Recommendation:</strong> {improvement.recommendation}</p>
                  {improvement.example && (
                    <div className="improvement-example">
                      <p className="example-title">Example:</p>
                      <div className="example-content">{improvement.example}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {report.contentImprovements && report.contentImprovements.length > 0 && (
        <div className="report-section content-section">
          <h2>Content Improvements</h2>
          <div className="content-improvements">
            {report.contentImprovements.map((improvement, index) => (
              <div key={index} className="improvement-card">
                <h3>{improvement.section}</h3>
                <div className="improvement-content">
                  <p><strong>Issue:</strong> {improvement.issue}</p>
                  <p><strong>Recommendation:</strong> {improvement.recommendation}</p>
                  {improvement.example && (
                    <div className="improvement-example">
                      <p className="example-title">Example:</p>
                      <div className="example-content">{improvement.example}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {report.actionableRecommendations && report.actionableRecommendations.length > 0 && (
        <div className="report-section recommendations-section">
          <h2>Actionable Recommendations</h2>
          <div className="recommendations-grid">
            {report.actionableRecommendations.map((recommendation, index) => (
              <div key={index} className="recommendation-card">
                {recommendation.priority && (
                  <div className={`recommendation-priority ${getPriorityClass(recommendation.priority)}`}>
                    {recommendation.priority.charAt(0).toUpperCase()}
                  </div>
                )}
                <h3>{recommendation.title}</h3>
                <p>{recommendation.description}</p>
                {recommendation.impact && (
                  <div className="recommendation-impact">
                    <strong>Impact:</strong> {recommendation.impact}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {report.atsOptimizationTips && report.atsOptimizationTips.length > 0 && (
        <div className="report-section ats-section">
          <h2>ATS Optimization Tips</h2>
          <div className="ats-tips">
            {report.atsOptimizationTips.map((tip, index) => (
              <div key={index} className="ats-tip-card">
                <h3>{tip.title}</h3>
                <p>{tip.description}</p>
                {tip.example && (
                  <div className="before-after">
                    <div className="before">
                      <h4>Before</h4>
                      <p>{tip.example.split('Before:')[1]?.split('After:')[0] || tip.example}</p>
                    </div>
                    <div className="after">
                      <h4>After</h4>
                      <p>{tip.example.split('After:')[1] || 'Example not properly formatted'}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {report.projectSuggestions && report.projectSuggestions.length > 0 && (
        <div className="report-section projects-section">
          <h2>Project Suggestions</h2>
          <div className="project-cards">
            {report.projectSuggestions.map((project, index) => (
              <div key={index} className="project-card">
                {project.difficulty && (
                  <div className={`project-difficulty ${getDifficultyClass(project.difficulty)}`}>
                    {project.difficulty}
                  </div>
                )}
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                {project.skills && project.skills.length > 0 && (
                  <div className="project-skills">
                    <h4>Skills Demonstrated</h4>
                    <div className="skill-tags">
                      {project.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
                {project.resources && project.resources.length > 0 && (
                  <div className="project-resources">
                    <h4>Resources</h4>
                    <ul className="resources-list">
                      {project.resources.map((resource, resourceIndex) => (
                        <li key={resourceIndex}>
                          <a href={resource.startsWith('http') ? resource : '#'} target="_blank" rel="noopener noreferrer">
                            {resource}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {project.example && (
                  <div className="project-example">
                    <p><strong>Example:</strong> {project.example}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {report.courseSuggestions && report.courseSuggestions.length > 0 && (
        <div className="report-section courses-section">
          <h2>Course Suggestions</h2>
          <div className="course-cards">
            {report.courseSuggestions.map((course, index) => (
              <div key={index} className="course-card">
                <h3>{course.title}</h3>
                {course.provider && <p className="course-provider">{course.provider}</p>}
                <p>{course.description}</p>
                <div className="course-meta">
                  {course.duration && <span className="course-duration">{course.duration}</span>}
                  {course.cost && <span className="course-cost">{course.cost}</span>}
                </div>
                {course.link && (
                  <div className="course-link">
                    <a href={course.link} target="_blank" rel="noopener noreferrer">
                      View Course
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {report.careerPathInsights && (
        <div className="report-section career-section">
          <h2>Career Path Insights</h2>
          <p>{report.careerPathInsights}</p>
        </div>
      )}

      {report.industrySpecificAdvice && (
        <div className="report-section industry-advice">
          <h3>Industry-Specific Advice</h3>
          <p>{report.industrySpecificAdvice}</p>
        </div>
      )}

      <div className="report-actions">
        <button className="action-button" onClick={() => window.print()}>
          Download Report
        </button>
        <button className="action-button print-button" onClick={() => window.print()}>
          Print Report
        </button>
      </div>
    </div>
  );
};

export default ReportDisplay;