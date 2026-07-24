const path = require('path');
const fs = require('fs');
const logger = require('../../utils/logger');

/**
 * ExecutionArchiveService
 *
 * Persists execution artifacts to disk for historical analysis.
 * Archives:
 * - Snapshots
 * - Screenshots
 * - Execution reports
 * - Publishing packages
 * - Logs
 * - Metrics
 */
class ExecutionArchiveService {
  constructor() {
    this._archiveDir = path.join(__dirname, '../../../data/archive');
    this._maxArchiveEntries = 500;
    /** @type {Array<Object>} */
    this._index = [];
  }

  /**
   * Ensure archive directory exists
   */
  _ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Archive an execution's data to disk
   * @param {string} executionId
   * @param {Object} data
   * @param {Object} [data.snapshot]
   * @param {Object} [data.report]
   * @param {Object} [data.publishingPackage]
   * @param {Object} [data.metrics]
   * @param {string} [data.logs]
   * @returns {Object} archive entry
   */
  archive(executionId, data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const entryDir = path.join(this._archiveDir, `${executionId}_${timestamp}`);
    this._ensureDir(entryDir);

    const files = [];

    if (data.snapshot) {
      const filePath = path.join(entryDir, 'snapshot.json');
      fs.writeFileSync(filePath, JSON.stringify(data.snapshot, null, 2));
      files.push('snapshot.json');
    }

    if (data.report) {
      const filePath = path.join(entryDir, 'report.json');
      fs.writeFileSync(filePath, JSON.stringify(data.report, null, 2));
      files.push('report.json');
    }

    if (data.publishingPackage) {
      const filePath = path.join(entryDir, 'publishing_package.json');
      fs.writeFileSync(filePath, JSON.stringify(data.publishingPackage, null, 2));
      files.push('publishing_package.json');
    }

    if (data.metrics) {
      const filePath = path.join(entryDir, 'metrics.json');
      fs.writeFileSync(filePath, JSON.stringify(data.metrics, null, 2));
      files.push('metrics.json');
    }

    if (data.logs) {
      const filePath = path.join(entryDir, 'execution.log');
      fs.writeFileSync(filePath, data.logs);
      files.push('execution.log');
    }

    const entry = {
      executionId,
      directory: entryDir,
      files,
      archivedAt: new Date().toISOString(),
    };

    this._index.push(entry);
    this._enforceMaxSize();

    logger.info(`[ExecutionArchive] Archived '${executionId}' with ${files.length} files to ${entryDir}`);
    return entry;
  }

  /**
   * Retrieve an archived execution from disk
   * @param {string} executionId
   * @returns {Object|null}
   */
  retrieve(executionId) {
    const entry = this._index.find((e) => e.executionId === executionId);
    if (!entry) {
      logger.warn(`[ExecutionArchive] No archive found for '${executionId}'`);
      return null;
    }

    const result = { executionId, archivedAt: entry.archivedAt };

    for (const file of entry.files) {
      const filePath = path.join(entry.directory, file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const key = file.replace('.json', '').replace('.log', '_log');
        try {
          result[key] = JSON.parse(content);
        } catch {
          result[key] = content;
        }
      }
    }

    return result;
  }

  /**
   * List all archived executions
   * @param {number} [limit=20]
   * @returns {Array<Object>}
   */
  listArchives(limit = 20) {
    return this._index.slice(-limit).reverse().map((e) => ({
      executionId: e.executionId,
      fileCount: e.files.length,
      archivedAt: e.archivedAt,
    }));
  }

  /**
   * Get archive statistics
   * @returns {Object}
   */
  getStats() {
    return {
      totalArchived: this._index.length,
      archiveDir: this._archiveDir,
      oldestArchive: this._index.length > 0 ? this._index[0].archivedAt : null,
      newestArchive: this._index.length > 0 ? this._index[this._index.length - 1].archivedAt : null,
    };
  }

  /** Keep bounded */
  _enforceMaxSize() {
    if (this._index.length > this._maxArchiveEntries) {
      this._index = this._index.slice(-this._maxArchiveEntries);
    }
  }
}

module.exports = new ExecutionArchiveService();
