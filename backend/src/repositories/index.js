const BaseRepository = require('./base.repository');
const merchantRepository = require('./merchant.repository');
const categoryRepository = require('./category.repository');
const productRepository = require('./product.repository');
const priceHistoryRepository = require('./priceHistory.repository');
const dealRepository = require('./deal.repository');
const couponRepository = require('./coupon.repository');
const telegramPostRepository = require('./telegramPost.repository');
const priceAlertRepository = require('./priceAlert.repository');
const dealHistoryRepository = require('./dealHistory.repository');
const scrapeJobRepository = require('./scrapeJob.repository');
const monitoringConfigurationRepository = require('./monitoringConfiguration.repository');
const monitoringRunRepository = require('./monitoringRun.repository');

module.exports = {
  BaseRepository,
  merchantRepository,
  categoryRepository,
  productRepository,
  priceHistoryRepository,
  dealRepository,
  couponRepository,
  telegramPostRepository,
  priceAlertRepository,
  dealHistoryRepository,
  scrapeJobRepository,
  monitoringConfigurationRepository,
  monitoringRunRepository,
};
