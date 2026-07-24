# ADR-073: Auto Recovery Strategy

## Status
Accepted

## Context
Manual intervention for subsystem failures (browser crashes, scheduler stops, queue stalls) is impractical in a production environment. The system needs self-healing capabilities.

## Decision
Implement AutoRecoveryService with pluggable recovery strategies per subsystem. Each strategy has configurable max attempts, cooldown periods, and automatic attempt counter reset on success.

## Consequences
- Browser, scheduler, queue, worker, publisher, and monitoring engine can self-recover
- Recovery attempts are bounded to prevent infinite loops
- Cooldown prevents rapid successive recovery attempts
- All recovery events generate alerts for operator awareness
