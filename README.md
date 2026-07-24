# Crazy Loots India - Automated E-Commerce Loot Deals Platform

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)
![Express](https://img.shields.io/badge/Express.js-v4.x-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-v6%2B-brightgreen.svg)
![License](https://img.shields.io/badge/License-MIT-orange.svg)

**Crazy Loots India** is a scalable, automated backend platform designed to monitor major e-commerce platforms in India, detect price drop loot deals, generate affiliate links, and automatically publish deal alerts to Telegram channels.

---

## Architecture & Design

The platform is designed following **Clean Architecture** principles to guarantee modularity, maintainability, and testability.

Detailed architecture specifications can be found in [docs/architecture.md](file:///c:/NodeProjects/Crazy_Loots_India/docs/architecture.md).

### Project Layout

```
Crazy_Loots_India/
├── backend/            # Express.js REST API & Automation Services
│   ├── src/
│   │   ├── config/     # Environment & DB initialization
│   │   ├── controllers/# API route handlers
│   │   ├── services/   # Business logic
│   │   ├── repositories/# Database access layer
│   │   ├── models/     # Mongoose models
│   │   ├── routes/     # Express routers
│   │   ├── middleware/ # Custom middleware & error handler
│   │   ├── telegram/   # Telegram bot integration module
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

## Quick Start Guide

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **MongoDB**: Local instance or MongoDB Atlas URI

### Installation

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment configuration file:
   ```bash
   cp .env.example .env
   ```
   Fill in mandatory variables like `MONGODB_URI` and `PORT`.

4. Start development server:
   ```bash
   npm run dev
   ```

5. Check health check endpoint:
   ```bash
   curl http://localhost:5000/api/v1/health
   ```

---

## Available NPM Scripts

Inside the `backend/` directory:

- `npm run dev` - Starts the development server with `nodemon`.
- `npm start` - Starts the production server (`node src/server.js`).
- `npm run lint` - Runs ESLint to check for code standard violations.
- `npm run lint:fix` - Fixes auto-fixable lint issues.
- `npm run format` - Formats codebase using Prettier.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.
