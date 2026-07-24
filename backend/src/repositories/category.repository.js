const BaseRepository = require('./base.repository');
const Category = require('../models/category.model');
const { CategoryStatus } = require('../constants/enums');

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  async findBySlug(slug) {
    return this.findOne({ slug: slug.toLowerCase().trim() });
  }

  async findSubcategories(parentId) {
    return this.findMany({ parentCategory: parentId, status: CategoryStatus.ACTIVE });
  }

  async findRootCategories() {
    return this.findMany({ parentCategory: null, status: CategoryStatus.ACTIVE });
  }
}

module.exports = new CategoryRepository();
