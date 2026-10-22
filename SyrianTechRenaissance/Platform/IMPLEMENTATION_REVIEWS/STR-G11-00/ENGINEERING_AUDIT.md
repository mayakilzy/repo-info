# STR-G11-00 — Engineering Audit

> **Mission:** STR-G11-00 — Pre-UI Hardening & Adversarial System Validation
> **Code repo baseline SHA:** `635abbae2dd88ca8e27e2582d079b1de6c541e13`
> **Code repo fix commit SHA:** `e8386fa25598470dfaf8f3a4dc548492cb41b44b`
> **Code repo PR:** https://github.com/mayakilzy/SyrianTechRenaissance-Platform/pull/7
> **Date:** 2026-10-22
> **Executor:** GLM Engineering Agent

---

## 1. Mission Objective (recap)

Before UI/UX implementation begins, perform an exhaustive, evidence-driven
engineering validation of the existing platform. The goal is to discover and
remediate defects that could cause unauthorized access, data corruption,
broken business workflows, security-control bypasses, or unreliable
deployment behavior.

This document records the engineering audit findings.

---

## 2. Repository Verification

| Item | Value |
|------|-------|
| Code repo | `mayakilzy/SyrianTechRenaissance-Platform` |
| Verified `main` HEAD | `635abbae2dd88ca8e27e2582d079b1de6c541e13` |
| Post-merge CI status | STR Platform CI #274 SUCCESS (Typecheck/Lint/Unit + Playwright E2E RTL+LTR) |
| Documentation repo | `mayakilzy/repo-info` (public) |
| Path for G11-00 reports | `SyrianTechRenaissance/Platform/IMPLEMENTATION_REVIEWS/STR-G11-00/` |

---

## 3. Existing Test Suite Inventory

### 3.1 Unit/integration tests (Vitest)

- **Total test files:** 35 (pre-G11-00) + 1 (G11-00 adversarial) = 36
- **Total tests:** 325 (pre-G11-00) + 7 (G11-00 adversarial) = 332
- **Coverage by module:** proposals, teams, projects, opportunities, talent,
  organizations, partnerships, moderation, communications, notifications,
  impact, admin, integrations, identity, governance.

### 3.2 E2E tests (Playwright)

- **Total spec files:** 17
- **Coverage:** auth flow, G03 proposal flow, G04 talent/opportunity flow,
  G05 project execution flow, G06 institutional governance, G07 integration,
  G08 visual accessibility + RTL/LTR, G09 anti-self, browser-interactive,
  cross-isolation, csrf-sessions, injection-file-access, rbac-idor, webhook-http,
  security-negative, rtl-ltr, login-diagnostic.

### 3.3 CI workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` (STR Platform CI) | push to main / feat / PR | Typecheck + Lint + Unit + Playwright E2E RTL/LTR |
| `docker-build.yml` | push to feat/g10-runtime-foundation / PR | Build prod image + smoke test + worker imports |
| `g10-02-integration.yml` | push to feat/g10-02-runtime-integration / PR | Docker Compose integration (postgres + web + worker) |
| `g10-03-staging-validation.yml` | push to feat/g10-03-staging-hardening / PR | Empirical verification of staging compose (C1-C7) |

---

## 4. Execution Environment

| Item | Value |
|------|-------|
| Runtime | Bun 1.4.3 + Node 24.21.0 |
| Test DB | PostgreSQL 16.2 (bundled via Python `pgserver` package) |
| Test DB setup | `pg_ctl initdb` + `listen_addresses='localhost'` + `port=5433` + trust auth |
| Database user | `str` (superuser) |
| Databases | `str_platform` + `str_platform_shadow` (mirror docker-compose.yml) |
| Prisma migrations | 11 migrations, applied via `bunx prisma migrate deploy` |
| Isolation | Each test creates a unique `runId` and cleans up only its own rows |
| No mocks introduced | All tests use the real DB |

