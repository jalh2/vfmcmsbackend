const express = require('express');
const router = express.Router();
const {
  getHomePage,
  updateHomePage,
  uploadHeroImage,
  deleteHeroImage,
  uploadFeaturedProgramImage,
  uploadHeaderLogo,
  deleteHeaderLogo,
} = require('../controllers/homeController');
const { protect } = require('../middleware/authMiddleware');
const { imageUpload } = require('../middleware/uploadMiddleware');

router.get('/', getHomePage);
router.put('/', protect, updateHomePage);
router.post('/hero-images/upload', protect, imageUpload.single('image'), uploadHeroImage);
router.delete('/hero-images/:index', protect, deleteHeroImage);
router.post('/programs/:key/image', protect, imageUpload.single('image'), uploadFeaturedProgramImage);
router.post('/header/logo', protect, imageUpload.single('image'), uploadHeaderLogo);
router.delete('/header/logo', protect, deleteHeaderLogo);

module.exports = router;
