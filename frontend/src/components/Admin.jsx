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
        <div className="animate-fade-in" style={{ padding: '1rem 0' }}>
            <h2 style={{ marginBottom: '2rem' }}>Admin Dashboard</h2>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 mb-4" style={{ gap: '1rem' }}>
                <div className="glass-panel text-center" style={{ padding: '1.5rem' }}>
                    <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '1rem' }}>Total Users</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>{users.length}</div>
                </div>
                <div className="glass-panel text-center" style={{ padding: '1.5rem' }}>
                    <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '1rem' }}>Total Emails Classified</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{totalClassifications}</div>
                </div>
                <div className="glass-panel text-center" style={{ padding: '1.5rem' }}>
                    <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '1rem' }}>Total Spam Detected</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--danger)' }}>{spamCount}</div>
                </div>
                <div className="glass-panel text-center" style={{ padding: '1.5rem' }}>
                    <h3 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '1rem' }}>Overall Accuracy Trend</h3>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--success)' }}>~{(logs.reduce((acc, log) => acc + log.confidence, 0) / (logs.length || 1) * 100).toFixed(1)}%</div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <button
                    className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'dashboard' ? '' : 'transparent', color: activeTab === 'dashboard' ? '' : 'var(--text-muted)' }}
                    onClick={() => setActiveTab('dashboard')}
                >Overview</button>
                <button
                    className={`btn ${activeTab === 'users' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'users' ? '' : 'transparent', color: activeTab === 'users' ? '' : 'var(--text-muted)' }}
                    onClick={() => setActiveTab('users')}
                >Users List</button>
                <button
                    className={`btn ${activeTab === 'logs' ? 'btn-primary' : ''}`}
                    style={{ background: activeTab === 'logs' ? '' : 'transparent', color: activeTab === 'logs' ? '' : 'var(--text-muted)' }}
                    onClick={() => setActiveTab('logs')}
                >System Activity</button>
            </div>

            {activeTab === 'users' && (
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>Username</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>Email</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem' }}>{user.id}</td>
                                    <td style={{ padding: '1rem' }}>{user.username}</td>
                                    <td style={{ padding: '1rem' }} className="text-muted">{user.email}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span className="badge" style={{ background: user.role === 'ROLE_ADMIN' ? 'var(--secondary)' : 'var(--primary)', color: 'white' }}>
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
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>Time</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>User ID</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>Prediction</th>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>Confidence</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.slice(0, 50).map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{formatDate(log.timestamp)}</td>
                                    <td style={{ padding: '1rem' }}>User #{log.user?.id || 'Unknown'}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            color: log.prediction.toLowerCase() === 'spam' ? '#fca5a5' : log.prediction.toLowerCase() === 'important' ? '#fcd34d' : '#6ee7b7',
                                            fontWeight: 'bold'
                                        }}>{log.prediction}</span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>{(log.confidence * 100).toFixed(1)}%</td>
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
