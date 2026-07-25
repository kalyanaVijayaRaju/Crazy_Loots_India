/**
 * Product DTO Schema and Validator
 */
class ProductDTO {
  static validateCreate(req) {
    const { url, asin, title, currentPrice } = req.body || {};
    const errors = [];

    if (!url && !asin) {
      errors.push('Either "url" or "asin" must be provided');
    }
    if (currentPrice !== undefined && (typeof currentPrice !== 'number' || currentPrice < 0)) {
      errors.push('"currentPrice" must be a non-negative number');
    }

    return { error: errors.length ? errors : null, value: req.body };
  }

  static validateUpdate(req) {
    const { title, currentPrice, rating } = req.body || {};
    const errors = [];

    if (currentPrice !== undefined && (typeof currentPrice !== 'number' || currentPrice < 0)) {
      errors.push('"currentPrice" must be a non-negative number');
    }
    if (rating !== undefined && (typeof rating !== 'number' || rating < 0 || rating > 5)) {
      errors.push('"rating" must be a number between 0 and 5');
    }

    return { error: errors.length ? errors : null, value: req.body };
  }
}

module.exports = ProductDTO;
