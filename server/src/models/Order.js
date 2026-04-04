const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, default: '' },
        price: { type: Number, required: true, default: 0 },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
    },
    paymentInfo: {
      razorpayOrderId: { type: String, required: true },
      razorpayPaymentId: { type: String, required: true },
      status: { type: String, default: 'Paid' },
    },
    itemsPrice: { type: Number, required: true, default: 0 },
    discountPrice: { type: Number, required: true, default: 0 },
    taxPrice: { type: Number, required: true, default: 0 },
    totalPrice: { type: Number, required: true, default: 0 },
    coupon: {
      code: { type: String, trim: true },
      discountPercentage: { type: Number, default: 0 },
    },
    orderStatus: { type: String, default: 'Processing' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
