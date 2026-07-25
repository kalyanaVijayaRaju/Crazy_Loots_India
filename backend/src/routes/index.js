const express = require('express');

// Middleware imports
const requestIdHandler = require('../middleware/requestIdHandler');
const responseTimeHandler = require('../middleware/responseTimeHandler');
const apiMetricsHandler = require('../middleware/apiMetricsHandler');
const auditLogger = require('../middleware/auditLogger');
const rateLimiter = require('../middleware/rateLimiter');

// Sub-routers
const pipelineRoutes = require('./v1/pipeline.routes');
const productRoutes = require('./v1/product.routes');
const monitoringRoutes = require('./v1/monitoring.routes');
const dealRoutes = require('./v1/deal.routes');
const affiliateRoutes = require('./v1/affiliate.routes');
const publishingRoutes = require('./v1/publishing.routes');
const telegramRoutes = require('./v1/telegram.routes');
const systemRoutes = require('./v1/system.routes');
const adminRoutes = require('./v1/admin.routes');
const healthRoutes = require('./health.routes');
const { observabilityApi } = require('../observability');

const router = express.Router();

// Apply global application middlewares
router.use(requestIdHandler);
router.use(responseTimeHandler);
router.use(apiMetricsHandler);
router.use(auditLogger);
router.use(rateLimiter);

// Mount API v1 sub-routes
router.use('/pipeline', pipelineRoutes);
router.use('/products', productRoutes);
router.use('/monitoring', monitoringRoutes);
router.use('/deals', dealRoutes);
router.use('/affiliate', affiliateRoutes);
router.use('/publishing', publishingRoutes);
router.use('/telegram', telegramRoutes);
router.use('/system', systemRoutes);
router.use('/admin', adminRoutes);

// Health & Observability
router.use('/health', healthRoutes);
router.use('/observability', observabilityApi.createRouter());

module.exports = router;
