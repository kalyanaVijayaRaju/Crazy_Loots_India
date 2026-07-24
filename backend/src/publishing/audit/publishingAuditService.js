const logger = require('../../utils/logger');

class PublishingAuditService {
  constructor() {
    this.auditLogs = [];
  }

  logAudit(entry) {
    const record = {
      packageId: entry.packageId,
      dealId: entry.dealId,
      templateVersion: entry.templateVersion || '1.0.0',
      affiliateProvider: entry.affiliateProvider,
      validationPassed: entry.validationPassed,
      generationTimeMs: entry.generationTimeMs,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.push(record);
    logger.info(`[PublishingAuditService] Logged audit for package '${entry.packageId}' (Valid: ${entry.validationPassed})`);

    if (this.auditLogs.length > 500) {
      this.auditLogs.shift();
    }
  }

  getAuditLogs() {
    return [...this.auditLogs];
  }
}

module.exports = new PublishingAuditService();
