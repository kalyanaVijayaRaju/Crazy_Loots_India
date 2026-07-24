const DealEventTypes = require('./events/dealEventTypes');
const historicalPriceAnalyzer = require('./analyzer/historicalPriceAnalyzer');
const trendAnalyzer = require('./trends/trendAnalyzer');
const priceComparisonSpec = require('./specifications/priceComparisonSpec');
const ruleRegistry = require('./rules/ruleRegistry');
const ruleVersionManager = require('./rules/ruleVersionManager');
const ruleEngine = require('./rules/ruleEngine');
const ruleSimulator = require('./simulation/ruleSimulator');
const dealDuplicateChecker = require('./duplicate/dealDuplicateChecker');
const dealCooldownManager = require('./cooldown/dealCooldownManager');
const dealClassifier = require('./classification/dealClassifier');
const dealScoreEngine = require('./scoring/dealScoreEngine');
const dealConfidenceEngine = require('./confidence/dealConfidenceEngine');
const dealExplainabilityEngine = require('./explainability/dealExplainabilityEngine');
const dealApprovalQueueService = require('./approval/dealApprovalQueueService');
const recommendationService = require('./recommendations/recommendationService');
const falsePositiveTracker = require('./metrics/falsePositiveTracker');
const dealMetrics = require('./metrics/dealMetrics');
const dealDetectionReportGenerator = require('./reports/dealDetectionReportGenerator');
const dealDetectionEngine = require('./services/dealDetectionEngine');

module.exports = {
  DealEventTypes,
  historicalPriceAnalyzer,
  trendAnalyzer,
  priceComparisonSpec,
  ruleRegistry,
  ruleVersionManager,
  ruleEngine,
  ruleSimulator,
  dealDuplicateChecker,
  dealCooldownManager,
  dealClassifier,
  dealScoreEngine,
  dealConfidenceEngine,
  dealExplainabilityEngine,
  dealApprovalQueueService,
  recommendationService,
  falsePositiveTracker,
  dealMetrics,
  dealDetectionReportGenerator,
  dealDetectionEngine,
};
