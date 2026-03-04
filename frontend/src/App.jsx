import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Login from './components/Login';
import Register from './components/Register';
import Classification from './components/Classification';
import History from './components/History';
import Admin from './components/Admin';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import ChatWidget from './components/ChatWidget';
import LiveChatWidget from './components/LiveChatWidget';
import Dashboard from './components/Dashboard';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && user.role !== 'ROLE_ADMIN') return <Navigate to="/" />;

  return children;
};

const Navigation = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav>
      <Link to="/" className="nav-brand">Smart Classifier</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/" className="nav-link">Classify</Link>
            <Link to="/history" className="nav-link">History</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            {user.role === 'ROLE_ADMIN' && (
              <Link to="/admin" className="nav-link">Admin</Link>
            )}
            <button onClick={logout} className="btn btn-danger" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-link">Register</Link>
          </>
        )}
        <button
          onClick={toggleTheme}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-color)',
            cursor: 'pointer',
            fontSize: '1.25rem',
            marginLeft: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
};

const AuthenticatedChatWidgets = () => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <>
      <ChatWidget />
      <LiveChatWidget />
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navigation />
          <main className="main-container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Classification />
                </ProtectedRoute>
              } />
              <Route path="/history" element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <Admin />
                </ProtectedRoute>
              } />
            </Routes>
            <AuthenticatedChatWidgets />
          </main>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
