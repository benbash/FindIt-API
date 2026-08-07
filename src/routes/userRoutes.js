const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getProfile, updateProfile } = require('../controllers/userController');
const { validateProfileUpdate } = require('../middleware/validateRequest');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.patch('/profile', protect, validateProfileUpdate, updateProfile);

module.exports = router;
