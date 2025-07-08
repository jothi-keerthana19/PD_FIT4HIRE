import { Link, useLocation } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          <Link to="/">
            <FaFire className="brand-icon" />
            FIT4HIRE
          </Link>
        </div>
        <div className="navbar-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
          <Link to="/analyze" className={location.pathname === '/analyze' ? 'active' : ''}>
            Analyze
          </Link>
          <Link to="/roles" className={location.pathname === '/roles' ? 'active' : ''}>
            Job Roles
          </Link>
          <Link to="/reports/generate" className={location.pathname === '/reports/generate' ? 'active' : ''}>
            Resume Analysis
          </Link>
          
          {isLandingPage && (
            <div className="auth-buttons">
              <Link to="/login" className="login-button">
                Login
              </Link>
              <Link to="/register" className="signup-button">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;