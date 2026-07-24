# ADR-072: Circuit Breaker Pattern

## Status
Accepted

## Context
External dependencies (Amazon, Telegram, MongoDB, affiliates) can fail transiently. Without circuit breakers, the system would continue making failing calls, consuming resources and causing cascading failures.

## Decision
Implement a generic CircuitBreaker class with CLOSED/OPEN/HALF_OPEN states, managed via a CircuitBreakerRegistry. Each protected dependency has pre-configured failure thresholds and reset timeouts.

## Consequences
- Cascading failures are prevented by short-circuiting calls to failing dependencies
- The system self-heals through automatic HALF_OPEN probing
- Circuit states are exposed via the Observability API for monitoring
- Protected: Amazon Merchant, Telegram Client, Browser, MongoDB, Affiliate Provider, Short URL Provider
