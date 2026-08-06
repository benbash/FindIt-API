const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const AppError = require('../utils/appError');

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phoneNumber, role } = req.body;
    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return next(new AppError('User already exists', 409));
    }

    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
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

exports.loginUser = async (req, res, next) => {
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

exports.getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
};
