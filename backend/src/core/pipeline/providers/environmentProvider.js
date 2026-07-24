const env = require('../../../config/environment');
const ProviderInterface = require('../interfaces/provider.interface');

class EnvironmentProvider extends ProviderInterface {
  constructor() {
    super('EnvironmentProvider');
  }

  get(key, defaultValue = undefined) {
    if (env[key] !== undefined) {
      return env[key];
    }
    return process.env[key] !== undefined ? process.env[key] : defaultValue;
  }

  get nodeEnv() {
    return env.NODE_ENV;
  }

  get isDevelopment() {
    return env.NODE_ENV === 'development';
  }

  get isProduction() {
    return env.NODE_ENV === 'production';
  }

  get isTest() {
    return env.NODE_ENV === 'test';
  }
}

module.exports = new EnvironmentProvider();
