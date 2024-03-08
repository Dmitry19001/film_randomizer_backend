import { Router } from 'express';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { findOne } from '../../models/user';

const router = Router();

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  // Check for user
  const user = await findOne({ username });
  if (user && (await compare(password, user.password))) {
    // Create token
    const token = sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '200d' });
    res.json({ token });
  } else {
    res.status(400).send('Invalid credentials');
  }
});

export default router;
