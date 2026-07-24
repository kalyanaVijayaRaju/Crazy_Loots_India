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
 [ System Orchestrator ]   -> StartupManager, Readiness, Diagnostics, EndToEndPipeline
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

## End-to-End Workflow Architecture

```
 Real Amazon Product URL
          │
          ▼
 [ Merchant Adapter & Playwright ] ──► Extracts raw HTML & maps ProductDTO
          │
          ▼
 [ Product Monitoring Engine ]    ──► Price comparison & change detection
          │
          ▼
 [ Deal Intelligence Engine ]     ──► 30d/90d/180d Lows, Rule Evaluation & 0-100 Score
          │
          ▼
 [ Approval Queue Service ]       ──► Enqueues deal with status APPROVED
          │
          ▼
 [ Publishing Preparation Engine] ──► Affiliate Link, Short URL, Images, Template Rendering
          │
          ▼
 [ Telegram Publishing Engine ]   ──► Executes task safely in DRY_RUN mode
          │
          ▼
 [ Publishing History ]           ──► Persists record via TelegramPostRepository
```

---

### Key Architectural Patterns & ADRs
- **[ADR-006] to [ADR-063]**: Previous phases.
- **[ADR-064: System Orchestration Architecture](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-064-system-orchestration.md)**: Main orchestrator architecture.
- **[ADR-065: Subsystem Startup Lifecycle](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-065-startup-lifecycle.md)**: Idempotent startup manager.
- **[ADR-066: Background Monitoring Worker](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-066-background-worker.md)**: Task worker with lock protection.
- **[ADR-067: Environment Profile Management](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-067-environment-profiles.md)**: Profile definitions for dev/staging/prod.
- **[ADR-068: End-to-End Pipeline Execution](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-068-end-to-end-validation.md)**: Full E2E workflow runner.
- **[ADR-069: System Readiness & Diagnostics](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-069-readiness-and-diagnostics.md)**: Readiness and diagnostic services.
- **[ADR-070: DRY_RUN Validation Strategy](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-070-dry-run-validation-strategy.md)**: Broadcast safety validator.

---

## Future Scaling Strategy

1. **Caching & Queueing**: Redis for distributed locking and BullMQ for job queues.
2. **Scraper Resilience**: User-agent rotation, proxy pools, and headless session cycling.
3. **Deployment**: AWS EC2 with PM2 cluster mode, Nginx reverse proxy, and SSL.
