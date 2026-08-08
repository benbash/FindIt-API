<<<<<<< HEAD
import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import { getProfile } from "../controllers/userController.js";
import { updateProfile } from "../controllers/userController.js";

const router = express.Router();

// Protected Routes
router.get("/profile", authenticate, getProfile);
router.patch("/profile", authenticate, updateProfile);

export default router;  
=======
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getProfile, updateProfile } from '../controllers/userController.js';
import { validateProfileUpdate } from '../middleware/validateRequest.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.patch('/profile', protect, validateProfileUpdate, updateProfile);

export default router;
>>>>>>> origin/master
