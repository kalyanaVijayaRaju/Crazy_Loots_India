const { merchantRepository, categoryRepository } = require('../../repositories');
const { merchantFactory } = require('../../merchants');
const telegramChannelRegistry = require('../../telegramPublishing/channels/telegramChannelRegistry');
const publishingModeManager = require('../../telegramPublishing/mode/publishingModeManager');
const featureFlags = require('../../telegramPublishing/mode/featureFlags');
const mongoose = require('mongoose');
const logger = require('../../utils/logger');

class SeederService {
  async seedAll() {
    logger.info('[SeederService] Seeding default platform records...');

    // 1. Seed merchant adapters & MongoDB records
    try {
      merchantFactory.getAdapter('amazon');
      if (mongoose.connection.readyState === 1) {
        await merchantRepository.findOrCreateBySlug('amazon', 'Amazon India', 'https://www.amazon.in');
        await categoryRepository.findOrCreateBySlug('electronics', 'Electronics');
      }
    } catch (e) {
      logger.warn(`[SeederService] Default merchant/category seed warning: ${e.message}`);
    }

    // 2. Seed default channels
    telegramChannelRegistry.registerChannel({
      id: 'chan_seed_main',
      channelId: process.env.TELEGRAM_CHANNEL_ID || '@crazylootsindia',
      name: 'Crazy Loots Main Channel',
      priority: 100,
      mode: 'LIVE',
      status: 'ACTIVE',
    });

    // 3. Seed publishing mode
    publishingModeManager.setMode('DRY_RUN');

    // 4. Seed feature flags
    featureFlags.setFlag('ENABLE_DRY_RUN', true);
    featureFlags.setFlag('ENABLE_SANDBOX', true);

    logger.info('[SeederService] Default platform seeding completed.');
    return { seeded: true };
  }
}

module.exports = new SeederService();
