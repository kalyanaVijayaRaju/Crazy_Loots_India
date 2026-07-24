class EmailTemplate {
  render(context) {
    const { product, deal, shortUrl } = context;
    return `<h1>Crazy Loots India - Deal Alert</h1><p><strong>${product.title}</strong></p><p>Price: ₹${deal.dealPrice} (${deal.discountPercentage}% OFF)</p><a href="${shortUrl}">Buy Now</a>`;
  }
}

module.exports = new EmailTemplate();
