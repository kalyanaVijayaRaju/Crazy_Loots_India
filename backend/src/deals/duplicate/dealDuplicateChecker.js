const { dealRepository } = require('../../repositories');
const logger = require('../../utils/logger');

class DealDuplicateChecker {
  /**
   * Check if an active deal already exists for this product within window
   * @param {string} productId
   * @param {number} windowHours - Default 12 hours
   * @returns {Promise<boolean>} true if duplicate exists
   */
  async isDuplicate(productId, windowHours = 12) {
    if (!productId) {
      return false;
    }
    const cutoff = new Date(Date.now() - windowHours * 3600 * 1000);
    const existing = await dealRepository.findOne({
      product: productId,
      createdAt: { $gte: cutoff },
    });

    if (existing) {
      logger.debug(`[DealDuplicateChecker] Duplicate deal found for product '${productId}' within ${windowHours}h window`);
      return true;
    }
    return false;
  }
}

module.exports = new DealDuplicateChecker();
