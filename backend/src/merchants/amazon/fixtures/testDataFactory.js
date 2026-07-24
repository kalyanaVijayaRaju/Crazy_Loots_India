const ProductDTO = require('../../dto/product.dto');
const ExtractionResult = require('../results/extractionResult');

class TestDataFactory {
  static createRawAmazonProduct(overrides = {}) {
    return {
      title: 'Amazon Echo Dot (4th Gen) Smart Speaker',
      currentPrice: '₹2,499',
      originalPrice: '₹4,499',
      rating: '4.4 out of 5 stars',
      reviewCount: '8,520 ratings',
      brand: 'Brand: Amazon',
      availability: 'In stock.',
      image: 'https://m.media-amazon.com/images/I/61MB86jV6rL._SL1000_.jpg',
      description: 'Smart speaker with Alexa',
      breadcrumb: 'Smart Home',
      coupon: null,
      delivery: 'Free delivery by Tomorrow',
      seller: 'Appario Retail Private Ltd',
      ...overrides,
    };
  }

  static createProductDTO(overrides = {}) {
    return ProductDTO.from({
      merchant: 'amazon',
      productId: 'B08N5WRWNW',
      title: 'Amazon Echo Dot (4th Gen) Smart Speaker',
      brand: 'Amazon',
      image: 'https://m.media-amazon.com/images/I/61MB86jV6rL._SL1000_.jpg',
      productUrl: 'https://www.amazon.in/dp/B08N5WRWNW',
      affiliateUrl: 'https://www.amazon.in/dp/B08N5WRWNW',
      currentPrice: 2499,
      originalPrice: 4499,
      discountPercentage: 44,
      rating: 4.4,
      reviewCount: 8520,
      availability: 'IN_STOCK',
      currency: 'INR',
      category: 'Smart Home',
      metadata: { asin: 'B08N5WRWNW' },
      ...overrides,
    });
  }

  static createExtractionResult(overrides = {}) {
    return new ExtractionResult({
      success: true,
      product: this.createProductDTO(),
      warnings: [],
      errors: [],
      metrics: { durationMs: 120 },
      traceId: 'trc_mock_test_id',
      ...overrides,
    });
  }
}

module.exports = TestDataFactory;
