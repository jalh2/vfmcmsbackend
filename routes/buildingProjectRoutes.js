const express = require('express');
const router = express.Router();
const {
  getBuildingProjectPage,
  updateBuildingProjectPage,
  uploadHeaderBackgroundImage,
  uploadReasonImpactImage,
  uploadFloodGalleryImage,
} = require('../controllers/buildingProjectController');
const { protect } = require('../middleware/authMiddleware');
const { imageUpload } = require('../middleware/uploadMiddleware');

router.get('/', getBuildingProjectPage);
router.put('/', protect, updateBuildingProjectPage);
router.post('/header/background-image', protect, imageUpload.single('image'), uploadHeaderBackgroundImage);
router.post('/reason-impact/image', protect, imageUpload.single('image'), uploadReasonImpactImage);
router.post('/flood-gallery/upload', protect, imageUpload.single('image'), uploadFloodGalleryImage);

module.exports = router;
