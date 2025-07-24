const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) {
      cart = new Cart({ user_id: req.user._id, items: [], total: 0 });
      await cart.save();
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const product = await Product.findById(product_id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    let cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) {
      cart = new Cart({ user_id: req.user._id, items: [], total: 0 });
    }
    const existingItem = cart.items.find(item => item.product_id.equals(product._id));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product_id: product._id, quantity, price: product.price });
    }
    cart.total = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    cart.updated_at = Date.now();
    await cart.save();
    res.json({ message: 'Item added to cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { product_id } = req.params;
    let cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter(item => !item.product_id.equals(product_id));
    cart.total = cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    cart.updated_at = Date.now();
    await cart.save();
    res.json({ message: 'Item removed from cart', cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user_id: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = [];
    cart.total = 0;
    cart.updated_at = Date.now();
    await cart.save();
    res.json({ message: 'Cart cleared', cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}; 