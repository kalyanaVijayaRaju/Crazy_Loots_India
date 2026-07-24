class ExtractionResult {
  constructor({
    success,
    product = null,
    warnings = [],
    errors = [],
    metrics = {},
    traceId = '',
    htmlSnapshot = null,
    screenshots = [],
    selectorHealth = {},
  }) {
    this.success = Boolean(success);
    this.product = product;
    this.warnings = Object.freeze([...warnings]);
    this.errors = Object.freeze([...errors]);
    this.metrics = Object.freeze({ ...metrics });
    this.traceId = traceId;
    this.htmlSnapshot = htmlSnapshot;
    this.screenshots = Object.freeze([...screenshots]);
    this.selectorHealth = Object.freeze({ ...selectorHealth });
    this.timestamp = new Date().toISOString();

    Object.freeze(this);
  }
}

module.exports = ExtractionResult;
