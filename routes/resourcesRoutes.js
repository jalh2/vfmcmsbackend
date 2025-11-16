const express = require('express');
const router = express.Router();
const {
  getResourcesPage,
  updateResourcesPage,
  uploadTeachingVideo,
  uploadOtSession,
  uploadNtSession,
  uploadDbsSession,
  uploadNurturingSession,
  uploadAudioLesson,
} = require('../controllers/resourcesController');
const { protect } = require('../middleware/authMiddleware');
const { mediaUpload } = require('../middleware/uploadMiddleware');

router.get('/', getResourcesPage);
router.put('/', protect, updateResourcesPage);

router.post('/teaching-videos/upload', protect, mediaUpload.single('file'), uploadTeachingVideo);
router.post('/ot-sessions/upload', protect, mediaUpload.single('file'), uploadOtSession);
router.post('/nt-sessions/upload', protect, mediaUpload.single('file'), uploadNtSession);
router.post('/dbs-sessions/upload', protect, mediaUpload.single('file'), uploadDbsSession);
router.post('/nurturing-sessions/upload', protect, mediaUpload.single('file'), uploadNurturingSession);
router.post('/audio-lessons/upload', protect, mediaUpload.single('file'), uploadAudioLesson);

module.exports = router;
