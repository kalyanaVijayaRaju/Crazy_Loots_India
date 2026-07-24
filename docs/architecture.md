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

### 2. Why Every Merchant Returns `ProductDTO`

1. **Decoupling Business Logic**: The deal discovery engine, price tracking algorithm, and Telegram publisher require a single, predictable interface (`title`, `currentPrice`, `originalPrice`, `discountPercentage`, `productUrl`).
2. **Zero Code Churn on Adding Merchants**: Integrating a 10th merchant (e.g. Nykaa or Croma) requires writing only the platform adapter. No business service or repository requires modification.
3. **Strict Validation & Type Safety**: `ProductDTO` validates numerical bounds, auto-computes discount percentages, and normalizes merchant names at the boundary layer.

---

### 3. Design Patterns Applied

- **Adapter Pattern**: `MerchantAdapter` defines the common interface contract. Each e-commerce store (`AmazonAdapter`, `FlipkartAdapter`, `MyntraAdapter`) implements platform-specific URL regex, affiliate tags, and scraping normalization.
- **Factory Pattern**: `MerchantFactory` resolves the appropriate adapter instance either by merchant slug (`'amazon'`) or by auto-matching raw product web links (`getAdapterByUrl(url)`).
- **Registry Pattern**: `MerchantRegistry` dynamically registers and manages supported merchant adapters.

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

### Collection Purpose & Indexing Summary

| Collection | Primary Purpose | Key Indexes | Scalability Strategy |
| :--- | :--- | :--- | :--- |
| **Merchant** | E-commerce platform registry | `slug` (unique), `status`, `priority` | Cached in memory for fast lookup |
| **Category** | Product categorization & taxonomy | `slug` (unique), `{ parentCategory, status }` | Hierarchical indexing for subcategory queries |
| **Product** | Master product catalog & current state | `{ merchant, productId }` (unique), `slug`, `trackingEnabled`, `{ status, discountPercentage }` | Compound index on discount & tracking status |
| **PriceHistory** | Time-series price drop tracking | `{ product, recordedAt: -1 }` | Compound index optimized for millions of price entries |
| **Deal** | Detected & published loot deals | `product`, `{ status, dealScore: -1 }`, `publishedAt` | Sorted compound index for high-score deal publishing |
| **Coupon** | E-commerce promo & discount codes | `{ merchant, couponCode }`, `{ status, expiryDate }` | Compound index for merchant coupon lookups |
| **TelegramPost** | Published Telegram message mapping | `{ telegramMessageId, channelId }` (unique), `deal` | Prevents duplicate channel posts |
| **PriceAlert** | Prevents duplicate deal broadcasts | `product`, `{ status, targetPrice }` | Fast alert threshold evaluation |
| **DealHistory** | Full audit log of all detected deals | `{ product, detectedAt: -1 }`, `{ merchant, published }` | Log retention & deal trend analytics |
| **ScrapeJob** | Scraper execution performance log | `{ merchant, startedAt: -1 }`, `{ status, startedAt: -1 }` | Scraper diagnostics & uptime auditing |

---

## Future Scaling Strategy

1. **Caching & Queueing**:
   - Integration of **Redis** for distributed locking, price history caching, and request rate limiting.
   - Integration of **BullMQ** or Redis streams for decoupled asynchronous scraping & Telegram posting queues.

2. **Scraper Resilience**:
   - Rotation of user-agents, proxies, and headless browser sessions using Playwright pool controllers.

3. **Deployment Topology**:
   - AWS EC2 managed by PM2 cluster mode with Nginx reverse proxy, SSL termination, and cloud log collection.
