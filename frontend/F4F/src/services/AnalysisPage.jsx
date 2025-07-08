import React from 'react';
import { useLocation } from 'react-router-dom';
import ReportGenerator from '../components/Reports/ReportGenerator';

const AnalysisPage = () => {
  const location = useLocation();
  const { analysisData } = location.state || {};

  return (
    <div className="analysis-page">
      {/* Your existing analysis display code */}
      
      {/* Add the report generator component */}
      {analysisData && (
        <ReportGenerator analysisData={analysisData} />
      )}
    </div>
  );
};

export default AnalysisPage;