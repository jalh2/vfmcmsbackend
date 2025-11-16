const express = require('express');
const router = express.Router();
const {
  getTestimoniesPage,
  updateTestimoniesPage,
  listTestimonyPosts,
  createTestimonyPost,
  updateTestimonyPost,
  deleteTestimonyPost,
  uploadTestimonyImage,
} = require('../controllers/testimoniesController');
const { protect } = require('../middleware/authMiddleware');
const { imageUpload } = require('../middleware/uploadMiddleware');

router.get('/', getTestimoniesPage);
router.put('/', protect, updateTestimoniesPage);

router.get('/posts', listTestimonyPosts);
router.post('/posts', protect, createTestimonyPost);
router.put('/posts/:id', protect, updateTestimonyPost);
router.delete('/posts/:id', protect, deleteTestimonyPost);
router.post('/posts/:id/image', protect, imageUpload.single('image'), uploadTestimonyImage);

module.exports = router;
