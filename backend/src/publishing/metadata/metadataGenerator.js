class MetadataGenerator {
  generateSeoMetadata(product, deal) {
    const title = `${product.title} - ${deal.discountPercentage}% OFF Deal`;
    const description = `Buy ${product.title} at ₹${deal.dealPrice} (${deal.discountPercentage}% OFF) on Crazy Loots India.`;

    return {
      title,
      metaDescription: description,
      ogTitle: title,
      ogDescription: description,
      canonicalUrl: product.productUrl,
    };
  }

  generateAnalyticsMetadata(product, deal, providerName) {
    return {
      utmSource: 'crazy_loots',
      utmMedium: 'telegram',
      utmCampaign: `deal_${deal.dealType || 'price_drop'}`,
      productId: product._id || product.productId,
      merchant: product.merchant,
      affiliateProvider: providerName,
    };
  }
}

module.exports = new MetadataGenerator();