**Note on PG version:** the production target is PostgreSQL 17. The test
environment uses PG 16.2 (bundled with pgserver). PG 16 → 17 migrations are
generally backward-compatible. No PG-17-specific features are used in the
schema. The G10-03 staging validation CI uses PG 17-alpine in Docker; that
CI test passed in PR #4 / PR #5.

---

## 5. Baseline Verification Results

Executed against the test environment above.

| Check | Command | Result |
|-------|---------|--------|
| Dependencies install | `bun install --frozen-lockfile` | ✅ PASS (707 packages) |
| Prisma client generation | `bunx prisma generate` | ✅ PASS |
| Prisma migrations apply | `bunx prisma migrate deploy` | ✅ PASS (11/11 migrations applied) |
| TypeScript typecheck | `bun run typecheck` (`tsc --noEmit`) | ✅ PASS (0 errors) |
| ESLint | `bun run lint` | ✅ PASS (0 errors) |
| Production build | `bun run build` (Next.js standalone) | ✅ PASS (all routes built) |
| Vitest unit tests (pre-fix) | `bun run vitest run` | 325/325 PASS in 35 files |
| Vitest unit tests (post-fix) | `bun run vitest run` | 332/332 PASS in 36 files |
| Playwright E2E (RTL + LTR) | `bun run test:e2e` | NOT RUN in this env (needs dev server + browser binaries); covered by CI #274 on G10-04A merge |

---

## 6. Defects Discovered (Confirmed)

### DEFECT 1 — CRITICAL — Suspended user can create proposals

**File:** `src/modules/proposals/service.ts`, function `createProposal`.

**Reproduction:**
1. User logs in (gets session cookie).
2. Admin suspends the user (`status` → `SUSPENDED`).
3. User's session cookie is still valid (NextAuth sessions persist until cookie expiry).
4. User calls `POST /api/proposals`.
5. **Before fix:** proposal created successfully (HTTP 200, status=`DRAFT`).
6. **After fix:** HTTP 403 Forbidden, `Account is not active; cannot create proposals`.

**Root cause:** `createProposal` only checked that `submitterId` was passed
and that the charter was valid. It did NOT verify that the submitter's
account was in `ACTIVE` status. The HTTP route handler checked authentication
(`getServerSession`) but not account status. The `governance/authorize.ts`
helper DOES check status, but `createProposal` does not call it.

**Severity:**
- **CVSS-style impact:** A suspended user can continue to perform privileged
  operations (proposal creation, possibly more) until their session cookie
  expires. In practice, this window can be hours.
- **Real-world impact:** If a malicious user is suspended, they can still
  create new proposals to spam or attempt further abuse during the window.
  Not a data-leak vulnerability per se, but an enforcement gap.

**Fix:** Added a user-status check at the START of `createProposal` —
fetch the user, throw `ForbiddenError` if status !== `ACTIVE`. This is
at the SERVICE layer (defense-in-depth on top of any HTTP-layer check).

### DEFECT 2 — HIGH — Suspended user can act as reviewer/steward

**File:** `src/modules/proposals/service.ts`, functions `isInstitutionalReviewer` and `isQualifiedSteward`.

**Reproduction:**
1. Reviewer (or steward/admin) logs in.
2. Admin suspends the user (status → `SUSPENDED`).
3. User calls `POST /api/proposals/{id}/review` with action `APPROVE`.
4. **Before fix:** approval succeeds (because `isInstitutionalReviewer`
   only checks `roleGrant.revokedAt: null`, not `user.status`).
5. **After fix:** approval rejected with `Only institutional reviewers can review proposals`.

**Root cause:** The two role-check helpers (`isInstitutionalReviewer`,
`isQualifiedSteward`) only checked the role grant itself. They did NOT
consult the user's account status. A suspended user with a still-valid
role grant could pass the role check.

