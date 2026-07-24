const { merchantFactory } = require('../../../merchants');
const logger = require('../../../utils/logger');

class MerchantDispatcher {
  constructor() {
    this.factory = merchantFactory;
  }

  /**
   * Dispatch merchant lookup and return adapter
   * @param {string} merchantName
   * @returns {MerchantAdapter}
   */
  dispatch(merchantName) {
    if (!merchantName || typeof merchantName !== 'string') {
      throw new Error('MerchantDispatcher requires a valid merchantName string.');
    }
    const cleanName = merchantName.toLowerCase().trim();
    logger.debug(`[MerchantDispatcher] Resolving merchant adapter for '${cleanName}'`);
    return this.factory.getAdapter(cleanName);
  }

  /**
   * Resolve adapter by raw URL pattern
   * @param {string} url
   * @returns {MerchantAdapter}
   */
  dispatchByUrl(url) {
    logger.debug(`[MerchantDispatcher] Resolving merchant adapter for URL pattern`);
    return this.factory.getAdapterByUrl(url);
  }
}

module.exports = new MerchantDispatcher();
