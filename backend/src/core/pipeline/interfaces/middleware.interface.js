/**
 * PipelineMiddleware Interface
 */
class PipelineMiddleware {
  constructor(name, priority = 50) {
    if (this.constructor === PipelineMiddleware) {
      throw new Error('PipelineMiddleware is an abstract interface and cannot be instantiated directly.');
    }
    this._name = name || this.constructor.name;
    this._priority = priority;
  }

  name() {
    return this._name;
  }

  priority() {
    return this._priority;
  }

  /**
   * Execute middleware logic
   * @param {Object} _context - Pipeline/Monitoring Context
   * @param {Function} _next - Continuation callback function
   */
  async execute(_context, _next) {
    throw new Error(`Method 'execute()' must be implemented by ${this.name()}`);
  }
}

module.exports = PipelineMiddleware;
