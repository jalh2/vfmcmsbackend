const express = require('express');
const router = express.Router();
const {
  getClinicPage,
  updateClinicPage,
  uploadHeaderBackgroundImage,
  uploadEstablishmentStoryImage,
  uploadGalleryImage,
} = require('../controllers/clinicController');
const { protect } = require('../middleware/authMiddleware');
const { imageUpload } = require('../middleware/uploadMiddleware');

router.get('/', getClinicPage);
router.put('/', protect, updateClinicPage);
router.post('/header/background-image', protect, imageUpload.single('image'), uploadHeaderBackgroundImage);
router.post('/establishment-story/image', protect, imageUpload.single('image'), uploadEstablishmentStoryImage);
router.post('/gallery/upload', protect, imageUpload.single('image'), uploadGalleryImage);

module.exports = router;
