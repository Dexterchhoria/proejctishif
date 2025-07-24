const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/create', authenticate, orderController.createOrder);
router.post('/verify-payment', authenticate, orderController.verifyPayment);
router.get('/', authenticate, orderController.getUserOrders);
router.get('/admin/orders', authenticate, requireAdmin, orderController.getAllOrders);

module.exports = router; 