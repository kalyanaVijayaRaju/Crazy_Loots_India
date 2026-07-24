# Crazy Loots India — Operational Runbook

## Table of Contents

1. [Startup Procedure](#1-startup-procedure)
2. [Shutdown Procedure](#2-shutdown-procedure)
3. [Recovery Procedure](#3-recovery-procedure)
4. [Troubleshooting](#4-troubleshooting)
5. [Known Issues](#5-known-issues)
6. [Monitoring Guide](#6-monitoring-guide)
7. [Alert Guide](#7-alert-guide)
8. [Deployment Checklist](#8-deployment-checklist)

---

## 1. Startup Procedure

1. **Verify environment variables**:
   - `MONGODB_URI` — MongoDB connection string
   - `TELEGRAM_BOT_TOKEN` — Telegram bot API token
   - `PUBLISHING_MODE` — Set to `DRY_RUN` for initial deployment
   - `NODE_ENV` — `development`, `staging`, or `production`
   - `PORT` — Server port (default: 5000)

2. **Start MongoDB** and verify it is accepting connections.

3. **Install dependencies**:
   ```bash
   npm install
   npx playwright install chromium
   ```

4. **Start the application**:
   ```bash
   # Development
   npm run dev

   # Production (with PM2)
   pm2 start ecosystem.config.js
   ```

5. **Verify health**:
   ```bash
   curl http://localhost:5000/api/v1/health
   curl http://localhost:5000/api/v1/observability/readiness
   ```

6. **Verify circuit breakers** are all CLOSED:
   ```bash
   curl http://localhost:5000/api/v1/observability/failures
   ```

7. **Confirm PUBLISHING_MODE** is `DRY_RUN` for first deployment.

---

## 2. Shutdown Procedure

1. Send `SIGTERM` to the Node.js process:
   ```bash
   pm2 stop crazy-loots
   # or
   kill -SIGTERM <pid>
   ```

2. The system will:
   - Mark itself as shutting down (readiness returns 503)
   - Complete active monitoring cycles
   - Drain browser pool and close Playwright contexts
   - Close MongoDB connections gracefully

3. Verify the process has exited:
   ```bash
   pm2 status
   ```

---

## 3. Recovery Procedure

1. **Check system status**:
   ```bash
   curl http://localhost:5000/api/v1/observability/status
   ```

2. **Identify open circuit breakers**:
   ```bash
   curl http://localhost:5000/api/v1/observability/failures
   ```

3. **Review alerts**:
   ```bash
   curl http://localhost:5000/api/v1/observability/alerts
   ```

4. **Recovery actions by circuit**:

   | Circuit | Recovery Action |
   |---|---|
   | `browser` | Restart Playwright browser pool |
   | `telegram-client` | Verify BOT_TOKEN and network connectivity to api.telegram.org |
   | `mongodb` | Check MongoDB server status and connection string |
   | `amazon-merchant` | Check Amazon accessibility; update selectors if needed |
   | `affiliate-provider` | Verify affiliate API credentials |
   | `short-url-provider` | Verify short URL service availability |

5. **Reset circuit breakers** after root cause is resolved.

6. **Verify recovery**:
   ```bash
   curl http://localhost:5000/api/v1/observability/readiness
   ```

---

## 4. Troubleshooting

### Products Not Being Extracted

- **Check**: Browser circuit breaker state
- **Check**: Amazon DOM selectors in `domExtractor`
- **Check**: Error logs for selector mismatch messages
- **Fix**: Update DOM selectors if Amazon layout changed; reset browser circuit breaker

### Deals Not Being Published

- **Check**: `PUBLISHING_MODE` — if set to `DRY_RUN`, publishing is intentionally suppressed
- **Check**: Telegram circuit breaker state
- **Check**: Publishing queue size
- **Fix**: Ensure Telegram bot token is valid; verify network to `api.telegram.org`

### High Memory Usage

- **Check**: Browser pool size and active contexts
- **Check**: Performance diagnostics: `GET /api/v1/observability/diagnostics`
- **Fix**: Reduce browser pool concurrency; restart process; review profiler reports

### MongoDB Connection Failures

- **Check**: `MONGODB_URI` environment variable
- **Check**: MongoDB server status
- **Fix**: Correct connection string; restart MongoDB; increase pool timeout

### Scheduler Not Running

- **Check**: Scheduler status in system diagnostics
- **Check**: Cron expressions and timezone configuration
- **Fix**: Restart scheduler; verify cron configuration

---

## 5. Known Issues

1. **Amazon Rate Limiting**: Amazon may rate-limit or block rapid successive requests. Use browser pool with appropriate delays between requests.

2. **Chromium Memory Usage**: Playwright Chromium can consume significant memory when multiple contexts are open simultaneously. Monitor heap usage via diagnostics.

3. **Telegram Rate Limits**: Telegram Bot API enforces rate limits (approximately 30 messages/second to groups). The publishing queue handles backpressure.

4. **Long-Run Validation Duration**: DRY_RUN validation with 20+ products may take significant time. Plan execution during low-traffic periods.

---

## 6. Monitoring Guide

### Key Endpoints

| Endpoint | Purpose | Frequency |
|---|---|---|
| `GET /api/v1/observability/health` | Full health + dependency status | Every 30s |
| `GET /api/v1/observability/readiness` | Readiness for load balancer | Every 10s |
| `GET /api/v1/observability/metrics` | Counters, gauges, histograms | Every 60s |
| `GET /api/v1/observability/timeline` | Recent execution traces | On demand |
| `GET /api/v1/observability/diagnostics` | System diagnostics bundle | On demand |
| `GET /api/v1/observability/status` | Aggregated overview | Every 60s |

### Key Metrics to Watch

- `browser.launches` — Browser pool utilization
- `monitoring.products_processed` — Throughput
- `deals.detected` — Deal discovery rate
- `publishing.published` — Publication rate
- `longrun.failures` — Validation failure rate

---

## 7. Alert Guide

| Alert Type | Severity | Immediate Action |
|---|---|---|
| `SELECTOR_FAILURE` | WARNING | Update Amazon DOM selectors |
| `DOM_VERSION_CHANGE` | WARNING | Review extraction parsers |
| `BROWSER_CRASH` | CRITICAL | Restart browser pool; check resources |
| `QUEUE_OVERFLOW` | CRITICAL | Increase capacity or reduce input |
| `SCHEDULER_FAILURE` | CRITICAL | Restart scheduler |
| `TELEGRAM_OFFLINE` | FATAL | Verify bot token + network |
| `MONGODB_LATENCY` | WARNING | Check MongoDB performance |
| `HIGH_RETRY_COUNT` | WARNING | Investigate root cause |
| `DLQ_GROWTH` | CRITICAL | Review and reprocess DLQ items |

---

## 8. Deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB accessible and indexes created
- [ ] Playwright browsers installed (`npx playwright install chromium`)
- [ ] `PUBLISHING_MODE` set to `DRY_RUN`
- [ ] Health endpoint responding: `GET /api/v1/health`
- [ ] Readiness probe passing: `GET /api/v1/observability/readiness`
- [ ] All circuit breakers CLOSED
- [ ] No unacknowledged FATAL/CRITICAL alerts
- [ ] PM2 configured for auto-restart
- [ ] Log rotation configured
- [ ] Production readiness check passing: `GET /api/v1/observability/production-readiness`
