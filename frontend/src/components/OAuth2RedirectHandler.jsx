import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OAuth2RedirectHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const getUrlParameter = (name) => {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            const results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };

        const token = getUrlParameter('token');
        const username = getUrlParameter('username');
        const role = getUrlParameter('role');

        if (token && username) {
            login({ token, username, role });
            navigate('/', { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    }, [location, login, navigate]);

    return (
        <div className="flex-center">
            <div className="glass-panel" style={{ textAlign: 'center' }}>
                <h2>Logging you in...</h2>
                <p>Please wait while we securely authenticate your account.</p>
            </div>
        </div>
    );
};

export default OAuth2RedirectHandler;
