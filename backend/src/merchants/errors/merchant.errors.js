const ApiError = require('../../utils/ApiError');
const { HTTP_STATUS } = require('../../constants');

class MerchantNotSupportedError extends ApiError {
  constructor(merchantName) {
    super(
      HTTP_STATUS.BAD_REQUEST,
      `Merchant '${merchantName}' is currently not supported.`
    );
    this.name = 'MerchantNotSupportedError';
  }
}

class MerchantUnavailableError extends ApiError {
  constructor(merchantName, reason = 'Service unreachable') {
    super(
      HTTP_STATUS.SERVICE_UNAVAILABLE,
      `Merchant '${merchantName}' is unavailable: ${reason}`
    );
    this.name = 'MerchantUnavailableError';
  }
}

class InvalidMerchantError extends ApiError {
  constructor(message = 'Invalid merchant parameters specified.') {
    super(HTTP_STATUS.BAD_REQUEST, message);
    this.name = 'InvalidMerchantError';
  }
}

class InvalidProductUrlError extends ApiError {
  constructor(url, merchantName = '') {
    const prefix = merchantName ? `for merchant '${merchantName}'` : '';
    super(
      HTTP_STATUS.BAD_REQUEST,
      `URL '${url}' is not a valid product URL ${prefix}`.trim()
    );
    this.name = 'InvalidProductUrlError';
  }
}

class ProductNotFoundError extends ApiError {
  constructor(productId, merchantName = '') {
    const prefix = merchantName ? `on merchant '${merchantName}'` : '';
    super(
      HTTP_STATUS.NOT_FOUND,
      `Product '${productId}' not found ${prefix}`.trim()
    );
    this.name = 'ProductNotFoundError';
  }
}

module.exports = {
  MerchantNotSupportedError,
  MerchantUnavailableError,
  InvalidMerchantError,
  InvalidProductUrlError,
  ProductNotFoundError,
};
