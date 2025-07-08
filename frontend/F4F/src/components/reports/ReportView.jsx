import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReportService from '../../services/ReportService';
import './ReportView.css';

const ReportView = () => {
  const { reportId } = useParams();
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const reportData = await ReportService.getReportById(reportId);
        setReport(reportData);
      } catch (err) {
        setError('Failed to load report. Please try again.');
        console.error('Error loading report:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  if (isLoading) {
    return <div className="loading">Loading report...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!report) {
    return <div className="not-found">Report not found</div>;
  }

  const handleDownloadPdf = async () => {
    try {
      await ReportService.downloadReportAsPdf(reportId);
    } catch (err) {
      setError('Failed to download report. Please try again.');
      console.error('Error downloading report:', err);
    }
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <h1>Resume Analysis Report</h1>
        <p className="report-date">Generated on: {new Date(report.createdAt).toLocaleString()}</p>
      </div>

      <div className="report-section">
        <h2>Candidate Profile</h2>
        <div className="profile-details">
          <p><strong>Name:</strong> {report.candidateName}</p>
          <p><strong>Email:</strong> {report.candidateEmail}</p>
          <p><strong>Phone:</strong> {report.candidatePhone}</p>
          {report.candidateLinkedIn && (
            <p><strong>LinkedIn:</strong> {report.candidateLinkedIn}</p>
          )}
        </div>
      </div>

      <div className="report-section">
        <h2>Match Score</h2>
        <div className="match-score">
          <div className="score-circle" style={{ 
            background: `conic-gradient(#4CAF50 ${report.matchScore}%, #f3f3f3 0)` 
          }}>
            <span>{report.matchScore}%</span>
          </div>
          <p className="score-description">
            {report.matchScore >= 80 ? 'Excellent match' : 
             report.matchScore >= 60 ? 'Good match' : 
             report.matchScore >= 40 ? 'Average match' : 'Below average match'}
          </p>
        </div>
      </div>

      <div className="report-section">
        <h2>Skills Analysis</h2>
        <div className="skills-comparison">
          <div className="skills-matched">
            <h3>Matched Skills</h3>
            <ul>
              {report.matchedSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
          <div className="skills-missing">
            <h3>Missing Skills</h3>
            <ul>
              {report.missingSkills.map((skill, index) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h2>Experience Analysis</h2>
        <p>{report.experienceAnalysis}</p>
      </div>

      <div className="report-section">
        <h2>Education Analysis</h2>
        <p>{report.educationAnalysis}</p>
      </div>

      <div className="report-section recommendation-section">
        <h2>AI Recommendations</h2>
        <div className="recommendations">
          {report.recommendations.map((recommendation, index) => (
            <div key={index} className="recommendation-item">
              <h3>{recommendation.title}</h3>
              <p>{recommendation.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="report-section">
        <h2>Improvement Areas</h2>
        <ul className="improvement-list">
          {report.improvementAreas.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="report-actions">
        <button className="action-button" onClick={() => window.print()}>
          Print Report
        </button>
        <button className="action-button" onClick={handleDownloadPdf}>
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default ReportView;