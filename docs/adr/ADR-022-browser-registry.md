# ADR-022: Centralized Browser Resource Registry

## Status
Accepted

## Context
Tracking active browser processes, contexts, and pages across asynchronous pool requests requires a thread-safe registry to prevent memory leaks and track allocation metadata.

## Decision
We implement `BrowserRegistry` to record registered browser, context, and page instances with unique IDs (`brw_...`, `ctx_...`, `pg_...`) and metadata.

## Consequences
- Accurate tracking of all allocated browser resources.
- Clean resource unregistration upon teardown.
