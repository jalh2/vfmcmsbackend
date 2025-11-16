const express = require('express');
const router = express.Router();
const {
  getAboutPage,
  updateAboutPage,
  uploadHeaderBackgroundImage,
  uploadOrganizationBioImage,
  uploadHistoryImage,
  uploadFounderImage,
} = require('../controllers/aboutController');
const { protect } = require('../middleware/authMiddleware');
const { imageUpload } = require('../middleware/uploadMiddleware');

router.get('/', getAboutPage);
router.put('/', protect, updateAboutPage);
router.post('/header/background-image', protect, imageUpload.single('image'), uploadHeaderBackgroundImage);
router.post('/organization-bio/image', protect, imageUpload.single('image'), uploadOrganizationBioImage);
router.post('/history/image', protect, imageUpload.single('image'), uploadHistoryImage);
router.post('/founder/image', protect, imageUpload.single('image'), uploadFounderImage);

module.exports = router;
