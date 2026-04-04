const express = require('express');
const orderController = require('../controllers/orderController');
const couponController = require('../controllers/couponController');

const router = express.Router();

router.get('/orders', orderController.getAllOrders);
router.get('/stats', orderController.getAdminStats);
router.get('/coupons', couponController.getCoupons);
router.post('/coupons', couponController.createCoupon);

module.exports = router;
