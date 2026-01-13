const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getMe
} = require('../controllers/authController');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Get current user
router.get('/me', getMe);

module.exports = router;
