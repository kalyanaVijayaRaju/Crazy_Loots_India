/**
 * Pipeline DTO Schemas
 */
class PipelineDTO {
  static validateRun(req) {
    const { url } = req.body || {};
    const errors = [];

    if (!url) {
      errors.push('"url" is required');
    } else if (typeof url !== 'string' || (!url.includes('amazon') && !url.includes('amzn'))) {
      errors.push('"url" must be a valid Amazon product URL');
    }

    return { error: errors.length ? errors : null, value: req.body };
  }
}

module.exports = PipelineDTO;
