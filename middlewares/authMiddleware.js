const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to protect routes - Verifies JWT token
 */
exports.protect = async (req, res, next) => {
  let token;

  try {
    token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token

    req.user = await User.findById(decoded.id).select('-password'); // Attach user to request object
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next(); // Continue to the next middleware/controller
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};
