class TelegramTemplate {
  render(context) {
    const { product, deal, comparisonSpec, explanations, shortUrl } = context;
    const title = product.title || 'Loot Deal';
    const price = deal.dealPrice || product.currentPrice || 0;
    const origPrice = deal.originalPrice || product.originalPrice || price;
    const discount = deal.discountPercentage || comparisonSpec.discountPercentage || 0;
    const rating = product.rating ? `⭐ ${product.rating}` : '';
    const reasonsStr = explanations.length ? `\n\n${explanations.slice(0, 3).join('\n')}` : '';

    return `🔥 *LOOT DEAL DETECTED!* 🔥

*${title}*

💰 *Deal Price*: ₹${price.toLocaleString('en-IN')} ~(₹${origPrice.toLocaleString('en-IN')})~
📉 *Discount*: ${discount}% OFF ${rating}${reasonsStr}

🛒 *BUY NOW*: ${shortUrl}`;
  }
}

module.exports = new TelegramTemplate();
