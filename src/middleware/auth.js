const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');

// Middleware to protect routes
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({
      message: "Not authorized, no token"
    });
  }

  const token = authHeader.split(' ')[1];

  // Sometimes the token is 'null' or empty string
  if (!token || token === 'null') {
    return res.status(401).json({
      message: "Not authorized, no token"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        message: "Not authorized, user not found"
      });
    }

    // After verifying token, we can check subscription
    next();
  } catch (error) {
    console.error('Error verifying token:', error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Session has expired."
      });
    }

    return res.status(401).json({
      message: "Not authorized, token failed"
    });
  }
});

module.exports = protect;