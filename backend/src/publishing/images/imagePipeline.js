const logger = require('../../utils/logger');

class ImagePipeline {
  /**
   * Process product image into various social and publishing dimensions
   * @param {string} originalImageUrl
   * @returns {Promise<Object>} Image URLs mapping { original, thumbnail, banner, socialPreview, compressed }
   */
  async processImage(originalImageUrl) {
    if (!originalImageUrl || typeof originalImageUrl !== 'string') {
      logger.warn('[ImagePipeline] Missing originalImageUrl. Returning fallback image set.');
      return this.getFallbackImages();
    }

    logger.debug(`[ImagePipeline] Processing image assets for '${originalImageUrl}'`);

    const clean = originalImageUrl.trim();
    // Validate image URL format
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      return this.getFallbackImages();
    }

    // Amazon image URLs have resolution modifiers like ._SL1000_.jpg
    const isAmazonCdn = clean.includes('media-amazon.com') || clean.includes('images-amazon.com');
    
    return {
      original: clean,
      thumbnail: isAmazonCdn ? clean.replace(/\._[A-Z0-9_]+_\./i, '._SL300_.') : clean,
      banner: isAmazonCdn ? clean.replace(/\._[A-Z0-9_]+_\./i, '._SL800_.') : clean,
      socialPreview: clean,
      compressed: clean,
      watermarked: clean,
    };
  }

  getFallbackImages() {
    const fallback = 'https://m.media-amazon.com/images/I/61MB86jV6rL._SL1000_.jpg';
    return {
      original: fallback,
      thumbnail: 'https://m.media-amazon.com/images/I/61MB86jV6rL._SL300_.jpg',
      banner: 'https://m.media-amazon.com/images/I/61MB86jV6rL._SL800_.jpg',
      socialPreview: fallback,
      compressed: fallback,
      watermarked: fallback,
    };
  }
}

module.exports = new ImagePipeline();
