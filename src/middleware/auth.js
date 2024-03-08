import { verify } from 'jsonwebtoken';
import { findById } from './User';

const authMiddleware = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = verify(token, process.env.JWT_SECRET);

      req.user = await findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.log(error);
      res.status(401).send('Not authorized');
    }
  }

  if (!token) {
    res.status(401).send('Not authorized, no token');
  }
};

export default authMiddleware;
