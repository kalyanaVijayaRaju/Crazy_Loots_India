const { affiliateAppService } = require('../application');
const ResponseDTO = require('../dto/response.dto');

/**
 * Affiliate Controller
 * Thin controller for affiliate link generation & providers
 */
class AffiliateController {
  async generateLink(req, res, next) {
    try {
      const result = await affiliateAppService.generateAffiliateLink(req.body);
      res.status(200).json(ResponseDTO.success('Affiliate link generated successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async getProviders(req, res, next) {
    try {
      const result = await affiliateAppService.getProviders();
      res.status(200).json(ResponseDTO.success('Affiliate providers retrieved', result));
    } catch (error) {
      next(error);
    }
  }

  async getStatus(req, res, next) {
    try {
      const result = await affiliateAppService.getStatus();
      res.status(200).json(ResponseDTO.success('Affiliate system status retrieved', result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AffiliateController();
