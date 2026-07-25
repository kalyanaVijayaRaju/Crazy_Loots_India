# Crazy Loots India — REST API Documentation (`/api/v1/`)

## Overview

The Crazy Loots India REST API platform exposes all application and domain features through a standardized, production-grade API interface.

- **Base URL**: `http://localhost:5000/api/v1`
- **Interactive Swagger UI**: `http://localhost:5000/api/v1/docs`
- **OpenAPI 3.0 Spec**: `http://localhost:5000/api/v1/docs/openapi.json`

---

## Global Headers & Middleware

Every request automatically receives and responds with:
- `X-Request-ID`: Unique per-request identifier (`req_...`)
- `X-Trace-ID`: Distributed trace identifier (`trc_...`)
- `X-Correlation-ID`: Correlation identifier (`crl_...`)
- `X-Response-Time`: Duration in milliseconds (`...ms`)
- `X-RateLimit-Limit`: Maximum requests per window
- `X-RateLimit-Remaining`: Remaining request quota

---

## Response Format

All responses follow the standardized `ResponseDTO` structure:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": {
    "timestamp": "2026-07-24T18:50:00.000Z"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Items retrieved successfully",
  "data": [ ... ],
  "meta": {
    "pagination": {
      "total": 45,
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    },
    "timestamp": "2026-07-24T18:50:00.000Z"
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "\"url\" must be a valid Amazon product URL"
  ],
  "code": 400,
  "meta": {
    "timestamp": "2026-07-24T18:50:00.000Z"
  }
}
```

---

## Endpoints Summary

### 1. Pipeline API (`/api/v1/pipeline`)
- `POST /pipeline/run` — Run full E2E deal discovery pipeline for an Amazon product URL.

### 2. Product APIs (`/api/v1/products`)
- `POST /products` — Create product record.
- `GET /products` — List products (supports `page`, `limit`, `search`, `merchant`, `sort`).
- `GET /products/:id` — Get product by ID.
- `PATCH /products/:id` — Update product.
- `DELETE /products/:id` — Delete product.
- `POST /products/:id/monitor` — Trigger product price monitoring.
- `POST /products/:id/extract` — Extract fresh product DTO from Amazon.
- `POST /products/:id/replay` — Replay product execution history.
- `GET /products/:id/history` — Get price history records.
- `GET /products/:id/prices` — Get raw price points list.
- `GET /products/:id/statistics` — Get calculated price statistics (lowest, highest, average, discount from peak).

### 3. Monitoring APIs (`/api/v1/monitoring`)
- `POST /monitoring/run` — Trigger manual monitoring cycle.
- `POST /monitoring/pause` — Pause scheduler monitoring cycles.
- `POST /monitoring/resume` — Resume scheduler monitoring cycles.
- `POST /monitoring/retry` — Retry failed monitoring tasks.
- `GET /monitoring/jobs` — Get active monitoring jobs.
- `GET /monitoring/history` — Get monitoring execution logs.

### 4. Deal APIs (`/api/v1/deals`)
- `GET /deals` — List deals (supports `page`, `limit`, `status`, `minScore`, `sort`).
- `GET /deals/:id` — Get deal by ID.
- `POST /deals/:id/detect` — Trigger deal detection algorithm.
- `POST /deals/:id/approve` — Approve pending deal.
- `POST /deals/:id/reject` — Reject pending deal.
- `POST /deals/:id/replay` — Replay deal execution snapshot.

### 5. Affiliate APIs (`/api/v1/affiliate`)
- `POST /affiliate/generate` — Generate affiliate link & short URL.
- `GET /affiliate/providers` — List registered affiliate providers.
- `GET /affiliate/status` — Get affiliate system health status.

### 6. Publishing APIs (`/api/v1/publishing`)
- `POST /publishing/prepare` — Prepare publishing package.
- `POST /publishing/preview` — Preview rendered Telegram & WhatsApp messages.
- `POST /publishing/publish` — Publish package (DRY_RUN / LIVE).
- `POST /publishing/retry` — Retry failed publication.
- `POST /publishing/rollback` — Rollback message broadcast.
- `GET /publishing/history` — Get publishing post history.

### 7. Telegram APIs (`/api/v1/telegram`)
- `POST /telegram/test` — Send test Telegram notification.
- `POST /telegram/dry-run` — Execute dry-run broadcast.
- `GET /telegram/channels` — List Telegram channels & connectivity status.
- `GET /telegram/history` — Get channel post history.

### 8. System APIs (`/api/v1/system`)
- `GET /system/status` — Get system status & subsystem health.
- `GET /system/version` — Get app version, git commit, node environment.
- `GET /system/configuration` — Get system runtime configuration.
- `GET /system/feature-flags` — Get active feature flags.

### 9. Admin APIs (`/api/v1/admin`)
- `POST /admin/seed` — Seed sample database data.
- `POST /admin/reset` — Reset all database collections.
- `POST /admin/reindex` — Resync database indexes.
- `POST /admin/replay` — Replay historical execution by Execution ID.

### 10. Observability APIs (`/api/v1/observability`)
- `GET /observability/health` — Detailed health report.
- `GET /observability/metrics` — Metrics (counters, gauges, histograms).
- `GET /observability/alerts` — Alert history.
- `GET /observability/timeline` — Execution stage timelines.
- `GET /observability/failures` — Circuit breaker states.
- `GET /observability/production-readiness` — Production readiness checklist.
- `GET /observability/diagnostics` — Full diagnostics bundle.
