# ADR-012: Executor Abstraction Layer

## Status
Accepted

## Context
E-commerce product monitoring can utilize multiple execution techniques depending on platform capabilities: static API calls, headless browser scraping (Playwright), browser grids (Selenium), or direct HTTP fetching. Hardcoding scraping mechanics inside the monitoring engine prevents strategy switching.

## Decision
We implement `ExecutorInterface` (`initialize()`, `execute()`, `shutdown()`, `healthCheck()`, `supports()`, `getCapabilities()`) managed by `ExecutorRegistry` and `ExecutorFactory`. The orchestrator selects executors dynamically based on strategy configuration (`static`, `playwright`, `api`, `selenium`).

## Consequences
- Pluggable scraping engine strategies.
- Ability to mock scraping mechanics with `StaticExecutor` during testing.
