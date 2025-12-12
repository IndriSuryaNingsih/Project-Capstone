const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProgress, updateProgress } = require('../controllers/progressController');

// GET /api/progress
router.get('/', auth, getProgress);

// PUT /api/progress
router.put('/', auth, updateProgress);

module.exports = router;
