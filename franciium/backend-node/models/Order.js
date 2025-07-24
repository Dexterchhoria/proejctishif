const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  payment_status: { type: String, default: 'pending' },
  order_status: { type: String, default: 'placed' },
  razorpay_order_id: { type: String },
  razorpay_payment_id: { type: String },
  shipping_address: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema); 