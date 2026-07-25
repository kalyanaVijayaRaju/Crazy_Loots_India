# ADR-080: Amazon Production Stabilization & Performance Validation

## Status
Approved

## Context
Following Phase 17 production integration, real-world execution revealed opportunities to improve Amazon India price extraction accuracy (excluding EMI, exchange, and subscription prices), fix Telegram photo delivery (`sendPhoto` fallback to `sendMessage`), enforce pipeline non-deal filtering, and compute historical price analytics.

## Decision
1. **Extraction Accuracy**: Target `#corePrice_desktop .a-offscreen` and `#corePriceDisplay_desktop_feature_div .a-offscreen` as top priority selectors. Reject EMI strings (`/month`, `EMI`), exchange offers, and starting-from prices in `PriceParser`.
2. **Product Validation**: Introduced `AmazonProductValidator` to validate extracted DTOs for required fields (ASIN, title, price, image URL, rating) before ingestion.
3. **Image Pipeline**: Resolved Amazon CDN resolution URLs (`._SL1000_.jpg`) without appending query parameters (`?dim=...`) that break Telegram CDN fetching. Direct buffer uploading via `FormData` was added to `RealTelegramClient.sendPhoto` to bypass hotlinking restrictions.
4. **Caption & Text Length Truncation**: Added `truncateCaption` (max 1024 chars for `sendPhoto`) and `truncateMessage` (max 4096 chars for `sendMessage`) to `TelegramFormatter`.
5. **Historical Price Analytics**: Added `calculateHistoricalStats` to `PriceComparisonService` to calculate lowest, highest, average, median, and price volatility.
6. **Pipeline Deal Filtering (Option A)**: Stopped pipeline execution cleanly at Stage 3 with `status: 'FILTERED_NO_DEAL'` when `isDeal === false`, unless explicitly overridden with `{ forcePublish: true }`.

## Consequences
- **Extraction Reliability**: Zero EMI or exchange prices ingested as real selling prices.
- **Telegram Photo Delivery**: Telegram API returns `200 OK` for photo publishing via direct buffer upload and valid CDN URLs.
- **Performance**: Pipeline execution remains under 5 seconds per product with native Playwright Chromium pooling.
