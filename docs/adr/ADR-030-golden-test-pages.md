# ADR-030: Golden Test Pages Fixture Strategy

## Status
Accepted

## Context
Relying exclusively on live e-commerce websites for unit testing causes flaky tests, rate limiting, and network overhead.

## Decision
We establish a suite of 8 offline HTML golden test fixtures (`normal-product`, `out-of-stock`, `lightning-deal`, `coupon-product`, `no-reviews`, `no-rating`, `multiple-image`, `variation-product`) managed by `FixtureManager`.

## Consequences
- Fast, deterministic unit tests.
- Instant regression detection when parser rules change.
