# Deal Detection & Intelligence Engine Specification

## 1. Executive Overview
The **Deal Detection & Intelligence Engine** identifies genuine e-commerce price drops, discounts, and loot deals for **Crazy Loots India**. It processes monitored product data and historical price records, applies configurable business rules, computes a weighted 0–100 Deal Score and confidence percentage, generates human-readable explanations, and queues validated deals for manual review in a `PENDING` state.

---

## 2. Functional Requirements

### 2.1 Historical Price Analysis
- Compute 30-day, 90-day, 180-day, and all-time low price points.
- Compute average price, median price, minimum, maximum, and price volatility standard deviation.

### 2.2 Trend Analysis
- Classify price movement trends into 6 states: `RISING`, `FALLING`, `STABLE`, `VOLATILE`, `NEW_LOW`, `NEW_HIGH`.

### 2.3 Rule Engine & Versioning
- Injectable, data-driven rule evaluator (`RuleEngine`).
- Support rule versioning, history tracking, enabled toggles, priority sorting, and rollback capabilities via `RuleVersionManager`.
- Provide offline dry-run simulation via `RuleSimulator`.

### 2.4 Scoring & Confidence Model
- **Deal Score (0–100)**: Weighted criteria including Discount (35%), Historical Low (25%), Rating (15%), Review Count (10%), Availability (5%), Coupon (5%), and Seller Quality (5%).
- **Confidence Engine**: Calculate confidence percentage (10–99%) based on data sample size, review count, and deal score.

### 2.5 Explainability Engine
- Generate structured human-readable bullet points explaining why a deal qualified (e.g. `✓ Lowest price in 180 days`, `✓ 44% discount off list price`).

### 2.6 Duplicate Prevention & Cooldown
- Check configurable duplicate deal windows (default 12 hours).
- Enforce product cooldown intervals (default 6 hours) before a new deal can be enqueued for the same product.

### 2.7 Approval Queue Workflow
- All detected deals are persisted with status `PENDING`.
- Support manual transition to `APPROVED`, `REJECTED`, or `EXPIRED`.
- Never publish automatically to external channels without explicit approval.

---

## 3. Non-Functional Requirements
- **Execution Performance**: Evaluation latency < 15ms per product.
- **Auditability**: Complete history tracking in `DealHistory` repository for every approval state transition.
- **Zero External Direct Coupling**: Pure domain engine operating inside Node.js backend.
