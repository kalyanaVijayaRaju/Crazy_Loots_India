# ADR-077: Chaos Testing Framework

## Status
Accepted

## Context
Production systems must be resilient to unexpected failures. Without controlled failure testing, the team cannot verify that recovery mechanisms work correctly.

## Decision
Implement ChaosTestRunner with 6 simulated failure scenarios (browser crash, Telegram failure, MongoDB timeout, selector failure, queue overflow, scheduler interruption). Each scenario injects a fault and verifies graceful recovery.

## Consequences
- Recovery mechanisms are validated before production deployment
- Failure scenarios are repeatable and automated
- Chaos test results are tracked and alertable
- Recovery gaps are identified proactively
