import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';
import { FiFileText, FiTarget, FiTrendingUp, FiAward, FiCheckCircle, FiLinkedin, FiGithub } from 'react-icons/fi';
import NeuralBackground from './NeuralBackground.jsx';

function Landing() {
  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="hero">
        <NeuralBackground />
        <div className="hero-content">
          <h1>Optimize Your Career Path with AI-Powered Resume Analysis</h1>
          <p className="hero-subtitle">Get instant feedback on your resume and improve your chances of landing your dream job</p>
          <Link to="/register" className="cta-button">
            Get Started
          </Link>
        </div>
      </section>

      {/* Rest of your sections remain unchanged */}
      <section className="features">
        <h2>Why Choose Our Resume Analyzer?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <FiTarget className="feature-icon" />
            <h3>Smart Analysis</h3>
            <p>AI-powered resume scanning that matches your skills with job requirements</p>
          </div>
          <div className="feature-card">
            <FiTrendingUp className="feature-icon" />
            <h3>Improvement Tips</h3>
            <p>Get actionable feedback to enhance your resume's effectiveness</p>
          </div>
          <div className="feature-card">
            <FiAward className="feature-icon" />
            <h3>Industry Standards</h3>
            <p>Compare your resume against industry benchmarks</p>
          </div>
          <div className="feature-card">
            <FiCheckCircle className="feature-icon" />
            <h3>ATS Friendly</h3>
            <p>Ensure your resume passes Applicant Tracking Systems</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Upload Resume</h3>
            <p>Upload your resume in PDF format</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Select Job Role</h3>
            <p>Choose your target job position</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Add Skills</h3>
            <p>Select relevant skills for the position</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Get Analysis</h3>
            <p>Receive detailed feedback and suggestions</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="benefits-content">
          <h2>Transform Your Job Search</h2>
          <ul className="benefits-list">
            <li>Increase interview chances</li>
            <li>Highlight key achievements</li>
            <li>Target specific roles</li>
            <li>Stand out from competition</li>
          </ul>
          <Link to="/analyze" className="secondary-cta">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Contributors Section */}
      <section className="contributors-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <div className="contributors-grid">
            {/* Contributor 1 */}
            <div className="contributor-card">
              <div className="contributor-image-container">
                <img 
                  src="/images/team/nithya.jpg" 
                  alt="Nithya Shree" 
                  className="contributor-image"
                  onError={(e) => {e.target.src = "https://via.placeholder.com/150?text=Nithya"}}
                />
              </div>
              <h3 className="contributor-name">Nithya Shree</h3>
              <p className="contributor-role">Frontend Developer</p>
              <p className="contributor-bio">"Coffee enthusiast who<br />codes best after midnight"</p>
              <div className="contributor-social">
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="social-icon"><FiLinkedin /></a>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="social-icon"><FiGithub /></a>
              </div>
            </div>
            
            {/* Contributor 2 */}
            <div className="contributor-card">
              <div className="contributor-image-container">
                <img 
                  src="/images/team/iswarya.jpeg" 
                  alt="Iswarya" 
                  className="contributor-image"
                  onError={(e) => {e.target.src = "https://via.placeholder.com/150?text=Iswarya"}}
                />
              </div>
              <h3 className="contributor-name">Iswarya</h3>
              <p className="contributor-role">Backend Developer</p>
              <p className="contributor-bio">"Loves solving algorithms<br />while hiking mountains"</p>
              <div className="contributor-social">
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="social-icon"><FiLinkedin /></a>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="social-icon"><FiGithub /></a>
              </div>
            </div>
            
            {/* Contributor 3 */}
            <div className="contributor-card">
              <div className="contributor-image-container">
                <img 
                  src="/images/team/jothi.jpeg" 
                  alt="Jothi Keerthana" 
                  className="contributor-image"
                  onError={(e) => {e.target.src = "https://via.placeholder.com/150?text=Jothi"}}
                />
              </div>
              <h3 className="contributor-name">Jothi Keerthana</h3>
              <p className="contributor-role">UI/UX Designer</p>
              <p className="contributor-bio">"Turns music playlists into<br />beautiful design systems"</p>
              <div className="contributor-social">
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="social-icon"><FiLinkedin /></a>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="social-icon"><FiGithub /></a>
              </div>
            </div>
            
            {/* Contributor 4 */}
            <div className="contributor-card">
              <div className="contributor-image-container">
                <img 
                  src="/images/team/veronica.jpeg" 
                  alt="Veronica" 
                  className="contributor-image"
                  onError={(e) => {e.target.src = "https://via.placeholder.com/150?text=Veronica"}}
                />
              </div>
              <h3 className="contributor-name">Veronica</h3>
              <p className="contributor-role">AI Engineer</p>
              <p className="contributor-bio">"Teaches AI models while<br />baking sourdough bread"</p>
              <div className="contributor-social">
                <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" className="social-icon"><FiLinkedin /></a>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="social-icon"><FiGithub /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Ready to Optimize Your Resume?</h2>
        <p>Join thousands of job seekers who have improved their resumes with our AI-powered analysis</p>
        <Link to="/analyze" className="cta-button">
          Start Free Analysis
        </Link>
      </section>
    </div>
  );
}

export default Landing;