import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../context/AuthContext';
import './LiveChatWidget.css'; // We will create this as well

const LiveChatWidget = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Only connect if user is logged in
        if (!user) return;

        const connectWebSocket = () => {
            const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
            const wsUrl = baseUrl.replace('/api', '/ws');
            const socket = new SockJS(wsUrl);
            const client = new Client({
                webSocketFactory: () => socket,
                debug: function (str) {
                    // console.log(str);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000,
            });

            client.onConnect = function (frame) {
                // Subscribe to public chat topic
                client.subscribe('/topic/public', function (message) {
                    const body = JSON.parse(message.body);
                    setMessages((prev) => [...prev, body]);
                });

                // Notify server that user joined
                client.publish({
                    destination: '/app/chat.addUser',
                    body: JSON.stringify({ senderName: user.username, senderEmail: user.email, type: 'JOIN' }),
                });
            };

            client.activate();
            stompClient.current = client;
        };

        connectWebSocket();

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [user]);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (messageInput.trim() && stompClient.current && stompClient.current.connected) {
            const chatMessage = {
                senderName: user.username,
                senderEmail: user.email,
                content: messageInput,
                type: 'CHAT'
            };
            stompClient.current.publish({
                destination: '/app/chat.sendMessage',
                body: JSON.stringify(chatMessage)
            });
            setMessageInput('');
        }
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    if (!user) return null;

    return (
        <div className="live-chat-container">
            {isOpen && (
                <div className="live-chat-window glass-panel">
                    <div className="live-chat-header">
                        <h4>🌐 Community Chat</h4>
                        <button className="live-close-btn" onClick={toggleOpen}>×</button>
                    </div>

                    <div className="live-chat-body">
                        <div className="live-chat-messages">
                            {messages.length === 0 && (
                                <div className="live-chat-empty">No messages yet. Say hi!</div>
                            )}
                            {messages.map((msg, index) => (
                                <div key={index} className={`live-chat-msg ${msg.type === 'JOIN' ? 'msg-event' : ''} ${msg.senderName === user.username ? 'msg-own' : 'msg-other'}`}>
                                    {msg.type === 'JOIN' ? (
                                        <span><em>{msg.senderName} joined the chat</em></span>
                                    ) : (
                                        <div className="msg-bubble">
                                            <div className="msg-sender" title={msg.senderEmail}>{msg.senderName}</div>
                                            <div className="msg-content">{msg.content}</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={sendMessage} className="live-chat-input-area">
                            <input
                                type="text"
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder="Type a message..."
                                autoComplete="off"
                            />
                            <button type="submit" disabled={!messageInput.trim()}>Send</button>
                        </form>
                    </div>
                </div>
            )}

            <button className="live-chat-toggle-btn" onClick={toggleOpen}>
                {isOpen ? '↓' : '🌍 Live Chat'}
            </button>
        </div>
    );
};

export default LiveChatWidget;
