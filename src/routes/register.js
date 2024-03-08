import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User, { findOne } from '../../models/user';

const router = Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Simple validation
  if (!username || !password) {
    return res.status(400).send('Please include all fields');
  }

  // Check for existing user
  const userExists = await findOne({ username });
  if (userExists) {
    return res.status(400).send('User already exists');
  }

  // Create user
  const user = new User({ username, password });
  await user.save();

  // Create token
  const token = sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

  res.status(201).json({ token });
});

export default router;
