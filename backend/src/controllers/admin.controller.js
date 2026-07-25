const { adminAppService } = require('../application');
const ResponseDTO = require('../dto/response.dto');

/**
 * Admin Controller
 * Thin controller for admin maintenance endpoints
 */
class AdminController {
  async seedData(req, res, next) {
    try {
      const result = await adminAppService.seedData();
      res.status(200).json(ResponseDTO.success('Database seeded successfully', result));
    } catch (error) {
      next(error);
    }
  }

  async resetData(req, res, next) {
    try {
      const result = await adminAppService.resetData();
      res.status(200).json(ResponseDTO.success('Database reset completed', result));
    } catch (error) {
      next(error);
    }
  }

  async reindexData(req, res, next) {
    try {
      const result = await adminAppService.reindexData();
      res.status(200).json(ResponseDTO.success('Database indexes resynced', result));
    } catch (error) {
      next(error);
    }
  }

  async replayExecution(req, res, next) {
    try {
      const { executionId } = req.body || {};
      const result = await adminAppService.replayExecution(executionId);
      res.status(200).json(ResponseDTO.success('Execution replayed', result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminController();
