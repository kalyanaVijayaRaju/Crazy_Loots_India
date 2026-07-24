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
 [ Publishing Engine ]     -> PublishingPreparationService, AffiliateManager, MessageRenderer
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
 [ Repositories Layer ]    -> Product, PriceHistory, Deal, DealHistory, MonitoringRun
         |
         v
 [ Models / Storage Layer ] -> MongoDB via Mongoose
```

---

## Publishing Preparation Architecture

```
 Approved Deal ──► [ AffiliateManager ]    ──► AmazonAssociates / Cuelinks / Admitad
                         │
                         ▼
                [ ShortUrlManager ]     ──► Branded Short URL (https://loots.in/...)
                         │
                         ▼
                [ ImagePipeline ]       ──► Thumbnail, Banner, Social Preview assets
                         │
                         ▼
                [ MessageRenderer ]     ──► Telegram, Website, WhatsApp, Push, Email
                         │
                         ▼
                [ ContentValidator ]    ──► Validate approval, bounds & links
                         │
                         ▼
              [ PublishingPackage ]     ──► Immutable Publishing Payload + Previews
```

---

### Key Architectural Patterns & ADRs
- **[ADR-006] to [ADR-046]**: Previous phases.
- **[ADR-047: Immutable Publishing Package](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-047-publishing-package.md)**: Immutable DTO payload.
- **[ADR-048: Affiliate Provider Abstraction](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-048-affiliate-provider-abstraction.md)**: Network-agnostic monetization interface.
- **[ADR-049: Multi-Channel Template Engine](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-049-template-engine.md)**: Data-driven template renderer.
- **[ADR-050: Multi-Format Image Pipeline](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-050-image-pipeline.md)**: Thumbnail, banner & social image pipeline.
- **[ADR-051: Publishing Content Validation](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-051-publishing-validation.md)**: Pre-broadcast validator.
- **[ADR-052: Multi-Channel Preview Generation](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-052-preview-generation.md)**: Channel UI preview generator.
- **[ADR-053: Publishing Package Audit Trail](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-053-audit-trail.md)**: Audit log tracker.

---

## Future Scaling Strategy

1. **Caching & Queueing**: Redis for distributed locking and BullMQ for job queues.
2. **Scraper Resilience**: User-agent rotation, proxy pools, and headless session cycling.
3. **Deployment**: AWS EC2 with PM2 cluster mode, Nginx reverse proxy, and SSL.
