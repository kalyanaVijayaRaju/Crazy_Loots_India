# ADR-041: Weighted Deal Scoring Model

## Status
Accepted

## Context
Deals vary in quality based on multiple dimensions (discount percentage, historical low status, rating, reviews, seller quality). A single metric cannot capture overall deal attractiveness.

## Decision
We implement `DealScoreEngine` calculating a 0–100 weighted score using configurable criteria weights (Discount: 35%, Historical Low: 25%, Rating: 15%, Review Count: 10%, Availability: 5%, Coupon: 5%, Seller Quality: 5%).

## Consequences
- Single unified quality score for ranking deals.
- Highly customizable scoring weights.
