import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await api.post('/auth/register', { username, email, password });
            setSuccess('Registration successful! You can now login.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            console.error("Registration Error: ", err);
            setError(err.response?.data?.message || err.response?.data || err.message || 'An error occurred during registration.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center">
            <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: '440px', padding: '3rem 2.5rem' }}>
                <div className="text-center mb-4 stagger-1">
                    <h2 className="gradient-text" style={{ fontSize: '2rem' }}>Create Account</h2>
                    <p className="subtitle mt-1">Join us to start classifying</p>
                </div>

                {error && <div className="error-message stagger-2">{error}</div>}
                {success && <div className="success-message stagger-2">{success}</div>}

                <form onSubmit={handleSubmit} className="stagger-3">
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-input"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Choose a username"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your email"
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
                            minLength="6"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary animate-pulse-glow" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
                        {loading ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>

                <div className="text-center mt-4 stagger-4" style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: '600', marginLeft: '0.25rem' }}>Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
