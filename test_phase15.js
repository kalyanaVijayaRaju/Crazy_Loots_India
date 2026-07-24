/**
 * Phase 15: Production Hardening — Verification Suite
 *
 * Tests all observability, reliability, and operational modules.
 */

const assert = (condition, message) => {
  if (!condition) {
    console.error(`  ✗ FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`  ✓ PASS: ${message}`);
  }
};

async function runTests() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  Phase 15: Production Hardening — Verification Suite');
  console.log('═══════════════════════════════════════════════════════════\n');

  // ──── 1. TraceTimelineService ────
  console.log('── 1. TraceTimelineService ──');
  const traceTimelineService = require('./backend/src/observability/tracing/traceTimelineService');

  const ctx = traceTimelineService.startExecution({ traceId: 'trc_test123', correlationId: 'corr_test456' });
  assert(ctx.executionId, 'Execution started with ID');
  assert(ctx.traceId === 'trc_test123', 'Trace ID matches');
  assert(ctx.correlationId === 'corr_test456', 'Correlation ID matches');

  traceTimelineService.recordStage(ctx.executionId, {
    stage: 'EXTRACTION',
    durationMs: 150,
    retries: 1,
    failures: [],
    warnings: ['Minor delay'],
    data: { productId: 'B08TEST' },
  });

  traceTimelineService.recordStage(ctx.executionId, {
    stage: 'MONITORING',
    durationMs: 80,
  });

  traceTimelineService.completeExecution(ctx.executionId, 'SUCCESS', { productsProcessed: 1 });

  const exec = traceTimelineService.getExecution(ctx.executionId);
  assert(exec.status === 'COMPLETED', 'Execution status is COMPLETED');
  assert(exec.result === 'SUCCESS', 'Execution result is SUCCESS');
  assert(exec.stages.length === 2, 'Two stages recorded');
  assert(exec.stages[0].stage === 'EXTRACTION', 'First stage is EXTRACTION');
  assert(exec.stages[0].retries === 1, 'Retry count recorded');
  assert(exec.totalDurationMs >= 0, 'Total duration calculated');

  const recent = traceTimelineService.getRecentExecutions(5);
  assert(recent.length >= 1, 'Recent executions returned');

  const queried = traceTimelineService.queryExecutions({ traceId: 'trc_test123' });
  assert(queried.length >= 1, 'Query by trace ID works');
  console.log('');

  // ──── 2. ExecutionTimelineStore ────
  console.log('── 2. ExecutionTimelineStore ──');
  const executionTimelineStore = require('./backend/src/observability/timeline/executionTimelineStore');

  assert(executionTimelineStore.constructor.STAGE_ORDER.length === 7, '7 canonical pipeline stages defined');

  const tl = executionTimelineStore.create('test_exec_1');
  assert(tl.executionId === 'test_exec_1', 'Timeline created');
  assert(Object.keys(tl.stages).length === 7, '7 stages initialized');

  executionTimelineStore.stageStarted('test_exec_1', 'EXTRACTION');
  executionTimelineStore.stageCompleted('test_exec_1', 'EXTRACTION', { ok: true });
  executionTimelineStore.stageRetried('test_exec_1', 'MONITORING');
  executionTimelineStore.stageFailed('test_exec_1', 'MONITORING', 'Timeout error');
  executionTimelineStore.complete('test_exec_1');

  const storedTl = executionTimelineStore.get('test_exec_1');
  assert(storedTl.stages.EXTRACTION.status === 'COMPLETED', 'EXTRACTION completed');
  assert(storedTl.stages.MONITORING.status === 'FAILED', 'MONITORING failed');
  assert(storedTl.stages.MONITORING.retries === 1, 'MONITORING retry counted');
  assert(storedTl.completedAt !== null, 'Timeline marked complete');
  console.log('');

  // ──── 3. PerformanceProfiler ────
  console.log('── 3. PerformanceProfiler ──');
  const performanceProfiler = require('./backend/src/observability/profiler/performanceProfiler');

  assert(performanceProfiler.constructor.CATEGORIES.length === 9, '9 profiling categories defined');

  performanceProfiler.startSession('prof_test_1');
  performanceProfiler.startMeasure('prof_test_1', 'BROWSER_LAUNCH');
  performanceProfiler.endMeasure('prof_test_1', 'BROWSER_LAUNCH', { browser: 'chromium' });
  performanceProfiler.startMeasure('prof_test_1', 'DOM_EXTRACTION');
  performanceProfiler.endMeasure('prof_test_1', 'DOM_EXTRACTION');

  const profReport = performanceProfiler.endSession('prof_test_1');
  assert(profReport, 'Profile report generated');
  assert(profReport.sessionId === 'prof_test_1', 'Session ID matches');
  assert(profReport.breakdown.length >= 2, 'Breakdown contains measured categories');
  assert(profReport.bottleneck, 'Bottleneck identified');
  assert(profReport.totalDurationMs >= 0, 'Total duration calculated');

  const recentProfiles = performanceProfiler.getRecentProfiles(5);
  assert(recentProfiles.length >= 1, 'Recent profiles returned');
  console.log('');

  // ──── 4. MetricsAggregator ────
  console.log('── 4. MetricsAggregator ──');
  const metricsAggregator = require('./backend/src/observability/metrics/metricsAggregator');

  metricsAggregator.incrementCounter('test.requests', 5);
  metricsAggregator.incrementCounter('test.requests', 3);
  metricsAggregator.setGauge('test.queue_size', 42);
  metricsAggregator.recordHistogram('test.duration_ms', 100);
  metricsAggregator.recordHistogram('test.duration_ms', 200);
  metricsAggregator.recordHistogram('test.duration_ms', 150);

  const unified = metricsAggregator.getUnifiedReport();
  assert(unified.counters['test.requests'] === 8, 'Counter accumulated correctly');
  assert(unified.gauges['test.queue_size'] === 42, 'Gauge set correctly');
  assert(unified.histograms['test.duration_ms'], 'Histogram recorded');
  assert(unified.histograms['test.duration_ms'].count === 3, 'Histogram count correct');
  assert(unified.histograms['test.duration_ms'].min === 100, 'Histogram min correct');
  assert(unified.histograms['test.duration_ms'].max === 200, 'Histogram max correct');
  assert(unified.uptimeMs >= 0, 'Uptime tracked');

  metricsAggregator.recordSubsystemMetrics('browser', {
    counters: { launches: 2 },
    gauges: { active_contexts: 1 },
    histograms: { launch_time_ms: 500 },
  });
  const report2 = metricsAggregator.getUnifiedReport();
  assert(report2.counters['browser.launches'] === 2, 'Subsystem counter recorded');
  assert(report2.gauges['browser.active_contexts'] === 1, 'Subsystem gauge recorded');
  console.log('');

  // ──── 5. FailureClassifier ────
  console.log('── 5. FailureClassifier ──');
  const failureClassifier = require('./backend/src/observability/alerts/failureClassifier');

  const networkErr = failureClassifier.classify(new Error('ECONNREFUSED to api.telegram.org'), { subsystem: 'telegram' });
  assert(networkErr.category === 'NETWORK', 'Network error classified');
  assert(networkErr.recoverable === true, 'Network errors are recoverable');

  const browserErr = failureClassifier.classify('Playwright browser target closed', { subsystem: 'browser' });
  assert(browserErr.category === 'BROWSER', 'Browser error classified');
  assert(browserErr.suggestedAction === 'RESTART_BROWSER', 'Browser action is RESTART_BROWSER');

  const dbErr = failureClassifier.classify('MongoDB buffering timed out', { subsystem: 'database' });
  assert(dbErr.category === 'DATABASE', 'Database error classified');

  const configErr = failureClassifier.classify('Missing env variable not configured');
  assert(configErr.category === 'CONFIGURATION', 'Configuration error classified');
  assert(configErr.recoverable === false, 'Configuration errors are not recoverable');

  const merchantErr = failureClassifier.classify('Amazon selector element not found');
  assert(merchantErr.category === 'MERCHANT', 'Merchant error classified');

  const publishErr = failureClassifier.classify('Telegram message send failed');
  assert(publishErr.category === 'PUBLISHING', 'Publishing error classified');
  console.log('');

  // ──── 6. AlertEngine ────
  console.log('── 6. AlertEngine ──');
  const alertEngine = require('./backend/src/observability/alerts/alertEngine');
  alertEngine.clear();

  let listenerCalled = false;
  alertEngine.onAlert(() => { listenerCalled = true; });

  const alert1 = alertEngine.fire({
    type: 'BROWSER_CRASH',
    severity: 'CRITICAL',
    message: 'Test browser crash alert',
    subsystem: 'browser',
  });
  assert(alert1.id, 'Alert has ID');
  assert(alert1.type === 'BROWSER_CRASH', 'Alert type correct');
  assert(alert1.severity === 'CRITICAL', 'Alert severity correct');
  assert(listenerCalled, 'Alert listener was called');

  const evaluated = alertEngine.evaluate({
    retryCount: 10,
    queueSize: 600,
    dbLatencyMs: 8000,
    dlqSize: 100,
    browserCrashes: 5,
    telegramOnline: false,
  });
  assert(evaluated.length >= 5, 'Multiple alerts evaluated and fired');

  const errorAlert = alertEngine.fireFromError(new Error('MongoDB connection timeout'), { subsystem: 'database' });
  assert(errorAlert, 'Alert fired from error');

  alertEngine.acknowledge(alert1.id);
  const acked = alertEngine.getAlerts({ unacknowledgedOnly: false }).find((a) => a.id === alert1.id);
  assert(acked.acknowledged === true, 'Alert acknowledged');

  const summary = alertEngine.getSummary();
  assert(summary.total > 0, 'Alert summary has total');
  assert(summary.bySeverity, 'Alert summary has severity breakdown');
  console.log('');

  // ──── 7. CircuitBreaker ────
  console.log('── 7. CircuitBreaker ──');
  const CircuitBreaker = require('./backend/src/observability/circuitBreaker/circuitBreaker');

  const cb = new CircuitBreaker({ name: 'test-circuit', failureThreshold: 3, resetTimeoutMs: 100 });
  assert(cb.getState() === 'CLOSED', 'Initial state is CLOSED');

  // Successful call
  const result1 = await cb.execute(async () => 'ok');
  assert(result1 === 'ok', 'Successful call returns result');
  assert(cb.getState() === 'CLOSED', 'Still CLOSED after success');

  // Fail enough to open
  for (let i = 0; i < 3; i++) {
    try { await cb.execute(async () => { throw new Error('fail'); }); } catch (_e) { /* expected */ }
  }
  assert(cb.getState() === 'OPEN', 'Circuit OPEN after threshold failures');

  // Calls are rejected when OPEN
  let rejected = false;
  try { await cb.execute(async () => 'should not run'); } catch (e) {
    rejected = e.code === 'CIRCUIT_OPEN';
  }
  assert(rejected, 'Calls rejected when OPEN');

  // Wait for reset timeout then transition to HALF_OPEN
  await new Promise((r) => setTimeout(r, 120));
  assert(cb.getState() === 'HALF_OPEN', 'Transitioned to HALF_OPEN after reset timeout');

  // Success in HALF_OPEN closes circuit
  await cb.execute(async () => 'recovered');
  assert(cb.getState() === 'CLOSED', 'CLOSED after successful HALF_OPEN call');

  const status = cb.getStatus();
  assert(status.name === 'test-circuit', 'Status name matches');
  assert(status.state === 'CLOSED', 'Status state is CLOSED');
  console.log('');

  // ──── 8. CircuitBreakerRegistry ────
  console.log('── 8. CircuitBreakerRegistry ──');
  const circuitBreakerRegistry = require('./backend/src/observability/circuitBreaker/circuitBreakerRegistry');

  circuitBreakerRegistry.initializeAll();
  const allStatus = circuitBreakerRegistry.getAllStatus();
  assert(allStatus.length === 6, '6 circuit breakers initialized');
  assert(allStatus.every((s) => s.state === 'CLOSED'), 'All circuits initially CLOSED');

  const amazonCb = circuitBreakerRegistry.get('amazon-merchant');
  assert(amazonCb, 'Amazon merchant circuit breaker retrieved');
  assert(amazonCb.failureThreshold === 5, 'Amazon threshold is 5');

  const openCircuits = circuitBreakerRegistry.getOpenCircuits();
  assert(openCircuits.length === 0, 'No open circuits initially');
  console.log('');

  // ──── 9. AutoRecoveryService ────
  console.log('── 9. AutoRecoveryService ──');
  const autoRecoveryService = require('./backend/src/observability/recovery/autoRecoveryService');

  let recoveryCalled = false;
  autoRecoveryService.registerStrategy('test-subsystem', async () => {
    recoveryCalled = true;
  }, { maxAttempts: 3, cooldownMs: 50 });

  const recoveryResult = await autoRecoveryService.recover('test-subsystem');
  assert(recoveryResult.success === true, 'Recovery succeeded');
  assert(recoveryCalled, 'Recovery function was called');

  // Recovery for unknown subsystem
  const noStrategy = await autoRecoveryService.recover('unknown');
  assert(noStrategy.success === false, 'No strategy returns failure');
  assert(noStrategy.reason === 'NO_STRATEGY', 'Reason is NO_STRATEGY');

  const recoveryStatus = autoRecoveryService.getStatus();
  assert(recoveryStatus.length >= 1, 'Recovery status returned');

  const recoveryLog = autoRecoveryService.getLog();
  assert(recoveryLog.length >= 1, 'Recovery log has entries');
  console.log('');

  // ──── 10. ExecutionReplayService ────
  console.log('── 10. ExecutionReplayService ──');
  const executionReplayService = require('./backend/src/observability/replay/executionReplayService');

  executionReplayService.storeSnapshot('replay_test_1', {
    publishingPackage: { packageId: 'pkg_123', shortUrl: 'https://amzn.to/test' },
    traceContext: { traceId: 'trc_replay', correlationId: 'corr_replay' },
    metrics: { totalDurationMs: 500 },
    timeline: { stages: ['EXTRACTION', 'MONITORING'] },
  });

  const replayed = executionReplayService.replay('replay_test_1');
  assert(replayed, 'Replay returned data');
  assert(replayed.publishingPackage.packageId === 'pkg_123', 'Publishing package restored');
  assert(replayed.traceContext.traceId === 'trc_replay', 'Trace context restored');
  assert(replayed.metrics.totalDurationMs === 500, 'Metrics restored');

  const available = executionReplayService.listAvailable();
  assert(available.length >= 1, 'Available snapshots listed');
  assert(available[0].hasPublishingPackage === true, 'Snapshot has publishing package');

  const replayLog = executionReplayService.getReplayLog();
  assert(replayLog.length >= 1, 'Replay log has entries');

  // Replay non-existent
  const notFound = executionReplayService.replay('nonexistent');
  assert(notFound === null, 'Replay returns null for missing snapshot');
  console.log('');

  // ──── 11. ExecutionArchiveService ────
  console.log('── 11. ExecutionArchiveService ──');
  const executionArchiveService = require('./backend/src/observability/archive/executionArchiveService');

  const archiveEntry = executionArchiveService.archive('archive_test_1', {
    snapshot: { test: 'data' },
    report: { summary: 'ok' },
    metrics: { durationMs: 200 },
  });
  assert(archiveEntry.executionId === 'archive_test_1', 'Archive entry created');
  assert(archiveEntry.files.length === 3, '3 files archived');

  const retrieved = executionArchiveService.retrieve('archive_test_1');
  assert(retrieved, 'Archive retrieved');
  assert(retrieved.snapshot.test === 'data', 'Snapshot data restored from disk');
  assert(retrieved.report.summary === 'ok', 'Report data restored from disk');

  const archives = executionArchiveService.listArchives();
  assert(archives.length >= 1, 'Archives listed');

  const archiveStats = executionArchiveService.getStats();
  assert(archiveStats.totalArchived >= 1, 'Archive stats tracked');
  console.log('');

  // ──── 12. HealthCheckService ────
  console.log('── 12. HealthCheckService ──');
  const healthCheckService = require('./backend/src/observability/health/healthCheckService');

  const liveness = healthCheckService.liveness();
  assert(liveness.status === 'ALIVE', 'Liveness returns ALIVE');
  assert(liveness.pid === process.pid, 'PID matches');
  assert(liveness.uptimeMs >= 0, 'Uptime tracked');

  const startup = healthCheckService.startup();
  assert(startup.started === false, 'Startup not yet marked complete');

  healthCheckService.markStartupComplete();
  const startup2 = healthCheckService.startup();
  assert(startup2.started === true, 'Startup marked complete');

  healthCheckService.registerDependency('test-dep', async () => ({ healthy: true, latencyMs: 5 }));
  const readiness = await healthCheckService.readiness();
  assert(readiness.ready === true, 'Readiness is true with healthy deps');
  assert(readiness.dependencies.length === 1, 'One dependency checked');

  const fullReport = await healthCheckService.getFullReport();
  assert(fullReport.status === 'HEALTHY', 'Full report is HEALTHY');
  assert(fullReport.liveness, 'Full report includes liveness');
  assert(fullReport.readiness, 'Full report includes readiness');

  const shutdownProbe = healthCheckService.shutdown();
  assert(shutdownProbe.shuttingDown === false, 'Not shutting down');
  console.log('');

  // ──── 13. ProductionReadinessChecker ────
  console.log('── 13. ProductionReadinessChecker ──');
  const productionReadinessChecker = require('./backend/src/observability/readiness/productionReadinessChecker');

  const readinessReport = await productionReadinessChecker.check();
  assert(readinessReport.readinessScore >= 0, 'Readiness score calculated');
  assert(readinessReport.totalChecks > 0, 'Checks were executed');
  assert(readinessReport.checks.configuration, 'Configuration checks present');
  assert(readinessReport.checks.health, 'Health checks present');
  assert(readinessReport.checks.recovery, 'Recovery checks present');
  assert(readinessReport.checks.monitoring, 'Monitoring checks present');
  assert(readinessReport.checks.alerts, 'Alert checks present');
  assert(readinessReport.checks.publishing, 'Publishing checks present');
  assert(readinessReport.checks.performance, 'Performance checks present');
  assert(readinessReport.checks.security, 'Security checks present');
  console.log('');

  // ──── 14. ChaosTestRunner ────
  console.log('── 14. ChaosTestRunner ──');
  const chaosTestRunner = require('./backend/src/observability/chaos/chaosTestRunner');

  const chaosResult = await chaosTestRunner.runScenario('BROWSER_CRASH', {
    recoveryFn: async () => { /* simulated recovery */ },
  });
  assert(chaosResult.scenario === 'BROWSER_CRASH', 'Chaos scenario matches');
  assert(chaosResult.injected === true, 'Fault was injected');
  assert(chaosResult.recovered === true, 'Recovery succeeded');
  assert(chaosResult.passed === true, 'Chaos test passed');

  const allChaos = await chaosTestRunner.runAll({
    BROWSER_CRASH: async () => {},
    TELEGRAM_FAILURE: async () => {},
    MONGODB_TIMEOUT: async () => {},
    SELECTOR_FAILURE: async () => {},
    QUEUE_OVERFLOW: async () => {},
    SCHEDULER_INTERRUPTION: async () => {},
  });
  assert(allChaos.totalScenarios === 6, '6 chaos scenarios');
  assert(allChaos.allPassed === true, 'All chaos tests passed with recovery');
  assert(allChaos.passed === 6, 'All 6 passed');

  const chaosSummary = chaosTestRunner.getSummary();
  assert(chaosSummary.totalRuns > 0, 'Chaos test summary has runs');
  console.log('');

  // ──── 15. SystemDiagnosticsService ────
  console.log('── 15. SystemDiagnosticsService ──');
  const systemDiagnosticsService = require('./backend/src/observability/diagnostics/systemDiagnosticsService');

  const diagnostics = await systemDiagnosticsService.generateFullDiagnostics();
  assert(diagnostics.configuration, 'Configuration report present');
  assert(diagnostics.configuration.nodeVersion === process.version, 'Node version matches');
  assert(diagnostics.dependencies, 'Dependency report present');
  assert(diagnostics.health, 'Health report present');
  assert(diagnostics.version, 'Version report present');
  assert(diagnostics.version.platform === 'Crazy Loots India', 'Platform name correct');
  assert(diagnostics.performance, 'Performance report present');
  assert(diagnostics.performance.memory.heapUsedMb > 0, 'Heap usage reported');
  console.log('');

  // ──── 16. LongRunValidationRunner ────
  console.log('── 16. LongRunValidationRunner ──');
  const longRunValidationRunner = require('./backend/src/observability/reports/longRunValidationRunner');

  assert(longRunValidationRunner.constructor.DEFAULT_PRODUCT_URLS.length >= 20, '20+ default product URLs');
  assert(longRunValidationRunner.isRunning() === false, 'Not running initially');

  // Run with simulated pipeline (no real scraping)
  const validationReport = await longRunValidationRunner.run({
    urls: ['https://www.amazon.in/dp/B0TEST1', 'https://www.amazon.in/dp/B0TEST2'],
    cycles: 1,
  });
  assert(validationReport.mode === 'DRY_RUN', 'Validation runs in DRY_RUN mode');
  assert(validationReport.totalProducts === 2, 'Correct product count');
  assert(validationReport.totalCycles === 1, 'Correct cycle count');
  assert(validationReport.stabilityScore >= 0, 'Stability score calculated');
  assert(validationReport.cycleResults.length === 1, 'One cycle result');
  assert(longRunValidationRunner.isRunning() === false, 'Not running after completion');
  console.log('');

  // ──── 17. RunbookGenerator ────
  console.log('── 17. RunbookGenerator ──');
  const runbookGenerator = require('./backend/src/observability/runbook/runbookGenerator');

  const runbook = runbookGenerator.generate();
  assert(runbook.title.includes('Crazy Loots India'), 'Runbook title correct');
  assert(runbook.sections.startup, 'Startup section present');
  assert(runbook.sections.shutdown, 'Shutdown section present');
  assert(runbook.sections.recovery, 'Recovery section present');
  assert(runbook.sections.troubleshooting, 'Troubleshooting section present');
  assert(runbook.sections.knownIssues, 'Known issues section present');
  assert(runbook.sections.monitoringGuide, 'Monitoring guide present');
  assert(runbook.sections.alertGuide, 'Alert guide present');
  assert(runbook.sections.deploymentChecklist, 'Deployment checklist present');
  assert(runbook.sections.startup.steps.length > 0, 'Startup has steps');
  assert(runbook.sections.alertGuide.alerts.length === 9, '9 alert types documented');
  console.log('');

  // ──── 18. ObservabilityApi ────
  console.log('── 18. ObservabilityApi ──');
  const observabilityApi = require('./backend/src/observability/dashboard/observabilityApi');

  const router = observabilityApi.createRouter();
  assert(router, 'Observability router created');
  assert(typeof router === 'function', 'Router is an Express middleware function');

  // Verify routes exist by checking the router's stack
  const routePaths = router.stack
    .filter((layer) => layer.route)
    .map((layer) => layer.route.path);
  assert(routePaths.includes('/health'), 'Health route exists');
  assert(routePaths.includes('/liveness'), 'Liveness route exists');
  assert(routePaths.includes('/readiness'), 'Readiness route exists');
  assert(routePaths.includes('/metrics'), 'Metrics route exists');
  assert(routePaths.includes('/alerts'), 'Alerts route exists');
  assert(routePaths.includes('/timeline'), 'Timeline route exists');
  assert(routePaths.includes('/failures'), 'Failures route exists');
  assert(routePaths.includes('/production-readiness'), 'Production readiness route exists');
  assert(routePaths.includes('/diagnostics'), 'Diagnostics route exists');
  assert(routePaths.includes('/status'), 'Status route exists');
  console.log('');

  // ──── 19. Module Index ────
  console.log('── 19. Module Index ──');
  const observability = require('./backend/src/observability');

  assert(observability.traceTimelineService, 'traceTimelineService exported');
  assert(observability.executionTimelineStore, 'executionTimelineStore exported');
  assert(observability.performanceProfiler, 'performanceProfiler exported');
  assert(observability.metricsAggregator, 'metricsAggregator exported');
  assert(observability.alertEngine, 'alertEngine exported');
  assert(observability.failureClassifier, 'failureClassifier exported');
  assert(observability.autoRecoveryService, 'autoRecoveryService exported');
  assert(observability.CircuitBreaker, 'CircuitBreaker exported');
  assert(observability.circuitBreakerRegistry, 'circuitBreakerRegistry exported');
  assert(observability.executionReplayService, 'executionReplayService exported');
  assert(observability.executionArchiveService, 'executionArchiveService exported');
  assert(observability.healthCheckService, 'healthCheckService exported');
  assert(observability.productionReadinessChecker, 'productionReadinessChecker exported');
  assert(observability.chaosTestRunner, 'chaosTestRunner exported');
  assert(observability.systemDiagnosticsService, 'systemDiagnosticsService exported');
  assert(observability.longRunValidationRunner, 'longRunValidationRunner exported');
  assert(observability.observabilityApi, 'observabilityApi exported');
  assert(observability.runbookGenerator, 'runbookGenerator exported');
  console.log('');

  // ──── 20. Routes Integration ────
  console.log('── 20. Routes Integration ──');
  const routesIndex = require('./backend/src/routes/index');
  assert(routesIndex, 'Routes index loads successfully with observability');
  console.log('');

  // ──── Summary ────
  console.log('═══════════════════════════════════════════════════════════');
  if (process.exitCode === 1) {
    console.log('  ❌ SOME TESTS FAILED — see above');
  } else {
    console.log('  ✅ ALL PHASE 15 TESTS PASSED');
  }
  console.log('═══════════════════════════════════════════════════════════');
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exitCode = 1;
});
