# ADR-029: Product DTO Mapping Pattern

## Status
Accepted

## Context
Downstream core services must remain completely agnostic of merchant-specific DOM structures or raw text formats.

## Decision
We enforce `AmazonProductMapper` to convert `RawAmazonProduct` structures directly into standardized `ProductDTO` instances. Raw DOM objects are never exposed outside the extractor layer.

## Consequences
- Guaranteed system-wide DTO uniformity.
- Merchant implementation details are completely encapsulated.
