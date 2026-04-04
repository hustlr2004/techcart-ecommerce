const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const couponController = require('../controllers/couponController');

const router = express.Router();

router.post('/apply', authMiddleware, couponController.applyCoupon);

module.exports = router;
