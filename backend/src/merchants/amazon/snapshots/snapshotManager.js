const htmlSanitizer = require('../utils/htmlSanitizer');
const logger = require('../../../utils/logger');

class SnapshotManager {
  constructor() {
    this.snapshots = new Map();
  }

  async save(id, html) {
    const sanitized = htmlSanitizer.sanitize(html);
    this.snapshots.set(id, { html: sanitized, timestamp: new Date().toISOString() });
    logger.debug(`[SnapshotManager] Saved HTML snapshot for '${id}' (${sanitized.length} bytes)`);
    return id;
  }

  async load(id) {
    const entry = this.snapshots.get(id);
    return entry ? entry.html : null;
  }

  async compare(id1, id2) {
    const html1 = await this.load(id1);
    const html2 = await this.load(id2);
    if (!html1 || !html2) {
      return { match: false, difference: 'One or both snapshots missing' };
    }
    const match = html1 === html2;
    return { match, difference: match ? 0 : Math.abs(html1.length - html2.length) };
  }

  async cleanup() {
    this.snapshots.clear();
  }
}

module.exports = new SnapshotManager();
