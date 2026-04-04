const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true, default: 0 },
  images: [String],
  countInStock: { type: Number, default: 0 },
  category: String,
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
