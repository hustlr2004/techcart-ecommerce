const Product = require('../models/Product.model');

exports.listProducts = async (req, res, next) => {
  try {
    const products = await Product.find().limit(20);
    res.json({ items: products });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};
