# ADR-025: Decoupled DOM Extraction Pipeline

## Status
Accepted

## Context
Mixing DOM traversal, string manipulation, type casting, and validation in a single monolithic scraper class violates the Single Responsibility Principle.

## Decision
We separate DOM traversal (`AmazonDomExtractor`) from value parsing (`AmazonParsers`), validation (`AmazonProductValidator`), and DTO conversion (`AmazonProductMapper`). `AmazonDomExtractor` returns raw DOM text (`RawAmazonProduct`) without parsing.

## Consequences
- Clean separation of concerns.
- Independent unit testing for parsers and mappers.
