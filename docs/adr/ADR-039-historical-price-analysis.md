# ADR-039: Historical Price Analysis Architecture

## Status
Accepted

## Context
Determining if a current product price represents a true deal requires evaluating historical price records across multiple time windows (30d, 90d, 180d, all-time) and calculating volatility.

## Decision
We implement `HistoricalPriceAnalyzer` to calculate 30/90/180-day lows, medians, averages, and volatility ratios from price history records.

## Consequences
- Accurate historical context for deal validation.
- Resilience against fake inflated list price discounts.
