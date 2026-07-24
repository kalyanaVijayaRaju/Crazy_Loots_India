# ADR-031: Offline Mock Browser Testing

## Status
Accepted

## Context
Running Playwright browser instances during local developer tests or CI pipeline runs can slow down test suites and require headless browser binaries.

## Decision
We implement `MockPlaywrightAdapter` to simulate Playwright page instances directly from local HTML golden test fixtures.

## Consequences
- Zero-browser-launch offline testing.
- Extremely fast unit test execution.
