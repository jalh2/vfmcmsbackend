const express = require('express');
const router = express.Router();
const { createUser, getUsers, updateUser } = require('../controllers/userController');
const { protect, requireSuperAdmin } = require('../middleware/authMiddleware');

router.post('/', protect, requireSuperAdmin, createUser);
router.get('/', protect, requireSuperAdmin, getUsers);
router.put('/:id', protect, requireSuperAdmin, updateUser);

module.exports = router;
