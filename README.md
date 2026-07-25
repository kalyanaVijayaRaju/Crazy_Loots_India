# Crazy Loots India - Automated E-Commerce Loot Deals Platform

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)
![Express](https://img.shields.io/badge/Express.js-v4.x-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-v6%2B-brightgreen.svg)
![Telegram](https://img.shields.io/badge/Telegram-Bot%20API-blue.svg)
![License](https://img.shields.io/badge/License-MIT-orange.svg)

**Crazy Loots India** is a scalable, automated backend platform designed to monitor major e-commerce platforms in India, detect price drop loot deals, generate affiliate links, and automatically publish deal alerts to Telegram channels.

---

## Architecture & Design

The platform is designed following **Clean Architecture** principles to guarantee modularity, maintainability, and testability.

- Detailed architecture specifications: [docs/architecture.md](file:///c:/NodeProjects/Crazy_Loots_India/docs/architecture.md)
- Telegram Bot Setup Guide: [docs/telegram_bot_guide.md](file:///c:/NodeProjects/Crazy_Loots_India/docs/telegram_bot_guide.md)

### Project Layout

```
Crazy_Loots_India/
├── backend/            # Express.js REST API & Automation Services
│   ├── src/
│   │   ├── config/     # Environment & DB initialization
│   │   ├── controllers/# API route handlers (health, telegram)
│   │   ├── services/   # Business logic
│   │   ├── repositories/# Database access layer
│   │   ├── models/     # Mongoose models
│   │   ├── routes/     # Express routers
│   │   ├── middleware/ # Custom middleware & error handler
│   │   ├── telegram/   # Telegram Bot Client & Service Module
│   │   │   ├── telegramClient.js
│   │   │   ├── telegramService.js
│   │   │   └── telegramTemplates.js
│   │   ├── affiliate/  # Link converter services
│   │   ├── scrapers/   # E-commerce scraping engines
│   │   ├── jobs/       # Scheduled cron background tasks
│   │   ├── utils/      # Logger, error handlers, standard responses
│   │   └── constants/  # Enums and configuration constants
│   ├── server.js       # Express server bootstrapper
│   └── app.js          # Express app configuration
├── docs/               # System & API Documentation
└── README.md
```

---

## Environment Variables

Inside `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/crazy_loots_india
LOG_LEVEL=info

# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHANNEL_ID=@crazylootsindia
```

---

## Quick Start Guide

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **MongoDB**: Local instance or MongoDB Atlas URI

### Installation & Run

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

---

## REST API Platform (`/api/v1/`)

The platform exposes its capabilities via a production-grade REST API platform.

- **Interactive Swagger UI**: [http://localhost:5000/api/v1/docs](http://localhost:5000/api/v1/docs)
- **OpenAPI 3.0 Specification**: [http://localhost:5000/api/v1/docs/openapi.json](http://localhost:5000/api/v1/docs/openapi.json)
- **Detailed API Guide**: [docs/api.md](file:///c:/NodeProjects/Crazy_Loots_India/docs/api.md)

### Key API Groups
1. **Pipeline API** (`/api/v1/pipeline/run`): Run full E2E deal discovery pipeline.
2. **Product APIs** (`/api/v1/products`): Product CRUD, monitoring, extraction, price history, and statistics.
3. **Monitoring APIs** (`/api/v1/monitoring`): Trigger monitoring cycles, pause/resume, jobs, and history.
4. **Deal APIs** (`/api/v1/deals`): List deals, get deal, detect, approve, reject, replay.
5. **Affiliate APIs** (`/api/v1/affiliate`): Link conversion, providers, system status.
6. **Publishing APIs** (`/api/v1/publishing`): Package preparation, message preview, publishing execution (DRY_RUN / LIVE), retry, rollback.
7. **Telegram APIs** (`/api/v1/telegram`): Test messages, dry-run broadcasts, channel status, post history.
8. **System APIs** (`/api/v1/system`): System status, version, runtime configuration, feature flags.
9. **Admin APIs** (`/api/v1/admin`): Database seeding, reset, reindexing, execution replay.
10. **Observability APIs** (`/api/v1/observability`): Health probes, metrics, alerts, timelines, circuit breakers, diagnostics, production readiness.

---

## Available NPM Scripts

Inside `backend/`:

- `npm run dev` - Starts development server with `nodemon`.
- `npm start` - Starts production server.
- `npm run lint` - Checks code quality via ESLint.
- `npm run lint:fix` - Auto-fixes lint issues.
- `npm run format` - Formats codebase with Prettier.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.
