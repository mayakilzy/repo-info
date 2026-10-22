# STR-G11-00 — Defect Register

> **Mission:** STR-G11-00
> **Code repo fix commit SHA:** `e8386fa`
> **Date:** 2026-10-22

---

## 1. Confirmed Defects (Fixed)

### DEFECT 1 — CRITICAL — Suspended user can create proposals

| Field | Value |
|-------|-------|
| ID | DEFECT-1 |
| Severity | CRITICAL |
| Status | FIXED + regression test |
| Module | `src/modules/proposals/service.ts` |
| Function | `createProposal` |
| Found by | G11-00 adversarial test #4 |
| Fix commit | `e8386fa` |
| Regression test | `src/modules/__tests__/g11-00-adversarial-security.test.ts` test #4 |
| Reproduction | See ADVERSARIAL_SECURITY_REPORT.md §2.1 |
| Root cause | Service layer did not check `user.status === "ACTIVE"` before creating proposal. Only HTTP-layer auth check existed. |
| Impact | A suspended user with a still-valid session cookie could create proposals. Window: hours (until session expires). |
| Fix | Added `db.user.findUnique` + status check at start of `createProposal`. Throws `ForbiddenError` if status !== "ACTIVE". |
| Verified by | All 332 tests PASS (325 pre-existing + 7 new adversarial). |

### DEFECT 2 — HIGH — Suspended user can act as reviewer/steward

| Field | Value |
|-------|-------|
| ID | DEFECT-2 |
| Severity | HIGH |
| Status | FIXED + regression test |
| Module | `src/modules/proposals/service.ts` |
| Functions | `isInstitutionalReviewer`, `isQualifiedSteward` |
| Found by | G11-00 adversarial test #5 |
| Fix commit | `e8386fa` |
| Regression test | `src/modules/__tests__/g11-00-adversarial-security.test.ts` test #5 |
| Reproduction | See ADVERSARIAL_SECURITY_REPORT.md §2.2 |
| Root cause | Both role-check helpers only checked `roleGrant.revokedAt: null`, not `user.status`. A suspended user with active role grants could pass the check. |
| Impact | A suspended admin/reviewer/steward could review proposals, nominate stewards, approve projects — all privileged operations — until session expires. |
| Fix | Both helpers now fetch the user and return `false` if status !== "ACTIVE". |
| Verified by | All 332 tests PASS. |

---

## 2. Follow-Up Items (NOT Fixed in G11-00)

### FOLLOW-UP-1 — Apply service-layer account-status check to other modules

| Field | Value |
|-------|-------|
| ID | FOLLOW-UP-1 |
| Severity | HIGH |
| Status | OPEN |
| Modules affected | `teams/service.ts`, `projects/service.ts`, `organizations/service.ts`, `moderation/service.ts`, `admin/dashboard.ts`, `integrations/service.ts` |
| Description | The same pattern that caused DEFECT 1 + 2 (service layer not checking user.status) likely exists in other modules. Each module should be audited and the same `db.user.findUnique` + status check added to privileged operations. |
| Reason not fixed in G11-00 | Each module requires its own regression tests + careful review. Time-boxed to G11-00. |
| Recommended mission | G11-00-followup (or roll into G11-01) |

### FOLLOW-UP-2 — HTTP-level integration test for suspended-user scenario

| Field | Value |
|-------|-------|
| ID | FOLLOW-UP-2 |
| Severity | MEDIUM |
| Status | OPEN |
| Description | The G11-00 regression tests cover the SERVICE layer (calling `createProposal` directly). An HTTP-level integration test (using a real Next.js dev server + real session cookie + suspended user) would catch any future regression in the HTTP layer. |
| Reason not fixed in G11-00 | Requires Playwright + dev server setup. The existing G09 E2E suite covers RBAC/IDOR at HTTP layer; adding a suspended-user scenario would be a natural extension. |
| Recommended mission | G11-00-followup or G11-01 |

### FOLLOW-UP-3 — Worker crash-during-execution recovery test

| Field | Value |
|-------|-------|
| ID | FOLLOW-UP-3 |
| Severity | HIGH (production blocker when real adapters wired) |
| Status | OPEN |
| Description | The specific scenario "worker crashes DURING `adapter.executeJob()`" is NOT_TESTED. The lease mechanism is tested (re-queues after 60s), but the partial-external-side-effect scenario is not. |
| Reason not fixed in G11-00 | Staging-safe (mock adapter is idempotent). Real adapters are not yet wired. |
| Recommended mission | G11-XX (when first real adapter is wired) |

