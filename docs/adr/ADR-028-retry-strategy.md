# ADR-028: Extraction Retry Strategy

## Status
Accepted

## Context
Transient network glitches, slow page loads, or temporary bot protection challenges can cause intermittent extraction failures.

## Decision
We implement `AmazonRetryHandler` using exponential backoff to retry navigation and DOM extraction operations up to 3 times before failing.

## Consequences
- Increased extraction resilience.
- Reduction in false-positive extraction failures.
