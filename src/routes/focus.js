const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
getFocusSessions,
createFocusSession,
} = require('../controllers/focusController');

// GET /api/focus  -> ambil riwayat sesi fokus user
router.get('/', auth, getFocusSessions);

// POST /api/focus -> simpan sesi fokus baru
router.post('/', auth, createFocusSession);

module.exports = router;
