const logger = require('../../utils/logger');

/**
 * ExecutionTimelineStore
 *
 * In-memory store that holds the complete pipeline stage timeline for
 * each execution. Stages are tracked in the canonical pipeline order:
 *
 *   Extraction → Monitoring → Price Comparison → Deal Detection →
 *   Publishing Preparation → Telegram Publishing → History Persistence
 */
class ExecutionTimelineStore {
  constructor() {
    /** @type {Map<string, Object>} */
    this._timelines = new Map();
    this._maxTimelines = 500;
  }

  /**
   * Canonical pipeline stage order
   * @returns {string[]}
   */
  static get STAGE_ORDER() {
    return [
      'EXTRACTION',
      'MONITORING',
      'PRICE_COMPARISON',
      'DEAL_DETECTION',
      'PUBLISHING_PREPARATION',
      'TELEGRAM_PUBLISHING',
      'HISTORY_PERSISTENCE',
    ];
  }

  /**
   * Create a new timeline for an execution
   * @param {string} executionId
   * @returns {Object}
   */
  create(executionId) {
    const timeline = {
      executionId,
      stages: {},
      createdAt: new Date().toISOString(),
      completedAt: null,
    };

    ExecutionTimelineStore.STAGE_ORDER.forEach((stage) => {
      timeline.stages[stage] = {
        status: 'PENDING',
        startedAt: null,
        completedAt: null,
        durationMs: null,
        retries: 0,
        error: null,
      };
    });

    this._timelines.set(executionId, timeline);
    this._enforceMaxSize();
    return timeline;
  }

  /**
   * Mark a stage as started
   * @param {string} executionId
   * @param {string} stage
   */
  stageStarted(executionId, stage) {
    const timeline = this._timelines.get(executionId);
    if (!timeline || !timeline.stages[stage]) {return;}

    timeline.stages[stage].status = 'RUNNING';
    timeline.stages[stage].startedAt = Date.now();
  }

  /**
   * Mark a stage as completed
   * @param {string} executionId
   * @param {string} stage
   * @param {Object} [result]
   */
  stageCompleted(executionId, stage, result = {}) {
    const timeline = this._timelines.get(executionId);
    if (!timeline || !timeline.stages[stage]) {return;}

    const stageData = timeline.stages[stage];
    stageData.status = 'COMPLETED';
    stageData.completedAt = Date.now();
    stageData.durationMs = stageData.startedAt ? stageData.completedAt - stageData.startedAt : 0;
    stageData.result = result;
  }

  /**
   * Mark a stage as failed
   * @param {string} executionId
   * @param {string} stage
   * @param {Error|string} error
   */
  stageFailed(executionId, stage, error) {
    const timeline = this._timelines.get(executionId);
    if (!timeline || !timeline.stages[stage]) {return;}

    const stageData = timeline.stages[stage];
    stageData.status = 'FAILED';
    stageData.completedAt = Date.now();
    stageData.durationMs = stageData.startedAt ? stageData.completedAt - stageData.startedAt : 0;
    stageData.error = error instanceof Error ? error.message : String(error);
  }

  /**
   * Increment retry count for a stage
   * @param {string} executionId
   * @param {string} stage
   */
  stageRetried(executionId, stage) {
    const timeline = this._timelines.get(executionId);
    if (!timeline || !timeline.stages[stage]) {return;}
    timeline.stages[stage].retries += 1;
  }

  /**
   * Mark the entire timeline as completed
   * @param {string} executionId
   */
  complete(executionId) {
    const timeline = this._timelines.get(executionId);
    if (!timeline) {return;}
    timeline.completedAt = new Date().toISOString();
  }

  /**
   * Retrieve a timeline
   * @param {string} executionId
   * @returns {Object|null}
   */
  get(executionId) {
    return this._timelines.get(executionId) || null;
  }

  /**
   * Get the most recent N timelines
   * @param {number} [limit=20]
   * @returns {Array<Object>}
   */
  getRecent(limit = 20) {
    return Array.from(this._timelines.values()).slice(-limit).reverse();
  }

  /**
   * Clear all stored timelines
   */
  clear() {
    this._timelines.clear();
    logger.info('[ExecutionTimelineStore] All timelines cleared');
  }

  /** Keep bounded */
  _enforceMaxSize() {
    if (this._timelines.size > this._maxTimelines) {
      const oldestKey = this._timelines.keys().next().value;
      this._timelines.delete(oldestKey);
    }
  }
}

module.exports = new ExecutionTimelineStore();
