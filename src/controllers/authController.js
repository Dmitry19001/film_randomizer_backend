const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
require('dotenv').config(); 

const login =  asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check for user
  const user = await User.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '300d' });
    res.status(201).json({ "token": token });
  } else {
    res.status(400).send('Invalid credentials');
  }
});

const register =  asyncHandler(async (req, res) => {
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

  // Encrypt password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = new User({ username, password: hashedPassword });
  await user.save();

  // Create token
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '300d' });

  res.status(201).json({ "token": token });
});

module.exports = { login, register };