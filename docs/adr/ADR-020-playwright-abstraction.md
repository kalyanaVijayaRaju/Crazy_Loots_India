# ADR-020: Playwright Adapter Abstraction

## Status
Accepted

## Context
Directly referencing third-party `playwright` calls throughout scraper or domain logic creates tight coupling and breaks Clean Architecture.

## Decision
We enforce `PlaywrightAdapter` as the sole boundary wrapper for Playwright interactions. The adapter handles native Playwright detection, mock fallback modes, and browser instantiation.

## Consequences
- Scraping and domain logic have zero direct dependency on raw Playwright imports.
- Easy mocking for unit and integration tests.
