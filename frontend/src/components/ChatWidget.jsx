import React, { useState } from 'react';
import axios from 'axios';
import './ChatWidget.css'; // We will create this

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('idle'); // idle, sending, success, error

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        // Reset status when reopening
        if (!isOpen && status === 'success') {
            setStatus('idle');
            setMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setStatus('sending');
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/contact/support',
                { message },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setStatus('success');
            setTimeout(() => {
                setIsOpen(false);
                setStatus('idle');
                setMessage('');
            }, 3000);
        } catch (error) {
            console.error('Support query failed', error);
            setStatus('error');
        }
    };

    return (
        <div className="chat-widget-container">
            {isOpen && (
                <div className="chat-window glass-panel">
                    <div className="chat-header">
                        <h4>Contact Support</h4>
                        <button className="close-btn" onClick={toggleOpen}>×</button>
                    </div>

                    <div className="chat-body">
                        {status === 'success' ? (
                            <div className="chat-success">
                                <span className="check-icon">✓</span>
                                <p>Message sent directly to the Admin!</p>
                                <p className="success-subtext">They will reply to your registered email address.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <p className="chat-instruction">Have a question? Send a direct message to the admin.</p>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your query here..."
                                    disabled={status === 'sending'}
                                    required
                                    rows="4"
                                />

                                {status === 'error' && (
                                    <p className="chat-error">Failed to send message. Please try again.</p>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary send-btn"
                                    disabled={status === 'sending' || !message.trim()}
                                >
                                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <button className="chat-toggle-btn" onClick={toggleOpen}>
                {isOpen ? '↓' : '💬 Support'}
            </button>
        </div>
    );
};

export default ChatWidget;
