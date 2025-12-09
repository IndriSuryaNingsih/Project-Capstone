const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { sendFeedback, listFeedback } = require('../controllers/feedbackController');

router.post('/', auth, sendFeedback);
router.get('/', auth, listFeedback);

module.exports = router;
