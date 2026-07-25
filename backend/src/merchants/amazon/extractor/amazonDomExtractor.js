const AmazonSelectors = require('../selectors/amazon.selectors');
const { PriceParser } = require('../parser/amazonParsers');
const domService = require('../../../browser/dom/domService');
const logger = require('../../../utils/logger');

class AmazonDomExtractor {
  /**
   * Extract raw DOM properties using fallback selector chains
   * @param {Object} page - Playwright page instance
   * @returns {Promise<Object>} RawAmazonProduct object
   */
  async extractRaw(page) {
    logger.debug('[AmazonDomExtractor] Starting raw DOM extraction');

    const extractField = async (selectorList) => {
      for (const sel of selectorList) {
        if (await domService.exists(page, sel)) {
          const val = await domService.text(page, sel);
          if (val && val.trim().length > 0) {
            return val.trim();
          }
        }
      }
      return '';
    };

    const extractAttribute = async (selectorList, attrName) => {
      for (const sel of selectorList) {
        if (await domService.exists(page, sel)) {
          const val = await domService.attribute(page, sel, attrName);
          if (val && val.trim().length > 0) {
            return val.trim();
          }
        }
      }
      return '';
    };

    let title = await extractField(AmazonSelectors.title);
    if (!title) {
      title = await page.evaluate(() => {
        const ogTitle = document.querySelector('meta[property="og:title"]') || document.querySelector('meta[name="title"]');
        if (ogTitle && ogTitle.content) {
          return ogTitle.content.replace(/^Amazon\.in:\s*/i, '').replace(/\s*:\s*Amazon\.in.*$/i, '').trim();
        }
        const documentTitle = document.title;
        if (documentTitle) {
          return documentTitle.replace(/^Amazon\.in:\s*/i, '').replace(/\s*:\s*Amazon\.in.*$/i, '').trim();
        }
        return '';
      }).catch(() => '');
    }

    let currentPrice = await extractField(AmazonSelectors.currentPrice);
    if (!currentPrice || PriceParser.parse(currentPrice) === 0) {
      currentPrice = await page.evaluate(() => {
        const metaPrice = document.querySelector('meta[property="og:price:amount"]');
        if (metaPrice && metaPrice.content) return metaPrice.content;
        const prices = Array.from(document.querySelectorAll('#corePrice_desktop .a-offscreen, #corePriceDisplay_desktop_feature_div .a-offscreen, .a-price .a-offscreen, #priceblock_ourprice, #priceblock_dealprice, span.a-color-price'));
        for (const p of prices) {
          const txt = (p.innerText || p.textContent || '').trim();
          if (txt && (txt.includes('₹') || /\d/.test(txt)) && !txt.toLowerCase().includes('/month') && !txt.toLowerCase().includes('emi')) {
            return txt;
          }
        }
        return '';
      }).catch(() => '');
    }

    const originalPrice = await extractField(AmazonSelectors.originalPrice);
    const rating = await extractField(AmazonSelectors.rating);
    const reviewCount = await extractField(AmazonSelectors.reviewCount);
    const brand = await extractField(AmazonSelectors.brand);
    const availability = await extractField(AmazonSelectors.availability);
    let image = await extractAttribute(AmazonSelectors.images, 'src');
    if (!image) {
      image = await extractAttribute(AmazonSelectors.images, 'data-old-hires');
    }
    if (!image) {
      image = await page.evaluate(() => {
        const ogImg = document.querySelector('meta[property="og:image"]') || document.querySelector('meta[name="twitter:image"]');
        return ogImg ? ogImg.content : '';
      }).catch(() => '');
    }
    const description = await extractField(AmazonSelectors.description);
    const breadcrumb = await extractField(AmazonSelectors.breadcrumb);
    const coupon = await extractField(AmazonSelectors.coupon);
    const delivery = await extractField(AmazonSelectors.delivery);
    const seller = await extractField(AmazonSelectors.seller);

    return {
      title,
      currentPrice,
      originalPrice,
      rating,
      reviewCount,
      brand,
      availability,
      image,
      description,
      breadcrumb,
      coupon,
      delivery,
      seller,
    };
  }
}

module.exports = new AmazonDomExtractor();
