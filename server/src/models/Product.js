const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 0, min: 0 },
    comparePrice: { type: Number, default: 0, min: 0 },
    category: { type: String, required: true, trim: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    images: { type: [String], default: [] },
    ratings: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: { type: [ReviewSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
