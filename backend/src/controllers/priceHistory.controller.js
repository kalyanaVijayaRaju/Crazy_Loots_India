const { priceHistoryAppService } = require('../application');
const ResponseDTO = require('../dto/response.dto');

/**
 * Price History Controller
 * Thin controller for price history & statistics endpoints
 */
class PriceHistoryController {
  async getProductPrices(req, res, next) {
    try {
      const result = await priceHistoryAppService.getProductPrices(req.params.id);
      res.status(200).json(ResponseDTO.success('Price history retrieved successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async getProductStatistics(req, res, next) {
    try {
      const result = await priceHistoryAppService.getProductStatistics(req.params.id);
      res.status(200).json(ResponseDTO.success('Price statistics calculated successfully', result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PriceHistoryController();
