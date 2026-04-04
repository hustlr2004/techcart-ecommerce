const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const paymentController = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-order', authMiddleware, paymentController.createRazorpayOrder);
router.post('/verify', authMiddleware, paymentController.verifyPayment);

module.exports = router;
