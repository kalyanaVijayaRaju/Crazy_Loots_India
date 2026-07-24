# ADR-013: Scheduler Abstraction Architecture

## Status
Accepted

## Context
Periodic product price monitoring requires task scheduling abstractions. Hardcoding node-cron or setInterval into application logic prevents migrating to distributed schedulers (e.g. BullMQ, Redis Scheduler, or AWS EventBridge).

## Decision
We establish `SchedulerInterface` (`schedule()`, `cancel()`, `pause()`, `resume()`, `shutdown()`, `healthCheck()`) with an in-memory implementation (`MemoryScheduler`). Higher-level orchestration interacts exclusively with `SchedulerInterface`.

## Consequences
- Clean separation between scheduling policy and queue processing.
- Zero-code-change migration to Redis/BullMQ distributed schedulers.
