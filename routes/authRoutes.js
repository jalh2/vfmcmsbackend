const express = require('express');
const router = express.Router();
const {
  registerSuperAdmin,
  login,
  logout,
  getCurrentUser,
} = require('../controllers/authController');

router.post('/register-super-admin', registerSuperAdmin);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getCurrentUser);

module.exports = router;
