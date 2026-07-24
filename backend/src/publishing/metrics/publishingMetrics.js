class PublishingMetrics {
  constructor() {
    this.reset();
  }

  reset() {
    this.packagesGenerated = 0;
    this.validationFailures = 0;
    this.missingAffiliateLinks = 0;
    this.templateRenderDurations = [];
    this.imageProcessingDurations = [];
    this.previewGenerationDurations = [];
  }

  recordPackageGenerated(templateMs, imageMs, previewMs) {
    this.packagesGenerated += 1;
    this.templateRenderDurations.push(templateMs);
    this.imageProcessingDurations.push(imageMs);
    this.previewGenerationDurations.push(previewMs);
  }

  recordValidationFailure() {
    this.validationFailures += 1;
  }

  recordMissingAffiliateLink() {
    this.missingAffiliateLinks += 1;
  }

  getMetrics() {
    const avg = (arr) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);
    return {
      packagesGenerated: this.packagesGenerated,
      validationFailures: this.validationFailures,
      missingAffiliateLinks: this.missingAffiliateLinks,
      avgTemplateRenderMs: avg(this.templateRenderDurations),
      avgImageProcessingMs: avg(this.imageProcessingDurations),
      avgPreviewGenerationMs: avg(this.previewGenerationDurations),
    };
  }
}

module.exports = new PublishingMetrics();
