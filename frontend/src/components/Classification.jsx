import React, { useState } from 'react';
import api from '../utils/api';

const Classification = () => {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleClassify = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await api.post('/emails/classify', { text });
            setResult({
                category: response.data.category,
                confidence: response.data.confidence
            });
        } catch (err) {
            // Check for specific 503 error from AI service failure
            if (err.response?.status === 503) {
                setError(err.response.data || "The AI model service is currently offline. Please ensure it is running.");
            } else {
                setError(err.response?.data || 'Failed to classify email. Please try again.');
            }
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

    return (
        <div className="flex-center" style={{ padding: '2rem 1rem' }}>
            <div className="glass-panel text-center mb-4 animate-slide-up stagger-1" style={{ maxWidth: '800px', width: '100%', padding: '2.5rem' }}>
                <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    Smart AI Classifier
                </h1>
                <p className="subtitle" style={{ fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
                    Analyze any email content instantly using our advanced Naive Bayes Machine Learning model to determine if it's Spam, Important, or Normal.
                </p>
            </div>

            <div className="glass-panel animate-slide-up stagger-2" style={{ maxWidth: '800px', width: '100%' }}>
                <form onSubmit={handleClassify}>
                    <div className="form-group">
                        <label className="form-label" style={{ fontSize: '1rem' }}>Enter Email Content Below</label>
                        <textarea
                            className="form-input form-textarea mt-1"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Paste the email text here..."
                            required
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                        <button type="submit" className="btn btn-primary animate-pulse-glow" disabled={loading || !text.trim()} style={{ minWidth: '180px' }}>
                            {loading ? 'Analyzing...' : 'Classify Email'}
                        </button>
                    </div>
                </form>

                {error && <div className="error-message mt-4 animate-slide-up">{error}</div>}

                {result && (
                    <div className="mt-4 animate-slide-up stagger-3" style={{ background: 'rgba(9, 9, 11, 0.4)', padding: '1.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.2)' }}>
                        <h3 className="gradient-text" style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Analysis Results</h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' }}>
                            <div>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Category</span>
                                <span className={`badge ${getBadgeClass(result.category)}`} style={{ fontSize: '1.1rem', padding: '0.5rem 1.25rem' }}>
                                    {result.category}
                                </span>
                            </div>

                            <div style={{ flex: 1, minWidth: '200px' }}>
                                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>AI Confidence Score</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                                        {(result.confidence * 100).toFixed(1)}%
                                    </span>

                                    {/* Visual Confidence Bar */}
                                    <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${result.confidence * 100}%`,
                                            background: result.confidence > 0.8 ? 'linear-gradient(90deg, #10b981, #34d399)' : result.confidence > 0.5 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 'linear-gradient(90deg, #ef4444, #f87171)',
                                            transition: 'width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                                            boxShadow: '0 0 10px rgba(255,255,255,0.2)'
                                        }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Classification;
