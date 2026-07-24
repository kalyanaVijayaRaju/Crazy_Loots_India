const telegramClient = require('./telegramClient');
const templates = require('./telegramTemplates');
const env = require('../config/environment');
const logger = require('../utils/logger');
const ApiError = require('../utils/ApiError');

class TelegramService {
  constructor() {
    this.channelId = env.TELEGRAM_CHANNEL_ID;
  }

  /**
   * Send plain text or custom formatted message to configured Telegram channel.
   * @param {string} text - Message text
   * @param {string} [parseMode] - Optional parse mode ('Markdown' | 'HTML' | null)
   * @returns {Promise<object>} Telegram response payload
   */
  async sendMessage(text, parseMode = null) {
    if (!text || typeof text !== 'string' || text.trim() === '') {
      throw ApiError.badRequest('Message text is required and must be a non-empty string.');
    }

    const options = {};
    if (parseMode) {
      options.parse_mode = parseMode;
    }

    logger.info(`[TelegramService] Broadcasting message to channel ${this.channelId}`);
    return telegramClient.sendMessage(this.channelId, text, options);
  }

  /**
   * Send Markdown-formatted message to configured Telegram channel.
   * @param {string} markdownText - Markdown message content
   * @returns {Promise<object>} Telegram response payload
   */
  async sendMarkdown(markdownText) {
    return this.sendMessage(markdownText, 'Markdown');
  }

  /**
   * Automatically broadcast backend startup alert on server startup.
   * Catches errors gracefully to guarantee server startup is never blocked or crashed.
   */
  async sendStartupMessage() {
    try {
      const startupText = templates.formatStartupMessage({
        appName: env.APP_NAME,
        environment: env.NODE_ENV,
        timestamp: new Date().toISOString(),
      });

      logger.info('[TelegramService] Dispatching backend startup notification to Telegram channel...');
      const result = await this.sendMarkdown(startupText);
      logger.info(`[TelegramService] Startup notification delivered (message_id: ${result?.message_id})`);
      return result;
    } catch (error) {
      logger.warn(
        `[TelegramService] Startup notification failed: ${error.message}. Server execution continues unaffected.`
      );
      return null;
    }
  }

  /**
   * [Placeholder for Phase 3] Publish E-Commerce Loot Deal to Telegram Channel
   * @param {object} dealData - Deal parameters (title, price, affiliate link, etc.)
   */
  async sendDeal(dealData) {
    logger.info('[TelegramService] sendDeal called (Phase 3 placeholder)');
    if (!dealData || !dealData.title) {
      throw ApiError.badRequest('Invalid dealData payload.');
    }
    const message = templates.formatDealMessage(dealData);
    return this.sendMarkdown(message);
  }

  /**
   * [Placeholder for Phase 3] Publish E-Commerce Coupon Alert to Telegram Channel
   * @param {object} couponData - Coupon parameters (code, description, store, etc.)
   */
  async sendCoupon(couponData) {
    logger.info('[TelegramService] sendCoupon called (Phase 3 placeholder)');
    if (!couponData || !couponData.code) {
      throw ApiError.badRequest('Invalid couponData payload.');
    }
    const message = templates.formatCouponMessage(couponData);
    return this.sendMarkdown(message);
  }
}

module.exports = new TelegramService();
