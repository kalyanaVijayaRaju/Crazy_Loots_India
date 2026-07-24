/**
 * Standardized Product DTO Contract
 * All merchant adapters MUST transform platform-specific responses into this DTO.
 */
class ProductDTO {
  constructor({
    merchant,
    productId,
    title,
    brand = 'Generic',
    image = '',
    productUrl,
    affiliateUrl = '',
    currentPrice,
    originalPrice,
    discountPercentage = 0,
    rating = 0,
    reviewCount = 0,
    availability = 'IN_STOCK',
    currency = 'INR',
    category = 'General',
    metadata = {},
  }) {
    if (!merchant || typeof merchant !== 'string') {
      throw new Error('ProductDTO requires a valid merchant identifier string.');
    }
    if (!productId || typeof productId !== 'string') {
      throw new Error('ProductDTO requires a valid productId string.');
    }
    if (!title || typeof title !== 'string') {
      throw new Error('ProductDTO requires a valid title string.');
    }
    if (!productUrl || typeof productUrl !== 'string') {
      throw new Error('ProductDTO requires a valid productUrl string.');
    }
    if (typeof currentPrice !== 'number' || currentPrice < 0) {
      throw new Error('ProductDTO requires currentPrice as a non-negative number.');
    }
    if (typeof originalPrice !== 'number' || originalPrice < 0) {
      throw new Error('ProductDTO requires originalPrice as a non-negative number.');
    }

    this.merchant = merchant.toLowerCase().trim();
    this.productId = productId.trim();
    this.title = title.trim();
    this.brand = brand.trim();
    this.image = image.trim();
    this.productUrl = productUrl.trim();
    this.affiliateUrl = affiliateUrl ? affiliateUrl.trim() : this.productUrl;
    this.currentPrice = currentPrice;
    this.originalPrice = originalPrice;

    // Calculate discount percentage if not explicitly provided
    if (discountPercentage === 0 && originalPrice > currentPrice && originalPrice > 0) {
      this.discountPercentage = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    } else {
      this.discountPercentage = Math.max(0, Math.min(100, Math.round(discountPercentage)));
    }

    this.rating = Number(rating) || 0;
    this.reviewCount = Number(reviewCount) || 0;
    this.availability = availability;
    this.currency = currency;
    this.category = category;
    this.metadata = metadata;
    this.timestamp = new Date().toISOString();
  }

  static from(data) {
    return new ProductDTO(data);
  }
}

module.exports = ProductDTO;
