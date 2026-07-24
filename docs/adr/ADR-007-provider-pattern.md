# ADR-007: Provider Pattern for Environment and System Services

## Status
Accepted

## Context
Directly invoking global runtime functions (`process.env`, `new Date()`, `crypto.randomUUID()`, `Math.random()`) inside domain logic causes tight coupling to system APIs and prevents deterministic unit testing and mocking.

## Decision
We enforce the Provider Pattern across the application. All system access must go through dedicated provider wrappers (`TimeProvider`, `IdProvider`, `RandomProvider`, `HashProvider`, `EnvironmentProvider`, `ConfigurationProvider`).

## Consequences
- Business logic is completely isolated from system calls.
- Deterministic testing with mock providers.
- Seamless transition to external configuration stores (e.g. AWS Secrets Manager or Parameter Store).
