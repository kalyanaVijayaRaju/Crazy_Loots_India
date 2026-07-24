class WebsiteTemplate {
  render(context) {
    const { product, deal, shortUrl } = context;
    return {
      title: product.title,
      price: deal.dealPrice || product.currentPrice,
      originalPrice: deal.originalPrice || product.originalPrice,
      discountPercentage: deal.discountPercentage,
      buyUrl: shortUrl,
    };
  }
}

module.exports = new WebsiteTemplate();
