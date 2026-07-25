/**
 * Publishing Mapper
 * Maps TelegramPost or PublishingPackage models to clean DTOs
 */
class PublishingMapper {
  static toDTO(doc) {
    if (!doc) return null;

    const raw = doc.toObject ? doc.toObject() : doc;

    return {
      id: raw._id ? String(raw._id) : raw.id || null,
      messageId: raw.messageId || null,
      channelId: raw.channelId || null,
      content: raw.content || raw.renderedMessages ? (raw.renderedMessages.telegram || '') : '',
      shortUrl: raw.shortUrl || raw.affiliateLink || '',
      status: raw.status || 'PUBLISHED',
      mode: raw.mode || 'DRY_RUN',
      publishedAt: raw.publishedAt ? new Date(raw.publishedAt).toISOString() : raw.createdAt ? new Date(raw.createdAt).toISOString() : null,
    };
  }

  static toListDTO(docs) {
    if (!Array.isArray(docs)) return [];
    return docs.map(PublishingMapper.toDTO).filter(Boolean);
  }
}

module.exports = PublishingMapper;
