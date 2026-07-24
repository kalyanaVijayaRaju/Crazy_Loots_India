# ADR-045: Duplicate Deal Prevention Strategy

## Status
Accepted

## Context
Repeated monitoring cycles on the same deal product can create multiple identical active deal records, cluttering approval queues and analytics.

## Decision
We implement `DealDuplicateChecker` checking for existing active deals for the same product within a configurable time window (default 12 hours).

## Consequences
- Single deal record per product per window.
- Prevention of duplicate approval queue entries.
