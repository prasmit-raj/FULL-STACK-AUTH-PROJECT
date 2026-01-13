import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser, getStoredUser } from '../services/api';
import './Dashboard.css';

/**
 * Dashboard Component
 * Protected route that displays user information
 * 
 * Flow:
 * 1. On mount, fetches current user data from API
 * 2. Displays user information
 * 3. Provides logout functionality
 * 
 * This component demonstrates:
 * - How to access protected routes
 * - How to fetch authenticated user data
 * - How to handle logout
 */
const Dashboard = () => {
  const navigate = useNavigate();
  
  // User state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Fetch current user data on component mount
   * Uses the stored token to authenticate the request
   */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // First, try to get user from localStorage (faster)
        const storedUser = getStoredUser();
        if (storedUser) {
          setUser(storedUser);
        }

        // Then fetch fresh data from API
        // This ensures we have the latest user data
        const response = await getCurrentUser();
        setUser(response.user);
      } catch (err) {
        // If API call fails (e.g., token expired), redirect to login
        setError('Failed to fetch user data');
        // The API interceptor will handle redirecting to login
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  /**
   * Handle logout
   * Removes token and user data, then redirects to login
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-box">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-box">
          <div className="error-message">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="navbar">
        <h2>Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-box">
        <h2>Welcome!</h2>
        
        {user && (
          <div className="user-info">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.createdAt && (
              <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        )}

        <div className="info-section">
          <h3>Protected Route Example</h3>
          <p>
            This page is protected by authentication. Only logged-in users can access it.
          </p>
          <p>
            The JWT token stored in localStorage is automatically sent with each API request
            via the axios interceptor in the API service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
