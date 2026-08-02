import { body } from "express-validator";

// Register Validator
export const registerValidator = [
  body("fullName")
    .notEmpty()
    .withMessage("Full name is required")
    .trim(),

  body("email")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required"),

  body("state")
    .notEmpty()
    .withMessage("State is required"),

  body("lga")
    .notEmpty()
    .withMessage("LGA is required"),
];

// Login Validator
export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// Forgot Password Validator
export const forgotPasswordValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email."),
];

// Reset Password Validator
export const resetPasswordValidator = [
  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];