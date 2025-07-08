import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './ReportGenerator.css';
import ReportDisplay from './ReportDisplay';

const ReportGenerator = ({ analysisData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Use analysis data from props or from location state
  const analysisDataToUse = analysisData || (location.state && location.state.analysisData);
  
  const [jobDescription, setJobDescription] = useState('');
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJobDescriptionChange = (e) => {
    setJobDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!jobDescription) {
      setError('Please provide a job description');
      return;
    }

    if (!analysisDataToUse) {
      setError('No resume analysis data available. Please analyze a resume first.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Use the existing analysis data with the job description
      console.log("Using analysis data:", analysisDataToUse);
      
      // Make sure we're sending the correct data structure
      const reportResponse = await axios.post('http://localhost:5000/api/reports/generate', {
        analysisData: analysisDataToUse,
        jobDescription: jobDescription
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        withCredentials: false
      });

      if (reportResponse.data && reportResponse.data.success) {
        setReport(reportResponse.data.report);
      } else {
        setError('Failed to generate report: ' + (reportResponse.data.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Error generating report:', err);
      // More detailed error message
      setError(`Failed to generate report: ${
        err.response?.status === 400 ? 
        'Invalid data format. Please check console for details.' : 
        err.response?.status === 404 ? 
        'API endpoint not found. Please check if the backend server is running.' : 
        err.response?.data?.error || err.message
      }`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="report-generator-container">
      <div className="report-header">
        <h2>AI Report Generator</h2>
      </div>
      
      <p>Using your resume analysis, provide a job description to get AI-powered recommendations</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-group">
          <label htmlFor="jobDescription">Job Description</label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            placeholder="Paste the job description here..."
            rows={6}
            required
          />
        </div>
        
        <div className="report-actions">
          <button 
            type="button"
            className="back-button" 
            onClick={() => navigate('/analyze')}
          >
            <i className="fas fa-arrow-left"></i> Back to Analysis
          </button>
          
          <button 
            type="submit"
            className="generate-report-btn" 
            disabled={isLoading || !jobDescription.trim()}
          >
            {isLoading ? 'Generating...' : 'Generate Detailed Report'}
          </button>
        </div>
      </form>

      {report && <ReportDisplay report={report} />}
    </div>
  );
};

export default ReportGenerator;