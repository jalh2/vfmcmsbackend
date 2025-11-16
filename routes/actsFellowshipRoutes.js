const express = require('express');
const router = express.Router();
const {
  getActsFellowshipPage,
  updateActsFellowshipPage,
  uploadActsGalleryImage,
} = require('../controllers/actsFellowshipController');
const { protect } = require('../middleware/authMiddleware');
const { imageUpload } = require('../middleware/uploadMiddleware');

router.get('/', getActsFellowshipPage);
router.put('/', protect, updateActsFellowshipPage);
router.post('/galleries/upload', protect, imageUpload.single('image'), uploadActsGalleryImage);

module.exports = router;
