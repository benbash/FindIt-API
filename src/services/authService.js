import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";

// Register User Service
export const registerUserService = async (userData) => {

  const {
    fullName,
    email,
    password,
    phoneNumber,
    state,
    lga,
  } = userData;

  // Check if email already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists.");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
    phoneNumber,
    state,
    lga,
  });

  return newUser;
};

// Login User Service
export const loginUserService = async ({ email, password }) => {
  // Find user
  const user = await User.findOne({ email });

if (!user) {
    throw new Error("Invalid email or password.");
}
  // Compare password
  const isPasswordMatch = await bcrypt.compare(
    password,
    user.password
  );
  if (!isPasswordMatch) {
    throw new Error("Invalid email or password.");
  }
  // Generate JWT
  const token = generateToken(user._id);
  return {
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    },
  };
};

// Forgot Password Service
export const forgotPasswordService = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("No account found with this email.");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.resetPasswordToken = hashedToken;

  user.resetPasswordExpires =
    Date.now() + 10 * 60 * 1000;

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

await sendEmail({
  email: user.email,
  subject: "Password Reset Request",
  message: `
    <h2>Reset Your Password</h2>

    <p>You requested to reset your password.</p>

    <p>
      Click the link below to continue:
    </p>

    <a href="${resetUrl}">
      Reset Password
    </a>

    <p>
      This link expires in 10 minutes.
    </p>

    <p>
      If you didn't request this, please ignore this email.
    </p>
  `,
});

  return {
    message: "Password reset link sent successfully.",
  };
}; 

// Reset Password Service
export const resetPasswordService = async (
  token,
  password
) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    throw new Error(
      "Invalid or expired reset token."
    );
  }

  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  user.password = hashedPassword;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return {
    message: "Password reset successful.",
  };
};

