import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './services/api';
import './App.css';

/**
 * Main App Component
 * Sets up routing for the application
 * 
 * Routes:
 * - /login - Login page (public)
 * - /register - Registration page (public)
 * - /dashboard - User dashboard (protected - requires authentication)
 * - / - Redirects to dashboard if logged in, otherwise to login
 */
function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/login" 
            element={
              // If already logged in, redirect to dashboard
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />
            } 
          />
          <Route 
            path="/register" 
            element={
              // If already logged in, redirect to dashboard
              isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Register />
            } 
          />

          {/* Protected Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route
            path="/"
            element={
              // Redirect to dashboard if logged in, otherwise to login
              isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 404 - Catch all other routes */}
          <Route
            path="*"
            element={
              <div className="container">
                <h2>404 - Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
