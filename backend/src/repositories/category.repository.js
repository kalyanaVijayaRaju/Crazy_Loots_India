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

  async findOrCreateBySlug(slug = 'electronics', name = 'Electronics') {
    const cleanSlug = slug.toLowerCase().trim();
    let category = await this.findBySlug(cleanSlug);
    if (!category) {
      category = await this.create({
        name,
        slug: cleanSlug,
        status: CategoryStatus.ACTIVE,
      });
    }
    return category;
  }

  async findSubcategories(parentId) {
    return this.findMany({ parentCategory: parentId, status: CategoryStatus.ACTIVE });
  }

  async findRootCategories() {
    return this.findMany({ parentCategory: null, status: CategoryStatus.ACTIVE });
  }
}

module.exports = new CategoryRepository();
