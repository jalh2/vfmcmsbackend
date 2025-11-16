const express = require('express');
const router = express.Router();
const {
  getRehabPage,
  updateRehabPage,
  uploadHeaderBackgroundImage,
  uploadGalleryImage,
} = require('../controllers/rehabController');
const { protect } = require('../middleware/authMiddleware');
const { imageUpload } = require('../middleware/uploadMiddleware');

router.get('/', getRehabPage);
router.put('/', protect, updateRehabPage);
router.post('/header/background-image', protect, imageUpload.single('image'), uploadHeaderBackgroundImage);
router.post('/gallery/upload', protect, imageUpload.single('image'), uploadGalleryImage);

module.exports = router;
