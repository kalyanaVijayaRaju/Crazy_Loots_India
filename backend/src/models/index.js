const Merchant = require('./merchant.model');
const Category = require('./category.model');
const Product = require('./product.model');
const PriceHistory = require('./priceHistory.model');
const Deal = require('./deal.model');
const Coupon = require('./coupon.model');
const TelegramPost = require('./telegramPost.model');
const PriceAlert = require('./priceAlert.model');
const DealHistory = require('./dealHistory.model');
const ScrapeJob = require('./scrapeJob.model');
const MonitoringConfiguration = require('./monitoringConfiguration.model');
const MonitoringRun = require('./monitoringRun.model');

module.exports = {
  Merchant,
  Category,
  Product,
  PriceHistory,
  Deal,
  Coupon,
  TelegramPost,
  PriceAlert,
  DealHistory,
  ScrapeJob,
  MonitoringConfiguration,
  MonitoringRun,
};
