const traceTimelineService = require('./tracing/traceTimelineService');
const executionTimelineStore = require('./timeline/executionTimelineStore');
const performanceProfiler = require('./profiler/performanceProfiler');
const metricsAggregator = require('./metrics/metricsAggregator');
const alertEngine = require('./alerts/alertEngine');
const failureClassifier = require('./alerts/failureClassifier');
const autoRecoveryService = require('./recovery/autoRecoveryService');
const CircuitBreaker = require('./circuitBreaker/circuitBreaker');
const circuitBreakerRegistry = require('./circuitBreaker/circuitBreakerRegistry');
const executionReplayService = require('./replay/executionReplayService');
const executionArchiveService = require('./archive/executionArchiveService');
const healthCheckService = require('./health/healthCheckService');
const productionReadinessChecker = require('./readiness/productionReadinessChecker');
const chaosTestRunner = require('./chaos/chaosTestRunner');
const systemDiagnosticsService = require('./diagnostics/systemDiagnosticsService');
const longRunValidationRunner = require('./reports/longRunValidationRunner');
const observabilityApi = require('./dashboard/observabilityApi');
const runbookGenerator = require('./runbook/runbookGenerator');

module.exports = {
  // Tracing & Timeline
  traceTimelineService,
  executionTimelineStore,

  // Performance
  performanceProfiler,

  // Metrics
  metricsAggregator,

  // Alerts
  alertEngine,
  failureClassifier,

  // Recovery
  autoRecoveryService,

  // Circuit Breakers
  CircuitBreaker,
  circuitBreakerRegistry,

  // Replay & Archive
  executionReplayService,
  executionArchiveService,

  // Health & Readiness
  healthCheckService,
  productionReadinessChecker,

  // Chaos Testing
  chaosTestRunner,

  // Diagnostics
  systemDiagnosticsService,

  // Reports
  longRunValidationRunner,

  // API
  observabilityApi,

  // Runbook
  runbookGenerator,
};
