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

## Core Engine Foundation Architecture

The Core Engine provides reusable internal infrastructure designed for zero-dependency local execution while enabling zero-code-change pluggability for distributed infrastructure (Redis, RabbitMQ, Kafka, Prometheus).

```
                      +----------------------------------+
                      |         EventBus System          |
                      | (Sync/Async, Priority, Tracing)  |
                      +----------------+-----------------+
                                       |
                                       v
 +----------------------+    +-------------------+    +----------------------+
 | QueueManager System  |    | MonitoringContext |    | MonitoringState      |
 | (Memory/Priority)    |===>| (Flow Pipeline)   |<===| Machine (Transitions)|
 +----------------------+    +-------------------+    +----------------------+
                                       |
                                       v
 +----------------------+    +-------------------+    +----------------------+
 | DI Container         |    | LifecycleManager  |    | MemoryMetrics        |
 | (Singleton/Transient)|    | (Hooks / Boot)    |    | (Counters / Gauges)  |
 +----------------------+    +-------------------+    +----------------------+
```

### 1. In-Process Domain Event Bus (`EventBus`)
- Supports listener priorities, async/sync handlers, and one-time listeners (`registerOnce`).
- Enforces strict event envelope (`DomainEvent` DTO) containing `eventId`, `eventName`, `timestamp`, `correlationId`, `payload`, `metadata`, `source`, `version`.
- Pluggability: Business code emits `eventBus.emit(...)`. Transitioning to Kafka or RabbitMQ requires changing only the underlying `EventBus` implementation.

### 2. Queue System & Priority Queue (`QueueManager`)
- Implements `QueueInterface` with `MemoryQueue` (FIFO) and `PriorityQueue` (Max-Priority Heap).
- Priority Levels: `FLASH_SALE` (100), `HIGH` (80), `COUPON` (60), `BANK_OFFER` (50), `NORMAL` (40), `LOW` (10).
- Automatic duplicate prevention by tracking active item IDs (`productId` or `correlationId`).
- Pluggability: Transitioning to Redis/BullMQ requires substituting `QueueInterface` in `QueueManager`.

### 3. Monitoring State Machine (`MonitoringStateMachine`)
State Transitions Matrix:
- `IDLE` $\rightarrow$ `QUEUED`, `RUNNING`, `DISABLED`
- `QUEUED` $\rightarrow$ `RUNNING`, `CANCELLED`
- `RUNNING` $\rightarrow$ `WAITING`, `COMPLETED`, `FAILED`, `RETRYING`, `CANCELLED`
- `WAITING` $\rightarrow$ `RUNNING`, `FAILED`, `CANCELLED`
- `RETRYING` $\rightarrow$ `QUEUED`, `RUNNING`, `FAILED`, `CANCELLED`
- `COMPLETED` $\rightarrow$ `IDLE`, `QUEUED`
- `FAILED` $\rightarrow$ `IDLE`, `QUEUED`, `RETRYING`
- `DISABLED` / `CANCELLED` $\rightarrow$ `IDLE`

### 4. Dependency Injection Container (`Container`)
- Lightweight in-process DI container supporting `registerSingleton()`, `registerTransient()`, `resolve()`, and `clear()`.

### 5. Lifecycle & Metrics (`LifecycleManager` & `MemoryMetrics`)
- `LifecycleManager`: Controls boot order and graceful process termination (`SIGINT`/`SIGTERM`).
- `MemoryMetrics`: Tracks counter metrics (`eventsEmitted`, `failedEvents`, `processedEvents`, `retries`), gauges (`queueSize`), and latency histograms (`executionDuration`).

---

## Merchant Abstraction Layer Architecture

To prevent e-commerce platform variance (Amazon vs. Flipkart vs. Myntra) from polluting the application core, all platform integrations pass through the **Merchant Abstraction Layer**.

### 1. Adapter & DTO Flow

```
   Raw E-Commerce Platform Data
  (Amazon, Flipkart, Myntra, etc.)
               │
               ▼
     [ Merchant Adapter ] ───────► (Normalizes schema variance)
               │
               ▼
        [ ProductDTO ]    ───────► (Uniform contract)
               │
               ▼
  [ Core Application Engine ] ────► (Zero knowledge of platform specifics)
```

---

## Database Domain Architecture

### Collection Relationships & Data Flow

```
 Merchant ───────► Product ───────► PriceHistory (Time-series)
    │                 │
    │                 ├───────► PriceAlert (Duplicate post prevention)
    │                 │
    ├───────► Coupon  └───────► Deal ───────► TelegramPost
    │                             │
    └───────► ScrapeJob           └─────────► DealHistory (Historical record)
```

---

## Future Scaling Strategy

1. **Caching & Queueing**:
   - Integration of **Redis** for distributed locking, price history caching, and request rate limiting.
   - Substitution of `MemoryQueue` with **BullMQ** or Redis streams.

2. **Scraper Resilience**:
   - Rotation of user-agents, proxies, and headless browser sessions using Playwright pool controllers.

3. **Deployment Topology**:
   - AWS EC2 managed by PM2 cluster mode with Nginx reverse proxy, SSL termination, and cloud log collection.
