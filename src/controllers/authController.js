const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const asyncHandler = require('express-async-handler');
require('dotenv').config(); 

const login =  asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Check for user
  const user = await User.findOne({ username });

  // Check if forceChangePassword is true
  if (user && user.forceChangePassword) {
    forceChangePassword(user, password);
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: '300d' });
    res.status(200).json({ "token": token });
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

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  if (user && (await bcrypt.compare(oldPassword, user.password))) {
    forceChangePassword(user, newPassword);
    res.status(200).send('Password changed successfully');
  } else {
    res.status(400).send('Invalid credentials');
  }
});

const forceChangePassword = asyncHandler(async (user, newPassword) => {
  // Should be accessible only when forceChangePassword is true
  // OR when changePassword is called and oldPassword is correct
  
  const hashedPassword = bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.forceChangePassword = false;
  await user.save();
})
module.exports = { login, register, changePassword };