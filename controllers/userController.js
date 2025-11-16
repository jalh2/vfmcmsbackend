const User = require('../models/userModel');
const { hashPassword } = require('../utils/encryption');

const createUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const newRole = role === 'superadmin' ? 'editor' : role || 'editor';
    const canManageUsers = newRole === 'superadmin' ? false : false;

    const hashedPassword = hashPassword(password);

    const user = await User.create({
      username,
      password: hashedPassword,
      role: newRole,
      canManageUsers,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      role: user.role,
      canManageUsers: user.canManageUsers,
      message: 'User created successfully.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { role, isActive } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.role === 'superadmin') {
      return res.status(403).json({ message: 'Cannot modify super admin via this endpoint.' });
    }

    if (role) {
      user.role = role === 'superadmin' ? user.role : role;
    }

    if (typeof isActive === 'boolean') {
      user.isActive = isActive;
    }

    await user.save();

    res.json({
      _id: user._id,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      message: 'User updated successfully.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
};
