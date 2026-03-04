import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(response.data);
            } catch (err) {
                setError('Failed to load profile data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ textAlign: 'center', marginTop: '3rem' }}>
                <p>Loading Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '2rem auto' }}>
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1.5rem' }}>
                    <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: 'var(--primary)', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2.5rem', fontWeight: 'bold'
                    }}>
                        {profile?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2 style={{ margin: 0, color: 'var(--primary)' }}>{profile?.username}</h2>
                        <p style={{ color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>{profile?.email}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Account Role</h4>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-color)' }}>
                            {profile?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Standard User'}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Login Method</h4>
                        <div style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-color)' }}>
                            {profile?.provider === 'GOOGLE' ? 'Google OAuth' : 'Local Account'}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Total Emails Classified</h4>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--primary)' }}>
                            {profile?.totalClassifications || 0}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Account Actions</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn btn-secondary" onClick={() => window.location.href = '/history'}>View Email History</button>
                        {/* Can add more actions like Change Password here later if user wants */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
