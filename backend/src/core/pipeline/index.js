const { PipelineStage, PipelineInterface } = require('./interfaces/pipeline.interface');
const PipelineMiddleware = require('./interfaces/middleware.interface');
const PolicyInterface = require('./interfaces/policy.interface');
const ProviderInterface = require('./interfaces/provider.interface');
const PluginInterface = require('./interfaces/plugin.interface');

const PipelineEventTypes = require('./contracts/pipelineEvents');
const featureFlagManager = require('./featureFlags/featureFlagManager');

const timeProvider = require('./providers/timeProvider');
const clockProvider = require('./providers/clockProvider');
const idProvider = require('./providers/idProvider');
const randomProvider = require('./providers/randomProvider');
const hashProvider = require('./providers/hashProvider');
const environmentProvider = require('./providers/environmentProvider');
const configurationProvider = require('./providers/configurationProvider');

const MonitoringTask = require('./tasks/monitoringTask');
const MonitoringResult = require('./results/monitoringResult');

const RetryPolicy = require('./policies/retryPolicy');
const PriorityPolicy = require('./policies/priorityPolicy');
const SchedulingPolicy = require('./policies/schedulingPolicy');
const DuplicatePolicy = require('./policies/duplicatePolicy');
const MerchantSelectionPolicy = require('./policies/merchantSelectionPolicy');
const TimeoutPolicy = require('./policies/timeoutPolicy');
const FeatureFlagPolicy = require('./policies/featureFlagPolicy');

const ValidationMiddleware = require('./middleware/validationMiddleware');
const StateMiddleware = require('./middleware/stateMiddleware');
const DuplicateCheckMiddleware = require('./middleware/duplicateCheckMiddleware');
const MerchantResolutionMiddleware = require('./middleware/merchantResolutionMiddleware');
const PriorityAssignmentMiddleware = require('./middleware/priorityAssignmentMiddleware');
const PolicyMiddleware = require('./middleware/policyMiddleware');
const LoggingMiddleware = require('./middleware/loggingMiddleware');
const ContextMiddleware = require('./middleware/contextMiddleware');

const PipelineCoordinator = require('./coordinator/pipelineCoordinator');

const PlaywrightPlugin = require('./plugins/playwrightPlugin');
const TelegramPlugin = require('./plugins/telegramPlugin');
const AffiliatePlugin = require('./plugins/affiliatePlugin');
const AnalyticsPlugin = require('./plugins/analyticsPlugin');
const AIScoringPlugin = require('./plugins/aiScoringPlugin');

module.exports = {
  PipelineStage,
  PipelineInterface,
  PipelineMiddleware,
  PolicyInterface,
  ProviderInterface,
  PluginInterface,
  PipelineEventTypes,
  featureFlagManager,
  timeProvider,
  clockProvider,
  idProvider,
  randomProvider,
  hashProvider,
  environmentProvider,
  configurationProvider,
  MonitoringTask,
  MonitoringResult,
  RetryPolicy,
  PriorityPolicy,
  SchedulingPolicy,
  DuplicatePolicy,
  MerchantSelectionPolicy,
  TimeoutPolicy,
  FeatureFlagPolicy,
  ValidationMiddleware,
  StateMiddleware,
  DuplicateCheckMiddleware,
  MerchantResolutionMiddleware,
  PriorityAssignmentMiddleware,
  PolicyMiddleware,
  LoggingMiddleware,
  ContextMiddleware,
  PipelineCoordinator,
  PlaywrightPlugin,
  TelegramPlugin,
  AffiliatePlugin,
  AnalyticsPlugin,
  AIScoringPlugin,
};
