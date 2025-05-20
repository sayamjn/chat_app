const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.get('/:userId', protect, getMessages);
router.post('/', protect, sendMessage);

module.exports = router;