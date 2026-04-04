const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { getActiveCoupon } = require('./couponController');

function getRazorpayClient() {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are not configured in server/.env');
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

async function calculateOrderPricing(rawItems = [], couponCode = '') {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error('At least one order item is required');
  }

  const itemIds = rawItems.map((item) => item.product || item._id).filter(Boolean);
  const products = await Product.find({ _id: { $in: itemIds } });
  const productMap = new Map(products.map((product) => [String(product._id), product]));

  const normalizedItems = rawItems.map((item) => {
    const productId = String(item.product || item._id);
    const product = productMap.get(productId);

    if (!product) {
      throw new Error('One or more products are invalid');
    }

    const quantity = Math.max(1, Number(item.quantity || item.qty || 1));

    return {
      product: product._id,
      name: product.name,
      image: product.images?.[0] || item.image || '',
      price: product.price,
      quantity,
    };
  });

  const itemsPrice = Number(
    normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
  );

  const coupon = couponCode ? await getActiveCoupon(couponCode) : null;
  if (couponCode && !coupon) {
    const error = new Error('Coupon not found or inactive');
    error.status = 400;
    throw error;
  }
  const discountPrice = coupon
    ? Number(((itemsPrice * coupon.discountPercentage) / 100).toFixed(2))
    : 0;
  const discountedSubtotal = Math.max(itemsPrice - discountPrice, 0);
  const taxPrice = Number((discountedSubtotal * 0.18).toFixed(2));
  const totalPrice = Number((discountedSubtotal + taxPrice).toFixed(2));

  return {
    normalizedItems,
    itemsPrice,
    discountPrice,
    taxPrice,
    totalPrice,
    coupon: coupon
      ? {
          code: coupon.code,
          discountPercentage: coupon.discountPercentage,
        }
      : null,
  };
}

exports.createRazorpayOrder = async (req, res, next) => {
  try {
    const { orderItems, couponCode = '' } = req.body;
    const pricing = await calculateOrderPricing(orderItems, couponCode);

    const razorpay = getRazorpayClient();
    const order = await razorpay.orders.create({
      amount: Math.round(pricing.totalPrice * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });

    res.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      itemsPrice: pricing.itemsPrice,
      discountPrice: pricing.discountPrice,
      taxPrice: pricing.taxPrice,
      totalPrice: pricing.totalPrice,
      coupon: pricing.coupon,
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderItems,
      shippingAddress,
      couponCode = '',
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: 'Missing payment verification fields' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    if (generatedSignature !== razorpaySignature) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const pricing = await calculateOrderPricing(orderItems, couponCode);

    const savedOrder = await Order.create({
      user: req.user._id,
      orderItems: pricing.normalizedItems,
      shippingAddress,
      paymentInfo: {
        razorpayOrderId,
        razorpayPaymentId,
        status: 'Paid',
      },
      itemsPrice: pricing.itemsPrice,
      discountPrice: pricing.discountPrice,
      taxPrice: pricing.taxPrice,
      totalPrice: pricing.totalPrice,
      coupon: pricing.coupon,
      orderStatus: 'Processing',
    });

    res.status(201).json(savedOrder);
  } catch (err) {
    next(err);
  }
};
