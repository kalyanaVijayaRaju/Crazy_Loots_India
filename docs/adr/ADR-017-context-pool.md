# ADR-017: Isolated Context Pool Architecture

## Status
Accepted

## Context
E-commerce websites track user sessions, cookies, and localStorage. Scraping different merchants or products within the same browser context risks cookie leakage and cross-session pollution.

## Decision
We implement `ContextPool` to create isolated Playwright browser contexts for each monitoring task. Contexts configure custom viewports, user-agents, and locales, and are destroyed after execution.

## Consequences
- Total session isolation between scraping jobs.
- Clean cookie and storage state per task.
