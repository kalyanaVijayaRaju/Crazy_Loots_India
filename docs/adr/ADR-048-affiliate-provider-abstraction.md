# ADR-048: Affiliate Provider Abstraction Architecture

## Status
Accepted

## Context
Different e-commerce merchants require distinct affiliate link generation mechanisms and networks (Amazon Associates, Admitad, Cuelinks, EarnKaro, Impact).

## Decision
We enforce `AffiliateProviderInterface` and `AffiliateManager` to decouple deal preparation logic from individual affiliate network implementations.

## Consequences
- Seamless support for multiple affiliate networks.
- Pluggable provider architecture.
