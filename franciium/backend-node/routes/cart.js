const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, cartController.getCart);
router.post('/add', authenticate, cartController.addToCart);
router.delete('/remove/:product_id', authenticate, cartController.removeFromCart);
router.post('/clear', authenticate, cartController.clearCart);

module.exports = router; 