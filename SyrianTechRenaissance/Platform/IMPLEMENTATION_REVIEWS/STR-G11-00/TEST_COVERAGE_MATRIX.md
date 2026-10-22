# STR-G11-00 — Test Coverage Matrix

> **Mission:** STR-G11-00
> **Code repo baseline SHA:** `635abbae`
> **Code repo fix commit SHA:** `e8386fa`
> **Test execution date:** 2026-10-22

---

## 1. Risk-Ranked Validation Matrix

Each critical business capability is mapped to its test coverage. The
risk ranking reflects the impact of a failure, not the likelihood.

Risk levels:
- **CRITICAL**: failure causes data loss, security breach, or authorization bypass.
- **HIGH**: failure causes broken core workflow or wrong authorization decision.
- **MEDIUM**: failure causes degraded UX or non-correct state.
- **LOW**: failure is cosmetic or affects non-user-facing functionality.

| # | Capability | Risk | Existing test coverage | New G11-00 coverage | Status |
|---|------------|------|------------------------|----------------------|--------|
| 1 | Authentication (signup, signin, signout) | CRITICAL | `g09-csrf-sessions.spec.ts`, `g09-browser-interactive.spec.ts`, `auth-flow.spec.ts`, identity unit tests | — | PASS |
| 2 | Email verification | HIGH | identity unit tests | — | PASS |
| 3 | Password reset (with email enumeration prevention) | HIGH | identity unit tests | NEW: `email enumeration prevention` test #3 | PASS |
| 4 | Session invalidation on signout | HIGH | `g09-csrf-sessions.spec.ts` | — | PASS |
| 5 | Account suspension blocks privileged operations | CRITICAL | (none) | NEW: tests #4, #5 (DEFECT 1 + DEFECT 2 regression tests) | PASS (after fix) |
| 6 | Role-grant revocation immediate effect | HIGH | (none) | NEW: test #6 | PASS |
| 7 | RBAC: admin-only endpoints | CRITICAL | `g09-rbac-idor.spec.ts` (11 IDOR tests) | — | PASS |
| 8 | ABAC: project-scoped role checks (lead, steward, member) | CRITICAL | `g09-cross-isolation.spec.ts`, `g03-fix-governance.test.ts`, G03-G06 service tests | — | PASS |
| 9 | Anti-self-review (segregation of duties) | HIGH | `g09-anti-self.spec.ts` (5 tests) | — | PASS |
| 10 | Cross-tenant isolation (no IDOR) | CRITICAL | `g09-cross-isolation.spec.ts`, `g09-rbac-idor.spec.ts` | — | PASS |
| 11 | Proposal lifecycle (draft → submit → review → approve/reject) | CRITICAL | `g03-service.test.ts` (12 tests) | NEW: tests #1, #2 (concurrent state transitions) | PASS |
| 12 | Project execution (deliverables, milestones, tasks) | HIGH | `g05-service.test.ts`, `g05-project-execution-flow.spec.ts` | — | PASS |
| 13 | Team invitations + accept/decline | HIGH | `g03-service.test.ts` | — | PASS |
| 14 | Opportunities + applications | HIGH | `g04-service.test.ts`, `g04-talent-opportunity-flow.spec.ts` | — | PASS |
| 15 | Talent search | MEDIUM | `g04-service.test.ts` | — | PASS |
| 16 | Organizations + representatives + verification | HIGH | `g06-organizations.test.ts` | — | PASS |
| 17 | Partnerships lifecycle | HIGH | `g06-partnerships.test.ts` | — | PASS |
| 18 | Moderation (complaints + decisions) | HIGH | `g06-moderation.test.ts` | — | PASS |
| 19 | Communications (threads + messages) | MEDIUM | `g06-threads.test.ts` | — | PASS |
| 20 | Notifications | MEDIUM | `g06-threads.test.ts` (implicit) | — | PARTIAL (no dedicated notification service tests) |
| 21 | Impact records | MEDIUM | `g06-impact.test.ts` | — | PASS |
| 22 | Admin dashboard + audit + grants | HIGH | `g06-admin.test.ts`, `g09-audit-integrity.test.ts` | — | PASS |
| 23 | Integration providers + approval flow | HIGH | `g07-service.test.ts` | — | PASS |
| 24 | Integration connections (create, suspend, revoke) | HIGH | `g07-service.test.ts` | — | PASS |
| 25 | Integration jobs (queue, claim, execute, cancel) | CRITICAL | `g07-service.test.ts`, `g07-webhook-worker.test.ts`, `g09-outbox-reliability.test.ts` | — | PASS |
| 26 | Webhook HMAC verification | CRITICAL | `g09-webhook-hmac.test.ts` (11 tests), `g09-webhook-http.spec.ts` | — | PASS |
| 27 | Outbox event delivery + recovery | CRITICAL | `g09-outbox-reliability.test.ts` (10 tests) | — | PASS |
| 28 | Worker crash recovery (lease expiration) | HIGH | `g09-outbox-reliability.test.ts`, `g10-01v-worker-shutdown.test.ts` | — | PASS |
| 29 | Worker graceful shutdown (SIGTERM) | HIGH | `g10-01v-worker-shutdown.test.ts`, G10-02 CI C3 | — | PASS |
| 30 | Encryption at rest (webhook secrets) | CRITICAL | `g09-encryption-audit.test.ts` (13 tests) | — | PASS |
| 31 | Audit log integrity (reqId, atomicity, denied/failure) | HIGH | `g09-audit-reqid.test.ts`, `g09-audit-atomic.test.ts`, `g09-audit-denied.test.ts` | — | PASS |
| 32 | Concurrency: optimistic locks on critical state changes | CRITICAL | `g09-concurrency-approvals.test.ts`, `g09-production-atomicity.test.ts` | NEW: tests #1, #2 (concurrent proposal approvals + double-submit) | PASS |
| 33 | File access safety (no path traversal, no public reads) | HIGH | `g09-injection-file-access.spec.ts`, `g09-file-fail-closed.test.ts` | — | PASS |
| 34 | Injection prevention (XSS, SQL, NoSQL) | HIGH | `g09-injection-file-access.spec.ts`, `g09-rbac-idor.spec.ts` | — | PASS |
| 35 | CSRF defense (SameSite cookies) | MEDIUM | `g09-csrf-sessions.spec.ts` | — | PASS |
| 36 | RTL/LTR layout integrity | MEDIUM | `rtl-ltr.spec.ts`, `g08-visual-accessibility.spec.ts` | — | PASS |
| 37 | Health endpoint (liveness) | LOW | `g10-01v-health-readiness.test.ts` | — | PASS |
| 38 | Readiness endpoint (DB ping) | LOW | `g10-01v-health-readiness.test.ts` | — | PASS |
| 39 | Migration ordering (migrate before app/worker start) | HIGH | G10-03 staging validation CI C3, C7 | — | PASS |
| 40 | Staging compose runtime (postgres + migrate + app + worker) | HIGH | G10-03 staging validation CI C1-C6 | — | PASS |
| 41 | Docker production image build | HIGH | G10-03 staging validation CI A1-A3 + Docker Production Build CI | — | PASS |
| 42 | Backup procedure (pg_dump) | HIGH | DOCUMENTED in `backup-restore.md` §2.2 | — | NOT_TESTED (procedural, requires real server) |
| 43 | Restore procedure (pg_restore / psql) | CRITICAL | DOCUMENTED in `backup-restore.md` §3 | — | NOT_TESTED (procedural, requires real server) |
| 44 | Migration rollback (forward-only, restore from backup) | HIGH | DOCUMENTED in `backup-restore.md` §4 | — | NOT_TESTED (procedural) |
| 45 | Real S3 object storage integration | MEDIUM | NOT_IMPLEMENTED (placeholder readUrl) | — | NOT_TESTED |
| 46 | Real SMTP email service | MEDIUM | NOT_IMPLEMENTED (LogEmailService default) | — | NOT_TESTED |
| 47 | Real Google OAuth flow | MEDIUM | NOT_IMPLEMENTED (scaffolded, hidden when env vars unset) | — | NOT_TESTED |
| 48 | Distributed rate limiter (Redis) | HIGH (multi-instance) | NOT_IMPLEMENTED (in-memory Map) | — | NOT_TESTED (single-instance OK for staging) |
| 49 | Interrupted worker recovery during mid-processing | HIGH | NOT_TESTED explicitly (lease mechanism tested, but not the specific mid-execution crash) | — | NOT_TESTED (staging-safe with mock adapter; production blocker once real adapters wired) |
| 50 | UI/UX visual fidelity | LOW | OUT OF SCOPE (deferred to G11-01) | — | OUT OF SCOPE |

