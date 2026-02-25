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
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>Classification History</h2>
                <span style={{ color: 'var(--text-muted)' }}>{history.length} records found</span>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="text-center" style={{ padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading your history...
                </div>
            ) : history.length === 0 ? (
                <div className="glass-panel text-center" style={{ padding: '4rem 2rem' }}>
                    <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No classifications yet</h3>
                    <p>Head over to the Classify tab to analyze your first email.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2">
                    {history.map((item) => (
                        <div key={item.id} className="history-card">
                            <div className="history-header">
                                <span className={`badge ${getBadgeClass(item.prediction)}`}>
                                    {item.prediction}
                                </span>
                                <span className="history-date">{formatDate(item.timestamp)}</span>
                            </div>

                            <div className="history-text">
                                {item.emailText}
                            </div>

                            <div className="history-footer">
                                <span>Confidence:</span>
                                <span style={{
                                    color: item.confidence > 0.8 ? 'var(--success)' : item.confidence > 0.5 ? 'var(--warning)' : 'var(--danger)',
                                    fontWeight: 'bold'
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
