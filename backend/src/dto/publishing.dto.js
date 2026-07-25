/**
 * Publishing DTO Schemas
 */
class PublishingDTO {
  static validatePrepare(req) {
    const { dealId, productId } = req.body || {};
    const errors = [];

    if (!dealId && !productId) {
      errors.push('Either "dealId" or "productId" is required');
    }

    return { error: errors.length ? errors : null, value: req.body };
  }

  static validatePublish(req) {
    const { packageId } = req.body || {};
    const errors = [];

    if (!packageId) {
      errors.push('"packageId" is required');
    }

    return { error: errors.length ? errors : null, value: req.body };
  }
}

module.exports = PublishingDTO;
