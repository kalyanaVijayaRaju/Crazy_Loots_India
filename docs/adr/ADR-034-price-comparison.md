# ADR-034: Price Comparison Service

## Status
Accepted

## Context
Detecting meaningful price movements requires comparing newly scraped prices against stored prices and historical extremes (lowest/highest ever) to classify trends.

## Decision
We implement `PriceComparisonService` returning trend enums (`UP`, `DOWN`, `UNCHANGED`, `NEW_LOW`, `NEW_HIGH`), percentage change, and boolean flags for lowest/highest ever.

## Consequences
- Precise price movement classification.
- Foundation for future deal detection algorithms.
