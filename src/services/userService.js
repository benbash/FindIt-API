import User from "../models/User.js";

export const updateProfileService = async (
  userId,
  updateData
) => {
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!updatedUser) {
    throw new Error("User not found.");
  }

  return updatedUser;
};