const { systemAppService } = require('../application');
const ResponseDTO = require('../dto/response.dto');

/**
 * System Controller
 * Thin controller for system information endpoints
 */
class SystemController {
  async getStatus(req, res, next) {
    try {
      const result = await systemAppService.getStatus();
      res.status(200).json(ResponseDTO.success('System status retrieved', result));
    } catch (error) {
      next(error);
    }
  }

  async getVersion(req, res, next) {
    try {
      const result = await systemAppService.getVersion();
      res.status(200).json(ResponseDTO.success('System version retrieved', result));
    } catch (error) {
      next(error);
    }
  }

  async getConfiguration(req, res, next) {
    try {
      const result = await systemAppService.getConfiguration();
      res.status(200).json(ResponseDTO.success('System configuration retrieved', result));
    } catch (error) {
      next(error);
    }
  }

  async getFeatureFlags(req, res, next) {
    try {
      const result = await systemAppService.getFeatureFlags();
      res.status(200).json(ResponseDTO.success('Feature flags retrieved', result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SystemController();
