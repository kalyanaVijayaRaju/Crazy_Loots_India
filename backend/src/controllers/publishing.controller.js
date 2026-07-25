const { publishingAppService } = require('../application');
const ResponseDTO = require('../dto/response.dto');

/**
 * Publishing Controller
 * Thin controller for publishing operations
 */
class PublishingController {
  async preparePackage(req, res, next) {
    try {
      const result = await publishingAppService.preparePackage(req.body);
      res.status(200).json(ResponseDTO.success('Publishing package prepared successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async previewMessage(req, res, next) {
    try {
      const result = await publishingAppService.previewMessage(req.body);
      res.status(200).json(ResponseDTO.success('Publishing preview generated successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async publishPackage(req, res, next) {
    try {
      const result = await publishingAppService.publishPackage(req.body);
      res.status(200).json(ResponseDTO.success('Package published successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async retryPublishing(req, res, next) {
    try {
      const result = await publishingAppService.retryPublishing(req.body);
      res.status(200).json(ResponseDTO.success('Publishing retried successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async rollbackPublishing(req, res, next) {
    try {
      const { messageId } = req.body || {};
      const result = await publishingAppService.rollbackPublishing(messageId);
      res.status(200).json(ResponseDTO.success('Publishing rolled back successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async getHistory(req, res, next) {
    try {
      const result = await publishingAppService.getHistory(req.query);
      res.status(200).json(ResponseDTO.paginated('Publishing history retrieved successfully', result.items, result.total, result.page, result.limit));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PublishingController();
