const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password) {
    return res.status(400).send('Please include all fields');
  }

  // Check for existing user
  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).send('User already exists');
  }

  // Create user
  const user = new User({ username, password });
  await user.save();

  // Create token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '300d' });

  res.status(201).json({ token });
});

module.exports = router;
