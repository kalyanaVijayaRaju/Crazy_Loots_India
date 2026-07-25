class PriceParser {
  static parse(priceStr) {
    if (!priceStr || typeof priceStr !== 'string') {
      return 0;
    }
    const match = priceStr.match(/(?:(?:₹|RS\.?|INR)\s*)?([0-9]{1,3}(?:,[0-9]{2,3})*(?:\.[0-9]{1,2})?)/i);
    if (match && match[1]) {
      const num = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(num) && num > 0) {
        return num;
      }
    }
    const clean = priceStr.replace(/[^0-9.]/g, '');
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  }
}

class RatingParser {
  static parse(ratingStr) {
    if (!ratingStr || typeof ratingStr !== 'string') {
      return 0;
    }
    const match = ratingStr.match(/([0-9.]+)/);
    if (match && match[1]) {
      const val = parseFloat(match[1]);
      return isNaN(val) ? 0 : Math.min(5, Math.max(0, val));
    }
    return 0;
  }
}

class ReviewParser {
  static parse(reviewStr) {
    if (!reviewStr || typeof reviewStr !== 'string') {
      return 0;
    }
    const clean = reviewStr.replace(/[^0-9]/g, '');
    const val = parseInt(clean, 10);
    return isNaN(val) ? 0 : val;
  }
}

class CurrencyParser {
  static parse(currencyStr) {
    if (currencyStr && (currencyStr.includes('₹') || currencyStr.includes('INR'))) {
      return 'INR';
    }
    return 'INR';
  }
}

class BrandParser {
  static parse(brandStr) {
    if (!brandStr || typeof brandStr !== 'string') {
      return 'Generic';
    }
    return brandStr.replace(/^Brand:\s*/i, '').replace(/^Visit the\s*/i, '').replace(/\s*Store$/i, '').trim() || 'Generic';
  }
}

class AvailabilityParser {
  static parse(availStr) {
    if (!availStr || typeof availStr !== 'string') {
      return 'IN_STOCK';
    }
    const lower = availStr.toLowerCase();
    if (lower.includes('currently unavailable') || lower.includes('out of stock')) {
      return 'OUT_OF_STOCK';
    }
    return 'IN_STOCK';
  }
}

class ImageParser {
  static parse(imgUrl) {
    if (!imgUrl || typeof imgUrl !== 'string') {
      return 'https://m.media-amazon.com/images/I/sample.jpg';
    }
    return imgUrl.trim();
  }
}

class CouponParser {
  static parse(couponStr) {
    if (!couponStr || typeof couponStr !== 'string') {
      return null;
    }
    return couponStr.trim();
  }
}

class DeliveryParser {
  static parse(deliveryStr) {
    if (!deliveryStr || typeof deliveryStr !== 'string') {
      return '';
    }
    return deliveryStr.trim();
  }
}

module.exports = {
  PriceParser,
  RatingParser,
  ReviewParser,
  CurrencyParser,
  BrandParser,
  AvailabilityParser,
  ImageParser,
  CouponParser,
  DeliveryParser,
};
