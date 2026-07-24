const logger = require('../../../utils/logger');

class DOMVersionDetector {
  detectVersion(html) {
    if (!html || typeof html !== 'string') {
      return 'UNKNOWN';
    }

    if (html.includes('id="productTitle"') && html.includes('id="corePrice_feature_div"')) {
      return 'AMAZON_DESKTOP_V2';
    }

    if (html.includes('id="productTitle"') && html.includes('class="a-price"')) {
      return 'AMAZON_DESKTOP_V1';
    }

    if (html.includes('id="vtps-product-title"')) {
      return 'AMAZON_MOBILE_V1';
    }

    logger.warn('[DOMVersionDetector] Unrecognized Amazon DOM layout detected.');
    return 'AMAZON_UNKNOWN_LAYOUT';
  }
}

module.exports = new DOMVersionDetector();
