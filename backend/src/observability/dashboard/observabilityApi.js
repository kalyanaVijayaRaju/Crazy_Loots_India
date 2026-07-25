const express = require('express');
const healthCheckService = require('../health/healthCheckService');
const metricsAggregator = require('../metrics/metricsAggregator');
const alertEngine = require('../alerts/alertEngine');
const traceTimelineService = require('../tracing/traceTimelineService');
const circuitBreakerRegistry = require('../circuitBreaker/circuitBreakerRegistry');
const productionReadinessChecker = require('../readiness/productionReadinessChecker');
const systemDiagnosticsService = require('../diagnostics/systemDiagnosticsService');
const logger = require('../../utils/logger');

/**
 * ObservabilityApi
 *
 * Backend-only API endpoints returning:
 * - Health
 * - Metrics
 * - Alerts
 * - Timeline
 * - Failures (circuit breakers)
 * - Readiness
 * - System status (diagnostics)
 */
class ObservabilityApi {
  /**
   * Create an Express router with all observability endpoints
   * @returns {express.Router}
   */
  createRouter() {
    const router = express.Router();

    // GET /observability/health
    router.get('/health', async (_req, res) => {
      try {
        const report = await healthCheckService.getFullReport();
        res.json({ success: true, data: report });
      } catch (error) {
        logger.error(`[ObservabilityApi] Health error: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // GET /observability/liveness
    router.get('/liveness', (_req, res) => {
      const liveness = healthCheckService.liveness();
      res.json({ success: true, data: liveness });
    });

    // GET /observability/readiness
    router.get('/readiness', async (_req, res) => {
      try {
        const readiness = await healthCheckService.readiness();
        const statusCode = readiness.ready ? 200 : 503;
        res.status(statusCode).json({ success: readiness.ready, data: readiness });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // GET /observability/metrics
    router.get('/metrics', (_req, res) => {
      const metrics = metricsAggregator.getUnifiedReport();
      res.json({ success: true, data: metrics });
    });

    // GET /observability/alerts
    router.get('/alerts', (req, res) => {
      const filter = {};
      if (req.query.severity) {filter.severity = req.query.severity;}
      if (req.query.type) {filter.type = req.query.type;}
      if (req.query.unacknowledged === 'true') {filter.unacknowledgedOnly = true;}

      const alerts = alertEngine.getAlerts(filter);
      const summary = alertEngine.getSummary();
      res.json({ success: true, data: { alerts, summary } });
    });

    // GET /observability/timeline
    router.get('/timeline', (req, res) => {
      const limit = parseInt(req.query.limit, 10) || 20;
      const executions = traceTimelineService.getRecentExecutions(limit);
      res.json({ success: true, data: executions });
    });

    // GET /observability/timeline/:executionId
    router.get('/timeline/:executionId', (req, res) => {
      const execution = traceTimelineService.getExecution(req.params.executionId);
      if (!execution) {
        return res.status(404).json({ success: false, error: 'Execution not found' });
      }
      res.json({ success: true, data: execution });
    });

    // GET /observability/failures
    router.get('/failures', (_req, res) => {
      const circuits = circuitBreakerRegistry.getAllStatus();
      const openCircuits = circuitBreakerRegistry.getOpenCircuits();
      res.json({
        success: true,
        data: {
          allCircuits: circuits,
          openCircuits,
          hasOpenCircuits: openCircuits.length > 0,
        },
      });
    });

    // GET /observability/production-readiness
    router.get('/production-readiness', async (_req, res) => {
      try {
        const checklist = await productionReadinessChecker.check();
        res.json({ success: true, data: checklist });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // GET /observability/diagnostics
    router.get('/diagnostics', async (_req, res) => {
      try {
        const diagnostics = await systemDiagnosticsService.generateFullDiagnostics();
        res.json({ success: true, data: diagnostics });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // GET /observability/status
    router.get('/status', async (_req, res) => {
      try {
        const [health, metrics, alertSummary, circuits] = await Promise.all([
          healthCheckService.getFullReport(),
          metricsAggregator.getUnifiedReport(),
          alertEngine.getSummary(),
          circuitBreakerRegistry.getAllStatus(),
        ]);

        res.json({
          success: true,
          data: {
            health,
            metrics: {
              counters: Object.keys(metrics.counters).length,
              gauges: Object.keys(metrics.gauges).length,
              uptimeMs: metrics.uptimeMs,
            },
            alerts: alertSummary,
            circuits: {
              total: circuits.length,
              open: circuits.filter((c) => c.state === 'OPEN').length,
            },
            timestamp: new Date().toISOString(),
          },
        });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    return router;
  }
}

module.exports = new ObservabilityApi();
