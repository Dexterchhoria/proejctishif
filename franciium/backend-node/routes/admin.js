const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/admin/stats', authenticate, requireAdmin, adminController.getStats);
router.get('/categories', adminController.getCategories);
router.get('/admin/users', authenticate, requireAdmin, adminController.getAllUsers);
module.exports = router;