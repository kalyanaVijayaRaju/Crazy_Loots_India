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

## Deal Detection & Intelligence Engine Architecture

```
 Monitored Product ──► [ HistoricalPriceAnalyzer ] ──► Compute 30d/90d/180d & All-Time Lows
                                     │
                                     ▼
                          [ TrendAnalyzer ]        ──► RISING / FALLING / STABLE / NEW_LOW
                                     │
                                     ▼
                          [ RuleEngine ]           ──► Data-driven rule evaluation (min discount, stock)
                                     │
                                     ▼
                          [ DealScoreEngine ]      ──► 0–100 Weighted Score calculation
                                     │
                                     ▼
                       [ DealConfidenceEngine ]    ──► Confidence percentage & reasoning
                                     │
                                     ▼
                      [ DealExplainabilityEngine ] ──► Human-readable bulleted points ("✓ Lowest in 180d")
                                     │
                                     ▼
                    [ DealApprovalQueueService ]   ──► Enqueue into DealRepository (PENDING status)
```

---

### Key Architectural Patterns & ADRs
- **[ADR-006] to [ADR-038]**: Previous phases.
- **[ADR-039: Historical Price Analysis](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-039-historical-price-analysis.md)**: 30/90/180-day & all-time low calculation.
- **[ADR-040: Data-Driven Rule Engine](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-040-rule-engine.md)**: Configurable rules with versioning & simulator.
- **[ADR-041: Weighted Deal Scoring](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-041-deal-scoring.md)**: 0–100 weighted quality score.
- **[ADR-042: Deal Confidence Engine](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-042-confidence-engine.md)**: Confidence percentage calculation.
- **[ADR-043: Manual Approval Queue](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-043-approval-queue.md)**: Human verification workflow.
- **[ADR-044: Deal Explainability](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-044-explainability.md)**: Transparent qualification bullet points.
- **[ADR-045: Duplicate Prevention](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-045-duplicate-prevention.md)**: Duplicate window detection.
- **[ADR-046: Product Deal Cooldown](file:///c:/NodeProjects/Crazy_Loots_India/docs/adr/ADR-046-cooldown-strategy.md)**: Dampening minor price fluctuations.

---

## Future Scaling Strategy

1. **Caching & Queueing**: Redis for distributed locking and BullMQ for job queues.
2. **Scraper Resilience**: User-agent rotation, proxy pools, and headless session cycling.
3. **Deployment**: AWS EC2 with PM2 cluster mode, Nginx reverse proxy, and SSL.
