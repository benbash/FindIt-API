import express from "express";
import { registerUser, loginUser, forgotPassword, resetPassword, } from "../controllers/authController.js";
import { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator, } from "../validators/authValidator.js";
import validate from "../middleware/validate.js"; 



const router = express.Router();

router.post( "/register", registerValidator, validate, registerUser );
router.post( "/login", loginValidator, validate, loginUser );
router.post("/forgot-password", forgotPasswordValidator, validate, forgotPassword );
router.patch("/reset-password/:token", resetPasswordValidator, validate, resetPassword ); 
    
export default router; 

