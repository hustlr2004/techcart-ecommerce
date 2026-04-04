const Product = require('../models/Product');

exports.getAllProducts = async (req, res, next) => {
  try {
    const { keyword = '', category = '', page, limit } = req.query;
    const query = {};

    if (keyword.trim()) {
      query.name = { $regex: keyword.trim(), $options: 'i' };
    }

    if (category.trim()) {
      query.category = category.trim();
    }

    const shouldPaginate = page !== undefined || limit !== undefined;
    const pageNumber = Math.max(Number(page) || 1, 1);
    const pageSize = Math.max(Number(limit) || 8, 1);

    const totalProducts = await Product.countDocuments(query);
    const productsQuery = Product.find(query).sort({ createdAt: -1 });

    if (shouldPaginate) {
      productsQuery.skip((pageNumber - 1) * pageSize).limit(pageSize);
    }

    const products = await productsQuery;

    if (shouldPaginate) {
      return res.json({
        products,
        page: pageNumber,
        limit: pageSize,
        totalProducts,
        hasMore: pageNumber * pageSize < totalProducts,
      });
    }

    res.json(products);
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      images = [],
      ratings = 0,
      numReviews = 0,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images,
      ratings,
      numReviews,
    });

    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const fields = ['name', 'description', 'price', 'category', 'stock', 'images', 'ratings', 'numReviews'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (err) {
    next(err);
  }
};

exports.createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const numericRating = Number(rating);
    const trimmedComment = String(comment || '').trim();

    if (numericRating < 1 || numericRating > 5 || !trimmedComment) {
      return res.status(400).json({ message: 'Rating between 1 and 5 and comment are required' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.find(
      (review) => String(review.user) === String(req.user._id)
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating: numericRating,
      comment: trimmedComment,
    });

    product.numReviews = product.reviews.length;
    product.ratings =
      product.reviews.reduce((total, review) => total + review.rating, 0) / product.numReviews;

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};
