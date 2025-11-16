const express = require('express');
const router = express.Router();
const { getActivitiesPage, updateActivitiesPage } = require('../controllers/activitiesController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getActivitiesPage);
router.put('/', protect, updateActivitiesPage);

module.exports = router;
