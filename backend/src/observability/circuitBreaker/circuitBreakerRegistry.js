const CircuitBreaker = require('./circuitBreaker');
const logger = require('../../utils/logger');

/**
 * CircuitBreakerRegistry
 *
 * Registry that manages named circuit breaker instances for:
 * - Amazon Merchant
 * - Telegram Client
 * - Browser (Playwright)
 * - MongoDB
 * - Affiliate Provider
 * - Short URL Provider
 */
class CircuitBreakerRegistry {
  constructor() {
    /** @type {Map<string, CircuitBreaker>} */
    this._breakers = new Map();
  }

  /**
   * Pre-configured circuit breaker profiles
   */
  static get PROFILES() {
    return {
      'amazon-merchant': { failureThreshold: 5, resetTimeoutMs: 60000, halfOpenMaxAttempts: 2 },
      'telegram-client': { failureThreshold: 3, resetTimeoutMs: 30000, halfOpenMaxAttempts: 1 },
      'browser': { failureThreshold: 3, resetTimeoutMs: 45000, halfOpenMaxAttempts: 1 },
      'mongodb': { failureThreshold: 5, resetTimeoutMs: 15000, halfOpenMaxAttempts: 2 },
      'affiliate-provider': { failureThreshold: 4, resetTimeoutMs: 30000, halfOpenMaxAttempts: 2 },
      'short-url-provider': { failureThreshold: 4, resetTimeoutMs: 30000, halfOpenMaxAttempts: 2 },
    };
  }

  /**
   * Get or create a circuit breaker by name
   * @param {string} name
   * @param {Object} [overrides] - Override default profile settings
   * @returns {CircuitBreaker}
   */
  get(name, overrides = {}) {
    if (this._breakers.has(name)) {
      return this._breakers.get(name);
    }

    const profile = CircuitBreakerRegistry.PROFILES[name] || {
      failureThreshold: 5,
      resetTimeoutMs: 30000,
      halfOpenMaxAttempts: 2,
    };

    const breaker = new CircuitBreaker({
      name,
      ...profile,
      ...overrides,
    });

    this._breakers.set(name, breaker);
    logger.info(`[CircuitBreakerRegistry] Registered circuit breaker '${name}'`);
    return breaker;
  }

  /**
   * Initialize all pre-configured circuit breakers
   */
  initializeAll() {
    for (const name of Object.keys(CircuitBreakerRegistry.PROFILES)) {
      this.get(name);
    }
    logger.info(`[CircuitBreakerRegistry] Initialized ${this._breakers.size} circuit breakers`);
  }

  /**
   * Get status of all registered circuit breakers
   * @returns {Array<Object>}
   */
  getAllStatus() {
    return Array.from(this._breakers.values()).map((b) => b.getStatus());
  }

  /**
   * Reset all circuit breakers to CLOSED
   */
  resetAll() {
    for (const breaker of this._breakers.values()) {
      breaker.reset();
    }
    logger.info('[CircuitBreakerRegistry] All circuit breakers reset');
  }

  /**
   * Check if any circuit is currently OPEN
   * @returns {Array<Object>}
   */
  getOpenCircuits() {
    return this.getAllStatus().filter((s) => s.state === 'OPEN');
  }
}

module.exports = new CircuitBreakerRegistry();
