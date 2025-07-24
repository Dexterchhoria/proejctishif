const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  full_name: { type: String, required: true },
  role: { type: String, default: 'customer' },
  phone: { type: String },
  address: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema); 