# Contributing to Crazy Loots India

Thank you for contributing to **Crazy Loots India**! This document outlines our engineering standards, architecture principles, git workflows, testing rules, and pull request guidelines.

---

## 1. Architecture Principles & Standards

We enforce **Clean Architecture** and **Domain-Driven Design (DDD)** principles across the backend:

1. **Layer Unidirectional Dependency**:
   - `Routes` $\rightarrow$ `Controllers` $\rightarrow$ `Orchestration` $\rightarrow$ `Pipeline` $\rightarrow$ `Core Engine` $\rightarrow$ `Services` $\rightarrow$ `Merchant Abstraction` $\rightarrow$ `Repositories` $\rightarrow$ `Models`.
2. **Provider Pattern Enforcement**:
   - Never call `process.env`, `new Date()`, `crypto.randomUUID()`, or `Math.random()` directly in domain logic. Always use system providers (`TimeProvider`, `IdProvider`, `EnvironmentProvider`, `ConfigurationProvider`).
3. **Playwright Abstraction**:
   - Never import or invoke Playwright directly in domain or scraper logic. All browser interactions MUST pass through `PlaywrightAdapter` in `src/browser/utils/playwrightAdapter.js`.
4. **Strict DTO Contracts**:
   - All merchant adapters MUST return `ProductDTO` or `CouponDTO`. Never leak platform-specific HTML or JSON into core services.

---

## 2. Environment & Project Setup

```bash
# Clone the repository
git clone https://github.com/kalyanaVijayaRaju/Crazy_Loots_India.git
cd Crazy_Loots_India/backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Run development server
npm run dev

# Run ESLint check
npm run lint
```

---

## 3. Git Workflow & Branch Conventions

### Feature Branch Strategy
> **Rule**: Never work directly on the `main` branch. Every feature or phase MUST be developed on its own dedicated feature branch.

#### Branch Naming Format:
- `feature/<feature-name>` (e.g., `feature/playwright-infrastructure`, `feature/telegram-bot`)
- `fix/<bug-description>` (e.g., `fix/amazon-price-parsing`)
- `docs/<doc-update>` (e.g., `docs/update-architecture`)

### Commit Conventions
Follow Conventional Commits specification:
- `feat(scope)`: A new feature
- `fix(scope)`: A bug fix
- `docs(scope)`: Documentation changes only
- `refactor(scope)`: Code refactoring without behavioral changes
- `test(scope)`: Adding or fixing tests
- `chore(scope)`: Build system or configuration maintenance

Example Commit Message:
```text
feat(browser): implement playwright browser pool, context pool, and navigation service

- Add BrowserPool, ContextPool, and PagePool resource managers
- Add PlaywrightAdapter isolating browser API interactions
- Add NavigationService and DomService helper utilities
- Add ADR-016 to ADR-022 and update architecture.md
```

---

## 4. Pull Request Checklist

Before submitting a Pull Request (PR):
- [ ] Code follows project ESLint & Prettier rules (`npm run lint` passes with 0 errors).
- [ ] All unit and integration test scripts complete successfully.
- [ ] New components implement required interfaces (`HealthCheckInterface`, `ExecutorInterface`, etc.).
- [ ] Relevant Architecture Decision Records (ADRs) are documented in `docs/adr/`.
- [ ] Architecture documentation in `docs/architecture.md` is updated.

---

## 5. Testing Requirements

- Maintain zero linting warnings and errors.
- Test both mock mode and native execution paths.
- Ensure all resources (browsers, contexts, pages) are properly cleaned up in teardown routines.
