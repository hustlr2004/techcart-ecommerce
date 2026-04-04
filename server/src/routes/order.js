const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/isAdmin');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.get('/me', authMiddleware, orderController.getMyOrders);
router.get('/:id', authMiddleware, orderController.getOrderById);
router.put('/:id/status', authMiddleware, isAdmin, orderController.updateOrderStatus);

module.exports = router;
