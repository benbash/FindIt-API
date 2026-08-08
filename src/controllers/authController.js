<<<<<<< HEAD
import { registerUserService, loginUserService, forgotPasswordService, resetPasswordService } from "../services/authService.js";

// Register User Controller
export const registerUser = async (req, res) => {
  try {
    const newUser = await registerUserService(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: newUser,
    });
  } catch (error) {
    res.status(409).json({
      success: false,
      message: error.message,
    });
  }
};

// Login User Controller
export const loginUser = async (req, res) => {
  try {
    const result = await loginUserService(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      ...result,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
}; 

// Forgot Password Controller
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await forgotPasswordService(email);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  } 
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const result = await resetPasswordService(token, password);

    res.status(200).json({  
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
=======
import crypto from 'crypto';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import AppError from '../utils/appError.js';
import sendEmail from '../utils/sendEmail.js';

const sanitizeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName || user.name || '',
  name: user.name || user.fullName || '',
  email: user.email,
  phoneNumber: user.phoneNumber,
  state: user.state || '',
  lga: user.lga || '',
  role: user.role,
  isVerified: user.isVerified || false,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerUser = async (req, res, next) => {
  try {
    const { fullName, email, password, phoneNumber, state, lga, role } = req.body;
    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return next(new AppError('User already exists', 409));
    }

    const user = await User.create({
      fullName,
      name: fullName,
      email: normalizedEmail,
      password,
      phoneNumber,
      state,
      lga,
      role: role || 'user',
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: generateToken(user._id),
      data: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return next(new AppError('Invalid email or password', 401));
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: generateToken(user._id),
      data: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return next(new AppError('No account found with this email', 404));
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      message: `
        <h2>Reset Your Password</h2>
        <p>You requested to reset your password.</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link expires in 10 minutes.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: 'Password reset link sent successfully.',
    });
  } catch (error) {
    return next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      return next(new AppError('Invalid or expired reset token.', 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successful.',
    });
  } catch (error) {
    return next(error);
  }
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: sanitizeUser(req.user),
  });
};
>>>>>>> origin/master
