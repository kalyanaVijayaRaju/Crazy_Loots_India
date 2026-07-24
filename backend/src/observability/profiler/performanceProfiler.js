const logger = require('../../utils/logger');

/**
 * PerformanceProfiler
 *
 * Automatically profiles every subsystem in the pipeline, capturing
 * timing data for browser launch, navigation, DOM extraction, parsing,
 * database, monitoring, deal detection, publishing, and total execution.
 */
class PerformanceProfiler {
  constructor() {
    /** @type {Map<string, Object>} */
    this._profiles = new Map();
    this._maxProfiles = 200;
  }

  /**
   * Profiling categories
   */
  static get CATEGORIES() {
    return [
      'BROWSER_LAUNCH',
      'NAVIGATION',
      'DOM_EXTRACTION',
      'PARSING',
      'DATABASE',
      'MONITORING',
      'DEAL_DETECTION',
      'PUBLISHING',
      'TOTAL_EXECUTION',
    ];
  }

  /**
   * Start a new profiling session
   * @param {string} sessionId - Typically matches executionId
   * @returns {string} sessionId
   */
  startSession(sessionId) {
    this._profiles.set(sessionId, {
      sessionId,
      entries: {},
      startedAt: Date.now(),
      completedAt: null,
    });
    this._enforceMaxSize();
    return sessionId;
  }

  /**
   * Begin profiling a specific category
   * @param {string} sessionId
   * @param {string} category
   */
  startMeasure(sessionId, category) {
    const profile = this._profiles.get(sessionId);
    if (!profile) return;

    profile.entries[category] = {
      category,
      startedAt: Date.now(),
      completedAt: null,
      durationMs: null,
      metadata: {},
    };
  }

  /**
   * End profiling a specific category
   * @param {string} sessionId
   * @param {string} category
   * @param {Object} [metadata] - Extra data about this measurement
   */
  endMeasure(sessionId, category, metadata = {}) {
    const profile = this._profiles.get(sessionId);
    if (!profile || !profile.entries[category]) return;

    const entry = profile.entries[category];
    entry.completedAt = Date.now();
    entry.durationMs = entry.completedAt - entry.startedAt;
    entry.metadata = metadata;
  }

  /**
   * Complete a profiling session
   * @param {string} sessionId
   * @returns {Object|null} profile report
   */
  endSession(sessionId) {
    const profile = this._profiles.get(sessionId);
    if (!profile) return null;

    profile.completedAt = Date.now();

    // Compute TOTAL_EXECUTION if not explicitly measured
    if (!profile.entries['TOTAL_EXECUTION']) {
      profile.entries['TOTAL_EXECUTION'] = {
        category: 'TOTAL_EXECUTION',
        startedAt: profile.startedAt,
        completedAt: profile.completedAt,
        durationMs: profile.completedAt - profile.startedAt,
        metadata: {},
      };
    }

    logger.info(`[Profiler] Session '${sessionId}' completed in ${profile.completedAt - profile.startedAt}ms`);
    return this.generateReport(sessionId);
  }

  /**
   * Generate a human-readable performance report
   * @param {string} sessionId
   * @returns {Object|null}
   */
  generateReport(sessionId) {
    const profile = this._profiles.get(sessionId);
    if (!profile) return null;

    const entries = Object.values(profile.entries);
    const totalMs = profile.completedAt
      ? profile.completedAt - profile.startedAt
      : Date.now() - profile.startedAt;

    const breakdown = entries.map((entry) => ({
      category: entry.category,
      durationMs: entry.durationMs,
      percentOfTotal: totalMs > 0 ? parseFloat(((entry.durationMs / totalMs) * 100).toFixed(2)) : 0,
      metadata: entry.metadata,
    }));

    // Identify the slowest category
    const sorted = [...breakdown].sort((a, b) => (b.durationMs || 0) - (a.durationMs || 0));
    const bottleneck = sorted.length > 0 ? sorted[0] : null;

    return {
      sessionId,
      totalDurationMs: totalMs,
      breakdown,
      bottleneck: bottleneck ? { category: bottleneck.category, durationMs: bottleneck.durationMs } : null,
      startedAt: new Date(profile.startedAt).toISOString(),
      completedAt: profile.completedAt ? new Date(profile.completedAt).toISOString() : null,
    };
  }

  /**
   * Get the most recent N profiles
   * @param {number} [limit=20]
   * @returns {Array<Object>}
   */
  getRecentProfiles(limit = 20) {
    const all = Array.from(this._profiles.keys()).slice(-limit).reverse();
    return all.map((id) => this.generateReport(id)).filter(Boolean);
  }

  /**
   * Clear all stored profiles
   */
  clear() {
    this._profiles.clear();
  }

  /** Keep bounded */
  _enforceMaxSize() {
    if (this._profiles.size > this._maxProfiles) {
      const oldestKey = this._profiles.keys().next().value;
      this._profiles.delete(oldestKey);
    }
  }
}

module.exports = new PerformanceProfiler();
