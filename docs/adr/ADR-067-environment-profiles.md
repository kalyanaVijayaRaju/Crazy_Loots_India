# ADR-067: Environment Profile Management

## Status
Accepted

## Context
Deploying across development, staging, and production environments requires environment-specific configurations for publishing modes, feature flags, and log levels.

## Decision
We implement `EnvironmentProfileManager` managing profile definitions for `development`, `staging`, and `production`.

## Consequences
- Environment-specific publishing mode enforcement.
- Centralized environment feature configuration.
