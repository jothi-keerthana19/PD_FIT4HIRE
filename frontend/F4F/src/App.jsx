import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './components/Landing';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import AnalysisResults from './components/AnalysisResults';
import JobRoles from './components/JobRoles';

import Login from './components/Login';
import Register from './components/Register';
import './App.css';
import ReportGenerator from './components/Reports/ReportGenerator';
import ReportView from './components/Reports/ReportView';

import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/analyze" element={<ResumeAnalyzer />} />
        <Route path="/results" element={<AnalysisResults />} />
        <Route path="/roles" element={<JobRoles />} />
        
        {/* Report routes */}
        <Route path="/reports/generate" element={<ReportGenerator />} />
        <Route path="/reports/:reportId" element={<ReportView />} />
      </Routes>
    </Router>
  );
}

export default App;