import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { username, password });
            login(response.data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data || 'An error occurred during login.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center">
            <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem' }}>
                <div className="text-center mb-4 stagger-1">
                    <h2 className="gradient-text" style={{ fontSize: '2rem' }}>Welcome Back</h2>
                    <p className="subtitle mt-1">Sign in to your account</p>
                </div>

                {error && <div className="error-message stagger-2">{error}</div>}

                <form onSubmit={handleSubmit} className="stagger-3">
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary animate-pulse-glow" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center mt-4 stagger-4" style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    Don't have an account? <Link to="/register" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600', marginLeft: '0.25rem' }}>Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
