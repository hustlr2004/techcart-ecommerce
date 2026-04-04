const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const wishlistController = require('../controllers/wishlistController');

const router = express.Router();

router.get('/', authMiddleware, wishlistController.getWishlist);
router.post('/toggle', authMiddleware, wishlistController.toggleWishlist);

module.exports = router;
