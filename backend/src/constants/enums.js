/**
 * Centralized Domain Enums for Crazy Loots India
 */

const MerchantStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
});

const CategoryStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
});

const ProductStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DISCONTINUED: 'DISCONTINUED',
});

const DealStatus = Object.freeze({
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  PUBLISHED: 'PUBLISHED',
  EXPIRED: 'EXPIRED',
  REJECTED: 'REJECTED',
});

const CouponStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  INACTIVE: 'INACTIVE',
});

const PriceAlertStatus = Object.freeze({
  ACTIVE: 'ACTIVE',
  TRIGGERED: 'TRIGGERED',
  DISABLED: 'DISABLED',
  EXPIRED: 'EXPIRED',
});

const ScrapeJobStatus = Object.freeze({
  PENDING: 'PENDING',
  RUNNING: 'RUNNING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
});

const Currency = Object.freeze({
  INR: 'INR',
  USD: 'USD',
});

const Availability = Object.freeze({
  IN_STOCK: 'IN_STOCK',
  OUT_OF_STOCK: 'OUT_OF_STOCK',
  PRE_ORDER: 'PRE_ORDER',
});

const DealType = Object.freeze({
  FLASH: 'FLASH',
  LIGHTNING: 'LIGHTNING',
  PRICE_DROP: 'PRICE_DROP',
  COUPON: 'COUPON',
  BANK_OFFER: 'BANK_OFFER',
  CLEARANCE: 'CLEARANCE',
});

module.exports = {
  MerchantStatus,
  CategoryStatus,
  ProductStatus,
  DealStatus,
  CouponStatus,
  PriceAlertStatus,
  ScrapeJobStatus,
  Currency,
  Availability,
  DealType,
};
