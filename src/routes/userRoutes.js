import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { validateProfileUpdate } from '../middleware/validateRequest.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.patch('/profile', protect, validateProfileUpdate, updateProfile);

export default router;
