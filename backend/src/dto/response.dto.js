/**
 * Standardized Response DTO Formatter
 */
class ResponseDTO {
  /**
   * Format success response
   * @param {string} message
   * @param {*} [data=null]
   * @param {Object} [meta={}]
   * @returns {Object}
   */
  static success(message, data = null, meta = {}) {
    return {
      success: true,
      message,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }

  /**
   * Format paginated list response
   * @param {string} message
   * @param {Array} items
   * @param {number} total
   * @param {number} page
   * @param {number} limit
   * @returns {Object}
   */
  static paginated(message, items, total, page, limit) {
    const totalPages = Math.ceil(total / limit) || 1;
    return {
      success: true,
      message,
      data: items,
      meta: {
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Format error response
   * @param {string} message
   * @param {Array<string>} [errors=[]]
   * @param {number} [code=500]
   * @returns {Object}
   */
  static error(message, errors = [], code = 500) {
    return {
      success: false,
      message,
      errors: errors.length > 0 ? errors : [message],
      code,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  }
}

module.exports = ResponseDTO;
