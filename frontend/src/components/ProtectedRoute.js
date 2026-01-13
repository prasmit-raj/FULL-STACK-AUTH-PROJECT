import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/api';

/**
 * Protected Route Component
 * Wraps routes that require authentication
 * 
 * Flow:
 * 1. Check if user is authenticated (has valid token)
 * 2. If authenticated, render the protected component
 * 3. If not authenticated, redirect to login page
 * 
 * Usage:
 * <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  // Check if user has a token in localStorage
  const authenticated = isAuthenticated();

  // If not authenticated, redirect to login
  // The 'replace' prop prevents user from going back to protected route
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the protected component
  return children;
};

export default ProtectedRoute;
