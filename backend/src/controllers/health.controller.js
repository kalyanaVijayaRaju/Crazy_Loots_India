const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const env = require('../config/environment');

/**
 * @desc    Get system health status
 * @route   GET /api/v1/health
 * @access  Public
 */
const getHealthStatus = asyncHandler(async (req, res) => {
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbConnectionState = mongoose.connection.readyState;
  const dbStatus = dbStateMap[dbConnectionState] || 'unknown';

  const healthData = {
    appName: env.APP_NAME,
    environment: env.NODE_ENV,
    status: dbStatus === 'connected' ? 'UP' : 'DEGRADED',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
    },
    memoryUsage: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(process.memoryUsage().heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
    },
  };

  return ApiResponse.success(res, 'System health check passed', healthData);
});

module.exports = {
  getHealthStatus,
};
