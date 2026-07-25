const { telegramAppService } = require('../application');
const ResponseDTO = require('../dto/response.dto');

/**
 * Telegram Controller
 * Thin controller for Telegram bot interactions & broadcasts
 */
class TelegramController {
  async sendTestMessage(req, res, next) {
    try {
      const result = await telegramAppService.sendTestMessage(req.body);
      res.status(200).json(ResponseDTO.success('Test message processed', result));
    } catch (error) {
      next(error);
    }
  }

  async runDryRun(req, res, next) {
    try {
      const result = await telegramAppService.runDryRunBroadcast(req.body);
      res.status(200).json(ResponseDTO.success('Dry run broadcast executed', result));
    } catch (error) {
      next(error);
    }
  }

  async getChannels(req, res, next) {
    try {
      const result = await telegramAppService.getChannels();
      res.status(200).json(ResponseDTO.success('Channels list retrieved', result));
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const result = await telegramAppService.getTelegramHistory(req.query);
      res.status(200).json(ResponseDTO.paginated('Telegram history retrieved', result.items, result.total, result.page, result.limit));
    } catch (error) {
      next(error);
    }
  }

  // Backwards compatible method
  async sendTelegramMessage(req, res, next) {
    return this.sendTestMessage(req, res, next);
  }
}

module.exports = new TelegramController();
