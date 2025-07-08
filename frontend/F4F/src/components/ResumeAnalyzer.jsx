import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFire, FaFileUpload, FaFile, FaCloudUploadAlt, FaTimes, FaPlus } from 'react-icons/fa';
import FitAnalysis from './FitAnalysis';
import HireAnalysis from './HireAnalysis';
import './ResumeAnalyzer.css';
import NeuralBackground from './NeuralBackground';

// Job roles and their associated skills
const jobSkillsMap = {
  'Software Engineer': [
    'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 
    'Data Structures', 'Algorithms', 'Git', 'REST APIs',
    'TypeScript', 'Docker', 'AWS', 'CI/CD', 'System Design'
  ],
  'Data Scientist': [
    'Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 
    'Data Visualization', 'Pandas', 'NumPy', 'Scikit-learn',
    'Deep Learning', 'TensorFlow', 'Big Data', 'Data Mining'
  ],
  'Product Manager': [
    'Product Strategy', 'Agile', 'User Research', 'Analytics',
    'Stakeholder Management', 'Roadmapping', 'A/B Testing',
    'Market Analysis', 'User Stories', 'Product Development',
    'Project Management', 'Business Strategy'
  ],
  'UX Designer': [
    'UI Design', 'User Research', 'Wireframing', 'Prototyping',
    'Figma', 'Adobe XD', 'User Testing', 'Information Architecture',
    'Design Systems', 'Accessibility', 'Visual Design'
  ],
  'DevOps Engineer': [
    'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux',
    'Python', 'Shell Scripting', 'Terraform', 'Jenkins',
    'Monitoring', 'Cloud Architecture', 'Security'
  ]
};

function ResumeAnalyzer() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobRole, setJobRole] = useState('');
  const [availableSkills, setAvailableSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState('fit');
  const [analysis, setAnalysis] = useState(null);
  const [fileName, setFileName] = useState('');
  const [customSkill, setCustomSkill] = useState('');
  const [customSkills, setCustomSkills] = useState([]);

  // Update available skills when job role changes
  useEffect(() => {
    if (jobRole) {
      setAvailableSkills(jobSkillsMap[jobRole] || []);
      setSelectedSkills([]); // Reset selected skills when job role changes
    }
  }, [jobRole]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || 
                 file.type.startsWith('image/'))) {
      setSelectedFile(file);
      setFileName(file.name);
      setError('');
    } else {
      setSelectedFile(null);
      setFileName('');
      setError('Please upload a PDF or image file (JPG, PNG, etc.)');
    }
  };

  const handleJobRoleChange = (event) => {
    setJobRole(event.target.value);
  };

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(selectedSkills.filter(skill => skill !== skillToRemove));
  };

  const handleCustomSkillAdd = (e) => {
    e.preventDefault();
    if (customSkill.trim() && !customSkills.includes(customSkill.trim())) {
      setCustomSkills([...customSkills, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const removeCustomSkill = (skillToRemove) => {
    setCustomSkills(customSkills.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile || !jobRole || selectedSkills.length === 0) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('role', jobRole);
      formData.append('skills', selectedSkills.join(','));
      formData.append('mode', mode);

      const response = await fetch('http://localhost:5000/api/analyze-resume', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      
      // Navigate to results page with analysis data and mode
      navigate('/results', { 
        state: { 
          analysis: data,
          mode: mode
        }
      });
    } catch (err) {
      setError('Error analyzing resume: ' + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="analyzer-page">
      <NeuralBackground />
      <div className="resume-analyzer">
        <h1>
          <FaFire className="brand-icon" />
          FIT4FIRE
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="resume">Upload Resume</label>
            <div className="custom-file-input">
              <div className="file-input-button">
                <FaCloudUploadAlt className="upload-cloud-icon" />
                <span>Upload</span>
                <input
                  type="file"
                  id="resume"
                  className="hidden-input"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
              {fileName && (
                <div className="file-name">
                  {fileName}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="jobRole">Select Job Role</label>
            <select
              id="jobRole"
              value={jobRole}
              onChange={handleJobRoleChange}
            >
              <option value="">Select a role</option>
              {Object.keys(jobSkillsMap).map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {jobRole && (
            <div className="form-group">
              <label htmlFor="skills">Select Relevant Skills</label>
              <select
                id="skills"
                className="skills-select"
                value=""
                onChange={(e) => {
                  const skill = e.target.value;
                  if (skill) {
                    handleSkillSelect(skill);
                  }
                }}
              >
                <option value="">Select a skill</option>
                {availableSkills
                  .filter(skill => !selectedSkills.includes(skill))
                  .map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
              </select>

              <div className="selected-skills">
                {selectedSkills.map(skill => (
                  <div key={skill} className="skill-tag">
                    {skill}
                    <button
                      type="button"
                      className="remove-skill"
                      onClick={() => handleRemoveSkill(skill)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Add Custom Skills</label>
            <div className="custom-skills-input">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Enter a custom skill"
                className="skill-input"
              />
              <button
                onClick={handleCustomSkillAdd}
                className="add-skill-btn"
                disabled={!customSkill.trim()}
              >
                <FaPlus />
              </button>
            </div>

            {customSkills.length > 0 && (
              <div className="custom-skills-list">
                {customSkills.map((skill) => (
                  <div key={skill} className="skill-tag custom">
                    {skill}
                    <button
                      onClick={() => removeCustomSkill(skill)}
                      className="remove-skill"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label>
              Analysis Mode:
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="fit">Job Fit Analysis</option>
                <option value="hire">Hiring Analysis</option>
              </select>
            </label>
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <div className="loading"><div></div></div>
            ) : (
              'Analyze Resume'
            )}
          </button>
        </form>

        {analysis && (
          mode === 'fit' ? 
          <FitAnalysis analysis={analysis} /> :
          <HireAnalysis analysis={analysis} />
        )}
      </div>
    </div>
  );
}

export default ResumeAnalyzer;
