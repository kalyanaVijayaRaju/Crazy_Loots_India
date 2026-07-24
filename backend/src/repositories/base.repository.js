/**
 * BaseRepository Class
 * Generic repository encapsulating all database operations with Mongoose
 */
class BaseRepository {
  /**
   * @param {Object} model - Mongoose Model instance
   */
  constructor(model) {
    if (!model) {
      throw new Error('BaseRepository requires a Mongoose model instance');
    }
    this.model = model;
  }

  /**
   * Create a new document
   * @param {Object} data
   * @param {Object} [options]
   * @returns {Promise<Object>} Created document
   */
  async create(data, options = {}) {
    if (Array.isArray(data)) {
      return this.model.insertMany(data, options);
    }
    const doc = new this.model(data);
    return doc.save(options);
  }

  /**
   * Find document by ID
   * @param {string|Object} id
   * @param {string|Object} [select]
   * @param {Object} [options]
   * @returns {Promise<Object|null>}
   */
  async findById(id, select = null, options = {}) {
    let query = this.model.findById(id, select, options);
    if (options.populate) {
      query = query.populate(options.populate);
    }
    if (options.lean !== false) {
      query = query.lean();
    }
    return query.exec();
  }

  /**
   * Find single document by query filter
   * @param {Object} filter
   * @param {string|Object} [select]
   * @param {Object} [options]
   * @returns {Promise<Object|null>}
   */
  async findOne(filter = {}, select = null, options = {}) {
    let query = this.model.findOne(filter, select, options);
    if (options.populate) {
      query = query.populate(options.populate);
    }
    if (options.sort) {
      query = query.sort(options.sort);
    }
    if (options.lean !== false) {
      query = query.lean();
    }
    return query.exec();
  }

  /**
   * Find multiple documents by query filter
   * @param {Object} filter
   * @param {Object} [options]
   * @returns {Promise<Array>}
   */
  async findMany(filter = {}, options = {}) {
    let query = this.model.find(filter, options.select, options);
    if (options.populate) {
      query = query.populate(options.populate);
    }
    if (options.sort) {
      query = query.sort(options.sort);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.skip) {
      query = query.skip(options.skip);
    }
    if (options.lean !== false) {
      query = query.lean();
    }
    return query.exec();
  }

  /**
   * Update document by ID
   * @param {string|Object} id
   * @param {Object} updateData
   * @param {Object} [options]
   * @returns {Promise<Object|null>} Updated document
   */
  async update(id, updateData, options = {}) {
    const defaultOptions = { new: true, runValidators: true, lean: true, ...options };
    return this.model.findByIdAndUpdate(id, updateData, defaultOptions).exec();
  }

  /**
   * Delete document by ID
   * @param {string|Object} id
   * @returns {Promise<Object|null>} Deleted document
   */
  async delete(id) {
    return this.model.findByIdAndDelete(id).exec();
  }

  /**
   * Paginated search
   * @param {Object} filter
   * @param {Object} [options]
   * @param {number} [options.page=1]
   * @param {number} [options.limit=10]
   * @param {Object|string} [options.sort]
   * @param {Object|string} [options.select]
   * @param {Object|string} [options.populate]
   * @returns {Promise<Object>} { docs, totalDocs, limit, page, totalPages, hasPrevPage, hasNextPage }
   */
  async paginate(filter = {}, options = {}) {
    const page = Math.max(1, parseInt(options.page, 10) || 1);
    const limit = Math.max(1, parseInt(options.limit, 10) || 10);
    const skip = (page - 1) * limit;

    const totalDocs = await this.model.countDocuments(filter);
    const totalPages = Math.ceil(totalDocs / limit) || 1;

    let query = this.model.find(filter, options.select).skip(skip).limit(limit);

    if (options.sort) {
      query = query.sort(options.sort);
    }
    if (options.populate) {
      query = query.populate(options.populate);
    }
    if (options.lean !== false) {
      query = query.lean();
    }

    const docs = await query.exec();

    return {
      docs,
      totalDocs,
      limit,
      page,
      totalPages,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }

  /**
   * Count documents matching filter
   * @param {Object} filter
   * @returns {Promise<number>}
   */
  async count(filter = {}) {
    return this.model.countDocuments(filter).exec();
  }

  /**
   * Check if any document matches filter
   * @param {Object} filter
   * @returns {Promise<boolean>}
   */
  async exists(filter = {}) {
    const result = await this.model.exists(filter);
    return Boolean(result);
  }
}

module.exports = BaseRepository;
