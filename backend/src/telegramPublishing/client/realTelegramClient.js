const TelegramClientInterface = require('./telegramClient.interface');
const telegramClient = require('../../telegram/telegramClient');
const logger = require('../../utils/logger');

class RealTelegramClient extends TelegramClientInterface {
  constructor() {
    super('real_telegram_client');
  }

  async sendMessage(channelId, text, options = {}) {
    logger.info(`[RealTelegramClient] Dispatching Telegram message to channel '${channelId}' (API Method: sendMessage)`);
    const payload = {
      chat_id: channelId,
      text,
      ...(options.parse_mode && { parse_mode: options.parse_mode }),
    };
    try {
      const result = await telegramClient.request('sendMessage', payload);
      logger.info(`[RealTelegramClient] Telegram message delivered to '${channelId}' (Message ID: ${result?.message_id})`);
      return { ok: true, result };
    } catch (err) {
      logger.error(`[RealTelegramClient] Telegram sendMessage failed for '${channelId}': ${err.message}`);
      throw err;
    }
  }

  async editMessage(channelId, messageId, text, options = {}) {
    logger.info(`[RealTelegramClient] Editing Telegram message ${messageId} on channel '${channelId}' (API Method: editMessageText)`);
    const payload = {
      chat_id: channelId,
      message_id: messageId,
      text,
      ...(options.parse_mode && { parse_mode: options.parse_mode }),
    };
    try {
      const result = await telegramClient.request('editMessageText', payload);
      return { ok: true, result };
    } catch (err) {
      logger.error(`[RealTelegramClient] Telegram editMessageText failed: ${err.message}`);
      throw err;
    }
  }

  async deleteMessage(channelId, messageId) {
    logger.info(`[RealTelegramClient] Deleting Telegram message ${messageId} on channel '${channelId}' (API Method: deleteMessage)`);
    const payload = {
      chat_id: channelId,
      message_id: messageId,
    };
    try {
      const result = await telegramClient.request('deleteMessage', payload);
      return { ok: true, result };
    } catch (err) {
      logger.error(`[RealTelegramClient] Telegram deleteMessage failed: ${err.message}`);
      throw err;
    }
  }

  async sendPhoto(channelId, photoUrl, caption = '', options = {}) {
    logger.info(`[RealTelegramClient] Dispatching Telegram photo to channel '${channelId}' (API Method: sendPhoto)`);
    const payload = {
      chat_id: channelId,
      photo: photoUrl,
      caption,
      ...(options.parse_mode && { parse_mode: options.parse_mode }),
    };
    try {
      const result = await telegramClient.request('sendPhoto', payload);
      logger.info(`[RealTelegramClient] Telegram photo delivered to '${channelId}' (Message ID: ${result?.message_id})`);
      return { ok: true, result };
    } catch (err) {
      logger.warn(`[RealTelegramClient] Telegram sendPhoto failed for '${channelId}': ${err.message}.`);
      throw err;
    }
  }

  async sendMediaGroup(channelId, mediaArray = [], options = {}) {
    logger.info(`[RealTelegramClient] Sending LIVE media group to channel '${channelId}'`);
    const payload = {
      chat_id: channelId,
      media: mediaArray,
      ...options,
    };
    const result = await telegramClient.request('sendMediaGroup', payload);
    return { ok: true, result };
  }

  async healthCheck() {
    return { status: 'HEALTHY', client: this.name };
  }
}

module.exports = RealTelegramClient;
