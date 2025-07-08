import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import NeuralBackground from './NeuralBackground';
import './Login.css';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/register', {
                username,
                email,
                password
            });
            console.log('Registration successful:', response.data);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
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
                        <h1>Create Account</h1>
                        <p>Sign up to get started with F4F</p>
                    </div>
                    
                    {error && <div className="login-error">
                        <i className="fas fa-exclamation-circle"></i>
                        <span>{error}</span>
                    </div>}
                    
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <div className="input-wrapper">
                                <i className="fas fa-user input-icon"></i>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        
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
                        
                        <button type="submit" className="login-button">Create Account</button>
                    </form>
                    
                    <div className="login-footer">
                        <p>
                            Already have an account? <Link to="/login" className="login-link">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;