class PushNotificationTemplate {
  render(context) {
    const { product, deal } = context;
    return {
      title: `🔥 Loot Price Drop: ${deal.discountPercentage}% OFF`,
      body: `${product.title} is now ₹${deal.dealPrice}!`,
    };
  }
}

module.exports = new PushNotificationTemplate();
