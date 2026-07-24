# ADR-065: Subsystem Startup Lifecycle

## Status
Accepted

## Context
Subsystems have strict dependency order requirements (e.g. Database $\rightarrow$ Repositories $\rightarrow$ Merchant Registry $\rightarrow$ Browser Platform $\rightarrow$ Engines).

## Decision
We implement `StartupManager` enforcing explicit sequential initialization steps and idempotent startup checks.

## Consequences
- Guaranteed dependency readiness before engine execution.
- Idempotent startup checks preventing duplicate initialization.
