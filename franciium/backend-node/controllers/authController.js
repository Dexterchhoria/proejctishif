const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone, address } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = new User({ email, password_hash, full_name, phone, address });
    await user.save();
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user._id,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 