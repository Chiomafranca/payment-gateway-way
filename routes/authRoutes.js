const express = require('express');
const { signup, signin } = require('../controllers/authController');

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Signup user
// @access  Public
router.post('/signup', signup);

// @route   POST /api/auth/signin
// @desc    Signin user
// @access  Public
router.post('/signin', signin);

module.exports = router;

