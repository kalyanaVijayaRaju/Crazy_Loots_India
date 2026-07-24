const telegramClientFactory = require('../client/telegramClientFactory');
const publishingModeManager = require('../mode/publishingModeManager');

class TelegramHealthService {
  async getHealthStatus() {
    const client = telegramClientFactory.getClient();
    const clientHealth = await client.healthCheck();

    return {
      status: clientHealth.status,
      publishingMode: publishingModeManager.getMode(),
      clientType: client.getProviderName ? client.getProviderName() : client.name,
      checkedAt: new Date().toISOString(),
    };
  }
}

module.exports = new TelegramHealthService();
