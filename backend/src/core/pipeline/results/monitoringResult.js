const timeProvider = require('../providers/timeProvider');

/**
 * Immutable MonitoringResult Model
 */
class MonitoringResult {
  constructor(builder) {
    if (!builder._taskId) {
      throw new Error('MonitoringResult requires a taskId.');
    }

    this.taskId = builder._taskId;
    this.success = Boolean(builder._success);
    this.duration = Number(builder._duration) || 0;
    this.events = Object.freeze([...(builder._events || [])]);
    this.warnings = Object.freeze([...(builder._warnings || [])]);
    this.errors = Object.freeze([...(builder._errors || [])]);
    this.metrics = Object.freeze({ ...(builder._metrics || {}) });
    this.timestamps = Object.freeze({
      startedAt: builder._startedAt || timeProvider.iso(),
      completedAt: timeProvider.iso(),
    });
    this.state = builder._state || (this.success ? 'COMPLETED' : 'FAILED');
    this.traceId = builder._traceId || '';
    this.metadata = Object.freeze({ ...(builder._metadata || {}) });

    Object.freeze(this);
  }

  static get Builder() {
    class MonitoringResultBuilder {
      constructor() {
        this._events = [];
        this._warnings = [];
        this._errors = [];
        this._metrics = {};
        this._metadata = {};
        this._success = false;
      }

      setTaskId(id) {
        this._taskId = id;
        return this;
      }

      setSuccess(success) {
        this._success = Boolean(success);
        return this;
      }

      setDuration(durationMs) {
        this._duration = durationMs;
        return this;
      }

      setTraceId(traceId) {
        this._traceId = traceId;
        return this;
      }

      setState(state) {
        this._state = state;
        return this;
      }

      addEvent(event) {
        this._events.push(event);
        return this;
      }

      addWarning(warning) {
        this._warnings.push(warning);
        return this;
      }

      addError(error) {
        this._errors.push(error);
        return this;
      }

      setMetrics(metrics) {
        this._metrics = { ...this._metrics, ...metrics };
        return this;
      }

      setMetadata(metadata) {
        this._metadata = { ...this._metadata, ...metadata };
        return this;
      }

      build() {
        return new MonitoringResult(this);
      }
    }
    return MonitoringResultBuilder;
  }
}

module.exports = MonitoringResult;
