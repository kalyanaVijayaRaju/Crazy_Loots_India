/**
 * Default Configurable Rules Registry
 */
const defaultRules = [
  {
    id: 'rule_availability',
    name: 'In Stock Check',
    version: '1.0.0',
    enabled: true,
    priority: 100,
    description: 'Product must be in stock',
    evaluate: (context) => {
      const avail = context.product.availability;
      return avail === 'IN_STOCK' || avail === 'In stock.';
    },
  },
  {
    id: 'rule_min_discount',
    name: 'Minimum Discount Threshold',
    version: '1.0.0',
    enabled: true,
    priority: 90,
    description: 'Discount percentage must be >= 15%',
    evaluate: (context) => {
      const discount = context.comparisonSpec.discountPercentage || 0;
      return discount >= 15;
    },
  },
  {
    id: 'rule_rating_threshold',
    name: 'Minimum Rating Threshold',
    version: '1.0.0',
    enabled: true,
    priority: 80,
    description: 'Product rating must be >= 3.5 or zero if new product',
    evaluate: (context) => {
      const rating = context.product.rating || 0;
      return rating === 0 || rating >= 3.5;
    },
  },
  {
    id: 'rule_review_count_threshold',
    name: 'Minimum Review Count Threshold',
    version: '1.0.0',
    enabled: true,
    priority: 70,
    description: 'Review count must be >= 10 or zero if new product',
    evaluate: (context) => {
      const reviews = context.product.reviewCount || 0;
      return reviews === 0 || reviews >= 10;
    },
  },
  {
    id: 'rule_valid_price',
    name: 'Valid Deal Price',
    version: '1.0.0',
    enabled: true,
    priority: 110,
    description: 'Current price must be greater than 0',
    evaluate: (context) => {
      return (context.product.currentPrice || 0) > 0;
    },
  },
];

class RuleRegistry {
  constructor() {
    this.rules = new Map(defaultRules.map((r) => [r.id, { ...r }]));
  }

  registerRule(rule) {
    if (!rule || !rule.id || typeof rule.evaluate !== 'function') {
      throw new Error('RuleRegistry: Rule must have an id and evaluate function.');
    }
    this.rules.set(rule.id, rule);
  }

  unregisterRule(ruleId) {
    this.rules.delete(ruleId);
  }

  getRules() {
    return Array.from(this.rules.values())
      .filter((r) => r.enabled)
      .sort((a, b) => b.priority - a.priority);
  }
}

module.exports = new RuleRegistry();
