# Affiliate & Publishing Preparation Engine Specification

## 1. Executive Overview
The **Affiliate & Publishing Preparation Engine** formats approved e-commerce deals for **Crazy Loots India** into multi-channel publishing payloads. It resolves affiliate monetization links, generates branded short URLs, processes social images, renders templates (Telegram, Website, WhatsApp, Push, Email), validates payload bounds, and compiles an immutable `PublishingPackage` with previews.

---

## 2. Functional Requirements

### 2.1 Affiliate Provider Abstraction
- Provider interface (`AffiliateProviderInterface`) with implementations for Amazon Associates (`AmazonAssociatesProvider`), Admitad, Cuelinks, EarnKaro, and Impact.
- Automatic provider routing via `AffiliateManager`.

### 2.2 Link Resolution & Shortening
- `LinkResolver` maps original URL, affiliate URL, short URL, resolved URL, and canonical URL.
- Provider interface (`ShortUrlProviderInterface`) with implementations for Internal (`InternalShortenerProvider`), Bitly, and TinyURL.

### 2.3 Image Pipeline
- Transform product images into multi-channel formats: original, thumbnail (150x150), banner (800x400), social preview (1200x630), webp compressed, and watermarked assets.

### 2.4 Multi-Channel Template & Renderer Engine
- Data-driven rendering across 5 channels: Telegram (Markdown), Website (JSON), WhatsApp, Push Notification, Email (HTML).
- Multi-channel template registry and message renderer (`MessageRenderer`).

### 2.5 Content Validation & Immutable Publishing Package
- Validate deal approval state, title, pricing, affiliate URL validity, and Telegram 4096-character limit.
- Produce an immutable `PublishingPackage` DTO with freeze protection.

### 2.6 Preview Generation & Audit Trail
- Generate channel-specific UI previews via `PreviewGenerator`.
- Record audit trails via `PublishingAuditService` logging generation duration, template version, and affiliate provider.

---

## 3. Non-Functional Requirements
- **Execution Performance**: Total package preparation latency < 25ms.
- **Provider Agnosticism**: Zero channel-specific or vendor-specific hardcoding inside core engine routines.
- **Contract Integrity**: Contract suite (`PublishingContracts`) verifying required payload properties.
