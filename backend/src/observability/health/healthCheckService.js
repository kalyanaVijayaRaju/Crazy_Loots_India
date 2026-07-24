const logger = require('../../utils/logger');

/**
 * HealthCheckService
 *
 * Extended health check service providing:
 * - Liveness probe (is the process alive?)
 * - Readiness probe (can the system serve requests?)
 * - Startup probe (has initialization completed?)
 * - Shutdown probe (is the system shutting down?)
 * - Dependency status (external service connectivity)
 */
class HealthCheckService {
  constructor() {
    this._startupComplete = false;
    this._shuttingDown = false;
    this._startTime = Date.now();

    /** @type {Map<string, Object>} */
    this._dependencyChecks = new Map();
  }

  /**
   * Register a dependency health check
   * @param {string} name - e.g. 'mongodb', 'telegram', 'browser'
   * @param {Function} checkFn - Async fn that returns { healthy: boolean, latencyMs?, error? }
   */
  registerDependency(name, checkFn) {
    this._dependencyChecks.set(name, { name, checkFn });
    logger.info(`[HealthCheck] Dependency '${name}' registered`);
  }

  /**
   * Mark startup as complete
   */
  markStartupComplete() {
    this._startupComplete = true;
    logger.info('[HealthCheck] Startup marked as complete');
  }

  /**
   * Mark system as shutting down
   */
  markShuttingDown() {
    this._shuttingDown = true;
    logger.info('[HealthCheck] System marked as shutting down');
  }

  /**
   * Liveness probe — is the process alive?
   * @returns {Object}
   */
  liveness() {
    return {
      status: this._shuttingDown ? 'SHUTTING_DOWN' : 'ALIVE',
      uptimeMs: Date.now() - this._startTime,
      pid: process.pid,
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Readiness probe — can the system serve requests?
   * @returns {Promise<Object>}
   */
  async readiness() {
    if (this._shuttingDown) {
      return { ready: false, reason: 'SHUTTING_DOWN', timestamp: new Date().toISOString() };
    }
    if (!this._startupComplete) {
      return { ready: false, reason: 'STARTUP_INCOMPLETE', timestamp: new Date().toISOString() };
    }

    const depResults = await this._checkAllDependencies();
    const allHealthy = depResults.every((d) => d.healthy);

    return {
      ready: allHealthy,
      dependencies: depResults,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Startup probe — has initialization completed?
   * @returns {Object}
   */
  startup() {
    return {
      started: this._startupComplete,
      startTime: new Date(this._startTime).toISOString(),
      elapsedMs: Date.now() - this._startTime,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Shutdown probe — is the system shutting down?
   * @returns {Object}
   */
  shutdown() {
    return {
      shuttingDown: this._shuttingDown,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get full health report including all probes and dependencies
   * @returns {Promise<Object>}
   */
  async getFullReport() {
    const [livenessResult, readinessResult, startupResult, shutdownResult] = await Promise.all([
      this.liveness(),
      this.readiness(),
      this.startup(),
      this.shutdown(),
    ]);

    const overall = readinessResult.ready ? 'HEALTHY' : 'DEGRADED';

    return {
      status: overall,
      liveness: livenessResult,
      readiness: readinessResult,
      startup: startupResult,
      shutdown: shutdownResult,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Check all registered dependencies
   * @returns {Promise<Array<Object>>}
   */
  async _checkAllDependencies() {
    const results = [];

    for (const [name, dep] of this._dependencyChecks) {
      try {
        const start = Date.now();
        const check = await dep.checkFn();
        results.push({
          name,
          healthy: check.healthy !== false,
          latencyMs: check.latencyMs || (Date.now() - start),
          error: check.error || null,
        });
      } catch (error) {
        results.push({
          name,
          healthy: false,
          latencyMs: null,
          error: error.message,
        });
      }
    }

    return results;
  }
}

module.exports = new HealthCheckService();
