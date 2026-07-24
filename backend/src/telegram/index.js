const logger = require('../utils/logger');
const env = require('../config/environment');

/**
 * Telegram Bot Module Stub (Prewired for Phase 2 Telegram Bot Integration)
 */
const initTelegramBot = () => {
  logger.info(
    `[Telegram Module Initialized Stub] Ready for Bot API integration with Channel: ${env.TELEGRAM_CHANNEL_ID}`
  );
  return {
    isReady: false,
    channelId: env.TELEGRAM_CHANNEL_ID,
  };
};

module.exports = {
  initTelegramBot,
};
