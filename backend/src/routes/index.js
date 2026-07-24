const express = require('express');
const healthRoutes = require('./health.routes');
const telegramRoutes = require('./telegram.routes');
const { observabilityApi } = require('../observability');

const router = express.Router();

// Mount API routes
router.use('/health', healthRoutes);
router.use('/telegram', telegramRoutes);
router.use('/observability', observabilityApi.createRouter());

module.exports = router;

