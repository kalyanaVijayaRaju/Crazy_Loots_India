const express = require('express');
const healthRoutes = require('./health.routes');
const telegramRoutes = require('./telegram.routes');

const router = express.Router();

// Mount API routes
router.use('/health', healthRoutes);
router.use('/telegram', telegramRoutes);

module.exports = router;
