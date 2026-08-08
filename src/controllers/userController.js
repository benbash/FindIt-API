<<<<<<< HEAD
import { updateProfileService } from "../services/userService.js";

// Get User Profile Controller
export  const getProfile = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        user: req.user,
    });
}
  
// Update User Profile Controller
export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await updateProfileService(
      req.user._id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
=======
import { updateProfileService } from '../services/userService.js';

export const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    user: req.user,
  });
};

export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await updateProfileService(req.user._id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    return next(error);
  }
};
>>>>>>> origin/master
