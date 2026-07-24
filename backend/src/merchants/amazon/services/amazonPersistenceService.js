const { productRepository, priceHistoryRepository } = require('../../../repositories');
const logger = require('../../../utils/logger');

class AmazonPersistenceService {
  /**
   * Persist or update Amazon ProductDTO and record PriceHistory in MongoDB
   * @param {ProductDTO} productDTO
   */
  async persistProduct(productDTO) {
    if (!productDTO || !productDTO.productId) {
      throw new Error('AmazonPersistenceService requires a valid ProductDTO.');
    }

    logger.debug(`[AmazonPersistenceService] Persisting Amazon product '${productDTO.productId}'`);

    const query = { merchant: 'amazon', productId: productDTO.productId };
    const updateData = {
      title: productDTO.title,
      brand: productDTO.brand,
      image: productDTO.image,
      productUrl: productDTO.productUrl,
      affiliateUrl: productDTO.affiliateUrl,
      currentPrice: productDTO.currentPrice,
      originalPrice: productDTO.originalPrice,
      discountPercentage: productDTO.discountPercentage,
      rating: productDTO.rating,
      reviewCount: productDTO.reviewCount,
      availability: productDTO.availability,
      currency: productDTO.currency,
      category: productDTO.category,
      metadata: productDTO.metadata,
      updatedAt: new Date(),
    };

    // Upsert product record via ProductRepository
    let productDoc = await productRepository.findOne(query);
    if (productDoc) {
      productDoc = await productRepository.update(productDoc._id, updateData);
    } else {
      productDoc = await productRepository.create({ ...query, ...updateData, createdAt: new Date() });
    }

    // Record price history snippet via PriceHistoryRepository
    if (productDoc && productDoc._id) {
      await priceHistoryRepository.create({
        productId: productDoc._id,
        merchant: 'amazon',
        merchantProductId: productDTO.productId,
        price: productDTO.currentPrice,
        originalPrice: productDTO.originalPrice,
        discountPercentage: productDTO.discountPercentage,
        availability: productDTO.availability,
        timestamp: new Date(),
      });
    }

    return productDoc;
  }
}

module.exports = new AmazonPersistenceService();
