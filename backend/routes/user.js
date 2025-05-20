const express = require('express');
const { getUsers, getUserById } = require('../controllers/userController');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getUsers);
router.get('/:id', protect, getUserById);

module.exports = router;