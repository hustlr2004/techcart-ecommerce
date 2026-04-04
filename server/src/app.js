const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/product');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const orderRoutes = require('./routes/order');
const adminRoutes = require('./routes/admin');
const wishlistRoutes = require('./routes/wishlist');
const couponRoutes = require('./routes/coupon');
const chatRoutes = require('./routes/chat');
const authMiddleware = require('./middleware/auth.middleware');
const isAdmin = require('./middleware/isAdmin');
const { errorHandler } = require('./middleware/error.middleware');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));

// Health check
app.get('/health', (req, res) => {
	res.json({ status: 'ok', uptime: process.uptime() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', authMiddleware, isAdmin, adminRoutes);

// Error handler (should be last)
app.use(errorHandler);

module.exports = app;
