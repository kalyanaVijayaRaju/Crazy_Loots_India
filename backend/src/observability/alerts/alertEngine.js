const logger = require('../../utils/logger');
const failureClassifier = require('./failureClassifier');

/**
 * AlertEngine
 *
 * Generates alerts for critical system events including:
 * - Amazon selector failures
 * - DOM version changes
 * - Browser crashes
 * - Queue overflow
 * - Scheduler failure
 * - Telegram offline
 * - MongoDB latency
 * - High retry count
 * - Dead Letter Queue growth
 */
class AlertEngine {
  constructor() {
    /** @type {Array<Object>} */
    this._alerts = [];
    this._maxAlerts = 1000;
    this._listeners = [];

    /** Configurable thresholds */
    this._thresholds = {
      maxRetryCount: 5,
      maxQueueSize: 500,
      maxDbLatencyMs: 5000,
      maxDlqSize: 50,
      maxBrowserCrashes: 3,
    };
  }

  /**
   * Alert severity levels
   */
  static get SEVERITY() {
    return {
      INFO: 'INFO',
      WARNING: 'WARNING',
      CRITICAL: 'CRITICAL',
      FATAL: 'FATAL',
    };
  }

  /**
   * Alert types
   */
  static get TYPES() {
    return {
      SELECTOR_FAILURE: 'SELECTOR_FAILURE',
      DOM_VERSION_CHANGE: 'DOM_VERSION_CHANGE',
      BROWSER_CRASH: 'BROWSER_CRASH',
      QUEUE_OVERFLOW: 'QUEUE_OVERFLOW',
      SCHEDULER_FAILURE: 'SCHEDULER_FAILURE',
      TELEGRAM_OFFLINE: 'TELEGRAM_OFFLINE',
      MONGODB_LATENCY: 'MONGODB_LATENCY',
      HIGH_RETRY_COUNT: 'HIGH_RETRY_COUNT',
      DLQ_GROWTH: 'DLQ_GROWTH',
      RECOVERY_TRIGGERED: 'RECOVERY_TRIGGERED',
      CIRCUIT_OPEN: 'CIRCUIT_OPEN',
      GENERAL: 'GENERAL',
    };
  }

  /**
   * Update alert thresholds
   * @param {Object} thresholds
   */
  setThresholds(thresholds) {
    Object.assign(this._thresholds, thresholds);
  }

  /**
   * Register an alert listener callback
   * @param {Function} listener - fn(alert)
   */
  onAlert(listener) {
    this._listeners.push(listener);
  }

  /**
   * Fire an alert
   * @param {Object} opts
   * @param {string} opts.type - One of TYPES
   * @param {string} opts.severity - One of SEVERITY
   * @param {string} opts.message
   * @param {string} [opts.subsystem]
   * @param {Object} [opts.data]
   * @returns {Object} alert
   */
  fire(opts) {
    const alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: opts.type || AlertEngine.TYPES.GENERAL,
      severity: opts.severity || AlertEngine.SEVERITY.WARNING,
      message: opts.message,
      subsystem: opts.subsystem || 'SYSTEM',
      data: opts.data || {},
      acknowledged: false,
      firedAt: new Date().toISOString(),
    };

    this._alerts.push(alert);
    this._enforceMaxSize();

    logger.warn(`[AlertEngine] [${alert.severity}] ${alert.type}: ${alert.message}`);

    // Notify listeners
    for (const listener of this._listeners) {
      try {
        listener(alert);
      } catch (err) {
        logger.error(`[AlertEngine] Listener error: ${err.message}`);
      }
    }

