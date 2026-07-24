const ProviderInterface = require('../interfaces/provider.interface');

class ClockProvider extends ProviderInterface {
  constructor() {
    super('ClockProvider');
  }

  uptime() {
    return process.uptime();
  }

  hrtime() {
    return process.hrtime.bigint();
  }
}

module.exports = new ClockProvider();
