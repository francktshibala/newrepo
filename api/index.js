const express = require('express');
const router = express.Router();
const cartRoutes = require('./routes/cart-routes');

// Import route modules
const accountRoutes = require('./routes/account-routes');
const inventoryRoutes = require('./routes/inventory-routes');
const reviewRoutes = require('./routes/review-routes');
const mediaRoutes = require('./routes/media-routes');

// Set up API routes
router.use('/account', accountRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/reviews', reviewRoutes);
router.use('/cart', cartRoutes);
router.use('/media', mediaRoutes);

// API health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'API is running' });
});

module.exports = router;