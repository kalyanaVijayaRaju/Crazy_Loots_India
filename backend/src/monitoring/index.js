const MonitoringEventTypes = require('./events/monitoringEventTypes');
const priceComparisonService = require('./comparison/priceComparisonService');
const productChangeDetector = require('./detector/productChangeDetector');
const monitoringLockManager = require('./locks/monitoringLockManager');
const pausePolicy = require('./policies/pausePolicy');
const cooldownPolicy = require('./policies/cooldownPolicy');
const failurePolicy = require('./policies/failurePolicy');
const monitoringHistoryService = require('./history/monitoringHistoryService');
const monitoringReportGenerator = require('./reports/monitoringReportGenerator');
const monitoringMetrics = require('./metrics/monitoringMetrics');
const monitoringConfigurationService = require('./configuration/monitoringConfiguration.service');
const productMonitoringService = require('./services/productMonitoringService');

module.exports = {
  MonitoringEventTypes,
  priceComparisonService,
  productChangeDetector,
  monitoringLockManager,
  pausePolicy,
  cooldownPolicy,
  failurePolicy,
  monitoringHistoryService,
  monitoringReportGenerator,
  monitoringMetrics,
  monitoringConfigurationService,
  productMonitoringService,
};