### FOLLOW-UP-4 — Generic idempotency-key deduplication for adapters

| Field | Value |
|-------|-------|
| ID | FOLLOW-UP-4 |
| Severity | MEDIUM |
| Status | OPEN |
| Description | The `idempotencyKey` field exists on `IntegrationJob` but is not enforced by the worker. Before wiring real adapters, add a pre-execution check: `SELECT result FROM IntegrationJob WHERE idempotencyKey=? AND status="succeeded"`. If a result exists, return it without re-executing. |
| Reason not fixed in G11-00 | No real adapters exist yet. |
| Recommended mission | G11-XX (when first real adapter is wired) |

### FOLLOW-UP-5 — Run Playwright E2E suite in CI on the new branch

| Field | Value |
|-------|-------|
| ID | FOLLOW-UP-5 |
| Severity | MEDIUM |
| Status | OPEN (will be auto-resolved when PR #7 CI runs) |
| Description | The G11-00 audit did NOT run the Playwright E2E suite locally (no dev server + browser binaries in test env). CI will run them on PR #7. |
| Reason not fixed in G11-00 | CI handles this automatically. |
| Recommended mission | (auto-resolved by CI) |

---

## 3. NOT_TESTED Items (Carry-Forward from G10-03)

These are NOT defects. They are capabilities that have not been
empirically tested. They are documented in `backup-restore.md` §12
and `g10-04a-server-blueprint.md` Track C.

| # | Item | Status | Staging blocker? | Production blocker? |
|---|------|--------|------------------|---------------------|
| 1 | Real S3 integration | NOT_TESTED | NO (optional) | YES (when file uploads needed) |
| 2 | Real SMTP integration | NOT_TESTED | NO (optional) | YES (when email verification needed) |
| 3 | Real Google OAuth integration | NOT_TESTED | NO (optional) | YES (when Google sign-in needed) |
| 4 | Distributed rate limiter (Redis) | NOT_TESTED | NO (single-instance OK) | YES (multi-instance) |
| 5 | Interrupted worker recovery during mid-processing | NOT_TESTED | NO (mock adapter idempotent) | YES (per-adapter) |
| 6 | Backup/restore end-to-end on real server | NOT_TESTED | NO (procedure documented) | YES (must run on staging first) |
| 7 | Migration rollback drill | NOT_TESTED | NO (procedure documented) | YES (must run on staging first) |

---

## 4. False Positives (Investigated + Dismissed)

### FP-1 — "Phantom modified files" in local working copy

| Field | Value |
|-------|-------|
| Description | During the G11-00 audit, the local working copy showed 364 files as "modified" with 0 insertions / 0 deletions. |
| Investigation | These were file-mode changes (100644 → 100755), not content changes. Caused by `chmod +x` on the discovery script (from G10-04A) leaking file modes. |
| Resolution | `git config core.fileMode false; git checkout -- .` — working tree clean. NOT a defect. |

### FP-2 — "46 vitest failures" on first run

| Field | Value |
|-------|-------|
| Description | First vitest run showed 46 failures across 7 files (g07, g09 integration/encryption/outbox/webhook tests). |
| Investigation | All 46 failures had the same root cause: missing `AUTH_SECRET` and `INTEGRATION_ENCRYPTION_KEY` env vars. The tests require these to function. |
| Resolution | Added env vars to the test runner script. All 332 tests then PASS. NOT a defect — just env setup. |

### FP-3 — "Concurrent approvals create 2 projects" assumption

| Field | Value |
|-------|-------|
| Description | Initial adversarial test #1 asserted that concurrent `reviewProposal` calls would result in 1 fulfilled + 1 rejected. |
| Investigation | The service implements IDEMPOTENT approval: the second concurrent call finds the proposal no longer in SUBMITTED status, looks up the existing project, and returns it WITHOUT creating a duplicate. Both calls succeed (both return the same project), but only ONE project + ONE review decision exist. |
| Resolution | Updated test #1 to assert the actual invariant: exactly 1 project + 1 decision + 1 team, final status = APPROVED. NOT a defect — the idempotent behavior is correct and desirable. |

---

## 5. Defect Summary

| Category | Count |
|----------|-------|
| Confirmed defects (fixed) | 2 (DEFECT 1 CRITICAL, DEFECT 2 HIGH) |
| Follow-up items (open) | 5 (FOLLOW-UP 1-5) |
| NOT_TESTED items (carry-forward) | 7 (from G10-03) |
| False positives (investigated) | 3 |
| **Total** | **17** |

**No unresolved critical or high-severity defects** in the areas
audited by G11-00.
