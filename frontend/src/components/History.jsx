import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const response = await api.get('/emails/history');
            setHistory(response.data);
        } catch (err) {
            setError('Failed to fetch history. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const getBadgeClass = (category) => {
        if (!category) return "";
        const lower = category.toLowerCase();
        if (lower === 'spam') return 'badge-spam';
        if (lower === 'important') return 'badge-important';
        return 'badge-normal';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="animate-slide-up stagger-1" style={{ padding: '2rem 1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                <h2 className="gradient-text" style={{ fontSize: '2.2rem' }}>Classification History</h2>
                <span className="badge" style={{ background: 'rgba(59, 130, 246, 0.2)', color: 'var(--accent-blue)', border: '1px solid rgba(59, 130, 246, 0.4)' }}>
                    {history.length} records found
                </span>
            </div>

            {error && <div className="error-message animate-slide-up stagger-2">{error}</div>}

            {loading ? (
                <div className="text-center animate-pulse" style={{ padding: '4rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Loading your history...
                </div>
            ) : history.length === 0 ? (
                <div className="glass-panel text-center animate-slide-up stagger-2" style={{ padding: '5rem 2rem' }}>
                    <h3 style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '1.5rem' }}>No classifications yet</h3>
                    <p style={{ color: 'var(--text-primary)' }}>Head over to the Classify tab to analyze your first email.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2">
                    {history.map((item, index) => (
                        <div key={item.id} className={`history-card animate-slide-up stagger-${(index % 4) + 1}`}>
                            <div className="history-header">
                                <span className={`badge ${getBadgeClass(item.prediction)}`}>
                                    {item.prediction}
                                </span>
                                <span className="history-date">{formatDate(item.timestamp)}</span>
                            </div>

                            <div className="history-text">
                                "{item.emailText}"
                            </div>

                            <div className="history-footer">
                                <span>Confidence Score</span>
                                <span style={{
                                    color: item.confidence > 0.8 ? 'var(--success)' : item.confidence > 0.5 ? 'var(--warning)' : 'var(--danger)',
                                    fontWeight: '800',
                                    fontSize: '1.1rem'
                                }}>
                                    {(item.confidence * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
