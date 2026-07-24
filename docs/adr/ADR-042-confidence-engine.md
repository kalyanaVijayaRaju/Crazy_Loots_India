# ADR-042: Deal Confidence Engine

## Status
Accepted

## Context
High deal scores calculated on sparse price history data or unrated products carry higher risk of false positives than deals backed by extensive historical telemetry.

## Decision
We implement `DealConfidenceEngine` calculating a 0–100% confidence rating with explicit reasoning based on historical data volume, rating count, and deal score consistency.

## Consequences
- Risk awareness for automated or manual deal approval.
- Exposes clear confidence reasoning to reviewers.
