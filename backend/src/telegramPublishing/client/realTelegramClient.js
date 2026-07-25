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
    const env = require('../../config/environment');

    // Attempt direct image buffer upload to bypass Telegram CDN hotlink restriction
    if (photoUrl && typeof photoUrl === 'string' && photoUrl.startsWith('http')) {
      try {
        const imgRes = await fetch(photoUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });
        if (imgRes.ok) {
          const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
          if (contentType.includes('image') || contentType.includes('octet-stream')) {
            const buffer = Buffer.from(await imgRes.arrayBuffer());
            const formData = new FormData();
            formData.append('chat_id', channelId);
            formData.append('caption', caption);
            if (options.parse_mode) {
              formData.append('parse_mode', options.parse_mode);
            }
            const blob = new Blob([buffer], { type: contentType.split(';')[0] });
            formData.append('photo', blob, 'product.jpg');

            const token = env.TELEGRAM_BOT_TOKEN;
            const apiUrl = `https://api.telegram.org/bot${token}/sendPhoto`;
            const resp = await fetch(apiUrl, {
              method: 'POST',
              body: formData,
            });
            const data = await resp.json();
            if (data && data.ok) {
              logger.info(`[RealTelegramClient] Telegram photo delivered successfully to '${channelId}' (Message ID: ${data.result?.message_id}) [Status: 200 OK]`);
              return { ok: true, result: data.result };
            }
            logger.warn(`[RealTelegramClient] Direct photo upload returned non-ok: ${data.description}. Fallback to URL method.`);
          }
        }
      } catch (uploadErr) {
        logger.warn(`[RealTelegramClient] Buffer photo upload skipped due to network error: ${uploadErr.message}`);
      }
    }

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
