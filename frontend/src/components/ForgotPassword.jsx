import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/forgot-password', { email });
            setMessage(response.data || 'Password reset link sent (check terminal)!');
        } catch (err) {
            setError(err.response?.data || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center animate-fade-in">
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Forgot Password</h2>
                {message && <div className="success-message" style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-4">
                        <label className="form-label">Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter your registered email"
                            disabled={loading || message}
                        />
                    </div>

                    {!message && (
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    )}
                </form>

                <div className="text-center mt-4" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Remember your password? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Back to Login</Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
