# Crazy Loots India - Architecture Documentation

## Overview

**Crazy Loots India** is an automated, production-grade e-commerce deal discovery and affiliate marketing backend system integrated with Telegram. The system continuously monitors e-commerce platforms (e.g., Amazon, Flipkart, Myntra), detects price drops and loot deals using historical price algorithms, converts product links into monetization/affiliate links, and broadcasts formatted notifications to a Telegram Channel.

---

## High-Level Architecture Diagram

```
 +------------------+     +-------------------+     +---------------------+
 |  Amazon India    |     | E-Commerce Site B |     |  E-Commerce Site C  |
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
                       | Product Monitoring Engine|
                       | (Comparison / Detection)|
                       +------------+------------+
                                    | Product & History Data
                                    v
                       +-------------------------+
                       | Deal Intelligence Engine|
                       | (Rules / Scoring / Queue)|
                       +------------+------------+
                                    | Verified PENDING Deal
                                    v
                       +-------------------------+
                       |   Manual Approval Queue |
                       | (PENDING → APPROVED)    |
                       +------------+------------+
                                    | Approved Deal
                                    v
                       +-------------------------+
                       | Publishing Preparation  |
                       | (Affiliate / Templates) |
                       +------------+------------+
                                    | PublishingPackage
                                    v
                       +-------------------------+
                       | Telegram Publisher Bot  |
                       | (Mode / Queue / Strategy)|
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

```
 HTTP Request / Cron Trigger
         |
         v
 [ Routes Layer ]          -> Defines API endpoints & maps middleware
         |
         v
 [ Controllers Layer ]     -> Request validation, response formatting
         |
         v
 [ Orchestration Layer ]   -> MonitoringEngine, MonitoringCoordinator, Dispatcher
         |
         v
 [ Telegram Publishing ]   -> TelegramPublisher, PublishingQueue, ClientFactory
         |
         v
 [ Publishing Preparation] -> PublishingPreparationService, AffiliateManager, MessageRenderer
         |
         v
 [ Deal Intelligence ]     -> DealDetectionEngine, RuleEngine, ScoreEngine, ApprovalQueue
         |
         v
 [ Monitoring Layer ]      -> ProductMonitoringService, PriceComparison, ChangeDetector
         |
         v
 [ Pipeline Layer ]        -> PipelineCoordinator, Middleware Chain, Policies
         |
         v
 [ Amazon Merchant ]       -> Normalizer, ASIN Extractor, DomExtractor, Parsers, Mapper
         |
         v
 [ Browser Platform ]      -> PlaywrightAdapter, BrowserPool, ContextPool, PagePool
         |
         v
 [ Core Engine Layer ]     -> EventBus, QueueManager, StateMachine, DI Container
         |
         v
 [ Repositories Layer ]    -> Product, PriceHistory, Deal, DealHistory, TelegramPost
         |
         v
 [ Models / Storage Layer ] -> MongoDB via Mongoose
```

---

## Telegram Publishing Engine Architecture

```
 PublishingPackage ──► [ DeliveryValidator ] ──► Validates approval & affiliate URL
                             │
                             ▼
                    [ ChannelRouter ]        ──► Selects target Telegram channel
                             │
                             ▼
                    [ PublishingQueue ]      ──► Priority task queueing
                             │
                             ▼
                [ PublishingStateMachine ]   ──► CREATED → VALIDATED → APPROVED → QUEUED → PUBLISHING → PUBLISHED
                             │
                             ▼
               [ ImmediatePublishingStrategy ] ──► Dispatches payload to client
                             │
                             ▼
                 [ TelegramClientFactory ]   ──► DRY_RUN / SANDBOX (MockClient) vs LIVE (RealClient)
                             │
                             ▼
                [ PublishingHistoryService ] ──► Persists record via TelegramPostRepository
```

---

### Key Architectural Patterns & ADRs
- **[ADR-006] to [ADR-053]**: Previous phases.
- **[ADR-054: Telegram Publishing Engine](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-054-telegram-publishing-engine.md)**: Main publisher engine.
- **[ADR-055: Controlled Publishing Modes](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-055-publishing-modes.md)**: DRY_RUN, SANDBOX, LIVE modes.
- **[ADR-056: Publishing State Machine](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-056-publishing-state-machine.md)**: 10 discrete states.
- **[ADR-057: Priority Publishing Queue](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-057-publishing-queue.md)**: Priority task queue.
- **[ADR-058: Exponential Backoff & DLQ](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-058-retry-strategy.md)**: Retry engine with backoff & DLQ.
- **[ADR-059: Channel Registry & Routing](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-059-telegram-channel-registry.md)**: Channel registry and routing.
- **[ADR-060: Pre-Dispatch Delivery Validation](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-060-delivery-validation.md)**: Delivery validator.
- **[ADR-061: Publishing History Persistence](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-061-publishing-history.md)**: TelegramPost history logger.
- **[ADR-062: Message Rollback Strategy](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-062-rollback-strategy.md)**: Deletion & edit rollback service.
- **[ADR-063: Telegram Client Abstraction](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-063-telegram-client-abstraction.md)**: Decoupled client factory.

---

## Future Scaling Strategy

1. **Caching & Queueing**: Redis for distributed locking and BullMQ for job queues.
2. **Scraper Resilience**: User-agent rotation, proxy pools, and headless session cycling.
3. **Deployment**: AWS EC2 with PM2 cluster mode, Nginx reverse proxy, and SSL.
