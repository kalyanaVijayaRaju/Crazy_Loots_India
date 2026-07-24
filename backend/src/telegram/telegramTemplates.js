/**
 * Telegram Message Template Formatters
 */

/**
 * Format system startup alert message
 * @param {object} params
 * @param {string} params.appName - Name of the application
 * @param {string} params.environment - Node environment (development / production)
 * @param {string} params.timestamp - Current ISO timestamp string
 * @returns {string} Formatted startup notification string
 */
const formatStartupMessage = ({ appName = 'Crazy Loots India', environment = 'development', timestamp }) => {
  const formattedTime = timestamp || new Date().toISOString();
  return (
    `🚀 *${appName} Backend Started*\n\n` +
    `📌 *Environment:* ${environment.toUpperCase()}\n` +
    `⚡ *Server Status:* Healthy & Online\n` +
    `⏰ *Timestamp:* \`${formattedTime}\``
  );
};

/**
 * [Placeholder Phase 3] Format E-Commerce Loot Deal Alert
 * @param {object} dealData - Deal metadata object
 * @param {string} dealData.title - Product title
 * @param {number} dealData.originalPrice - MRP
 * @param {number} dealData.discountPrice - Loot offer price
 * @param {number} dealData.discountPercentage - Percentage off
 * @param {string} dealData.affiliateUrl - Converted affiliate URL
 * @param {string} dealData.storeName - Amazon / Flipkart / Myntra
 * @returns {string} Markdown formatted deal text
 */
const formatDealMessage = (dealData) => {
  const { title, originalPrice, discountPrice, discountPercentage, affiliateUrl, storeName } = dealData;
  return (
    `🔥 *LOOT DEAL: ${title}*\n\n` +
    `🏷️ *Store:* ${storeName}\n` +
    `💰 *Offer Price:* ₹${discountPrice} ~₹${originalPrice}~\n` +
    `⚡ *Discount:* ${discountPercentage}% OFF\n\n` +
    `👉 [BUY NOW HERE](${affiliateUrl})`
  );
};

/**
 * [Placeholder Phase 3] Format E-Commerce Coupon Alert
 * @param {object} couponData - Coupon metadata object
 * @param {string} couponData.code - Coupon code string
 * @param {string} couponData.description - Discount description
 * @param {string} couponData.affiliateUrl - Destination URL
 * @param {string} couponData.storeName - Store name
 * @returns {string} Markdown formatted coupon text
 */
const formatCouponMessage = (couponData) => {
  const { code, description, affiliateUrl, storeName } = couponData;
  return (
    `🎁 *EXCLUSIVE COUPON: ${storeName}*\n\n` +
    `📝 *Details:* ${description}\n` +
    `🔑 *Coupon Code:* \`${code}\`\n\n` +
    `👉 [APPLY COUPON HERE](${affiliateUrl})`
  );
};

module.exports = {
  formatStartupMessage,
  formatDealMessage,
  formatCouponMessage,
};
