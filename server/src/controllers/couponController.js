const Coupon = require('../models/Coupon');

function normalizeCode(code = '') {
  return code.trim().toUpperCase();
}

async function getActiveCoupon(code) {
  const normalizedCode = normalizeCode(code);
  if (!normalizedCode) {
    return null;
  }

  return Coupon.findOne({ code: normalizedCode, isActive: true });
}

exports.getActiveCoupon = getActiveCoupon;

exports.createCoupon = async (req, res, next) => {
  try {
    const code = normalizeCode(req.body.code);
    const discountPercentage = Number(req.body.discountPercentage);

    if (!code || !discountPercentage) {
      return res.status(400).json({ message: 'Coupon code and discount percentage are required' });
    }

    const coupon = await Coupon.findOneAndUpdate(
      { code },
      { code, discountPercentage, isActive: req.body.isActive !== false },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(coupon);
  } catch (err) {
    next(err);
  }
};

exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    next(err);
  }
};

exports.applyCoupon = async (req, res, next) => {
  try {
    const code = normalizeCode(req.body.code);
    const subtotal = Number(req.body.subtotal || 0);

    if (!code) {
      return res.status(400).json({ message: 'Coupon code is required' });
    }

    if (subtotal <= 0) {
      return res.status(400).json({ message: 'Valid subtotal is required' });
    }

    const coupon = await getActiveCoupon(code);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found or inactive' });
    }

    const discountAmount = Number(((subtotal * coupon.discountPercentage) / 100).toFixed(2));

    res.json({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      discountAmount,
    });
  } catch (err) {
    next(err);
  }
};
