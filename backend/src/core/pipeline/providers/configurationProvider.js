const environmentProvider = require('./environmentProvider');
const ProviderInterface = require('../interfaces/provider.interface');

class ConfigurationProvider extends ProviderInterface {
  constructor() {
    super('ConfigurationProvider');
    this.configMap = new Map();
    this.initDefaults();
  }

  initDefaults() {
    this.set('app.name', environmentProvider.get('APP_NAME', 'Crazy Loots India'));
    this.set('app.port', environmentProvider.get('PORT', 5000));
    this.set('app.apiPrefix', environmentProvider.get('API_PREFIX', '/api/v1'));
    this.set('app.env', environmentProvider.nodeEnv);
    this.set('telegram.token', environmentProvider.get('TELEGRAM_BOT_TOKEN'));
    this.set('telegram.channelId', environmentProvider.get('TELEGRAM_CHANNEL_ID'));
  }

  get(key, defaultValue = undefined) {
    if (this.configMap.has(key)) {
      return this.configMap.get(key);
    }
    return defaultValue;
  }

  set(key, value) {
    this.configMap.set(key, value);
  }

  has(key) {
    return this.configMap.has(key);
  }
}

module.exports = new ConfigurationProvider();
