import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../utils/api';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    // Extract token from URL
    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        if (!token) {
            setError('Invalid or missing reset token.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);

        try {
            const response = await api.post('/auth/reset-password', { token, newPassword });
            setMessage(response.data || 'Password updated successfully!');
            setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
        } catch (err) {
            setError(err.response?.data || 'An error occurred while resetting the password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-center animate-fade-in">
            <div className="glass-panel" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-4">Set New Password</h2>
                {message && <div className="success-message" style={{ color: 'var(--success)', marginBottom: '1rem', textAlign: 'center' }}>{message}</div>}
                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label className="form-label">New Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={loading || !token || message}
                        />
                    </div>

                    <div className="form-group mb-4">
                        <label className="form-label">Confirm New Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            disabled={loading || !token || message}
                        />
                    </div>

                    {!message && (
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading || !token}>
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    )}
                </form>

                {(!token || error) && (
                    <div className="text-center mt-4">
                        <Link to="/forgot-password" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Request a new token</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetPassword;
