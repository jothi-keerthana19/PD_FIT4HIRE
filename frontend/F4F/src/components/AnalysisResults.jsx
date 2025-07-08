import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FitAnalysis from './FitAnalysis';
import HireAnalysis from './HireAnalysis';
import './AnalysisResults.css';

function AnalysisResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, mode } = location.state || {};

  if (!analysis) {
    navigate('/analyze');
    return null;
  }

  const handleGenerateReport = () => {
    // Navigate to the report generator page with the analysis data
    navigate('/reports/generate', { state: { analysisData: analysis } });
  };

  return (
    <div className="analysis-results-page">
      <div className="results-container">
        <div className="results-header">
          <h1>Analysis Results</h1>
          <button 
            className="generate-report-btn"
            onClick={handleGenerateReport}
          >
            Generate Detailed Report
          </button>
        </div>
        
        {mode === 'fit' ? 
          <FitAnalysis analysis={analysis} /> :
          <HireAnalysis analysis={analysis} />
        }
        
        <button 
          className="back-button"
          onClick={() => navigate('/analyze')}
        >
          Analyze Another Resume
        </button>
      </div>
    </div>
  );
}

export default AnalysisResults;