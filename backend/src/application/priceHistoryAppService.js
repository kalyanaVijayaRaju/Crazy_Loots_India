const mongoose = require('mongoose');
const PriceHistory = require('../models/priceHistory.model');
const ProductAppService = require('./productAppService');

/**
 * Price History Application Service
 * Manages price history queries and statistics calculations
 */
class PriceHistoryAppService {
  async getProductPrices(productId) {
    const product = await ProductAppService.getProductById(productId);
    let docs = [];
    if (mongoose.connection.readyState === 1) {
      docs = await PriceHistory.find({ product: product.id }).sort({ timestamp: -1 }).limit(100);
    } else {
      docs = [
        { price: product.currentPrice, timestamp: new Date() },
        { price: product.originalPrice, timestamp: new Date(Date.now() - 30 * 24 * 3600 * 1000) },
      ];
    }

    return {
      productId: product.id,
      productTitle: product.title,
      currentPrice: product.currentPrice,
      prices: docs.map((d) => ({
        price: d.price,
        timestamp: d.timestamp ? new Date(d.timestamp).toISOString() : new Date().toISOString(),
      })),
    };
  }

  async getProductStatistics(productId) {
    const product = await ProductAppService.getProductById(productId);
    let docs = [];
    if (mongoose.connection.readyState === 1) {
      docs = await PriceHistory.find({ product: product.id });
    } else {
      docs = [
        { price: product.currentPrice },
        { price: product.originalPrice },
      ];
    }

    const prices = docs.length ? docs.map((d) => d.price) : [product.currentPrice, product.originalPrice];
    const lowestPrice = Math.min(...prices);
    const highestPrice = Math.max(...prices);
    const sum = prices.reduce((acc, p) => acc + p, 0);
    const averagePrice = Math.round(sum / prices.length);
    const discountFromHighest = Math.round(((highestPrice - product.currentPrice) / highestPrice) * 100);

    return {
      productId: product.id,
      productTitle: product.title,
      currentPrice: product.currentPrice,
      originalPrice: product.originalPrice,
      lowestPrice,
      highestPrice,
      averagePrice,
      discountFromHighest,
      totalRecordCount: prices.length,
      calculatedAt: new Date().toISOString(),
    };
  }
}

module.exports = new PriceHistoryAppService();
