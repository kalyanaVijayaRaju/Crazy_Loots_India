const { dealAppService } = require('../application');
const ResponseDTO = require('../dto/response.dto');

/**
 * Deal Controller
 * Thin controller for deals operations
 */
class DealController {
  async getDeals(req, res, next) {
    try {
      const result = await dealAppService.listDeals(req.query);
      res.status(200).json(ResponseDTO.paginated('Deals retrieved successfully', result.items, result.total, result.page, result.limit));
    } catch (error) {
      next(error);
    }
  }

  async getDealById(req, res, next) {
    try {
      const deal = await dealAppService.getDealById(req.params.id);
      res.status(200).json(ResponseDTO.success('Deal retrieved successfully', deal));
    } catch (error) {
      next(error);
    }
  }

  async detectDeal(req, res, next) {
    try {
      const result = await dealAppService.detectDealForProduct(req.params.id);
      res.status(200).json(ResponseDTO.success('Deal detection executed', result));
    } catch (error) {
      next(error);
    }
  }

  async approveDeal(req, res, next) {
    try {
      const result = await dealAppService.approveDeal(req.params.id);
      res.status(200).json(ResponseDTO.success('Deal approved successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async rejectDeal(req, res, next) {
    try {
      const result = await dealAppService.rejectDeal(req.params.id, req.body ? req.body.reason : undefined);
      res.status(200).json(ResponseDTO.success('Deal rejected successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async replayDeal(req, res, next) {
    try {
      const result = await dealAppService.replayDeal(req.params.id);
      res.status(200).json(ResponseDTO.success('Deal replayed successfully', result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DealController();
