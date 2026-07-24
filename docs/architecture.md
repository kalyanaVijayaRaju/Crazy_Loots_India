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
 [ Repositories Layer ]    -> Data access abstraction, database queries (Mongoose abstraction)
         |
         v
 [ Models / Storage Layer ] -> Database schema definition & persistence (MongoDB)
```

---

## Backend Directory Layout

```
backend/
├── src/
│   ├── config/          # Environment & Database configuration
│   ├── controllers/     # API request handlers (thin controllers)
│   ├── services/        # Business logic & domain processing
│   ├── repositories/    # Database abstraction layer
│   ├── models/          # Mongoose schemas & models
│   ├── routes/          # Express route definitions
│   ├── middleware/      # Authentication, error handling, validation middleware
│   ├── telegram/        # Telegram Bot integration & message formatters
│   ├── affiliate/       # Affiliate tag injection & link processing
│   ├── scrapers/        # E-commerce platform scrapers (Playwright)
│   ├── jobs/            # Scheduled background jobs (node-cron)
│   ├── utils/           # Logger, ApiError, ApiResponse, helpers
│   └── constants/       # Enums, site constants, status codes
├── .env.example         # Environment template
├── .eslintrc.json       # ESLint configuration
├── .prettierrc          # Prettier code formatting config
├── package.json         # Node.js dependencies and scripts
└── server.js            # Main application entry point
```

---

## Future Scaling Strategy

1. **Caching & Queueing**:
   - Integration of **Redis** for distributed locking, price history caching, and request rate limiting.
   - Integration of **BullMQ** or Redis streams for decoupled asynchronous scraping & Telegram posting queues.

2. **Scraper Resilience**:
   - Rotation of user-agents, proxies, and headless browser sessions using Playwright pool controllers.

3. **Deployment Topology**:
   - AWS EC2 managed by PM2 cluster mode with Nginx reverse proxy, SSL termination, and cloud log collection.
