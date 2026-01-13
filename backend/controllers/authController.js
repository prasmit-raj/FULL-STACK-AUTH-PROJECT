const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT Token
 * Creates a signed JWT token containing the user's ID
 * Token expires in 7 days (configurable)
 */
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, // Payload: data stored in token
    process.env.JWT_SECRET, // Secret key to sign token
    { expiresIn: '7d' } // Token expires in 7 days
  );
};


exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        message: 'Please provide username, email, and password.'
      });
    }

    // Check duplicates explicitly for clearer errors
    const [existingEmail, existingUsername] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ username })
    ]);

    if (existingEmail) {
      return res.status(400).json({
        message: 'Email already exists.'
      });
    }

    if (existingUsername) {
      return res.status(400).json({
        message: 'Username already exists.'
      });
    }

    // Password hashing happens in the User model pre-save hook (bcrypt)
    const user = await User.create({
      username,
      email,
      password
    });

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]?.message || 'Validation error.';
      return res.status(400).json({
        message: firstError
      });
    }

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyValue || {})[0];
      const fieldLabel = duplicateField === 'username' ? 'Username' : 'Email';

      return res.status(400).json({
        message: `${fieldLabel} already exists.`
      });
    }

    res.status(500).json({
      message: 'Server error.'
    });
  }
};

/**
 * Login Controller
 * Handles user authentication
 * 
 * Flow:
 * 1. Validate input (email/username and password)
 * 2. Find user by email or username
 * 3. Check if user exists
 * 4. Compare provided password with hashed password in database
 * 5. If passwords match, generate JWT token
 * 6. Return user data and token
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password.' 
      });
    }

    // Step 2: Find user by email or username
    // User can login with either email or username
    const user = await User.findOne({
      $or: [{ email }, { username: email }]
    });

    // Step 3: Check if user exists
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials.' 
      });
    }

    // Step 4: Compare password
    // Uses bcrypt to compare plain text password with hashed password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid credentials.' 
      });
    }

    // Step 5: Generate JWT token
    const token = generateToken(user._id);

    // Step 6: Return user data (excluding password) and token
    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error during login.', 
      error: error.message 
    });
  }
};

/**
 * Get Current User Controller
 * Returns the authenticated user's information
 * This route is protected by auth middleware
 */
exports.getMe = async (req, res) => {
  try {
    // req.user is set by auth middleware
    // No need to query database again
    res.status(200).json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        createdAt: req.user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user data.', 
      error: error.message 
    });
  }
};
