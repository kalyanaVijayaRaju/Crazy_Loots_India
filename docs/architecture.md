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
                                    | Verified Changes
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
 [ Repositories Layer ]    -> Product, PriceHistory, MonitoringConfig, MonitoringRun
         |
         v
 [ Models / Storage Layer ] -> MongoDB via Mongoose
```

---

## Product Monitoring & Price Tracking Architecture

```
 Monitored Product ──► [ MonitoringConfiguration ] ──► Enabled? Priority? Interval?
                                     │
                                     ▼
                      [ MonitoringLockManager ]    ──► Acquire lock (1 task per product)
                                     │
                                     ▼
                     [ Amazon Adapter / Extractor ] ──► Extract fresh ProductDTO
                                     │
                                     ▼
                    [ PriceComparisonService ]      ──► UP / DOWN / UNCHANGED / NEW_LOW / NEW_HIGH
                                     │
                                     ▼
                    [ ProductChangeDetector ]       ──► Detect 9 attribute changes
                                     │
                                     ▼
                    [ ProductMonitoringService ]    ──► Persist Product & PriceHistory
                                     │
                                     ▼
                    [ MonitoringHistoryService ]    ──► Record MonitoringRun
                                     │
                                     ▼
                    [ MonitoringReportGenerator ]   ──► Generate structured report
                                     │
                                     ▼
                    [ EventBus ]                    ──► Emit PriceChanged / LowestPriceReached
```

---

## Amazon India Merchant Architecture

```
 Amazon URL ──► [ AmazonUrlNormalizer ] ──► Canonical URL
                       │
                       ▼
             [ AmazonAsinExtractor ]    ──► ASIN
                       │
                       ▼
             [ AmazonDomExtractor ]     ──► RawAmazonProduct
                       │
                       ▼
             [ AmazonParsers ]          ──► Parsed values
                       │
                       ▼
             [ AmazonProductMapper ]    ──► ProductDTO
                       │
                       ▼
             [ AmazonPersistenceService ]─► MongoDB
```

---

### Key Architectural Patterns & ADRs
- **[ADR-006: Monitoring Pipeline](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-006-monitoring-pipeline.md)** through **[ADR-032: DOM Version Detection](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-032-dom-version-detection.md)**: Previous phases.
- **[ADR-033: Monitoring Configuration](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-033-monitoring-configuration.md)**: Per-product scheduling model.
- **[ADR-034: Price Comparison](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-034-price-comparison.md)**: Trend classification service.
- **[ADR-035: Monitoring History](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-035-monitoring-history.md)**: Execution audit trail.
- **[ADR-036: Product Change Detection](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-036-product-change-detection.md)**: Multi-attribute change detector.
- **[ADR-037: Monitoring Reports](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-037-monitoring-reports.md)**: Structured report generation.
- **[ADR-038: Monitoring Locks](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-038-monitoring-locks.md)**: Execution concurrency lock.

---

## Future Scaling Strategy

1. **Caching & Queueing**: Redis for distributed locking and BullMQ for job queues.
2. **Scraper Resilience**: User-agent rotation, proxy pools, and headless session cycling.
3. **Deployment**: AWS EC2 with PM2 cluster mode, Nginx reverse proxy, and SSL.
