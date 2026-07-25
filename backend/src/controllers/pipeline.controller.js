const { pipelineAppService } = require('../application');
const ResponseDTO = require('../dto/response.dto');

/**
 * Pipeline Controller
 * Thin controller delegating execution to PipelineAppService
 */
class PipelineController {
  async runPipeline(req, res, next) {
    try {
      const { url } = req.body;
      const result = await pipelineAppService.runPipeline(url);
      res.status(200).json(ResponseDTO.success('Pipeline execution completed successfully', result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PipelineController();
