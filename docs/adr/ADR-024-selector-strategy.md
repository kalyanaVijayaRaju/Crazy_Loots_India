# ADR-024: Centralized Selector Strategy

## Status
Accepted

## Context
E-commerce websites frequently update DOM element IDs and class names. Hardcoding CSS selectors inside scraper or parser methods leads to fragile code.

## Decision
We enforce a centralized selector dictionary (`AmazonSelectors`) with array-based fallback selector chains for every product property. Hardcoding selectors anywhere else is prohibited.

## Consequences
- Single location for selector updates upon layout changes.
- Resilient fallback chains.