**Severity:**
- A suspended admin/reviewer/steward can review and approve proposals,
  nominate stewards, etc. — all privileged operations — until their
  session expires.
- This is a more direct authorization bypass than DEFECT 1, because
  the privileged operations actually mutate state (e.g., APPROVE creates
  a Project + Team + StewardAssignment).

**Fix:** Both helpers now fetch the user and return `false` if
`status !== 'ACTIVE'`. This blocks the path before any role-grant query.

### Shared Root Cause

Both defects share the same root cause: **account-suspension enforcement
was only done at login (`verifyCredentials` in identity/service.ts) and
in SOME HTTP routes via `authorize()` checks, but NOT in the service-layer
helpers that gate privileged operations**. The `governance/authorize.ts`
helper DOES check status, but `proposals/service.ts` does not consistently
use it.

**Recommended follow-up (post-G11-00):** audit ALL service modules to ensure
that every privileged operation checks user.status. The fix in DEFECT 1 + 2
covers the proposals module; similar checks should be added to:
- `teams/service.ts` (invite, suspend, change-steward)
- `projects/service.ts` (create-task, complete-milestone, etc.)
- `organizations/service.ts` (verify, suspend, reactivate)
- `moderation/service.ts` (decide)
- `admin/dashboard.ts` (admin-only queries)
- `integrations/service.ts` (provider approval, connection creation)

These were NOT fixed in G11-00 because each requires its own regression
test and careful review. They are listed in the DEFECT_REGISTER as
FOLLOW-UP items.

---

## 7. Adversarial Tests Added

**File:** `src/modules/__tests__/g11-00-adversarial-security.test.ts` (312 lines, 7 tests).

| # | Test | Status | Defect covered |
|---|------|--------|----------------|
| 1 | Concurrent proposal approvals do NOT create two projects (race protection) | ✅ PASS | (verifies existing optimistic lock works) |
| 2 | Double-submit of a DRAFT proposal fails cleanly (no duplicate state) | ✅ PASS | (verifies existing optimistic lock works) |
| 3 | Password reset for unknown email returns same message as known email | ✅ PASS | (verifies no email enumeration leak) |
| 4 | SUSPENDED user cannot create a proposal | ✅ PASS | DEFECT 1 (regression test) |
| 5 | SUSPENDED admin (with active roleGrants) cannot review proposals | ✅ PASS | DEFECT 2 (regression test) |
| 6 | Revoking the reviewer role grant prevents further reviews | ✅ PASS | (verifies role-grant revocation is enforced immediately) |
| 7 | Project suspension lifecycle: double-suspend fails, reactivate, re-suspend succeeds | ✅ PASS | (verifies state-machine invariants) |

All 7 tests PASS against real PostgreSQL. No mocks introduced. No
assertions weakened. No tests suppressed.

---

## 8. Boundaries Respected

- ✅ Isolated environment (pgserver test harness; no MASTER server access)
- ✅ Synthetic fixtures only (random per-run user IDs, no real user data)
- ✅ No DNS or firewall changes
- ✅ No deployment
- ✅ No PR merge without MASTER authorization
- ✅ No silently altered product requirements
- ✅ No mocked-out failures to obtain green results

---

## 9. Outstanding Items (post-G11-00)

These were identified but NOT remediated in G11-00. They are tracked in
the DEFECT_REGISTER.md as FOLLOW-UP items.

1. **Service-layer account-status checks in other modules** (teams,
   projects, organizations, moderation, admin, integrations).
2. **Run Playwright E2E suite in CI for the new test branch** — locally
   the test runner doesn't have a dev server + browser binaries; CI
   (ci.yml) does run them.
3. **NOT_TESTED items carried from G10-03** (unchanged):
   - Real S3 integration
   - Real SMTP integration
   - Real Google OAuth integration
   - Distributed rate limiter via Redis
   - Interrupted worker recovery during mid-processing (per-adapter
     before real adapters go live)
   - Backup/restore end-to-end on real staging server
