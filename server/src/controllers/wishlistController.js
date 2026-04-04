const Product = require('../models/Product');
const User = require('../models/User.model');

exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user?.wishlist || []);
  } catch (err) {
    next(err);
  }
};

exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    const existingIndex = user.wishlist.findIndex((item) => String(item) === String(productId));

    if (existingIndex >= 0) {
      user.wishlist.splice(existingIndex, 1);
    } else {
      user.wishlist.push(productId);
    }

    await user.save();
    await user.populate('wishlist');

    res.json({
      wishlist: user.wishlist,
      inWishlist: existingIndex < 0,
    });
  } catch (err) {
    next(err);
  }
};
