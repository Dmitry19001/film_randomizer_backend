// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const AppDataSource = require('../data-source');
require('dotenv').config();

const userRepo = AppDataSource.getRepository('User');

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await userRepo.findOneBy({ username });
  if (!user) return res.status(400).send('Invalid credentials');

  // If flagged to force password change, apply it now
  if (user.forceChangePassword) {
    await forceChangePassword(user, password);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: '300d',
  });
  res.status(200).json({ token });
});

const register = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Please include all fields');
  }

  const exists = await userRepo.findOneBy({ username });
  if (exists) {
    return res.status(400).send('User already exists');
  }

  const hashed = await bcrypt.hash(password, 10);
  const newUser = userRepo.create({
    username,
    password: hashed,
    forceChangePassword: false,
  });
  await userRepo.save(newUser);

  const token = jwt.sign({ id: newUser.id }, process.env.SECRET_KEY, {
    expiresIn: '300d',
  });
  res.status(201).json({ token });
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await userRepo.findOneBy({ id: req.user.id });
  if (!user) return res.status(400).send('Invalid credentials');

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).send('Invalid credentials');

  await forceChangePassword(user, newPassword);
  res.status(200).send('Password changed successfully');
});

const forceChangePassword = asyncHandler(async (user, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.forceChangePassword = false;
  await userRepo.save(user);
});

module.exports = { login, register, changePassword };