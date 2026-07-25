const logger = require('../../utils/logger');

/**
 * CircuitBreaker
 *
 * Generic circuit breaker implementation with three states:
 * CLOSED (normal) → OPEN (failing) → HALF_OPEN (testing recovery)
 *
 * Protects external dependencies from cascading failures by
 * short-circuiting calls when the failure threshold is exceeded.
 */
class CircuitBreaker {
  /**
   * @param {Object} opts
   * @param {string} opts.name - Circuit name (e.g. 'amazon-merchant')
   * @param {number} [opts.failureThreshold=5] - Failures before opening
   * @param {number} [opts.resetTimeoutMs=30000] - Time in OPEN before trying HALF_OPEN
   * @param {number} [opts.halfOpenMaxAttempts=2] - Max test calls in HALF_OPEN
   */
  constructor(opts) {
    this.name = opts.name;
    this.failureThreshold = opts.failureThreshold || 5;
    this.resetTimeoutMs = opts.resetTimeoutMs || 30000;
    this.halfOpenMaxAttempts = opts.halfOpenMaxAttempts || 2;

    this._state = CircuitBreaker.STATES.CLOSED;
    this._failureCount = 0;
    this._successCount = 0;
    this._lastFailureTime = null;
    this._halfOpenAttempts = 0;
    this._listeners = [];
  }

  static get STATES() {
    return {
      CLOSED: 'CLOSED',
      OPEN: 'OPEN',
      HALF_OPEN: 'HALF_OPEN',
    };
  }

  /**
   * Execute a function through the circuit breaker
   * @param {Function} fn - Async function to protect
   * @returns {Promise<*>}
   */
  async execute(fn) {
    if (this._state === CircuitBreaker.STATES.OPEN) {
      // Check if reset timeout has elapsed
      if (Date.now() - this._lastFailureTime >= this.resetTimeoutMs) {
        this._transitionTo(CircuitBreaker.STATES.HALF_OPEN);
      } else {
        const err = new Error(`Circuit '${this.name}' is OPEN — call rejected`);
        err.code = 'CIRCUIT_OPEN';
        throw err;
      }
    }

    if (this._state === CircuitBreaker.STATES.HALF_OPEN) {
      this._halfOpenAttempts += 1;
    }

    try {
      const result = await fn();
      this._onSuccess();
      return result;
    } catch (error) {
      this._onFailure(error);
      throw error;
    }
  }

  /** @returns {string} */
  getState() {
    // Auto-check if OPEN should transition to HALF_OPEN
    if (this._state === CircuitBreaker.STATES.OPEN) {
      if (Date.now() - this._lastFailureTime >= this.resetTimeoutMs) {
        this._transitionTo(CircuitBreaker.STATES.HALF_OPEN);
      }
    }
    return this._state;
  }

  /**
   * Get circuit breaker status
   * @returns {Object}
   */
  getStatus() {
    return {
      name: this.name,
      state: this.getState(),
      failureCount: this._failureCount,
      successCount: this._successCount,
      failureThreshold: this.failureThreshold,
      resetTimeoutMs: this.resetTimeoutMs,
      lastFailureTime: this._lastFailureTime ? new Date(this._lastFailureTime).toISOString() : null,
    };
  }

  /**
   * Register a state-change listener
   * @param {Function} listener - fn(name, fromState, toState)
   */
  onStateChange(listener) {
    this._listeners.push(listener);
  }

  /**
   * Manually reset the circuit to CLOSED
   */
  reset() {
    this._failureCount = 0;
    this._successCount = 0;
    this._halfOpenAttempts = 0;
    this._lastFailureTime = null;
    this._transitionTo(CircuitBreaker.STATES.CLOSED);
    logger.info(`[CircuitBreaker] '${this.name}' manually reset to CLOSED`);
  }

  /** Handle successful call */
  _onSuccess() {
    this._successCount += 1;

    if (this._state === CircuitBreaker.STATES.HALF_OPEN) {
      // Enough successes in HALF_OPEN — close circuit
      this._failureCount = 0;
      this._halfOpenAttempts = 0;
      this._transitionTo(CircuitBreaker.STATES.CLOSED);
    } else {
      // Reset failure count on success in CLOSED state
      this._failureCount = 0;
    }
  }

  /** Handle failed call */
  _onFailure(_error) {
    this._failureCount += 1;
    this._lastFailureTime = Date.now();

    if (this._state === CircuitBreaker.STATES.HALF_OPEN) {
      // Any failure in HALF_OPEN immediately re-opens
      this._halfOpenAttempts = 0;
      this._transitionTo(CircuitBreaker.STATES.OPEN);
    } else if (this._failureCount >= this.failureThreshold) {
      this._transitionTo(CircuitBreaker.STATES.OPEN);
    }
  }

  /** Transition state and notify listeners */
  _transitionTo(newState) {
    const oldState = this._state;
    if (oldState === newState) {return;}

    this._state = newState;
    logger.info(`[CircuitBreaker] '${this.name}' transitioned ${oldState} → ${newState}`);

    for (const listener of this._listeners) {
      try {
        listener(this.name, oldState, newState);
      } catch (err) {
        logger.error(`[CircuitBreaker] Listener error: ${err.message}`);
      }
    }
  }
}

module.exports = CircuitBreaker;
