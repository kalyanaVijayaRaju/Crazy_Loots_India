const amazonUrlNormalizer = require('./utils/amazonUrlNormalizer');
const amazonAsinExtractor = require('./utils/amazonAsinExtractor');
const amazonUrlValidator = require('./utils/amazonUrlValidator');
const htmlSanitizer = require('./utils/htmlSanitizer');
const domVersionDetector = require('./utils/domVersionDetector');
const AmazonSelectors = require('./selectors/amazon.selectors');
const amazonDomExtractor = require('./extractor/amazonDomExtractor');
const amazonParsers = require('./parser/amazonParsers');
const amazonProductValidator = require('./validators/amazonProductValidator');
const amazonProductMapper = require('./mapper/amazonProductMapper');
const ExtractionResult = require('./results/extractionResult');
const snapshotManager = require('./snapshots/snapshotManager');
const AmazonMetrics = require('./metrics/amazonMetrics');
const amazonHealthService = require('./health/amazonHealthService');
const amazonRetryHandler = require('./retry/amazonRetryHandler');
const amazonPersistenceService = require('./services/amazonPersistenceService');
const fixtureManager = require('./fixtures/fixtureManager');
const mockPlaywrightAdapter = require('./fixtures/mockPlaywrightAdapter');
const testDataFactory = require('./fixtures/testDataFactory');

module.exports = {
  amazonUrlNormalizer,
  amazonAsinExtractor,
  amazonUrlValidator,
  htmlSanitizer,
  domVersionDetector,
  AmazonSelectors,
  amazonDomExtractor,
  ...amazonParsers,
  amazonProductValidator,
  amazonProductMapper,
  ExtractionResult,
  snapshotManager,
  AmazonMetrics,
  amazonHealthService,
  amazonRetryHandler,
  amazonPersistenceService,
  fixtureManager,
  mockPlaywrightAdapter,
  testDataFactory,
};
