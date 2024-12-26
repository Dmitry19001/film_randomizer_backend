const { login, register } = require('../controllers/authController');
const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');

router.post('/login', login);
router.post('/register', register);
router.post('/changePassword', protect, changePassword);
router.get('/status', protect, (req, res) => {
  res.status(200);
})

module.exports = router;