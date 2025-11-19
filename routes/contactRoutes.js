const express = require('express');
const router = express.Router();
const { getContactPage, updateContactPage, uploadHeaderBackgroundImage } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const { imageUpload } = require('../middleware/uploadMiddleware');

router.get('/', getContactPage);
router.put('/', protect, updateContactPage);
router.post('/header/background-image', protect, imageUpload.single('image'), uploadHeaderBackgroundImage);

module.exports = router;
