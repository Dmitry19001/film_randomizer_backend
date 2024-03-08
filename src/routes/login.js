const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 

const router = express.Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Check for user
  const user = await User.findOne({ username });
  if (user && (await bcrypt.compare(password, user.password))) {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '300d' });
    res.json({ token });
  } else {
    res.status(400).send('Invalid credentials');
  }
});

module.exports = router;