    return alert;
  }

  /**
   * Check conditions and auto-fire alerts
   * @param {Object} systemState
   * @param {number} [systemState.retryCount]
   * @param {number} [systemState.queueSize]
   * @param {number} [systemState.dbLatencyMs]
   * @param {number} [systemState.dlqSize]
   * @param {number} [systemState.browserCrashes]
   * @param {boolean} [systemState.telegramOnline]
   * @returns {Array<Object>} fired alerts
   */
  evaluate(systemState) {
    const fired = [];

    if (systemState.retryCount > this._thresholds.maxRetryCount) {
      fired.push(this.fire({
        type: AlertEngine.TYPES.HIGH_RETRY_COUNT,
        severity: AlertEngine.SEVERITY.WARNING,
        message: `Retry count (${systemState.retryCount}) exceeds threshold (${this._thresholds.maxRetryCount})`,
        data: { retryCount: systemState.retryCount },
      }));
    }

    if (systemState.queueSize > this._thresholds.maxQueueSize) {
      fired.push(this.fire({
        type: AlertEngine.TYPES.QUEUE_OVERFLOW,
        severity: AlertEngine.SEVERITY.CRITICAL,
        message: `Queue size (${systemState.queueSize}) exceeds threshold (${this._thresholds.maxQueueSize})`,
        data: { queueSize: systemState.queueSize },
      }));
    }

    if (systemState.dbLatencyMs > this._thresholds.maxDbLatencyMs) {
      fired.push(this.fire({
        type: AlertEngine.TYPES.MONGODB_LATENCY,
        severity: AlertEngine.SEVERITY.WARNING,
        message: `MongoDB latency (${systemState.dbLatencyMs}ms) exceeds threshold (${this._thresholds.maxDbLatencyMs}ms)`,
        data: { dbLatencyMs: systemState.dbLatencyMs },
      }));
    }

    if (systemState.dlqSize > this._thresholds.maxDlqSize) {
      fired.push(this.fire({
        type: AlertEngine.TYPES.DLQ_GROWTH,
        severity: AlertEngine.SEVERITY.CRITICAL,
        message: `Dead Letter Queue size (${systemState.dlqSize}) exceeds threshold (${this._thresholds.maxDlqSize})`,
        data: { dlqSize: systemState.dlqSize },
      }));
    }

    if (systemState.browserCrashes > this._thresholds.maxBrowserCrashes) {
      fired.push(this.fire({
        type: AlertEngine.TYPES.BROWSER_CRASH,
        severity: AlertEngine.SEVERITY.CRITICAL,
        message: `Browser crash count (${systemState.browserCrashes}) exceeds threshold (${this._thresholds.maxBrowserCrashes})`,
        data: { browserCrashes: systemState.browserCrashes },
      }));
    }

    if (systemState.telegramOnline === false) {
      fired.push(this.fire({
        type: AlertEngine.TYPES.TELEGRAM_OFFLINE,
        severity: AlertEngine.SEVERITY.FATAL,
        message: 'Telegram client is offline',
      }));
    }

    return fired;
  }

  /**
   * Fire an alert from a classified failure
   * @param {Error|string} error
   * @param {Object} [context]
   * @returns {Object} alert
   */
  fireFromError(error, context = {}) {
    const classification = failureClassifier.classify(error, context);

    const severity = classification.recoverable
      ? AlertEngine.SEVERITY.WARNING
      : AlertEngine.SEVERITY.CRITICAL;

    return this.fire({
      type: AlertEngine.TYPES.GENERAL,
      severity,
      message: classification.originalMessage,
      subsystem: classification.subsystem,
      data: { classification },
    });
  }

  /**
   * Acknowledge an alert
   * @param {string} alertId
   * @returns {boolean}
   */
  acknowledge(alertId) {
    const alert = this._alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      return true;
    }
    return false;
  }

  /**
   * Get all alerts, optionally filtered
   * @param {Object} [filter]
   * @param {string} [filter.severity]
   * @param {string} [filter.type]
   * @param {boolean} [filter.unacknowledgedOnly]
   * @returns {Array<Object>}
   */
  getAlerts(filter = {}) {
    let results = [...this._alerts];

    if (filter.severity) {
      results = results.filter((a) => a.severity === filter.severity);
    }
    if (filter.type) {
      results = results.filter((a) => a.type === filter.type);
    }
    if (filter.unacknowledgedOnly) {
      results = results.filter((a) => !a.acknowledged);
    }

    return results.reverse();
  }

  /**
   * Get alert summary statistics
   * @returns {Object}
   */
  getSummary() {
    const total = this._alerts.length;
    const bySeverity = {};
    const byType = {};

    for (const alert of this._alerts) {
      bySeverity[alert.severity] = (bySeverity[alert.severity] || 0) + 1;
      byType[alert.type] = (byType[alert.type] || 0) + 1;
    }

    return {
      total,
      unacknowledged: this._alerts.filter((a) => !a.acknowledged).length,
      bySeverity,
      byType,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Clear all alerts
   */
  clear() {
    this._alerts = [];
    logger.info('[AlertEngine] All alerts cleared');
  }

  /** Keep bounded */
  _enforceMaxSize() {
    if (this._alerts.length > this._maxAlerts) {
      this._alerts = this._alerts.slice(-this._maxAlerts);
    }
  }
}

module.exports = new AlertEngine();
