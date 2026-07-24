# ADR-064: System Orchestration Architecture

## Status
Accepted

## Context
Connecting 13 decoupled subsystems requires a central orchestrator to manage initialization order, dependency checks, and graceful shutdown without creating tight couplings.

## Decision
We implement `SystemOrchestrator` and `StartupManager` to coordinate the subsystem bootstrap sequence.

## Consequences
- Single, predictable application startup sequence.
- Clean separation of orchestration from domain logic.
