/**
 * Monitoring Queue Priority Levels
 */
const PriorityLevels = Object.freeze({
  FLASH_SALE: 100,
  HIGH: 80,
  COUPON: 60,
  BANK_OFFER: 50,
  NORMAL: 40,
  LOW: 10,
});

/**
 * Priority Name Mapping
 */
const PriorityNames = Object.freeze({
  100: 'FLASH_SALE',
  80: 'HIGH',
  60: 'COUPON',
  50: 'BANK_OFFER',
  40: 'NORMAL',
  10: 'LOW',
});

module.exports = {
  PriorityLevels,
  PriorityNames,
};
