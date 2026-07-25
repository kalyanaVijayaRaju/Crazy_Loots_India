/**
 * Amazon Centralized Selectors Dictionary
 */
const AmazonSelectors = Object.freeze({
  title: ['#productTitle', '#title span', 'h1.a-size-large'],
  currentPrice: [
    '#corePrice_desktop .a-price.aok-align-center .a-offscreen',
    '#corePriceDisplay_desktop_feature_div .a-price.aok-align-center .a-offscreen',
    '#corePrice_feature_div .a-price.aok-align-center .a-offscreen',
    '#apex_desktop .a-price.aok-align-center .a-offscreen',
    '#priceblock_dealprice',
    '#priceblock_ourprice',
    '#corePrice_desktop .a-price .a-offscreen',
    '#corePriceDisplay_desktop_feature_div .a-price .a-offscreen',
    '.a-price.aok-align-center .a-offscreen',
    '.a-price .a-offscreen',
  ],
  originalPrice: [
    '#corePrice_desktop .a-price.a-text-price .a-offscreen',
    '#corePriceDisplay_desktop_feature_div .a-price.a-text-price .a-offscreen',
    '.a-price.a-text-price .a-offscreen',
    '#priceblock_listprice',
    'span.a-text-price span.a-offscreen',
    '.a-size-small.a-color-secondary.a-text-strike',
  ],
  rating: [
    '#acrPopover span.a-icon-alt',
    'i.a-icon-star span.a-icon-alt',
    'span[data-hook="rating-out-of-text"]',
  ],
  reviewCount: [
    '#acrCustomerReviewText',
    '#answersAndReviewsCount',
    'span[data-hook="total-review-count"]',
  ],
  brand: [
    '#bylineInfo',
    'a#bylineInfo',
    'tr.po-brand td.po-break-word span',
  ],
  availability: [
    '#availability span',
    '#outOfStock span',
    '.a-color-price',
  ],
  images: [
    '#landingImage',
    '#imgBlkFront',
    '#main-image',
    'img[data-old-hires]',
  ],
  description: [
    '#feature-bullets ul',
    '#productDescription p',
    '#bookDescription_feature_div',
  ],
  breadcrumb: [
    '#wayfinding-breadcrumbs_feature_div ul',
    '.a-breadcrumb ul',
  ],
  coupon: [
    'span.promoPriceBlockMessage',
    '#vpcButton span',
    'label[for^="oneClickCoupon"]',
  ],
  delivery: [
    '#mir-layout-DELIVERY_BLOCK-slot-PRIMARY_DELIVERY_MESSAGE_LARGE b',
    '#ddmDeliveryMessage b',
  ],
  seller: [
    '#merchant-info a span',
    '#sellerProfileTriggerId',
  ],
});

module.exports = AmazonSelectors;
