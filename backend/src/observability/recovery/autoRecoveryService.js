const logger = require('../../utils/logger');
const alertEngine = require('../alerts/alertEngine');

/**
 * AutoRecoveryService
 *
 * Automatic recovery for critical subsystems:
 * - Browser (Playwright)
 * - Scheduler
 * - Queue
 * - Worker
 * - Publisher
 * - Monitoring Engine
 *
 * Each recovery strategy is registered by subsystem name and invoked
 * when failures are detected. Recovery attempts are tracked and bounded.
 */
class AutoRecoveryService {
  constructor() {
    /** @type {Map<string, Object>} */
    this._strategies = new Map();

    /** @type {Array<Object>} */
    this._recoveryLog = [];
    this._maxLogSize = 200;
    this._maxAttempts = 5;
  }

  /**
   * Register a recovery strategy for a subsystem
   * @param {string} subsystem - e.g. 'browser', 'scheduler', 'queue'
   * @param {Function} recoveryFn - Async function that performs recovery
   * @param {Object} [opts]
   * @param {number} [opts.maxAttempts]
   * @param {number} [opts.cooldownMs=10000]
   */
  registerStrategy(subsystem, recoveryFn, opts = {}) {
    this._strategies.set(subsystem, {
      subsystem,
      recoveryFn,
      maxAttempts: opts.maxAttempts || this._maxAttempts,
      cooldownMs: opts.cooldownMs || 10000,
      attemptCount: 0,
      lastAttemptTime: null,
      lastResult: null,
    });

    logger.info(`[AutoRecovery] Strategy registered for '${subsystem}'`);
  }

  /**
   * Attempt recovery for a subsystem
   * @param {string} subsystem
   * @param {Object} [context] - Additional context for the recovery function
   * @returns {Promise<Object>} recovery result
   */
  async recover(subsystem, context = {}) {
    const strategy = this._strategies.get(subsystem);

    if (!strategy) {
      logger.warn(`[AutoRecovery] No strategy registered for '${subsystem}'`);
      return { success: false, reason: 'NO_STRATEGY' };
    }

    // Check max attempts
    if (strategy.attemptCount >= strategy.maxAttempts) {
      logger.error(`[AutoRecovery] Max attempts (${strategy.maxAttempts}) exhausted for '${subsystem}'`);
      return { success: false, reason: 'MAX_ATTEMPTS_EXHAUSTED' };
    }

    // Check cooldown
    if (strategy.lastAttemptTime) {
      const elapsed = Date.now() - strategy.lastAttemptTime;
      if (elapsed < strategy.cooldownMs) {
        logger.warn(`[AutoRecovery] Cooldown active for '${subsystem}' (${strategy.cooldownMs - elapsed}ms remaining)`);
        return { success: false, reason: 'COOLDOWN_ACTIVE' };
      }
    }

    strategy.attemptCount += 1;
    strategy.lastAttemptTime = Date.now();

    const logEntry = {
      subsystem,
      attempt: strategy.attemptCount,
      startedAt: new Date().toISOString(),
      success: false,
      error: null,
    };

    try {
      logger.info(`[AutoRecovery] Attempting recovery for '${subsystem}' (attempt ${strategy.attemptCount}/${strategy.maxAttempts})`);
      await strategy.recoveryFn(context);

      logEntry.success = true;
      strategy.lastResult = 'SUCCESS';
      strategy.attemptCount = 0; // Reset on success

      alertEngine.fire({
        type: alertEngine.constructor.TYPES.RECOVERY_TRIGGERED,
        severity: alertEngine.constructor.SEVERITY.INFO,
        message: `Recovery successful for '${subsystem}'`,
        subsystem,
        data: { attempt: logEntry.attempt },
      });

      logger.info(`[AutoRecovery] Recovery successful for '${subsystem}'`);
    } catch (error) {
      logEntry.error = error.message;
      strategy.lastResult = 'FAILURE';
      logger.error(`[AutoRecovery] Recovery failed for '${subsystem}': ${error.message}`);
    }

    logEntry.completedAt = new Date().toISOString();
    this._recoveryLog.push(logEntry);
    this._enforceLogSize();

    return {
      success: logEntry.success,
      attempt: logEntry.attempt,
      maxAttempts: strategy.maxAttempts,
      error: logEntry.error,
    };
  }

  /**
   * Get recovery status for all subsystems
   * @returns {Array<Object>}
   */
  getStatus() {
    return Array.from(this._strategies.values()).map((s) => ({
      subsystem: s.subsystem,
      attemptCount: s.attemptCount,
      maxAttempts: s.maxAttempts,
      lastResult: s.lastResult,
      lastAttemptTime: s.lastAttemptTime ? new Date(s.lastAttemptTime).toISOString() : null,
    }));
  }

  /**
   * Get recovery log
   * @param {number} [limit=20]
   * @returns {Array<Object>}
   */
  getLog(limit = 20) {
    return this._recoveryLog.slice(-limit).reverse();
  }

  /**
   * Reset attempt counter for a subsystem
   * @param {string} subsystem
   */
  resetAttempts(subsystem) {
    const strategy = this._strategies.get(subsystem);
    if (strategy) {
      strategy.attemptCount = 0;
      strategy.lastResult = null;
    }
  }

  /** Keep log bounded */
  _enforceLogSize() {
    if (this._recoveryLog.length > this._maxLogSize) {
      this._recoveryLog = this._recoveryLog.slice(-this._maxLogSize);
    }
  }
}

module.exports = new AutoRecoveryService();
