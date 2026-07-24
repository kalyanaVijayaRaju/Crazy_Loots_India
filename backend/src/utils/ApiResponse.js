const { HTTP_STATUS } = require('../constants');

class ApiResponse {
  /**
   * Standardized JSON API Response
   * @param {number} statusCode - HTTP status code
   * @param {string} message - Response message
   * @param {any} data - Response payload
   */
  constructor(statusCode = HTTP_STATUS.OK, message = 'Success', data = null) {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    if (data !== null) {
      this.data = data;
    }
    this.timestamp = new Date().toISOString();
  }

  static success(res, message = 'Success', data = null, statusCode = HTTP_STATUS.OK) {
    return res.status(statusCode).json(new ApiResponse(statusCode, message, data));
  }

  static created(res, message = 'Resource created successfully', data = null) {
    return res
      .status(HTTP_STATUS.CREATED)
      .json(new ApiResponse(HTTP_STATUS.CREATED, message, data));
  }
}

module.exports = ApiResponse;
