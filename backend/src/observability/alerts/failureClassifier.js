const logger = require('../../utils/logger');

/**
 * FailureClassifier
 *
 * Classifies errors and failures into well-defined categories so that
 * the alert engine and auto-recovery systems can respond appropriately.
 *
 * Categories:
 *   TEMPORARY, PERMANENT, CONFIGURATION, DEPENDENCY, NETWORK,
 *   BROWSER, MERCHANT, PUBLISHING, DATABASE
 */
class FailureClassifier {
  /**
   * Supported failure categories
   */
  static get CATEGORIES() {
    return {
      TEMPORARY: 'TEMPORARY',
      PERMANENT: 'PERMANENT',
      CONFIGURATION: 'CONFIGURATION',
      DEPENDENCY: 'DEPENDENCY',
      NETWORK: 'NETWORK',
      BROWSER: 'BROWSER',
      MERCHANT: 'MERCHANT',
      PUBLISHING: 'PUBLISHING',
      DATABASE: 'DATABASE',
    };
  }

  /**
   * Classify an error into a failure category
   * @param {Error|string} error
   * @param {Object} [context] - Optional context (subsystem, operation, etc.)
   * @returns {Object} classification result
   */
  classify(error, context = {}) {
    const message = error instanceof Error ? error.message : String(error);
    const lowerMsg = message.toLowerCase();

    let category = FailureClassifier.CATEGORIES.TEMPORARY;
    let recoverable = true;
    let suggestedAction = 'RETRY';

    // Network failures
    if (this._matchesAny(lowerMsg, ['econnrefused', 'enotfound', 'etimedout', 'socket hang up', 'network', 'dns', 'fetch failed'])) {
      category = FailureClassifier.CATEGORIES.NETWORK;
      suggestedAction = 'RETRY_WITH_BACKOFF';
    }
    // Browser failures
    else if (this._matchesAny(lowerMsg, ['browser', 'playwright', 'chromium', 'page crash', 'target closed', 'navigation failed', 'context destroyed'])) {
      category = FailureClassifier.CATEGORIES.BROWSER;
      suggestedAction = 'RESTART_BROWSER';
    }
    // Database failures
    else if (this._matchesAny(lowerMsg, ['mongo', 'mongoose', 'connection', 'topology', 'buffering timed out', 'duplicate key'])) {
      category = FailureClassifier.CATEGORIES.DATABASE;
      suggestedAction = lowerMsg.includes('duplicate key') ? 'SKIP' : 'RETRY_WITH_BACKOFF';
    }
    // Merchant/selector failures
    else if (this._matchesAny(lowerMsg, ['selector', 'dom', 'element not found', 'extraction failed', 'asin', 'merchant'])) {
      category = FailureClassifier.CATEGORIES.MERCHANT;
      suggestedAction = 'ALERT_AND_RETRY';
      recoverable = !lowerMsg.includes('permanent');
    }
    // Publishing failures
    else if (this._matchesAny(lowerMsg, ['telegram', 'publish', 'broadcast', 'channel', 'message send'])) {
      category = FailureClassifier.CATEGORIES.PUBLISHING;
      suggestedAction = 'RETRY_WITH_BACKOFF';
    }
    // Configuration failures
    else if (this._matchesAny(lowerMsg, ['config', 'environment', 'missing env', 'invalid setting', 'not configured'])) {
      category = FailureClassifier.CATEGORIES.CONFIGURATION;
      recoverable = false;
      suggestedAction = 'FIX_CONFIGURATION';
    }
    // Dependency failures
    else if (this._matchesAny(lowerMsg, ['dependency', 'module not found', 'require', 'import'])) {
      category = FailureClassifier.CATEGORIES.DEPENDENCY;
      recoverable = false;
      suggestedAction = 'FIX_DEPENDENCY';
    }
    // Check if error message implies permanence
    else if (this._matchesAny(lowerMsg, ['fatal', 'unrecoverable', 'permanent', 'critical'])) {
      category = FailureClassifier.CATEGORIES.PERMANENT;
      recoverable = false;
      suggestedAction = 'ALERT_AND_STOP';
    }

    const classification = {
      category,
      recoverable,
      suggestedAction,
      originalMessage: message,
      subsystem: context.subsystem || 'UNKNOWN',
      operation: context.operation || 'UNKNOWN',
      classifiedAt: new Date().toISOString(),
    };

    logger.debug(`[FailureClassifier] Classified as ${category} (recoverable: ${recoverable})`);
    return classification;
  }

  /**
   * Check if message contains any of the keywords
   * @param {string} message
   * @param {string[]} keywords
   * @returns {boolean}
   */
  _matchesAny(message, keywords) {
    return keywords.some((kw) => message.includes(kw));
  }
}

module.exports = new FailureClassifier();
