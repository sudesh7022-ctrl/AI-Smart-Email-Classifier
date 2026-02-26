import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        try {
            const [usersRes, logsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/emails')
            ]);
            setUsers(usersRes.data);
            setLogs(logsRes.data);
        } catch (err) {
            setError('Failed to fetch admin data. You might not have the correct permissions.');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const totalClassifications = logs.length;
    const spamCount = logs.filter(log => log.prediction.toLowerCase() === 'spam').length;
    const importantCount = logs.filter(log => log.prediction.toLowerCase() === 'important').length;
    const normalCount = logs.filter(log => log.prediction.toLowerCase() === 'normal').length;

    if (loading) return <div className="text-center mt-4">Loading admin dashboard...</div>;
    if (error) return <div className="error-message mt-4">{error}</div>;

    return (
        <div className="animate-slide-up stagger-1" style={{ padding: '2rem 1rem' }}>
            <h2 className="gradient-text" style={{ marginBottom: '2.5rem', fontSize: '2.2rem' }}>Admin Dashboard</h2>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 mb-4" style={{ gap: '1.5rem' }}>
                <div className="glass-panel text-center animate-slide-up stagger-1" style={{ padding: '2rem' }}>
                    <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '1.05rem', fontWeight: '500' }}>Total Users</h3>
                    <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent-blue)' }}>{users.length}</div>
                </div>
                <div className="glass-panel text-center animate-slide-up stagger-2" style={{ padding: '2rem' }}>
                    <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '1.05rem', fontWeight: '500' }}>Total Emails Classified</h3>
                    <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--accent-purple)' }}>{totalClassifications}</div>
                </div>
                <div className="glass-panel text-center animate-slide-up stagger-3" style={{ padding: '2rem' }}>
                    <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '1.05rem', fontWeight: '500' }}>Total Spam Detected</h3>
                    <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--danger)' }}>{spamCount}</div>
                </div>
                <div className="glass-panel text-center animate-slide-up stagger-4" style={{ padding: '2rem' }}>
                    <h3 style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem', fontSize: '1.05rem', fontWeight: '500' }}>Overall Accuracy Trend</h3>
                    <div style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--success)' }}>~{(logs.reduce((acc, log) => acc + log.confidence, 0) / (logs.length || 1) * 100).toFixed(1)}%</div>
                </div>
            </div>

            <div className="animate-slide-up stagger-2" style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.5rem' }}>
                <button
                    className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'dashboard' ? '' : 'rgba(255,255,255,0.05)', color: activeTab === 'dashboard' ? '' : 'var(--text-secondary)' }}
                    onClick={() => setActiveTab('dashboard')}
                >Overview</button>
                <button
                    className={`btn ${activeTab === 'users' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'users' ? '' : 'rgba(255,255,255,0.05)', color: activeTab === 'users' ? '' : 'var(--text-secondary)' }}
                    onClick={() => setActiveTab('users')}
                >Users List</button>
                <button
                    className={`btn ${activeTab === 'logs' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'logs' ? '' : 'rgba(255,255,255,0.05)', color: activeTab === 'logs' ? '' : 'var(--text-secondary)' }}
                    onClick={() => setActiveTab('logs')}
                >System Activity</button>
            </div>

            {activeTab === 'users' && (
                <div className="glass-panel animate-slide-up stagger-3" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(0,0,0,0.3)' }}>
                            <tr>
                                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontWeight: '600' }}>ID</th>
                                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontWeight: '600' }}>Username</th>
                                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontWeight: '600' }}>Email</th>
                                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontWeight: '600' }}>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.02)' } }}>
                                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>{user.id}</td>
                                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>{user.username}</td>
                                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span className="badge" style={{ background: user.role === 'ROLE_ADMIN' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(59, 130, 246, 0.2)', color: user.role === 'ROLE_ADMIN' ? 'var(--accent-purple)' : 'var(--accent-blue)', border: `1px solid ${user.role === 'ROLE_ADMIN' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(59, 130, 246, 0.4)'}` }}>
                                            {user.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'logs' && (
                <div className="glass-panel animate-slide-up stagger-3" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(0,0,0,0.3)' }}>
                            <tr>
                                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontWeight: '600' }}>Time</th>
                                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontWeight: '600' }}>User ID</th>
                                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontWeight: '600' }}>Prediction</th>
                                <th style={{ padding: '1.25rem 1.5rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontWeight: '600' }}>Confidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.slice(0, 50).map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{formatDate(log.timestamp)}</td>
                                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)' }}>User #{log.user?.id || 'Unknown'}</td>
                                    <td style={{ padding: '1.25rem 1.5rem' }}>
                                        <span style={{
                                            color: log.prediction.toLowerCase() === 'spam' ? 'var(--danger)' : log.prediction.toLowerCase() === 'important' ? 'var(--warning)' : 'var(--success)',
                                            fontWeight: 'bold'
                                        }}>{log.prediction}</span>
                                    </td>
                                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>{(log.confidence * 100).toFixed(1)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Admin;