---

## 2. Test Suite Summary

| Category | Files | Tests | Status |
|----------|-------|-------|--------|
| Vitest unit tests (pre-G11-00) | 35 | 325 | PASS |
| Vitest adversarial regression tests (new G11-00) | 1 | 7 | PASS |
| **Total unit tests** | **36** | **332** | **PASS** |
| Playwright E2E tests | 17 | (count varies, see CI #274) | PASS (verified in CI on `635abbae`) |
| Typecheck | 1 | — | PASS |
| ESLint | 1 | — | PASS |
| Production build | 1 | — | PASS |

---

## 3. Gaps Identified

### 3.1 Gaps closed by G11-00

- **Account-suspension enforcement at service layer** (proposals module):
  closed by DEFECT 1 + DEFECT 2 fixes + regression tests #4, #5.

### 3.2 Gaps NOT closed by G11-00 (carry-forward)

| # | Gap | Severity | Reason | Recommended mission |
|---|-----|----------|--------|---------------------|
| G1 | Service-layer account-status checks in teams/projects/organizations/moderation/admin/integrations modules | HIGH | Each requires its own regression test + careful review. Time-boxed to G11-00. | G11-00-followup |
| G2 | Backup/restore end-to-end test on real server | CRITICAL | Requires real server access; out of scope of G11-00. | G10-04B Step 10 |
| G3 | Real adapter integration tests (S3, SMTP, OAuth) | MEDIUM | Adapters not yet wired; placeholder/mock only. | G11-XX when integrations wired |
| G4 | Distributed rate limiter | HIGH (multi-instance) | Requires Redis; out of scope of G11-00. | G10-XX production-readiness mission |
| G5 | Interrupted worker recovery during mid-processing | HIGH | Lease mechanism is tested; the specific mid-execution crash scenario is NOT. | Staging acceptance test (G10-04C) |
| G6 | Performance / load testing | MEDIUM | Bounded load testing was attempted but no reliable load test was produced (Playwright is functional, not load). | G11-XX if performance concerns arise |

---

## 4. Test Execution Environment

| Item | Value |
|------|-------|
| OS | Linux (Debian trixie / Alpine container) |
| Architecture | x86_64 |
| Bun version | 1.4.3 |
| Node version | 24.21.0 |
| PostgreSQL version | 16.2 (bundled via pgserver Python package) |
| Test DB user | `str` (superuser, password `str_password`) |
| Test DBs | `str_platform` + `str_platform_shadow` |
| Test DB connection | TCP localhost:5433 |
| Migration tool | Prisma 6.11 |
| Test runner | Vitest 4.1.12 |
| Isolation | Per-test `runId`; cleanup deletes only the test's rows |

---

## 5. Methodology Notes

- Per MASTER directive: tests were written to discover defects, not to confirm
  that existing tests pass.
- Two real defects were found (DEFECT 1 + DEFECT 2) and fixed.
- No mocks were introduced; all tests run against real PostgreSQL.
- No assertions were weakened.
- No failing tests were suppressed.
- The 7 new adversarial regression tests are deterministic and use the same
  per-run isolation pattern as G03.
