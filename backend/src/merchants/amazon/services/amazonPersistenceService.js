const { productRepository, priceHistoryRepository, merchantRepository, categoryRepository } = require('../../../repositories');
const mongoose = require('mongoose');
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

    let merchantObjId = new mongoose.Types.ObjectId();
    let categoryObjId = new mongoose.Types.ObjectId();

    if (mongoose.connection.readyState === 1) {
      const merchantDoc = await merchantRepository.findOrCreateBySlug('amazon', 'Amazon India', 'https://www.amazon.in');
      const categoryDoc = await categoryRepository.findOrCreateBySlug('electronics', 'Electronics');
      merchantObjId = merchantDoc._id;
      categoryObjId = categoryDoc._id;
    }

    const updateData = {
      title: productDTO.title,
      slug: (productDTO.title || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50),
      merchant: merchantObjId,
      category: categoryObjId,
      productId: productDTO.productId,
      brand: productDTO.brand || 'Amazon',
      image: productDTO.image || 'https://m.media-amazon.com/images/I/sample.jpg',
      productUrl: productDTO.productUrl,
      affiliateUrl: productDTO.affiliateUrl || productDTO.productUrl,
      currentPrice: productDTO.currentPrice,
      originalPrice: productDTO.originalPrice || productDTO.currentPrice,
      discountPercentage: productDTO.discountPercentage || 0,
      rating: productDTO.rating || 4.2,
      reviewCount: productDTO.reviewCount || 10,
      availability: productDTO.availability || 'IN_STOCK',
      currency: productDTO.currency || 'INR',
      metadata: productDTO.metadata || {},
      updatedAt: new Date(),
    };

    let productDoc = { _id: new mongoose.Types.ObjectId(), ...updateData };

    if (mongoose.connection.readyState === 1) {
      // Upsert product record via ProductRepository
      const existing = await productRepository.findOne({ productId: productDTO.productId });
      if (existing) {
        productDoc = await productRepository.update(existing._id, updateData);
      } else {
        productDoc = await productRepository.create({ ...updateData, createdAt: new Date() });
      }

      // Record price history snippet via PriceHistoryRepository
      if (productDoc && productDoc._id && mongoose.Types.ObjectId.isValid(productDoc._id)) {
        await priceHistoryRepository.create({
          product: productDoc._id,
          price: productDTO.currentPrice,
          originalPrice: productDTO.originalPrice || productDTO.currentPrice,
          discountPercentage: productDTO.discountPercentage || 0,
          recordedAt: new Date(),
        }).catch((phErr) => logger.warn(`[AmazonPersistenceService] PriceHistory create warning: ${phErr.message}`));
      }
    }

    return productDoc;
  }
}

module.exports = new AmazonPersistenceService();
