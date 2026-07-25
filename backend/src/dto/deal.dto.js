/**
 * Deal DTO Schemas
 */
class DealDTO {
  static validateAction(req) {
    const { reason } = req.body || {};
    const errors = [];

    if (reason && typeof reason !== 'string') {
      errors.push('"reason" must be a string');
    }

    return { error: errors.length ? errors : null, value: req.body };
  }
}

module.exports = DealDTO;
