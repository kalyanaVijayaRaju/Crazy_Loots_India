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
    return {
      original: clean,
      thumbnail: `${clean}?dim=150x150`,
      banner: `${clean}?dim=800x400`,
      socialPreview: `${clean}?dim=1200x630`,
      compressed: `${clean}?fmt=webp&q=80`,
      watermarked: `${clean}?wm=crazyloots`,
    };
  }

  getFallbackImages() {
    const fallback = 'https://m.media-amazon.com/images/I/sample.jpg';
    return {
      original: fallback,
      thumbnail: `${fallback}?dim=150x150`,
      banner: `${fallback}?dim=800x400`,
      socialPreview: `${fallback}?dim=1200x630`,
      compressed: `${fallback}?fmt=webp&q=80`,
      watermarked: `${fallback}?wm=crazyloots`,
    };
  }
}

module.exports = new ImagePipeline();
