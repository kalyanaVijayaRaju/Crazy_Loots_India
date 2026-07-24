class PublishingPackage {
  constructor({
    packageId,
    product,
    deal,
    affiliateUrl,
    shortUrl,
    images,
    renderedMessages,
    seoMetadata,
    analyticsMetadata,
    publishingMetadata,
    validationResults,
    templateVersion = '1.0.0',
    packageVersion = '1.0.0',
  }) {
    this.packageId = packageId;
    this.product = product;
    this.deal = deal;
    this.affiliateUrl = affiliateUrl;
    this.shortUrl = shortUrl;
    this.images = Object.freeze({ ...images });
    this.renderedMessages = Object.freeze({ ...renderedMessages });
    this.seoMetadata = Object.freeze({ ...seoMetadata });
    this.analyticsMetadata = Object.freeze({ ...analyticsMetadata });
    this.publishingMetadata = Object.freeze({ ...publishingMetadata });
    this.validationResults = Object.freeze({ ...validationResults });
    this.templateVersion = templateVersion;
    this.packageVersion = packageVersion;
    this.createdAt = new Date().toISOString();

    Object.freeze(this);
  }
}

module.exports = PublishingPackage;
