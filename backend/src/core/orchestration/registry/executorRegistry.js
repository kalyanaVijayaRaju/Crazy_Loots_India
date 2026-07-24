const ExecutorInterface = require('../executors/executor.interface');
const logger = require('../../../utils/logger');

class ExecutorRegistry {
  constructor() {
    this.executors = new Map();
  }

  register(name, executor) {
    if (!(executor instanceof ExecutorInterface)) {
      throw new Error('Executor instance must extend ExecutorInterface.');
    }
    const key = name.toLowerCase().trim();
    this.executors.set(key, executor);
    logger.debug(`[ExecutorRegistry] Registered executor '${key}' (${executor.name()})`);
  }

  get(name) {
    const key = name.toLowerCase().trim();
    const executor = this.executors.get(key);
    if (!executor) {
      throw new Error(`Executor '${name}' is not registered in ExecutorRegistry.`);
    }
    return executor;
  }

  has(name) {
    if (!name || typeof name !== 'string') {
      return false;
    }
    return this.executors.has(name.toLowerCase().trim());
  }

  listSupported() {
    return Array.from(this.executors.keys());
  }

  async healthCheck() {
    const results = {};
    for (const [name, executor] of this.executors.entries()) {
      results[name] = await executor.healthCheck();
    }
    return {
      status: 'HEALTHY',
      executors: results,
    };
  }
}

module.exports = new ExecutorRegistry();
