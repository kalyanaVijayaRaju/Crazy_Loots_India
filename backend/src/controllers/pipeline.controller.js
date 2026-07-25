const { pipelineAppService } = require('../application');
const ResponseDTO = require('../dto/response.dto');

/**
 * Pipeline Controller
 * Thin controller delegating execution to PipelineAppService
 */
class PipelineController {
  async runPipeline(req, res, next) {
    try {
      const { url, options, forcePublish, mockHistory } = req.body;
      const pipelineOptions = options || { forcePublish, mockHistory };
      const result = await pipelineAppService.runPipeline(url, pipelineOptions);
      res.status(200).json(ResponseDTO.success('Pipeline execution completed successfully', result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PipelineController();
