const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const total_products = await Product.countDocuments();
    const total_orders = await Order.countDocuments();
    const total_users = await User.countDocuments({ role: 'customer' });
    const paidOrders = await Order.find({ payment_status: 'paid' });
    const total_revenue = paidOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    res.json({ total_products, total_orders, total_users, total_revenue });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(categories.map(cat => ({ name: cat._id, count: cat.count })));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find({}, '-password_hash'); // Exclude password hashes
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };