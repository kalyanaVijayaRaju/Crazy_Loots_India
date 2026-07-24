const env = require('../config/environment');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');
const { HTTP_STATUS } = require('../constants');

class TelegramClient {
  constructor() {
    this.baseUrl = 'https://api.telegram.org';
    this.timeoutMs = 10000;
  }

  /**
   * Helper to mask Telegram Bot Token in strings/URLs for safe logging.
   * @param {string} text - Input text containing sensitive URLs or tokens
   * @returns {string} Text with bot token masked
   */
  maskToken(text) {
    if (!text || typeof text !== 'string') {
      return text;
    }
    return text.replace(/\/bot[0-9]+:[A-Za-z0-9_-]+/g, '/bot[REDACTED_TOKEN]');
  }

  /**
   * Dispatch raw HTTP POST request to Telegram Bot API.
   * @param {string} endpoint - API method name (e.g. 'sendMessage')
   * @param {object} payload - Telegram payload
   * @returns {Promise<object>} Telegram API result object
   */
  async request(endpoint, payload) {
    const token = env.TELEGRAM_BOT_TOKEN;

    if (!token || token === 'stub_token_for_phase1' || token === 'your_telegram_bot_token_here') {
      const msg = 'Telegram Bot Token is unconfigured or set to placeholder value.';
      logger.warn(`[TelegramClient] ${msg}`);
      throw ApiError.badRequest(msg);
    }

    const url = `${this.baseUrl}/bot${token}/${endpoint}`;
    const safeUrl = this.maskToken(url);
    const startTime = Date.now();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      logger.debug(`[TelegramClient] POST ${safeUrl}`, {
        chat_id: payload.chat_id,
        parse_mode: payload.parse_mode,
      });

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      const durationMs = Date.now() - startTime;
      const data = await response.json();

      if (!response.ok || !data.ok) {
        const errorDesc = data.description || response.statusText || 'Telegram API Error';
        logger.error(
          `[TelegramClient] Request failed (${response.status}) in ${durationMs}ms: ${errorDesc}`,
          {
            error_code: data.error_code,
            description: errorDesc,
          }
        );
        throw new ApiError(
          response.status === 400 ? HTTP_STATUS.BAD_REQUEST : HTTP_STATUS.SERVICE_UNAVAILABLE,
          `Telegram API error: ${errorDesc}`,
          [{ errorCode: data.error_code, description: errorDesc }]
        );
      }

      logger.info(
        `[TelegramClient] Request '${endpoint}' succeeded in ${durationMs}ms (message_id: ${data.result?.message_id})`
      );
      return data.result;
    } catch (error) {
      clearTimeout(timeout);
      const durationMs = Date.now() - startTime;

      if (error.name === 'AbortError') {
        const timeoutMsg = `Telegram API request timed out after ${this.timeoutMs}ms`;
        logger.error(`[TelegramClient] ${timeoutMsg}`);
        throw new ApiError(HTTP_STATUS.SERVICE_UNAVAILABLE, timeoutMsg);
      }

      if (error instanceof ApiError) {
        throw error;
      }

      const maskedErrorMessage = this.maskToken(error.message);
      logger.error(`[TelegramClient] Network / System failure in ${durationMs}ms: ${maskedErrorMessage}`);
      throw new ApiError(
        HTTP_STATUS.SERVICE_UNAVAILABLE,
        `Telegram communication failed: ${maskedErrorMessage}`
      );
    }
  }

  /**
   * Send text message to Telegram channel/chat.
   * @param {string|number} chatId - Target channel ID or chat ID
   * @param {string} text - Message text content
   * @param {object} options - Optional parameters (parse_mode, disable_web_page_preview, etc.)
   */
  async sendMessage(chatId, text, options = {}) {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      throw ApiError.badRequest('Message text must be a non-empty string.');
    }

    const payload = {
      chat_id: chatId,
      text: text,
      disable_web_page_preview: options.disable_web_page_preview ?? false,
      ...(options.parse_mode && { parse_mode: options.parse_mode }),
      ...(options.reply_markup && { reply_markup: options.reply_markup }),
    };

    return this.request('sendMessage', payload);
  }
}

module.exports = new TelegramClient();
