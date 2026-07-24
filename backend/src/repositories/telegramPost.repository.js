const BaseRepository = require('./base.repository');
const TelegramPost = require('../models/telegramPost.model');

class TelegramPostRepository extends BaseRepository {
  constructor() {
    super(TelegramPost);
  }

  async findByTelegramMessageId(telegramMessageId, channelId) {
    return this.findOne({ telegramMessageId, channelId });
  }

  async findByDealId(dealId) {
    return this.findOne({ deal: dealId });
  }
}

module.exports = new TelegramPostRepository();
