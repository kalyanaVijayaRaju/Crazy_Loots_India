const MockTelegramClient = require('./mockTelegramClient');
const RealTelegramClient = require('./realTelegramClient');
const publishingModeManager = require('../mode/publishingModeManager');

class TelegramClientFactory {
  constructor() {
    this.mockClient = new MockTelegramClient();
    this.realClient = new RealTelegramClient();
  }

  getClient() {
    return publishingModeManager.isDryRun()
      ? this.mockClient
      : this.realClient;
  }
}

module.exports = new TelegramClientFactory();
