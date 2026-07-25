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

    return `🔥 *LOOT DEAL DETECTED!* 🔥\n\n` +
      `*${safeTitle}*\n\n` +
      `💰 *Deal Price*: ₹${price.toLocaleString('en-IN')} (List Price: ₹${origPrice.toLocaleString('en-IN')})\n` +
      `📉 *Discount*: ${discount}% OFF ${rating}${reasonsStr}\n\n` +
      `🛒 *BUY NOW*: [Click Here to Buy](${shortUrl})`;
  }
}

module.exports = new TelegramTemplate();
