import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Classification from './components/Classification';
import History from './components/History';
import Admin from './components/Admin';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (requireAdmin && user.role !== 'ROLE_ADMIN') return <Navigate to="/" />;

  return children;
};

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <Link to="/" className="nav-brand">Smart Classifier</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/" className="nav-link">Classify</Link>
            <Link to="/history" className="nav-link">History</Link>
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
      </div>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <main className="main-container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <Admin />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
