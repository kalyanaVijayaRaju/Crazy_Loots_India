const PublishingEventTypes = require('./events/publishingEventTypes');
const AffiliateProviderInterface = require('./affiliate/affiliateProvider.interface');
const AmazonAssociatesProvider = require('./providers/amazonAssociatesProvider');
const AdmitadProvider = require('./providers/admitadProvider');
const CuelinksProvider = require('./providers/cuelinksProvider');
const EarnKaroProvider = require('./providers/earnKaroProvider');
const ImpactProvider = require('./providers/impactProvider');
const affiliateManager = require('./affiliate/affiliateManager');
const linkResolver = require('./affiliate/linkResolver');
const ShortUrlProviderInterface = require('./shortening/shortUrlProvider.interface');
const BitlyProvider = require('./shortening/bitlyProvider');
const TinyUrlProvider = require('./shortening/tinyUrlProvider');
const InternalShortenerProvider = require('./shortening/internalShortenerProvider');
const shortUrlManager = require('./shortening/shortUrlManager');
const imagePipeline = require('./images/imagePipeline');
const templateRegistry = require('./templates/templateRegistry');
const messageRenderer = require('./renderer/messageRenderer');
const contentValidator = require('./validation/contentValidator');
const PublishingPackage = require('./package/publishingPackage');
const previewGenerator = require('./preview/previewGenerator');
const metadataGenerator = require('./metadata/metadataGenerator');
const publishingAuditService = require('./audit/publishingAuditService');
const publishingMetrics = require('./metrics/publishingMetrics');
const publishingContracts = require('./contracts/publishingContracts');
const publishingPreparationService = require('./services/publishingPreparationService');

module.exports = {
  PublishingEventTypes,
  AffiliateProviderInterface,
  AmazonAssociatesProvider,
  AdmitadProvider,
  CuelinksProvider,
  EarnKaroProvider,
  ImpactProvider,
  affiliateManager,
  linkResolver,
  ShortUrlProviderInterface,
  BitlyProvider,
  TinyUrlProvider,
  InternalShortenerProvider,
  shortUrlManager,
  imagePipeline,
  templateRegistry,
  messageRenderer,
  contentValidator,
  PublishingPackage,
  previewGenerator,
  metadataGenerator,
  publishingAuditService,
  publishingMetrics,
  publishingContracts,
  publishingPreparationService,
};
