# ADR-026: Modular Parser Layer

## Status
Accepted

## Context
Raw DOM extraction yields unparsed strings (e.g. `₹2,499`, `4.4 out of 5 stars`, `8,520 ratings`). Converting these into typed values requires clean parsing rules.

## Decision
We implement specialized static parser classes (`PriceParser`, `RatingParser`, `ReviewParser`, `CurrencyParser`, `BrandParser`, `AvailabilityParser`).

## Consequences
- Guaranteed numeric types for prices, ratings, and review counts.
- High test coverage for edge case string formats.
