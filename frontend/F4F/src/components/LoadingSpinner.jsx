import React from 'react';
import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Analyzing your resume...</p>
    </div>
  );
}

export default LoadingSpinner; 