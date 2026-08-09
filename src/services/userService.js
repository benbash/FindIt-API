import User from '../models/User.js';

export const updateProfileService = async (userId, updateData) => {
  const sanitizedUpdateData = { ...updateData };

  delete sanitizedUpdateData.password;
  delete sanitizedUpdateData.resetPasswordToken;
  delete sanitizedUpdateData.resetPasswordExpires;

  if (sanitizedUpdateData.fullName && !sanitizedUpdateData.name) {
    sanitizedUpdateData.name = sanitizedUpdateData.fullName;
  }

  if (sanitizedUpdateData.name && !sanitizedUpdateData.fullName) {
    sanitizedUpdateData.fullName = sanitizedUpdateData.name;
  }

  const updatedUser = await User.findByIdAndUpdate(userId, sanitizedUpdateData, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!updatedUser) {
    throw new Error('User not found.');
  }

  return updatedUser;
};
