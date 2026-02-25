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
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '2rem' }}>
            <div className="glass-panel text-center mb-4">
                <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Smart AI Classifier
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    Analyze any email content instantly using our advanced Naive Bayes Machine Learning model to determine if it's Spam, Important, or Normal.
                </p>
            </div>

            <div className="glass-panel">
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

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading || !text.trim()}>
                            {loading ? 'Analyzing...' : 'Classify Email'}
                        </button>
                    </div>
                </form>

                {error && <div className="error-message mt-4">{error}</div>}

                {result && (
                    <div className="mt-4 animate-fade-in" style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '1.5rem', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--glass-border)' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Analysis Results</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>Category</span>
                                <span className={`badge ${getBadgeClass(result.category)}`} style={{ fontSize: '1rem', padding: '0.4rem 1rem' }}>
                                    {result.category}
                                </span>
                            </div>

                            <div>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'block', marginBottom: '0.25rem' }}>Confidence Score</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                                        {(result.confidence * 100).toFixed(1)}%
                                    </span>

                                    {/* Visual Confidence Bar */}
                                    <div style={{ width: '150px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${result.confidence * 100}%`,
                                            background: result.confidence > 0.8 ? 'var(--success)' : result.confidence > 0.5 ? 'var(--warning)' : 'var(--danger)',
                                            transition: 'width 1s ease-out'
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
