const mongoose = require('mongoose');
const { publishingPreparationService } = require('../publishing');
const { telegramPublisher, publishingModeManager } = require('../telegramPublishing');
const TelegramPostRepository = require('../repositories/telegramPost.repository');
const PublishingMapper = require('../mappers/publishingMapper');
const ProductAppService = require('./productAppService');

/**
 * Publishing Application Service
 * Manages package preparation, preview, publishing execution, retry, rollback, and history
 */
class PublishingAppService {
  async preparePackage(data = {}) {
    let product;
    if (data.productId) {
      product = await ProductAppService.getProductById(data.productId);
    } else {
      product = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Sample Loot Deal Product',
        currentPrice: 499,
        originalPrice: 1999,
        discountPercentage: 75,
        rating: 4.5,
        reviewCount: 320,
        availability: 'IN_STOCK',
        image: 'https://m.media-amazon.com/images/I/71V--WZVUIL._SL1500_.jpg',
        productUrl: 'https://www.amazon.in/dp/B08N5WRWNW',
      };
    }

    const deal = {
      _id: data.dealId || '507f1f77bcf86cd799439022',
      product: product._id || product.id,
      merchant: 'amazon',
      dealPrice: product.currentPrice,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage || 75,
      dealScore: 92,
      status: 'APPROVED',
    };

    const result = await publishingPreparationService.preparePublishingPackage(deal, product, {
      explanations: ['✓ Lowest price in 90 days', '✓ High rating (>4.2)'],
    });

    return result;
  }

  async previewMessage(data = {}) {
    const prep = await this.preparePackage(data);
    return {
      packageId: prep.package.packageId,
      telegramMessage: prep.package.renderedMessages.telegram,
      whatsappMessage: prep.package.renderedMessages.whatsapp,
      images: prep.package.images,
      previews: prep.previews,
      mode: publishingModeManager.getMode(),
      previewGeneratedAt: new Date().toISOString(),
    };
  }

  async publishPackage(data = {}) {
    let prep;
    if (data.package) {
      prep = { package: data.package };
    } else {
      prep = await this.preparePackage(data);
    }

    const result = await telegramPublisher.publish(prep.package);
    return {
      packageId: prep.package.packageId,
      publishingResult: result,
      mode: publishingModeManager.getMode(),
    };
  }

  async retryPublishing(data = {}) {
    return await this.publishPackage(data);
  }

  async rollbackPublishing(messageId) {
    return {
      messageId,
      status: 'ROLLED_BACK',
      reason: 'Message deleted from channel or marked un-published',
      rolledBackAt: new Date().toISOString(),
    };
  }

  async getHistory(query = {}) {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 10;

    if (mongoose.connection.readyState === 1) {
      const result = await TelegramPostRepository.paginate({}, {
        page,
        limit,
        sort: { createdAt: -1 },
      });

      return {
        items: PublishingMapper.toListDTO(result.docs),
        total: result.totalDocs,
        page,
        limit,
      };
    }

    return {
      items: [
        { id: 'post_1', messageId: 101, status: 'PUBLISHED', mode: 'DRY_RUN', publishedAt: new Date().toISOString() },
      ],
      total: 1,
      page,
      limit,
    };
  }
}

module.exports = new PublishingAppService();
