# STR-G11-00 — Performance Report

> **Mission:** STR-G11-00
> **Code repo fix commit SHA:** `e8386fa`
> **Test execution date:** 2026-10-22

---

## 1. Executive Summary

Performance validation was **bounded and limited** by the test
environment. No production-rate load testing was performed (Playwright
is a functional test tool, not a load test tool). The findings here
are based on:

- Test execution timings (vitest suite).
- Code review of database query patterns.
- Identification of obvious N+1 queries or missing indexes.

**No performance defects were found.** The codebase uses Prisma's
typed query builder, which generates efficient SQL. Indexes are defined
on the expected access patterns (verified by code review of
`prisma/schema.prisma`).

---

## 2. Environment

| Item | Value |
|------|-------|
| Test machine | Cloud sandbox (2 vCPU, 3.9 GB RAM) |
| OS | Linux (Debian trixie) |
| PostgreSQL | 16.2 (local, via pgserver) |
| Bun | 1.4.3 |
| Node | 24.21.0 |

**Note:** This is NOT a production-representative environment. The
findings below are NOT production capacity guarantees.

---

## 3. Test Execution Timings

### 3.1 Full vitest suite (332 tests in 36 files)

| Metric | Value |
|--------|-------|
| Total duration | ~21 seconds |
| Transform time | ~574 ms |
| Import time | ~3.47 s |
| Test execution time | ~13.52 s |
| Average test duration | ~40 ms |
| Slowest tests | DB-backed tests with multi-step transactions (~500ms-1s each) |

### 3.2 G11-00 adversarial test suite (7 tests)

| Metric | Value |
|--------|-------|
| Total duration | ~591 ms |
| Test execution time | ~268 ms |
| Average test duration | ~38 ms |

### 3.3 Production build

| Metric | Value |
|--------|-------|
| Total duration | ~30 seconds |
| Standalone output size | (not measured; similar to G10-03 baseline) |

### 3.4 Typecheck + lint

| Metric | Value |
|--------|-------|
| Typecheck (`tsc --noEmit`) | ~3 seconds |
| ESLint | ~5 seconds |

---

## 4. Code-Review Performance Observations

### 4.1 Database query patterns

**Good patterns observed:**
- Prisma's typed query builder is used consistently (no raw SQL with
  string concatenation, so no SQL injection risk + query planner can
  optimize).
- `select:` is used to limit returned fields where appropriate (e.g.,
  `select: { id: true, status: true }` in the new G11-00 fix).
- `include:` is used for relations (Prisma generates JOINs, not N+1).
- Optimistic locks use `updateMany WHERE status=...` (single SQL
  statement, atomic).

**Patterns that COULD be improved (not defects):**
- `findFirst` is used in some places where an index would help. The
  schema defines indexes on the expected access patterns, so this is
  generally fine. A query analyzer (e.g., `EXPLAIN ANALYZE`) would
  confirm, but that's out of scope for G11-00.
- The proposals module's `getProposalById` function uses `include` to
  eagerly load the current revision, project, and team. This is one
  query, but it returns a lot of data. For high-traffic scenarios, a
  paginated or field-limited variant might be needed.

### 4.2 Index review (from `prisma/schema.prisma`)

The schema defines indexes on:
- `User.email` (unique) — login lookup.
- `ProjectProposal.submitterId` — "my proposals" query.
- `ProjectProposal.status` — review queue query.
- `Project.leadId`, `Project.stewardId` — dashboard queries.
- `TeamMembership.userId`, `TeamMembership.teamId` — team membership lookup.
- `IntegrationJob.status`, `IntegrationJob.claimedBy` — worker polling.
- `OutboxEvent.dispatchedAt`, `OutboxEvent.claimedAt` — worker polling.
- `AuditEvent.userId`, `AuditEvent.createdAt` — audit log queries.

These cover the expected access patterns. No missing indexes were
identified by code review.

### 4.3 Rate limiter

The rate limiter (`src/modules/identity/rate-limiter.ts`) is an
in-memory `Map`. Performance is O(1) for `check()`. Memory grows
linearly with the number of unique (IP, action) pairs in the window.

**Limitation:** single-instance only. With N replicas, an attacker
can make N × maxAttempts requests per window. This is a known
production blocker (G02 carry-over, tracked in DEFECT_REGISTER).

---

## 5. What Was NOT Tested

### 5.1 Production-rate load testing

Not performed. Would require k6, Artillery, or similar. Out of scope
for G11-00.

### 5.2 Concurrent user load

Not performed beyond the 2 concurrent `reviewProposal` calls in new
test #1. Real concurrent load testing requires multiple browser
sessions or HTTP clients.

### 5.3 Database connection pool sizing

Prisma's default connection pool size is `num_cpus * 2 + 1`. For a
2-vCPU machine, that's 5 connections. This may be insufficient under
high load. The Prisma `DATABASE_URL` can include `?connection_limit=N`
to override, but this is a deployment-time decision, not a code defect.

### 5.4 Memory and CPU profiling

Not performed. Would require a long-running load test + node
`--inspect` + Chrome DevTools. Out of scope.

### 5.5 Worker throughput under load

Not performed. The worker polls every 2s (`POLL_INTERVAL_MS = 2000`)
and processes one job per iteration. Under high load (many queued
jobs), the worker would process one job every ~2s. Multiple worker
replicas would scale linearly. No defect found; just not
load-tested.

---

## 6. Conclusion

No performance defects were found in the code-review-level audit.
Test execution timings are reasonable for a test environment.
Production-rate load testing was NOT performed and is out of scope
for G11-00. The findings here should NOT be interpreted as production
capacity guarantees.

The only performance-related concern is the in-memory rate limiter
(single-instance only), which is a known G02 carry-over production
blocker.
