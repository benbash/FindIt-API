const { updateProfileService } = require('../services/userService');

exports.getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Profile retrieved successfully',
    user: req.user,
  });
};

exports.updateProfile = async (req, res, next) => {
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
