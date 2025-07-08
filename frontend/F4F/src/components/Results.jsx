import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './Results.css';
import { FiArrowLeft, FiDownload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

function Results() {
  const location = useLocation();
  const { analysisData } = location.state || {};

  if (!analysisData) {
    return (
      <div className="results-error">
        <h2>No analysis data found</h2>
        <Link to="/analyze" className="back-button">
          <FiArrowLeft /> Go Back
        </Link>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-header">
        <Link to="/analyze" className="back-button">
          <FiArrowLeft /> Back to Analyzer
        </Link>
        <button className="download-button">
          <FiDownload /> Download Report
        </button>
      </div>

      <div className="results-container">
        <div className="score-section">
          <h2>Overall Score</h2>
          <div className="score-circle">
            {analysisData.score}%
          </div>
        </div>

        <div className="analysis-section">
          <h2>Key Findings</h2>
          <div className="findings-grid">
            {analysisData.findings?.map((finding, index) => (
              <div key={index} className="finding-card">
                {finding.type === 'positive' ? (
                  <FiCheckCircle className="finding-icon positive" />
                ) : (
                  <FiAlertCircle className="finding-icon negative" />
                )}
                <p>{finding.message}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="skills-section">
          <h2>Skills Analysis</h2>
          <div className="skills-grid">
            {analysisData.skills?.map((skill, index) => (
              <div key={index} className="skill-card">
                <h3>{skill.name}</h3>
                <div className="skill-bar">
                  <div 
                    className="skill-progress" 
                    style={{ width: `${skill.match}%` }}
                  />
                </div>
                <span className="skill-percentage">{skill.match}% match</span>
              </div>
            ))}
          </div>
        </div>

        <div className="recommendations-section">
          <h2>Recommendations</h2>
          <ul className="recommendations-list">
            {analysisData.recommendations?.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Results; 