import axios from 'axios';

// Base URL for backend API
// Change this if your backend runs on a different port
const API_URL = 'http://localhost:5000/api';

/**
 * Create axios instance with default configuration
 * This instance will be used for all API calls
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

/**
 * Request Interceptor
 * Automatically adds JWT token to all requests
 * This runs before every API call
 * 
 * Why localStorage?
 * - Simple and beginner-friendly
 * - Works across page refreshes
 * - No need for complex state management
 * 
 * Security Note:
 * - localStorage is vulnerable to XSS attacks
 * - For production, consider httpOnly cookies (requires backend changes)
 * - For this simple project, localStorage is acceptable
 */
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to Authorization header
    // Format: "Bearer <token>"
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles common errors (like 401 Unauthorized)
 * This runs after every API response
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // If token is invalid or expired, remove it and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

/**
 * Auth API Functions
 * These functions handle authentication-related API calls
 */

/**
 * Register a new user
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise} API response with user data and token
 */
export const register = async (username, email, password) => {
  const response = await api.post('/auth/register', {
    username,
    email,
    password
  });
  
  // Store token and user data in localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * Login user
 * @param {string} email - User's email or username
 * @param {string} password - User's password
 * @returns {Promise} API response with user data and token
 */
export const login = async (email, password) => {
  const response = await api.post('/auth/login', {
    email, // Backend accepts email or username
    password
  });
  
  // Store token and user data in localStorage
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * Get current user information
 * Requires authentication token
 * @returns {Promise} API response with user data
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

/**
 * Logout user
 * Removes token and user data from localStorage
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists in localStorage
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get stored user data
 * @returns {Object|null} User object or null if not found
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export default api;
