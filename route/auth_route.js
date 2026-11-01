const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controller/auth_controller');
const { authenticate } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (requires valid Bearer token)
router.get('/profile', authenticate, getProfile);

module.exports = router;