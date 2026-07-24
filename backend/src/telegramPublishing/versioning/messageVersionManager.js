class MessageVersionManager {
  constructor() {
    this.revisions = new Map(); // taskId -> array of revisions
  }

  recordRevision(taskId, text, meta = {}) {
    const list = this.revisions.get(taskId) || [];
    const rev = {
      revisionNumber: list.length + 1,
      text,
      packageVersion: meta.packageVersion || '1.0.0',
      templateVersion: meta.templateVersion || '1.0.0',
      timestamp: new Date().toISOString(),
    };
    list.push(rev);
    this.revisions.set(taskId, list);
    return rev;
  }

  getRevisions(taskId) {
    return this.revisions.get(taskId) || [];
  }
}

module.exports = new MessageVersionManager();
