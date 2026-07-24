const MockTelegramClient = require('./mockTelegramClient');
const RealTelegramClient = require('./realTelegramClient');
const publishingModeManager = require('../mode/publishingModeManager');

class TelegramClientFactory {
  constructor() {
    this.mockClient = new MockTelegramClient();
    this.realClient = new RealTelegramClient();
  }

  getClient() {
    if (publishingModeManager.isLive()) {
      return this.realClient;
    }
    return this.mockClient;
  }
}

module.exports = new TelegramClientFactory();
