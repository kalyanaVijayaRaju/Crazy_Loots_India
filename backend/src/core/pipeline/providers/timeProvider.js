const ProviderInterface = require('../interfaces/provider.interface');

class TimeProvider extends ProviderInterface {
  constructor() {
    super('TimeProvider');
  }

  now() {
    return new Date();
  }

  iso() {
    return new Date().toISOString();
  }

  timestamp() {
    return Date.now();
  }
}

module.exports = new TimeProvider();
