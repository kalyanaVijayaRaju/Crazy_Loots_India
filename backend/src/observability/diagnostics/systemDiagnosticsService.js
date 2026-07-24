const logger = require('../../utils/logger');
const healthCheckService = require('../health/healthCheckService');
const circuitBreakerRegistry = require('../circuitBreaker/circuitBreakerRegistry');
const metricsAggregator = require('../metrics/metricsAggregator');

/**
 * SystemDiagnosticsService
 *
 * Generates comprehensive diagnostic reports:
 * - Configuration report
 * - Dependency report
 * - Health report
 * - Version report
 * - Performance report
 */
class SystemDiagnosticsService {
  /**
   * Generate a full diagnostics bundle
   * @returns {Promise<Object>}
   */
  async generateFullDiagnostics() {
    const [configReport, dependencyReport, healthReport, versionReport, performanceReport] = await Promise.all([
      this.getConfigurationReport(),
      this.getDependencyReport(),
      this.getHealthReport(),
      this.getVersionReport(),
      this.getPerformanceReport(),
    ]);

    return {
      configuration: configReport,
      dependencies: dependencyReport,
      health: healthReport,
      version: versionReport,
      performance: performanceReport,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Configuration diagnostic report
   * @returns {Object}
   */
  getConfigurationReport() {
    return {
      nodeEnv: process.env.NODE_ENV || 'development',
      publishingMode: process.env.PUBLISHING_MODE || 'DRY_RUN',
      logLevel: process.env.LOG_LEVEL || 'info',
      telegramConfigured: Boolean(process.env.TELEGRAM_BOT_TOKEN),
      mongoConfigured: Boolean(process.env.MONGODB_URI),
      port: process.env.PORT || 5000,
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    };
  }

  /**
   * Dependency diagnostic report
   * @returns {Object}
   */
  getDependencyReport() {
    const circuitStatus = circuitBreakerRegistry.getAllStatus();

    return {
      circuitBreakers: circuitStatus,
      openCircuits: circuitStatus.filter((c) => c.state === 'OPEN').length,
      totalCircuits: circuitStatus.length,
      externalDependencies: [
        { name: 'MongoDB', type: 'database', configured: Boolean(process.env.MONGODB_URI) },
        { name: 'Telegram Bot API', type: 'messaging', configured: Boolean(process.env.TELEGRAM_BOT_TOKEN) },
        { name: 'Amazon India', type: 'merchant', configured: true },
        { name: 'Playwright/Chromium', type: 'browser', configured: true },
      ],
    };
  }

  /**
   * Health diagnostic report
   * @returns {Promise<Object>}
   */
  async getHealthReport() {
    try {
      return await healthCheckService.getFullReport();
    } catch (error) {
      return { status: 'UNKNOWN', error: error.message };
    }
  }

  /**
   * Version diagnostic report
   * @returns {Object}
   */
  getVersionReport() {
    return {
      platform: 'Crazy Loots India',
      version: '1.0.0',
      phase: 15,
      phaseName: 'Production Hardening',
      nodeVersion: process.version,
      v8Version: process.versions.v8,
      openSSLVersion: process.versions.openssl,
      buildDate: new Date().toISOString(),
    };
  }

  /**
   * Performance diagnostic report
   * @returns {Object}
   */
  getPerformanceReport() {
    const mem = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const metrics = metricsAggregator.getUnifiedReport();

    return {
      memory: {
        heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024),
        rssMb: Math.round(mem.rss / 1024 / 1024),
        externalMb: Math.round(mem.external / 1024 / 1024),
      },
      cpu: {
        userMs: Math.round(cpuUsage.user / 1000),
        systemMs: Math.round(cpuUsage.system / 1000),
      },
      uptimeSeconds: Math.round(process.uptime()),
      metricsSnapshot: {
        counters: Object.keys(metrics.counters).length,
        gauges: Object.keys(metrics.gauges).length,
        histograms: Object.keys(metrics.histograms).length,
      },
    };
  }
}

module.exports = new SystemDiagnosticsService();
