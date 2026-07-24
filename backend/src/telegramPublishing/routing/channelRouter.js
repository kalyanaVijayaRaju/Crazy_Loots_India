const telegramChannelRegistry = require('../channels/telegramChannelRegistry');
const publishingModeManager = require('../mode/publishingModeManager');

class ChannelRouter {
  /**
   * Determine target channel configuration for a publishing package
   * @param {Object} _publishingPackage
   * @returns {Object} Target Telegram channel configuration
   */
  route(_publishingPackage) {
    const mode = publishingModeManager.getMode();
    const activeChannels = telegramChannelRegistry.getChannelsForMode(mode);

    if (activeChannels.length > 0) {
      return activeChannels[0];
    }

    // Default fallback
    return {
      id: 'chan_fallback',
      channelId: process.env.TELEGRAM_CHANNEL_ID || '@crazylootsindia',
      name: 'Fallback Channel',
      priority: 10,
    };
  }
}

module.exports = new ChannelRouter();
