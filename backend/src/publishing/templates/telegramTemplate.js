const telegramFormatter = require('../../telegram/utils/telegramFormatter');

class TelegramTemplate {
  render(context) {
    const { product = {}, deal = {}, comparisonSpec = {}, explanations = [], shortUrl = '' } = context;
    const rawTitle = product.title || 'Loot Deal';
    const truncatedTitle = telegramFormatter.truncateTitle(rawTitle, 120);
    const safeTitle = telegramFormatter.escapeMarkdown(truncatedTitle);

    const price = deal.dealPrice || product.currentPrice || 0;
    const origPrice = deal.originalPrice || product.originalPrice || price;
    const discount = deal.discountPercentage || comparisonSpec.discountPercentage || 0;
    const rating = product.rating ? `⭐ ${product.rating}` : '';

    const safeExplanations = (Array.isArray(explanations) ? explanations : [])
      .slice(0, 3)
      .map((exp) => telegramFormatter.escapeMarkdown(exp));

    const reasonsStr = safeExplanations.length ? `\n\n${safeExplanations.join('\n')}` : '';

    const delivery = product.metadata?.delivery ? `\n🚚 *Delivery*: ${telegramFormatter.escapeMarkdown(product.metadata.delivery)}` : '';
    const seller = product.metadata?.seller ? `\n🏢 *Seller*: ${telegramFormatter.escapeMarkdown(product.metadata.seller)}` : '';
    const avail = product.availability === 'IN_STOCK' ? 'In Stock' : 'Limited Stock';

    return `🔥 *LOOT DEAL DETECTED!* 🔥\n\n` +
      `*${safeTitle}*\n\n` +
      `💰 *Deal Price*: ₹${price.toLocaleString('en-IN')} (M.R.P.: ₹${origPrice.toLocaleString('en-IN')})\n` +
      `📉 *Discount*: ${discount}% OFF ${rating}\n` +
      `📦 *Status*: ${avail}${delivery}${seller}${reasonsStr}\n\n` +
      `🛒 *BUY NOW ON AMAZON*: [Click Here to Buy](${shortUrl})`;
  }
}

module.exports = new TelegramTemplate();
