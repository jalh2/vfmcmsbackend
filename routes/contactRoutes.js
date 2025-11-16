const express = require('express');
const router = express.Router();
const { getContactPage, updateContactPage } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getContactPage);
router.put('/', protect, updateContactPage);

module.exports = router;
