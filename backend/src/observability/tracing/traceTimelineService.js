const idProvider = require('../../core/pipeline/providers/idProvider');
const logger = require('../../utils/logger');

/**
 * TraceTimelineService
 *
 * Records a per-execution trace timeline that captures every pipeline stage
 * with its duration, retries, failures, warnings, and final result.
 * Each execution is identified by a unique Execution ID, Trace ID, and
 * Correlation ID for distributed tracing.
 */
class TraceTimelineService {
  constructor() {
    /** @type {Map<string, Object>} */
    this._executions = new Map();
    this._maxExecutions = 500;
  }

  /**
   * Begin a new traced execution
   * @param {Object} [opts]
   * @param {string} [opts.traceId]
   * @param {string} [opts.correlationId]
   * @returns {Object} execution context
   */
  startExecution(opts = {}) {
    const executionId = `exec_${idProvider.uuid().slice(0, 12)}`;
    const traceId = opts.traceId || idProvider.generateTraceId();
    const correlationId = opts.correlationId || idProvider.generateCorrelationId();

    const execution = {
      executionId,
      traceId,
      correlationId,
      status: 'RUNNING',
      stages: [],
      startedAt: Date.now(),
      completedAt: null,
      totalDurationMs: null,
      result: null,
    };

    this._executions.set(executionId, execution);
    this._enforceMaxSize();

    logger.info(`[TraceTimeline] Execution '${executionId}' started [Trace: ${traceId}]`);
    return { executionId, traceId, correlationId };
  }

  /**
   * Record a pipeline stage within an execution
   * @param {string} executionId
   * @param {Object} stageData
   * @param {string} stageData.stage - Stage name (EXTRACTION, MONITORING, etc.)
   * @param {number} stageData.durationMs
   * @param {number} [stageData.retries]
   * @param {Array<string>} [stageData.failures]
   * @param {Array<string>} [stageData.warnings]
   * @param {Object} [stageData.data] - Arbitrary stage data
   */
  recordStage(executionId, stageData) {
    const execution = this._executions.get(executionId);
    if (!execution) {
      logger.warn(`[TraceTimeline] Cannot record stage — execution '${executionId}' not found`);
      return;
    }

    const stage = {
      stage: stageData.stage,
      durationMs: stageData.durationMs || 0,
      retries: stageData.retries || 0,
      failures: stageData.failures || [],
      warnings: stageData.warnings || [],
      data: stageData.data || {},
      recordedAt: new Date().toISOString(),
    };

    execution.stages.push(stage);
    logger.debug(`[TraceTimeline] Stage '${stage.stage}' recorded for '${executionId}' (${stage.durationMs}ms)`);
  }

  /**
   * Complete an execution with a final result
   * @param {string} executionId
   * @param {'SUCCESS'|'FAILURE'|'PARTIAL'} result
   * @param {Object} [summary]
   */
  completeExecution(executionId, result, summary = {}) {
    const execution = this._executions.get(executionId);
    if (!execution) {
      logger.warn(`[TraceTimeline] Cannot complete — execution '${executionId}' not found`);
      return;
    }

    execution.status = result === 'SUCCESS' ? 'COMPLETED' : 'FAILED';
    execution.result = result;
    execution.completedAt = Date.now();
    execution.totalDurationMs = execution.completedAt - execution.startedAt;
    execution.summary = summary;

    logger.info(`[TraceTimeline] Execution '${executionId}' completed [${result}] in ${execution.totalDurationMs}ms`);
  }

  /**
   * Get a single execution timeline
   * @param {string} executionId
   * @returns {Object|null}
   */
  getExecution(executionId) {
    return this._executions.get(executionId) || null;
  }

  /**
   * Get the most recent N executions
   * @param {number} [limit=20]
   * @returns {Array<Object>}
   */
  getRecentExecutions(limit = 20) {
    const all = Array.from(this._executions.values());
    return all.slice(-limit).reverse();
  }

  /**
   * Query executions by trace or correlation ID
   * @param {Object} query
   * @param {string} [query.traceId]
   * @param {string} [query.correlationId]
   * @returns {Array<Object>}
   */
  queryExecutions(query = {}) {
    const all = Array.from(this._executions.values());
    return all.filter((exec) => {
      if (query.traceId && exec.traceId !== query.traceId) {return false;}
      if (query.correlationId && exec.correlationId !== query.correlationId) {return false;}
      return true;
    });
  }

  /**
   * Clear all stored executions
   */
  clear() {
    this._executions.clear();
    logger.info('[TraceTimeline] All executions cleared');
  }

  /** Keep map bounded to prevent memory leaks */
  _enforceMaxSize() {
    if (this._executions.size > this._maxExecutions) {
      const oldestKey = this._executions.keys().next().value;
      this._executions.delete(oldestKey);
    }
  }
}

module.exports = new TraceTimelineService();
