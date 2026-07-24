# ADR-066: Background Monitoring Worker

## Status
Accepted

## Context
Executing monitoring tasks asynchronously requires worker routines that consume jobs, respect execution locks, and handle retries gracefully.

## Decision
We implement `MonitoringWorker` consuming monitoring tasks while respecting `MonitoringLockManager` locks.

## Consequences
- Asynchronous monitoring task execution.
- Protection against concurrent lock collisions.
