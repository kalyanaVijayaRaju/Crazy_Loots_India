const executorRegistry = require('../registry/executorRegistry');
const StaticExecutor = require('../executors/staticExecutor');
const PlaywrightExecutor = require('../executors/playwrightExecutor');
const ApiExecutor = require('../executors/apiExecutor');
const SeleniumExecutor = require('../executors/seleniumExecutor');

class ExecutorFactory {
  constructor() {
    this.registry = executorRegistry;
    this.initDefaultExecutors();
  }

  initDefaultExecutors() {
    this.registry.register('static', new StaticExecutor());
    this.registry.register('default-strategy', new StaticExecutor());
    this.registry.register('playwright', new PlaywrightExecutor());
    this.registry.register('api', new ApiExecutor());
    this.registry.register('selenium', new SeleniumExecutor());
  }

  getExecutor(strategy = 'static') {
    const key = strategy ? strategy.toLowerCase().trim() : 'static';
    if (!this.registry.has(key)) {
      // Fallback to static executor if requested strategy is unconfigured
      return this.registry.get('static');
    }
    return this.registry.get(key);
  }

  listExecutors() {
    return this.registry.listSupported();
  }
}

module.exports = new ExecutorFactory();
