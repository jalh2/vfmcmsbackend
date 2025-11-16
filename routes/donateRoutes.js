const express = require('express');
const router = express.Router();
const { getDonatePage, updateDonatePage } = require('../controllers/donateController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getDonatePage);
router.put('/', protect, updateDonatePage);

module.exports = router;
