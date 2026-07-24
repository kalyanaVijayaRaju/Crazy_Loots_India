const affiliateManager = require('../affiliate/affiliateManager');
const linkResolver = require('../affiliate/linkResolver');
const shortUrlManager = require('../shortening/shortUrlManager');
const imagePipeline = require('../images/imagePipeline');
const messageRenderer = require('../renderer/messageRenderer');
const contentValidator = require('../validation/contentValidator');
const PublishingPackage = require('../package/publishingPackage');
const previewGenerator = require('../preview/previewGenerator');
const metadataGenerator = require('../metadata/metadataGenerator');
const publishingAuditService = require('../audit/publishingAuditService');
const publishingMetrics = require('../metrics/publishingMetrics');
const PublishingEventTypes = require('../events/publishingEventTypes');
const eventBus = require('../../core/events/eventBus');
const idProvider = require('../../core/pipeline/providers/idProvider');
const logger = require('../../utils/logger');

class PublishingPreparationService {
  /**
   * Process an approved deal into a complete PublishingPackage and multi-channel previews
   * @param {Object} deal - Approved Deal document or object
   * @param {Object} product - ProductDTO or document
   * @param {Object} extraSpecs - Additional evaluation specs (comparisonSpec, explanations)
   * @returns {Promise<Object>} { package: PublishingPackage, previews: Object }
   */
  async preparePublishingPackage(deal, product, extraSpecs = {}) {
    const startMs = Date.now();
    const packageId = `pkg_${idProvider.generateTaskId()}`;
    const merchant = product.merchant || deal.merchant || 'amazon';
    const originalUrl = product.productUrl || `https://www.amazon.in/dp/${product.productId}`;

    logger.info(`[PublishingPreparationService] Preparing publishing package '${packageId}' for product '${product.productId || product._id}'`);

    // 1. Generate Affiliate Link
    const affiliateUrl = await affiliateManager.generateLink(originalUrl, merchant);
    await eventBus.emit(PublishingEventTypes.AFFILIATE_LINK_GENERATED, { packageId, affiliateUrl });

    // 2. Shorten URL
    const shortUrl = await shortUrlManager.shorten(affiliateUrl, 'internal');
    await eventBus.emit(PublishingEventTypes.SHORT_URL_GENERATED, { packageId, shortUrl });

    // 3. Resolve links mapping
    const links = linkResolver.resolve(originalUrl, affiliateUrl, shortUrl);

    // 4. Process Images
    const imgStart = Date.now();
    const images = await imagePipeline.processImage(product.image);
    const imgMs = Date.now() - imgStart;

    // 5. Render Messages
    const renderStart = Date.now();
    const renderContext = {
      product,
      deal,
      comparisonSpec: extraSpecs.comparisonSpec || {},
      explanations: extraSpecs.explanations || [],
      shortUrl: links.shortUrl,
      affiliateUrl: links.affiliateUrl,
    };
    const renderedMessages = messageRenderer.renderAll(renderContext);
    const renderMs = Date.now() - renderStart;
    await eventBus.emit(PublishingEventTypes.TEMPLATE_RENDERED, { packageId, templateVersion: '1.0.0' });

    // 6. Validate Content
    const validationResults = contentValidator.validate(deal, product, links.affiliateUrl, renderedMessages);
    await eventBus.emit(PublishingEventTypes.PUBLISHING_PACKAGE_VALIDATED, { packageId, valid: validationResults.valid });

    if (!validationResults.valid) {
      publishingMetrics.recordValidationFailure();
      logger.warn(`[PublishingPreparationService] Package validation failed for '${packageId}': ${validationResults.errors.join(', ')}`);
    }

    // 7. Generate SEO & Analytics Metadata
    const provider = affiliateManager.getProviderForMerchant(merchant);
    const providerName = provider ? provider.getProviderName() : 'generic';
    const seoMetadata = metadataGenerator.generateSeoMetadata(product, deal);
    const analyticsMetadata = metadataGenerator.generateAnalyticsMetadata(product, deal, providerName);
    const publishingMetadata = { merchant, targetChannels: ['telegram', 'website', 'whatsapp', 'push', 'email'] };

    // 8. Construct Immutable PublishingPackage
    const publishingPackage = new PublishingPackage({
      packageId,
      product,
      deal,
      affiliateUrl: links.affiliateUrl,
      shortUrl: links.shortUrl,
      images,
      renderedMessages,
      seoMetadata,
      analyticsMetadata,
      publishingMetadata,
      validationResults,
    });

    await eventBus.emit(PublishingEventTypes.PUBLISHING_PACKAGE_CREATED, { packageId, dealId: deal._id });

    // 9. Generate Previews
    const prevStart = Date.now();
    const previews = previewGenerator.generatePreviews(renderedMessages, images);
    const prevMs = Date.now() - prevStart;
    await eventBus.emit(PublishingEventTypes.PREVIEW_GENERATED, { packageId });

    // 10. Audit & Metrics
    const totalMs = Date.now() - startMs;
    publishingMetrics.recordPackageGenerated(renderMs, imgMs, prevMs);
    publishingAuditService.logAudit({
      packageId,
      dealId: deal._id,
      templateVersion: '1.0.0',
      affiliateProvider: providerName,
      validationPassed: validationResults.valid,
      generationTimeMs: totalMs,
    });

    logger.info(`[PublishingPreparationService] Successfully prepared package '${packageId}' in ${totalMs}ms`);
    return {
      package: publishingPackage,
      previews,
    };
  }
}

module.exports = new PublishingPreparationService();
