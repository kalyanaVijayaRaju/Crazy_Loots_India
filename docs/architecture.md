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
                       | Playwright Browser Platform|
                       |  (Browser/Context/Page) |
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
 [ Orchestration Layer ]   -> MonitoringEngine, MonitoringCoordinator, Dispatcher, Executor Abstractions
         |
         v
 [ Pipeline Layer ]        -> PipelineCoordinator, Middleware Chain, Policies, Task/Result Builders
         |
         v
 [ Browser Platform ]      -> PlaywrightAdapter, BrowserPool, ContextPool, PagePool, DomService
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

## Playwright Browser Infrastructure Architecture

The Playwright Infrastructure isolates browser automation mechanics into dedicated resource pools and helper services, exposing access through `PlaywrightAdapter`.

```
                    [ BrowserManager ]
                            │
                            ▼
                     [ BrowserPool ] (Reuses Browser Instances)
                            │
                            ▼
                     [ ContextPool ] (Session & Cookie Isolation)
                            │
                            ▼
                      [ PagePool ] (Tab & Resource Allocation)
                            │
      ┌─────────────────────┼─────────────────────┐
      ▼                     ▼                     ▼
[ NavigationService ]  [ DomService ]   [ ScreenshotService ]
```

### Key Architectural Patterns & ADRs
- **[ADR-006: Monitoring Pipeline](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-006-monitoring-pipeline.md)**: Prioritized stages with failure rollback.
- **[ADR-007: Provider Pattern](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-007-provider-pattern.md)**: System API isolation.
- **[ADR-008: Feature Flags](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-008-feature-flags.md)**: Runtime feature toggling.
- **[ADR-009: Plugin Architecture](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-009-plugin-architecture.md)**: Lifecycle-managed extensions.
- **[ADR-010: Middleware Pipeline](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-010-middleware-pipeline.md)**: Cross-cutting pipeline interceptors.
- **[ADR-011: Monitoring Orchestrator](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-011-monitoring-orchestrator.md)**: System coordinator facade.
- **[ADR-012: Executor Abstraction](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-012-executor-abstraction.md)**: Pluggable scraping engine strategies.
- **[ADR-013: Scheduler Abstraction](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-013-scheduler-abstraction.md)**: In-memory task scheduler.
- **[ADR-014: Unified Health Monitoring](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-014-health-monitoring.md)**: Component health aggregator.
- **[ADR-015: Statistics & Tracing](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-015-statistics-and-tracing.md)**: Distributed tracing and metrics.
- **[ADR-016: Browser Pool](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-016-browser-pool.md)**: Reusable browser instance pool.
- **[ADR-017: Context Pool](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-017-context-pool.md)**: Isolated browser context pool.
- **[ADR-018: Page Pool](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-018-page-pool.md)**: Reusable Playwright page pool.
- **[ADR-019: Browser Crash Recovery](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-019-browser-recovery.md)**: Automated process recovery.
- **[ADR-020: Playwright Abstraction](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-020-playwright-abstraction.md)**: Adapter isolation for Playwright APIs.
- **[ADR-021: Browser Metrics](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-021-browser-metrics.md)**: Resource & navigation telemetry.
- **[ADR-022: Browser Registry](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-022-browser-registry.md)**: Active resource registry.

---

## Future Scaling Strategy

1. **Caching & Queueing**:
   - Integration of **Redis** for distributed locking, price history caching, and request rate limiting.
   - Substitution of `MemoryQueue` with **BullMQ** or Redis streams.

2. **Scraper Resilience**:
   - Rotation of user-agents, proxies, and headless browser sessions using Playwright pool controllers.

3. **Deployment Topology**:
   - AWS EC2 managed by PM2 cluster mode with Nginx reverse proxy, SSL termination, and cloud log collection.
