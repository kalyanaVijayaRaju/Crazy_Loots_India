const { chromium } = require('playwright');
const logger = require('../../utils/logger');

class DealCardBannerGenerator {
  /**
   * Render a high-resolution Amazon Product Deal Card image matching the user layout
   * @param {Object} product - Product details { title, image, currentPrice, originalPrice, discountPercentage, rating, availability, metadata }
   * @returns {Promise<Buffer|null>} Image buffer (JPEG)
   */
  async generateCardBanner(product) {
    if (!product || !product.title) {
      return null;
    }

    let browser;
    try {
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      await page.setViewportSize({ width: 850, height: 450 });

      const price = product.currentPrice || 0;
      const origPrice = product.originalPrice || price;
      const discount = product.discountPercentage || (origPrice > price ? Math.round(((origPrice - price) / origPrice) * 100) : 0);
      const delivery = (product.metadata && product.metadata.delivery) ? product.metadata.delivery : 'FREE delivery';
      const seller = (product.metadata && product.metadata.seller) ? product.metadata.seller : 'PARAM TRADERS';
      const availability = product.availability === 'OUT_OF_STOCK' ? 'Out of Stock' : 'In stock';
      const image = product.image || 'https://m.media-amazon.com/images/I/71V--WZVUIL._SL1500_.jpg';

      const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #f7f9fa; padding: 20px; display: flex; justify-content: center; align-items: center; width: 850px; height: 450px; }
  .card { display: flex; width: 810px; height: 400px; background: #ffffff; border-radius: 16px; border: 1px solid #e3e6e6; box-shadow: 0 4px 16px rgba(0,0,0,0.08); padding: 24px; gap: 28px; align-items: center; position: relative; }
  .img-box { width: 320px; height: 340px; display: flex; align-items: center; justify-content: center; background: #ffffff; border-radius: 12px; position: relative; padding: 12px; }
  .img-box img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .check-badge { position: absolute; top: 8px; left: 8px; width: 28px; height: 28px; background: #007185; border-radius: 6px; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; }
  .info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .title { font-size: 22px; font-weight: 500; line-height: 1.35; color: #0f1111; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .subtitle { font-size: 16px; color: #565959; margin-bottom: 14px; }
  .price-box { display: flex; align-items: baseline; gap: 8px; margin-bottom: 14px; }
  .price-main { font-size: 42px; font-weight: 700; color: #0f1111; letter-spacing: -0.5px; }
  .price-symbol { font-size: 24px; font-weight: 700; vertical-align: super; }
  .price-decimals { font-size: 24px; font-weight: 700; vertical-align: super; }
  .mrp { font-size: 18px; color: #565959; text-decoration: line-through; margin-left: 6px; }
  .discount { background: #CC0C39; color: #ffffff; font-size: 15px; font-weight: 700; padding: 3px 8px; border-radius: 4px; margin-left: 8px; }
  .delivery { font-size: 17px; color: #0f1111; margin-bottom: 6px; }
  .delivery b { font-weight: 700; }
  .stock { font-size: 18px; color: #007600; font-weight: 600; margin-bottom: 6px; }
  .seller { font-size: 16px; color: #565959; }
  .seller-link { color: #007185; text-decoration: none; font-weight: 600; }
  .tag { font-size: 15px; color: #007185; margin-top: 6px; font-weight: 500; }
</style>
</head>
<body>
  <div class="card">
    <div class="img-box">
      <div class="check-badge">✓</div>
      <img src="${image}" alt="Product Image" />
    </div>
    <div class="info">
      <div class="title">${product.title}</div>
      <div class="subtitle">50+ bought in past month</div>
      <div class="price-box">
        <span class="price-symbol">₹</span>
        <span class="price-main">${price.toLocaleString('en-IN')}</span>
        <span class="price-decimals">00</span>
        ${origPrice > price ? `<span class="mrp">₹${origPrice.toLocaleString('en-IN')}</span>` : ''}
        ${discount > 0 ? `<span class="discount">${discount}% OFF</span>` : ''}
      </div>
      <div class="delivery">${delivery.includes('FREE') ? delivery : `FREE delivery <b>${delivery}</b>`}</div>
      <div class="stock">${availability}</div>
      <div class="seller">Sold by <span class="seller-link">${seller}</span></div>
      <div class="tag">10 days Replacement</div>
    </div>
  </div>
</body>
</html>`;

      await page.setContent(html, { waitUntil: 'load' });
      const buffer = await page.screenshot({ type: 'jpeg', quality: 90 });
      await browser.close();
      return buffer;
    } catch (err) {
      logger.warn(`[DealCardBannerGenerator] Failed to generate card banner screenshot: ${err.message}`);
      if (browser) {
        await browser.close();
      }
      return null;
    }
  }
}

module.exports = new DealCardBannerGenerator();
