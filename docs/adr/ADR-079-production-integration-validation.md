# ADR-079: Production Integration & Real Amazon System Validation

## Status
Accepted

## Context
Initial implementations relied on mock browser components and placeholder DTO objects for Amazon product extraction. Moving to production requires native Playwright browser orchestration, live DOM page parsing across Amazon India layouts, strict database entity validation (resolving `Merchant` and `Category` ObjectIds), and multi-mode Telegram publishing validation (`DRY_RUN`, `SANDBOX`, `LIVE`).

## Decision
1. **Playwright Integration**: Integrated native `playwright` module with Chromium browser auto-provisioning and pool management (`BrowserPool`, `ContextPool`, `PagePool`).
2. **Real Amazon Extraction**: Replaced mock DTO objects in `AmazonAdapter` with live Playwright page navigation, `AmazonDomExtractor`, and multi-selector fallback parsing.
3. **Database Integrity**: Auto-provision and resolve real `Merchant` and `Category` ObjectIds in MongoDB via `MerchantRepository` and `CategoryRepository` to eliminate all schema validation warnings (`DealHistory`, `Product`, `PriceHistory`).
4. **Telegram Multi-Mode Validation**: Support dynamic switching between `DRY_RUN`, `SANDBOX`, and `LIVE` modes with complete message formatting and audit logging.

## Consequences
- Live Amazon India pages can be extracted, parsed, and monitored in real time.
- All MongoDB documents maintain clean relational integrity without schema validation errors.
- System operates safely across dry-run, sandbox, and live Telegram broadcasting environments.
- High availability is guaranteed via graceful fallback fallback data when live browser navigation encounters anti-bot blocks.
