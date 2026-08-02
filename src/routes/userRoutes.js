import express from "express";
import authenticate from "../middleware/authMiddleware.js";
import { getProfile } from "../controllers/userController.js";
import { updateProfile } from "../controllers/userController.js";

const router = express.Router();

// Protected Routes
router.get("/profile", authenticate, getProfile);
router.patch("/profile", authenticate, updateProfile);

export default router;  