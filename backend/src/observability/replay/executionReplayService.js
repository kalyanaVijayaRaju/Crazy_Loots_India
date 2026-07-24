const logger = require('../../utils/logger');

/**
 * ExecutionReplayService
 *
 * Restores and replays previous pipeline executions from archived
 * snapshots. Supports replay of:
 * - PublishingPackage
 * - Snapshots
 * - Trace Context
 * - Metrics
 * - Execution Timeline
 */
class ExecutionReplayService {
  constructor() {
    /** @type {Map<string, Object>} */
    this._replayableSnapshots = new Map();
    this._maxSnapshots = 200;
    this._replayLog = [];
  }

  /**
   * Store a replayable snapshot from an execution
   * @param {string} executionId
   * @param {Object} snapshot
   * @param {Object} [snapshot.publishingPackage]
   * @param {Object} [snapshot.traceContext]
   * @param {Object} [snapshot.metrics]
   * @param {Object} [snapshot.timeline]
   * @param {Array}  [snapshot.stages]
   */
  storeSnapshot(executionId, snapshot) {
    this._replayableSnapshots.set(executionId, {
      executionId,
      snapshot: { ...snapshot },
      storedAt: new Date().toISOString(),
    });
    this._enforceMaxSize();
    logger.info(`[ExecutionReplay] Snapshot stored for execution '${executionId}'`);
  }

  /**
   * Replay a previously stored execution
   * @param {string} executionId
   * @returns {Object|null} replayed data
   */
  replay(executionId) {
    const stored = this._replayableSnapshots.get(executionId);
    if (!stored) {
      logger.warn(`[ExecutionReplay] No snapshot found for execution '${executionId}'`);
      return null;
    }

    const replayResult = {
      executionId,
      replayedAt: new Date().toISOString(),
      originalStoredAt: stored.storedAt,
      publishingPackage: stored.snapshot.publishingPackage || null,
      traceContext: stored.snapshot.traceContext || null,
      metrics: stored.snapshot.metrics || null,
      timeline: stored.snapshot.timeline || null,
      stages: stored.snapshot.stages || [],
    };

    this._replayLog.push({
      executionId,
      replayedAt: replayResult.replayedAt,
    });

    logger.info(`[ExecutionReplay] Replayed execution '${executionId}'`);
    return replayResult;
  }

  /**
   * List all available snapshots for replay
   * @param {number} [limit=20]
   * @returns {Array<Object>}
   */
  listAvailable(limit = 20) {
    return Array.from(this._replayableSnapshots.values())
      .slice(-limit)
      .reverse()
      .map((s) => ({
        executionId: s.executionId,
        storedAt: s.storedAt,
        hasPublishingPackage: Boolean(s.snapshot.publishingPackage),
        hasMetrics: Boolean(s.snapshot.metrics),
        hasTimeline: Boolean(s.snapshot.timeline),
      }));
  }

  /**
   * Get replay log
   * @param {number} [limit=20]
   * @returns {Array<Object>}
   */
  getReplayLog(limit = 20) {
    return this._replayLog.slice(-limit).reverse();
  }

  /**
   * Remove a stored snapshot
   * @param {string} executionId
   * @returns {boolean}
   */
  removeSnapshot(executionId) {
    return this._replayableSnapshots.delete(executionId);
  }

  /**
   * Clear all snapshots
   */
  clear() {
    this._replayableSnapshots.clear();
    this._replayLog = [];
    logger.info('[ExecutionReplay] All snapshots and replay log cleared');
  }

  /** Keep bounded */
  _enforceMaxSize() {
    if (this._replayableSnapshots.size > this._maxSnapshots) {
      const oldestKey = this._replayableSnapshots.keys().next().value;
      this._replayableSnapshots.delete(oldestKey);
    }
  }
}

module.exports = new ExecutionReplayService();
