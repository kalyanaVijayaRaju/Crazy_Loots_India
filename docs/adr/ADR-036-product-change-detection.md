# ADR-036: Product Change Detection

## Status
Accepted

## Context
Products change beyond just price — titles, ratings, review counts, availability, sellers, coupons, and delivery information can all shift independently.

## Decision
We implement `ProductChangeDetector` comparing 9 product attributes (title, currentPrice, originalPrice, rating, reviewCount, availability, image, seller, coupon) between old and new product states.

## Consequences
- Comprehensive multi-attribute change awareness.
- Fine-grained change audit logs.
