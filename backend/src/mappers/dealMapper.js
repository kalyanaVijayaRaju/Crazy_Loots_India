const ProductMapper = require('./productMapper');

/**
 * Deal Mapper
 * Maps Deal documents/models to clean external DTOs
 */
class DealMapper {
  static toDTO(doc) {
    if (!doc) return null;

    const raw = doc.toObject ? doc.toObject() : doc;

    return {
      id: raw._id ? String(raw._id) : raw.id || null,
      dealPrice: raw.dealPrice || 0,
      originalPrice: raw.originalPrice || 0,
      discountPercentage: raw.discountPercentage || 0,
      dealScore: raw.dealScore || 0,
      status: raw.status || 'PENDING',
      product: raw.product && typeof raw.product === 'object' ? ProductMapper.toDTO(raw.product) : raw.product || null,
      merchant: raw.merchant || 'amazon',
      createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : null,
      updatedAt: raw.updatedAt ? new Date(raw.updatedAt).toISOString() : null,
    };
  }

  static toListDTO(docs) {
    if (!Array.isArray(docs)) return [];
    return docs.map(DealMapper.toDTO).filter(Boolean);
  }
}

module.exports = DealMapper;
