/**
 * RunbookGenerator
 *
 * Generates structured runbook data for operations documentation:
 * - Startup procedure
 * - Shutdown procedure
 * - Recovery procedure
 * - Troubleshooting
 * - Known issues
 * - Monitoring guide
 * - Alert guide
 * - Deployment checklist
 */
class RunbookGenerator {
  /**
   * Generate the complete runbook as a structured object
   * @returns {Object}
   */
  generate() {
    return {
      title: 'Crazy Loots India — Operational Runbook',
      version: '1.0.0',
      sections: {
        startup: this._startupProcedure(),
        shutdown: this._shutdownProcedure(),
        recovery: this._recoveryProcedure(),
        troubleshooting: this._troubleshooting(),
        knownIssues: this._knownIssues(),
        monitoringGuide: this._monitoringGuide(),
        alertGuide: this._alertGuide(),
        deploymentChecklist: this._deploymentChecklist(),
      },
      generatedAt: new Date().toISOString(),
    };
  }

  _startupProcedure() {
    return {
      title: 'Startup Procedure',
      steps: [
        'Verify environment variables: MONGODB_URI, TELEGRAM_BOT_TOKEN, PUBLISHING_MODE, NODE_ENV',
        'Start MongoDB and verify connection',
        'Run `npm start` or `pm2 start ecosystem.config.js`',
        'Verify health endpoint: GET /api/v1/health',
        'Verify readiness: GET /api/v1/observability/readiness',
        'Check circuit breakers: GET /api/v1/observability/failures',
        'Confirm PUBLISHING_MODE is DRY_RUN for initial deployment',
      ],
    };
  }

  _shutdownProcedure() {
    return {
      title: 'Shutdown Procedure',
      steps: [
        'Send SIGTERM to the Node.js process',
        'System marks itself as shutting down (readiness returns 503)',
        'Active monitoring cycles complete their current iteration',
        'Browser pools are drained and Playwright contexts are closed',
        'MongoDB connections are closed gracefully',
        'Verify process has exited cleanly',
      ],
    };
  }

  _recoveryProcedure() {
    return {
      title: 'Recovery Procedure',
      steps: [
        'Check system status: GET /api/v1/observability/status',
        'Identify open circuit breakers: GET /api/v1/observability/failures',
        'Check alert history: GET /api/v1/observability/alerts',
        'If browser circuit is OPEN: restart Playwright browser pool',
        'If Telegram circuit is OPEN: verify BOT_TOKEN and network connectivity',
        'If MongoDB circuit is OPEN: check MongoDB server status and connection string',
        'Reset circuit breakers manually if needed after root cause is resolved',
        'Verify recovery via readiness probe: GET /api/v1/observability/readiness',
      ],
    };
  }

  _troubleshooting() {
    return {
      title: 'Troubleshooting',
      issues: [
        {
          symptom: 'Products not being extracted',
          checks: ['Verify Amazon selectors in domExtractor', 'Check browser circuit breaker state', 'Review error logs for selector mismatches'],
          resolution: 'Update DOM selectors if Amazon layout changed; reset browser circuit breaker',
        },
        {
          symptom: 'Deals not being published',
          checks: ['Verify PUBLISHING_MODE is not DRY_RUN (if LIVE intended)', 'Check Telegram circuit breaker', 'Review publishing queue'],
          resolution: 'Ensure Telegram bot token is valid; check network to api.telegram.org',
        },
        {
          symptom: 'High memory usage',
          checks: ['Check browser pool size', 'Review performance diagnostics', 'Check for memory leaks in long-running processes'],
          resolution: 'Reduce browser pool concurrency; restart process; review profiler reports',
        },
        {
          symptom: 'MongoDB connection failures',
          checks: ['Verify MONGODB_URI', 'Check MongoDB server status', 'Review connection pool settings'],
          resolution: 'Fix connection string; restart MongoDB; increase connection pool timeout',
        },
      ],
    };
  }

  _knownIssues() {
    return {
      title: 'Known Issues',
      items: [
        'Amazon may rate-limit or block rapid successive requests — use browser pool with delays',
        'Playwright Chromium can consume significant memory with multiple contexts',
        'Telegram Bot API has rate limits (30 messages/second to groups)',
        'Long-running DRY_RUN validation may take significant time with many products',
      ],
    };
  }

  _monitoringGuide() {
    return {
      title: 'Monitoring Guide',
      endpoints: [
        { path: '/api/v1/observability/health', description: 'Full health report with liveness, readiness, and dependency status' },
        { path: '/api/v1/observability/metrics', description: 'Unified metrics (counters, gauges, histograms) from all subsystems' },
        { path: '/api/v1/observability/timeline', description: 'Recent execution timelines with stage-by-stage breakdowns' },
        { path: '/api/v1/observability/diagnostics', description: 'System diagnostics including config, dependencies, performance' },
        { path: '/api/v1/observability/status', description: 'Aggregated system status overview' },
      ],
    };
  }

  _alertGuide() {
    return {
      title: 'Alert Guide',
      alerts: [
        { type: 'SELECTOR_FAILURE', severity: 'WARNING', action: 'Update Amazon DOM selectors' },
        { type: 'DOM_VERSION_CHANGE', severity: 'WARNING', action: 'Review and update extraction parsers' },
        { type: 'BROWSER_CRASH', severity: 'CRITICAL', action: 'Restart browser pool; check system resources' },
        { type: 'QUEUE_OVERFLOW', severity: 'CRITICAL', action: 'Increase queue capacity or reduce input rate' },
        { type: 'SCHEDULER_FAILURE', severity: 'CRITICAL', action: 'Restart scheduler; check cron configuration' },
        { type: 'TELEGRAM_OFFLINE', severity: 'FATAL', action: 'Verify bot token and network; check Telegram API status' },
        { type: 'MONGODB_LATENCY', severity: 'WARNING', action: 'Check MongoDB server performance; review indexes' },
        { type: 'HIGH_RETRY_COUNT', severity: 'WARNING', action: 'Investigate root cause of retries' },
        { type: 'DLQ_GROWTH', severity: 'CRITICAL', action: 'Review dead letter queue; reprocess or discard items' },
      ],
    };
  }

  _deploymentChecklist() {
    return {
      title: 'Deployment Checklist',
      items: [
        'Environment variables verified (MONGODB_URI, TELEGRAM_BOT_TOKEN, etc.)',
        'MongoDB accessible and indexes created',
        'Playwright browsers installed (`npx playwright install chromium`)',
        'PUBLISHING_MODE set to DRY_RUN for initial deployment',
        'Health endpoint responding: GET /api/v1/health',
        'Readiness probe passing: GET /api/v1/observability/readiness',
        'All circuit breakers in CLOSED state',
        'No unacknowledged FATAL or CRITICAL alerts',
        'PM2 or process manager configured for auto-restart',
        'Log rotation configured for production log files',
        'Monitoring dashboards configured (optional)',
      ],
    };
  }
}

module.exports = new RunbookGenerator();
