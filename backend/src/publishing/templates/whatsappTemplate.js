class WhatsappTemplate {
  render(context) {
    const { product, deal, shortUrl } = context;
    return `*Crazy Loots Deal:* ${product.title}\nPrice: ₹${deal.dealPrice} (${deal.discountPercentage}% OFF)\nLink: ${shortUrl}`;
  }
}

module.exports = new WhatsappTemplate();
