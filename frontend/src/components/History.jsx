import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Filtering and Sorting States
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');

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

    // Derived state for filtering and sorting
    const getFilteredHistory = () => {
        let filtered = [...history];

        // 1. Filter
        if (filterCategory !== 'All') {
            filtered = filtered.filter(item =>
                item.prediction.toLowerCase() === filterCategory.toLowerCase()
            );
        }

        // 2. Sort
        filtered.sort((a, b) => {
            if (sortBy === 'Newest') {
                return new Date(b.timestamp) - new Date(a.timestamp);
            } else if (sortBy === 'Oldest') {
                return new Date(a.timestamp) - new Date(b.timestamp);
            } else if (sortBy === 'Highest Confidence') {
                return b.confidence - a.confidence;
            } else if (sortBy === 'Lowest Confidence') {
                return a.confidence - b.confidence;
            }
            return 0;
        });

        return filtered;
    };

    const displayedHistory = getFilteredHistory();

    return (
        <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <h2>Classification History</h2>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <select
                            className="form-input"
                            style={{ padding: '0.5rem', width: 'auto' }}
                            value={filterCategory}
                            onChange={e => setFilterCategory(e.target.value)}
                        >
                            <option value="All">All Categories</option>
                            <option value="Normal">Normal</option>
                            <option value="Important">Important</option>
                            <option value="Spam">Spam</option>
                        </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <select
                            className="form-input"
                            style={{ padding: '0.5rem', width: 'auto' }}
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <option value="Newest">Newest First</option>
                            <option value="Oldest">Oldest First</option>
                            <option value="Highest Confidence">Highest Confidence</option>
                            <option value="Lowest Confidence">Lowest Confidence</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>
                Showing {displayedHistory.length} of {history.length} records.
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="text-center" style={{ padding: '3rem', color: 'var(--text-muted)' }}>
                    Loading your history...
                </div>
            ) : history.length === 0 ? (
                <div className="glass-panel text-center" style={{ padding: '4rem 2rem' }}>
                    <h3 style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No classifications yet</h3>
                    <p>No records match your filters, or you haven't classified anything yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2">
                    {displayedHistory.map((item) => (
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
