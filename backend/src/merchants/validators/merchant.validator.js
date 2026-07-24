const { InvalidMerchantError, InvalidProductUrlError } = require('../errors/merchant.errors');

/**
 * Validate merchant identifier name
 * @param {string} merchantName
 * @returns {string} Cleaned lowercase merchant name
 */
const validateMerchant = (merchantName) => {
  if (!merchantName || typeof merchantName !== 'string' || merchantName.trim() === '') {
    throw new InvalidMerchantError('Merchant identifier name is required and must be a non-empty string.');
  }
  return merchantName.toLowerCase().trim();
};

/**
 * Validate merchant product ID
 * @param {string} productId
 * @returns {string} Cleaned product ID
 */
const validateProductId = (productId) => {
  if (!productId || (typeof productId !== 'string' && typeof productId !== 'number')) {
    throw new InvalidMerchantError('Product ID is required and must be a non-empty string or number.');
  }
  const cleanId = String(productId).trim();
  if (cleanId === '') {
    throw new InvalidMerchantError('Product ID cannot be an empty string.');
  }
  return cleanId;
};

/**
 * Validate product URL structure
 * @param {string} url
 * @returns {string} Trimmed URL
 */
const validateProductUrl = (url) => {
  if (!url || typeof url !== 'string') {
    throw new InvalidProductUrlError(url || 'undefined');
  }
  const trimmed = url.trim();
  try {
    const parsed = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      throw new InvalidProductUrlError(trimmed);
    }
  } catch (_err) {
    throw new InvalidProductUrlError(trimmed);
  }
  return trimmed;
};

/**
 * Validate coupon object parameter
 * @param {object} couponData
 * @returns {boolean}
 */
const validateCoupon = (couponData) => {
  if (!couponData || typeof couponData !== 'object') {
    return false;
  }
  return Boolean(couponData.couponCode && couponData.merchant);
};

module.exports = {
  validateMerchant,
  validateProductId,
  validateProductUrl,
  validateCoupon,
};
