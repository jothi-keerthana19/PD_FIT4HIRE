import { useState, useEffect } from 'react';
import './JobRoles.css';

function JobRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [roleSkills, setRoleSkills] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/job-roles')
      .then(response => response.json())
      .then(data => {
        setRoles(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load job roles');
        setLoading(false);
      });
  }, []);

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setLoadingSkills(true);
    
    fetch(`http://localhost:5000/api/skills?role=${encodeURIComponent(role)}`)
      .then(response => response.json())
      .then(data => {
        setRoleSkills(data);
        setLoadingSkills(false);
      })
      .catch(err => {
        setError('Failed to load skills for this role');
        setLoadingSkills(false);
      });
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div><p>Loading job roles...</p></div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="job-roles">
      <h1>Available Job Roles</h1>
      <div className="roles-list">
        {roles.map((role, index) => (
          <div 
            key={index} 
            className={`role-item ${selectedRole === role ? 'selected' : ''}`}
            onClick={() => handleRoleClick(role)}
          >
            {role}
          </div>
        ))}
      </div>
      
      {selectedRole && (
        <div className="role-details">
          <h2>Skills Required for {selectedRole}</h2>
          {loadingSkills ? (
            <div className="loading-skills">Loading skills...</div>
          ) : (
            <div className="skills-list">
              {roleSkills.map((skill, index) => (
                <div key={index} className="skill-item">
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default JobRoles; 