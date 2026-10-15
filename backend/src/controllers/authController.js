const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  bio: user.bio,
  avatar: user.avatar,
  notifyEmail: user.notifyEmail,
  createdAt: user.createdAt,
});

// POST /api/v1/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, phone });
    res.status(201).json({ user: safeUser(user), token: generateToken(user._id) });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account suspended. Contact support.' });
    }

    res.json({ user: safeUser(user), token: generateToken(user._id) });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/auth/me
const getMe = async (req, res) => {
  res.json({ user: safeUser(req.user) });
};

// PUT /api/v1/auth/me
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, notifyEmail } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (bio !== undefined) user.bio = bio;
    if (notifyEmail !== undefined) user.notifyEmail = notifyEmail;

    await user.save();
    res.json({ user: safeUser(user) });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/auth/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    // Always return success to prevent email enumeration
    if (!user) {
      return res.json({ message: 'If that email is registered, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // In production, send an email with the reset link
    // For now, return the token in development mode
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    if (process.env.NODE_ENV === 'development') {
      return res.json({
        message: 'Password reset link generated. Check the devToken field (development mode only).',
        devToken: token,
        resetUrl,
      });
    }

    // TODO: Integrate a mail service (SendGrid, Nodemailer+SMTP) here
    // await sendResetEmail(user.email, resetUrl);

    res.json({ message: 'If that email is registered, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/auth/reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashed = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Reset token is invalid or has expired' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register, login, getMe, updateProfile, changePassword,
  forgotPassword, resetPassword,
};
