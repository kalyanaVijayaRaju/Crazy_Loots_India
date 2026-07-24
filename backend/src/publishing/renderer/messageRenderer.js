const templateRegistry = require('../templates/templateRegistry');
const logger = require('../../utils/logger');

class MessageRenderer {
  /**
   * Render channel-specific messages from deal context
   * @param {Object} context - { product, deal, comparisonSpec, explanations, shortUrl }
   * @returns {Object} Rendered messages mapping { telegram, website, whatsapp, push, email }
   */
  renderAll(context) {
    logger.debug('[MessageRenderer] Rendering multi-channel messages...');
    return {
      telegram: templateRegistry.getTemplate('telegram').render(context),
      website: templateRegistry.getTemplate('website').render(context),
      whatsapp: templateRegistry.getTemplate('whatsapp').render(context),
      push: templateRegistry.getTemplate('push').render(context),
      email: templateRegistry.getTemplate('email').render(context),
    };
  }
}

module.exports = new MessageRenderer();
