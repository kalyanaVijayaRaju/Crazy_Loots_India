# ADR-018: Playwright Page Pool Architecture

## Status
Accepted

## Context
Creating and closing Playwright pages rapidly within contexts requires pool limit enforcement to prevent memory exhaustion when monitoring hundreds of products concurrently.

## Decision
We implement `PagePool` (`maxPages: 10`) to acquire and release Playwright pages tied to contexts, unregistering active pages upon completion.

## Consequences
- Prevents memory leaks from unclosed browser tabs.
- Bounded concurrency across active pages.
