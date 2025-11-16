const express = require('express');
const router = express.Router();
const {
  getAcademyPage,
  updateAcademyPage,
  uploadHeaderBackgroundImage,
  uploadEstablishmentStoryImage,
  uploadFacilitiesGalleryImage,
} = require('../controllers/academyController');
const { protect } = require('../middleware/authMiddleware');
const { imageUpload } = require('../middleware/uploadMiddleware');

router.get('/', getAcademyPage);
router.put('/', protect, updateAcademyPage);
router.post('/header/background-image', protect, imageUpload.single('image'), uploadHeaderBackgroundImage);
router.post('/establishment-story/image', protect, imageUpload.single('image'), uploadEstablishmentStoryImage);
router.post('/facilities-gallery/upload', protect, imageUpload.single('image'), uploadFacilitiesGalleryImage);

module.exports = router;
