const User = require('../models/userModel');
const { hashPassword, comparePassword } = require('../utils/encryption');

const registerSuperAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingSuperAdmin = await User.findOne({ role: 'superadmin' });
    if (existingSuperAdmin) {
      return res.status(403).json({ message: 'Super admin already exists.' });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const hashedPassword = hashPassword(password);

    const user = await User.create({
      username,
      password: hashedPassword,
      role: 'superadmin',
      canManageUsers: true,
    });

    req.session.user = {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
      canManageUsers: user.canManageUsers,
    };

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      canManageUsers: user.canManageUsers,
      message: 'Super admin registered successfully.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, isActive: true });

    if (!user || !comparePassword(password, user.password)) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    req.session.user = {
      id: user._id.toString(),
      username: user.username,
      role: user.role,
      canManageUsers: user.canManageUsers,
    };

    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      canManageUsers: user.canManageUsers,
      message: 'Login successful.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = (req, res) => {
  if (!req.session) {
    return res.status(200).json({ message: 'Logged out.' });
  }

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out.' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully.' });
  });
};

const getCurrentUser = (req, res) => {
  if (req.session && req.session.user) {
    return res.json(req.session.user);
  }
  res.status(401).json({ message: 'Not authenticated.' });
};

module.exports = {
  registerSuperAdmin,
  login,
  logout,
  getCurrentUser,
};
