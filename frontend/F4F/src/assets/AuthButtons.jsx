// ... existing code ...
import { useNavigate } from 'react-router-dom';

const AuthButtons = () => {
  const navigate = useNavigate();
  
  // ... existing code ...
  
  const handleSignupClick = () => {
    navigate('/register'); // Navigate to registration page
  };
  
  return (
    <div className="auth-buttons">
      {/* ... existing code ... */}
      <button 
        className="signup-button" 
        onClick={handleSignupClick}
      >
        Sign Up
      </button>
      {/* ... existing code ... */}
    </div>
  );
};

// ... existing code ...