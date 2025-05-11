// middleware/auth.js
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const AppDataSource = require('../data-source');

const userRepo = AppDataSource.getRepository('User');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = authHeader.split(' ')[1];
  if (!token || token === 'null') {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await userRepo.findOne({
      where: { id: decoded.id },
      select: ['id', 'username', 'forceChangePassword'], 
    });

    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Session has expired.' });
    }
    console.error('Error verifying token:', err);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
});

module.exports = protect;
