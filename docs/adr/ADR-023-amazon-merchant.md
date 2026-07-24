# ADR-023: Amazon Merchant Integration Architecture

## Status
Accepted

## Context
Amazon India (`amazon.in`) is our primary e-commerce merchant integration. Amazon product pages use complex DOM layouts, fallback price elements, and localized currency strings.

## Decision
We implement a dedicated Amazon Merchant integration pipeline in `src/merchants/amazon/`: URL Normalizer $\rightarrow$ ASIN Extractor $\rightarrow$ DOM Extractor $\rightarrow$ Parser Layer $\rightarrow$ Product Validator $\rightarrow$ ProductDTO Mapper $\rightarrow$ Repository Persistence.

## Consequences
- End-to-end Amazon India merchant support.
- Complete isolation of Amazon-specific extraction mechanics.
