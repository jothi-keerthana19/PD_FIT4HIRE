import React, { useState } from 'react';
import { Button, TextField, Typography, Paper, CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import ReportDisplay from './ReportDisplay';

const ReportGenerator = ({ analysisData }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReport = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/reports/generate', {
        analysisData: analysisData,
        jobDescription: jobDescription
      });
      
      if (response.data.success) {
        setReport(response.data.report);
      } else {
        setError(response.data.error || 'Failed to generate report');
      }
    } catch (err) {
      setError('Error connecting to server: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Generate Detailed Report
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Enter a job description to generate a comprehensive report comparing the resume to the job requirements.
      </Typography>
      
      <TextField
        label="Job Description"
        multiline
        rows={6}
        fullWidth
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        margin="normal"
        placeholder="Paste the job description here..."
        variant="outlined"
      />
      
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={generateReport}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </Button>
      </Box>
      
      {report && <ReportDisplay report={report} />}
    </Paper>
  );
};

export default ReportGenerator;