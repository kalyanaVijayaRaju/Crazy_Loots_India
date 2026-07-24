const TelegramClientInterface = require('./telegramClient.interface');
const telegramClient = require('../../telegram/telegramClient');
const logger = require('../../utils/logger');

class RealTelegramClient extends TelegramClientInterface {
  constructor() {
    super('real_telegram_client');
  }

  async sendMessage(channelId, text, options = {}) {
    logger.info(`[RealTelegramClient] Sending LIVE message to channel '${channelId}'`);
    const result = await telegramClient.sendMessage(channelId, text, options);
    return { ok: true, result };
  }

  async editMessage(channelId, messageId, text, options = {}) {
    logger.info(`[RealTelegramClient] Editing LIVE message ${messageId} on channel '${channelId}'`);
    const payload = {
      chat_id: channelId,
      message_id: messageId,
      text,
      ...(options.parse_mode && { parse_mode: options.parse_mode }),
    };
    const result = await telegramClient.request('editMessageText', payload);
    return { ok: true, result };
  }

  async deleteMessage(channelId, messageId) {
    logger.info(`[RealTelegramClient] Deleting LIVE message ${messageId} on channel '${channelId}'`);
    const payload = {
      chat_id: channelId,
      message_id: messageId,
    };
    const result = await telegramClient.request('deleteMessage', payload);
    return { ok: true, result };
  }

  async sendPhoto(channelId, photoUrl, caption = '', options = {}) {
    logger.info(`[RealTelegramClient] Sending LIVE photo to channel '${channelId}'`);
    const payload = {
      chat_id: channelId,
      photo: photoUrl,
      caption,
      ...(options.parse_mode && { parse_mode: options.parse_mode }),
    };
    const result = await telegramClient.request('sendPhoto', payload);
    return { ok: true, result };
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
