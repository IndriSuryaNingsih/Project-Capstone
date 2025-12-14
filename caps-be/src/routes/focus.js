const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getFocusSessions,
  createFocusSession,
} = require('../controllers/focusController');

// GET /api/focus/history
router.get('/history', auth, getFocusSessions);

// POST /api/focus
router.post('/', auth, createFocusSession);

module.exports = router;
