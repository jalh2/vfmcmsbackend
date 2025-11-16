const express = require('express');
const router = express.Router();
const {
  getGalleryPage,
  updateGalleryPage,
  uploadGalleryImage,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/authMiddleware');
const { imageUpload } = require('../middleware/uploadMiddleware');

router.get('/', getGalleryPage);
router.put('/', protect, updateGalleryPage);
router.post('/images/upload', protect, imageUpload.single('image'), uploadGalleryImage);

module.exports = router;
