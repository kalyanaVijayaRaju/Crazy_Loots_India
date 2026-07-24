# Crazy Loots India - Architecture Documentation

## Overview

**Crazy Loots India** is an automated, production-grade e-commerce deal discovery and affiliate marketing backend system integrated with Telegram. The system continuously monitors e-commerce platforms (e.g., Amazon, Flipkart, Myntra), detects price drops and loot deals using historical price algorithms, converts product links into monetization/affiliate links, and broadcasts formatted notifications to a Telegram Channel.

---

## High-Level Architecture Diagram

```
 +------------------+     +-------------------+     +---------------------+
 |  E-Commerce Site |     | E-Commerce Site B |     |  E-Commerce Site C  |
 +--------+---------+     +---------+---------+     +----------+----------+
          |                         |                          |
          +-------------------------+--------------------------+
                                    | Scrapes HTML / APIs
                                    v
                       +-------------------------+
                       |    Scraper Service      |
                       |  (Playwright / Axios)   |
                       +------------+------------+
                                    | Raw Product Data
                                    v
                       +-------------------------+
                       |   Deal Detector Engine  |
                       | (Price Drop / Discount) |
                       +------------+------------+
                                    | Verified Loot Deal
                                    v
                       +-------------------------+
                       |    Affiliate Service    |
                       |  (Tagging / Shortener)  |
                       +------------+------------+
                                    | Monetized Deal
                                    v
                       +-------------------------+
                       | Telegram Publisher Bot  |
                       |   (Bot API Service)     |
                       +------------+------------+
                                    | Broadcasts Message
                                    v
                       +-------------------------+
                       |    Telegram Channel     |
                       |   (Crazy Loots India)   |
                       +-------------------------+
```

---

## Layered Clean Architecture

The project enforces Clean Architecture principles with a strict unidirectional flow of dependencies:

```
 HTTP Request / Cron Trigger
         |
         v
 [ Routes Layer ]          -> Defines API endpoints & maps middleware
         |
         v
 [ Controllers Layer ]     -> Request validation, response formatting, status codes (Thin layer)
         |
         v
 [ Pipeline Layer ]        -> Coordinator, Middleware Chain, Policies, Task/Result Builders
         |
         v
 [ Core Engine Layer ]     -> In-process EventBus, QueueManager, StateMachine, Context, DI Container
         |
         v
 [ Services Layer ]        -> Core business logic, orchestration, validation rules
         |
         v
 [ Merchant Layer ]        -> Standardized Merchant Abstraction (Adapter, Factory, DTOs)
         |
         v
 [ Repositories Layer ]    -> Data access abstraction, database queries (Mongoose abstraction)
         |
         v
 [ Models / Storage Layer ] -> Database schema definition & persistence (MongoDB)
```

---

## Monitoring Pipeline Architecture

The Monitoring Pipeline structures request execution into prioritized middleware chains and stage coordinators, enforcing policies, provider abstractions, feature flags, and plugin extensions.

```
                  [ MonitoringTask.Builder ]
                              │
                              ▼
                   [ PipelineCoordinator ]
                              │
    ┌─────────────────────────┴─────────────────────────┐
    ▼                                                   ▼
[ Middleware Chain ]                            [ Execution Stages ]
 (Validation, State,                             (Stage 1 -> Priority 100)
  DuplicateCheck, Merchant,                       (Stage 2 -> Priority 80)
  Priority, Policies, Logging)                    (Stage 3 -> Priority 50)
    │                                                   │
    └─────────────────────────┬─────────────────────────┘
                              │ (Emits Pipeline & Stage Events)
                              ▼
                 [ MonitoringResult.Builder ]
```

### 1. Key Architectural Patterns & ADRs
- **[ADR-006: Monitoring Pipeline](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-006-monitoring-pipeline.md)**: Prioritized stages with automatic failure rollback.
- **[ADR-007: Provider Pattern](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-007-provider-pattern.md)**: System API isolation (`TimeProvider`, `IdProvider`, `RandomProvider`, `EnvironmentProvider`, `ConfigurationProvider`).
- **[ADR-008: Feature Flags](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-008-feature-flags.md)**: Runtime feature toggling (`ENABLE_PLAYWRIGHT`, `ENABLE_TELEGRAM`, `ENABLE_REDIS`).
- **[ADR-009: Plugin Architecture](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-009-plugin-architecture.md)**: Lifecycle-managed extensions (`PlaywrightPlugin`, `TelegramPlugin`, etc.).
- **[ADR-010: Middleware Pipeline](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-010-middleware-pipeline.md)**: Cross-cutting pipeline interceptors.

---

## Future Scaling Strategy

1. **Caching & Queueing**:
   - Integration of **Redis** for distributed locking, price history caching, and request rate limiting.
   - Substitution of `MemoryQueue` with **BullMQ** or Redis streams.

2. **Scraper Resilience**:
   - Rotation of user-agents, proxies, and headless browser sessions using Playwright pool controllers.

3. **Deployment Topology**:
   - AWS EC2 managed by PM2 cluster mode with Nginx reverse proxy, SSL termination, and cloud log collection.
