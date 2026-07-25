const mongoose = require('mongoose');
const { telegramService } = require('../telegram');
const { publishingModeManager, telegramHealthService } = require('../telegramPublishing');
const TelegramPostRepository = require('../repositories/telegramPost.repository');

/**
 * Telegram Application Service
 * Manages test messaging, dry-run broadcasts, channel listing, and post history
 */
class TelegramAppService {
  async sendTestMessage(data = {}) {
    const text = data.text || '🔥 *Crazy Loots India* Test Notification';
    let result;

    try {
      result = await telegramService.sendMessage(text);
    } catch (err) {
      // Graceful fallback when Telegram token is unconfigured or in test mode
      result = {
        success: false,
        simulated: true,
        message: err.message || 'Telegram service unavailable',
        text,
      };
    }

    return {
      text,
      result,
      mode: publishingModeManager.getMode(),
      timestamp: new Date().toISOString(),
    };
  }

  async runDryRunBroadcast(data = {}) {
    const text = data.text || '🛍️ [DRY_RUN] Loot Deal Notification Test';
    const currentMode = publishingModeManager.getMode();

    return {
      text,
      mode: currentMode,
      dryRunExecuted: true,
      result: {
        success: true,
        channelId: process.env.TELEGRAM_CHANNEL_ID || '@CrazyLootsIndia',
        message: text,
        mode: 'DRY_RUN',
      },
    };
  }

  async getChannels() {
    const health = await telegramHealthService.getHealthStatus();

    return {
      channels: [
        {
          id: process.env.TELEGRAM_CHANNEL_ID || '@CrazyLootsIndia',
          title: 'Crazy Loots India Channel',
          type: 'channel',
          status: health.connected ? 'ONLINE' : 'OFFLINE',
        },
      ],
      health,
    };
  }

  async getTelegramHistory(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;

    if (mongoose.connection.readyState === 1) {
      const result = await TelegramPostRepository.paginate({}, {
        page,
        limit,
        sort: { createdAt: -1 },
      });

      return {
        items: result.docs,
        total: result.totalDocs,
        page,
        limit,
      };
    }

    return {
      items: [
        { id: 'post_1', messageId: 101, status: 'PUBLISHED', mode: 'DRY_RUN', publishedAt: new Date().toISOString() },
      ],
      total: 1,
      page,
      limit,
    };
  }
}

module.exports = new TelegramAppService();
