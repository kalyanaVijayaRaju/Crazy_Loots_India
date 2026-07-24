# ADR-046: Product Deal Cooldown Strategy

## Status
Accepted

## Context
Even after a deal is resolved or expired, immediately re-evaluating the same product can cause spammy deal notifications for minor price oscillations.

## Decision
We implement `DealCooldownManager` maintaining product-level cooldown timestamps (default 6 hours) before a new deal evaluation can emit a deal detection event for the product.

## Consequences
- Controlled deal notification frequency per product.
- Dampening of minor price fluctuations.
