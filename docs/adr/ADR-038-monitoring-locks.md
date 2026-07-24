# ADR-038: Monitoring Execution Locks

## Status
Accepted

## Context
Concurrent scheduling or manual triggers can cause duplicate monitoring tasks for the same product, wasting resources and producing conflicting database writes.

## Decision
We implement `MonitoringLockManager` using an in-process `Set` to enforce one active monitoring task per product. Locks are acquired before execution and released in a `finally` block.

## Consequences
- Guaranteed single concurrent execution per product.
- Clean lock release even on failure paths.
