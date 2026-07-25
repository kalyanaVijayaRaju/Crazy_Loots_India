/**
 * Product Mapper
 * Maps database models or domain objects to clean external DTOs
 */
class ProductMapper {
  static toDTO(doc) {
    if (!doc) {return null;}

    const raw = doc.toObject ? doc.toObject() : doc;

    return {
      id: raw._id ? String(raw._id) : raw.id || null,
      productId: raw.productId || null,
      merchant: raw.merchant || 'amazon',
      title: raw.title || '',
      currentPrice: raw.currentPrice || 0,
      originalPrice: raw.originalPrice || raw.currentPrice || 0,
      discountPercentage: raw.originalPrice && raw.currentPrice
        ? Math.round(((raw.originalPrice - raw.currentPrice) / raw.originalPrice) * 100)
        : 0,
      rating: raw.rating || 0,
      reviewCount: raw.reviewCount || 0,
      availability: raw.availability || 'IN_STOCK',
      productUrl: raw.productUrl || '',
      image: raw.image || '',
      metadata: raw.metadata || {},
      createdAt: raw.createdAt ? new Date(raw.createdAt).toISOString() : null,
      updatedAt: raw.updatedAt ? new Date(raw.updatedAt).toISOString() : null,
    };
  }

  static toListDTO(docs) {
    if (!Array.isArray(docs)) {return [];}
    return docs.map(ProductMapper.toDTO).filter(Boolean);
  }
}

module.exports = ProductMapper;
