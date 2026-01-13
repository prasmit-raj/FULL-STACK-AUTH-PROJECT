const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Protects routes by verifying JWT tokens
 * 
 * Flow:
 * 1. Extract token from Authorization header
 * 2. Verify token using JWT_SECRET
 * 3. Find user in database using token payload (userId)
 * 4. Attach user to request object for use in route handlers
 * 5. If any step fails, return 401 Unauthorized
 */
const auth = async (req, res, next) => {
  try {
    // Step 1: Get token from Authorization header
    // Expected format: "Bearer <token>"
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'No token provided. Access denied.' 
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Step 2: Verify token
    // jwt.verify throws error if token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Step 3: Find user in database
    // decoded contains { userId: ... } from when we created the token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Token is valid but user not found.' 
      });
    }

    // Step 4: Attach user to request object
    // Now route handlers can access req.user without querying database again
    req.user = user;
    
    // Step 5: Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle JWT errors (expired, invalid, etc.)
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token.' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token has expired.' 
      });
    }

    // Other errors
    res.status(500).json({ 
      message: 'Authentication error.', 
      error: error.message 
    });
  }
};

module.exports = auth;
