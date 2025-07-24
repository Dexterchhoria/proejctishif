const Order = require('../models/Order');
const Cart = require('../models/Cart');
const razorpay = require('razorpay');

const razorpayClient = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

exports.createOrder = async (req, res) => {
  try {
    const { shipping_address } = req.body;
    const cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    const razorpayOrder = await razorpayClient.orders.create({
      amount: Math.round(cart.total * 100),
      currency: 'INR',
      payment_capture: 1
    });
    const order = new Order({
      user_id: req.user._id,
      items: cart.items,
      total: cart.total,
      razorpay_order_id: razorpayOrder.id,
      shipping_address
    });
    await order.save();
    cart.items = [];
    cart.total = 0;
    await cart.save();
    res.json({
      order_id: order._id,
      razorpay_order_id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const crypto = require('crypto');
    const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');
    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ status: 'failure', message: 'Payment verification failed' });
    }
    await Order.findOneAndUpdate(
      { razorpay_order_id, user_id: req.user._id },
      { payment_status: 'paid', razorpay_payment_id, order_status: 'processing' }
    );
    res.json({ status: 'success', message: 'Payment verified successfully' });
  } catch (err) {
    res.status(500).json({ status: 'failure', message: 'Server error', error: err.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user_id: req.user._id }).sort({ created_at: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ created_at: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 