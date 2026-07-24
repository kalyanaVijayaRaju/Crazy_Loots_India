class PreviewGenerator {
  generatePreviews(renderedMessages, images) {
    return {
      telegram: {
        type: 'photo_caption',
        photoUrl: images.socialPreview || images.original,
        caption: renderedMessages.telegram,
      },
      website: {
        cardType: 'loot_deal_card',
        data: renderedMessages.website,
        imageUrl: images.thumbnail,
      },
      whatsapp: {
        type: 'text_with_preview',
        text: renderedMessages.whatsapp,
      },
    };
  }
}

module.exports = new PreviewGenerator();
