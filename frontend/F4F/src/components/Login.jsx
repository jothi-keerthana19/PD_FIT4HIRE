import '../components/Auth.css';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import NeuralBackground from './NeuralBackground';
import './Login.css';  // Add this import

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting login with:', { email, password }); // Debug line
            const response = await axios.post('http://localhost:5000/api/login', {
                email,
                password
            });
            
            console.log('Login response:', response.data); // Debug line
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            navigate('/analyze');
        } catch (err) {
            console.error('Login error:', err.response?.data); // Debug line
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="login-page">
            <NeuralBackground />
            <div className="login-container">
                <div className="login-card">
                    <div className="login-logo">
                        <h2>F4F</h2>
                    </div>
                    
                    <div className="login-header">
                        <h1>Welcome Back</h1>
                        <p>Sign in to continue to your account</p>
                    </div>
                    
                    {error && <div className="login-error">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{error}</span>
                    </div>}
                    
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <div className="input-wrapper">
                                <i className="fas fa-envelope input-icon"></i>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrapper">
                                <i className="fas fa-lock input-icon"></i>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="form-actions">
                            <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
                        </div>
                        
                        <button type="submit" className="login-button compact-button">Sign In</button>
                    </form>
                    
                    <div className="login-footer">
                        <p>
                            Don't have an account? <Link to="/register" className="login-link">Sign Up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;