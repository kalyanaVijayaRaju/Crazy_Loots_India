const { metricsAggregator } = require('../observability');

/**
 * API Metrics Middleware
 * Tracks request counts and duration histograms by route and status code
 */
const apiMetricsHandler = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const path = req.baseUrl ? `${req.baseUrl}${req.path}` : req.path;
    const method = req.method;
    const statusCode = res.statusCode;

    metricsAggregator.incrementCounter(`http_requests_total.${method}.${statusCode}`);
    metricsAggregator.recordHistogram(`http_request_duration_ms.${method}`, duration);
  });

  next();
};

module.exports = apiMetricsHandler;
