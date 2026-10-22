# STR-G11-00 — Adversarial Security Report

> **Mission:** STR-G11-00
> **Code repo fix commit SHA:** `e8386fa`
> **Test execution date:** 2026-10-22

---

## 1. Executive Summary

The adversarial security audit discovered **2 real defects** in the
proposals module, both related to **account-suspension enforcement**.
Both are fixed and covered by regression tests. No additional security
defects were found in the areas audited.

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 1 (DEFECT 1) | FIXED + regression test |
| HIGH | 1 (DEFECT 2) | FIXED + regression test |
| MEDIUM | 0 | — |
| LOW | 0 | — |

The existing G09 security test suite (12 unit tests + 7 E2E spec files)
provides strong coverage of:
- RBAC / ABAC enforcement (`g09-rbac-idor.spec.ts`, `g09-cross-isolation.spec.ts`).
- Anti-self-review segregation of duties (`g09-anti-self.spec.ts`).
- Webhook HMAC verification (`g09-webhook-hmac.test.ts`, `g09-webhook-http.spec.ts`).
- Encryption at rest (`g09-encryption-audit.test.ts`).
- Audit log integrity (`g09-audit-reqid.test.ts`, `g09-audit-atomic.test.ts`, `g09-audit-denied.test.ts`).
- Concurrency / optimistic locks (`g09-concurrency-approvals.test.ts`, `g09-production-atomicity.test.ts`).
- Injection prevention (`g09-injection-file-access.spec.ts`).
- CSRF / session protection (`g09-csrf-sessions.spec.ts`).
- Outbox reliability / worker recovery (`g09-outbox-reliability.test.ts`).

The G11-00 audit complemented this with **NEW adversarial tests** in
areas where coverage was thin or absent:
- Concurrent state transitions (race conditions in submit/approve).
- Email enumeration prevention.
- Account-suspension enforcement at service layer.
- Role-grant revocation immediate effect.
- Project suspension lifecycle.

---

## 2. Defects Found

### DEFECT 1 — CRITICAL — Suspended user can create proposals

**Severity:** CRITICAL (authorization bypass).

**Location:** `src/modules/proposals/service.ts`, function `createProposal`.

**Description:**
`createProposal` did NOT verify the submitter's account status before
creating a proposal. A SUSPENDED user with a still-valid session cookie
(session cookies persist until cookie expiry, even after the user is
suspended) could create proposals.

**Reproduction:**
1. User logs in (gets session cookie).
2. Admin suspends the user (status → `SUSPENDED`).
3. User's session cookie is still valid.
4. User calls `POST /api/proposals` with a valid charter.
5. **Before fix:** proposal created successfully.
6. **After fix:** 403 Forbidden, "Account is not active; cannot create proposals".

**Fix:**
Added user-status check at the START of `createProposal`:

```typescript
const submitter = await db.user.findUnique({
  where: { id: input.submitterId },
  select: { id: true, status: true },
});
if (!submitter || submitter.status !== "ACTIVE") {
  throw new ForbiddenError("Account is not active; cannot create proposals");
}
```

**Regression test:** `g11-00-adversarial-security.test.ts` test #4.

### DEFECT 2 — HIGH — Suspended user can act as reviewer/steward

**Severity:** HIGH (authorization bypass for privileged operations).

**Location:** `src/modules/proposals/service.ts`, functions `isInstitutionalReviewer` and `isQualifiedSteward`.

**Description:**
Both role-check helpers only checked the role grant itself (`revokedAt: null`).
They did NOT consult the user's account status. A SUSPENDED admin/reviewer/steward
with still-valid role grants could pass the role check and perform privileged
operations (review proposals, nominate stewards, approve projects).

**Reproduction:**
1. Reviewer (or steward/admin) logs in.
2. Admin suspends the user (status → `SUSPENDED`).
3. User calls `POST /api/proposals/{id}/review` with action `APPROVE`.
4. **Before fix:** approval succeeds (because `isInstitutionalReviewer`
   only checks `roleGrant.revokedAt: null`, not `user.status`).
5. **After fix:** approval rejected with "Only institutional reviewers can review proposals".

**Fix:**
Both helpers now fetch the user and return `false` if `status !== 'ACTIVE'`:

```typescript
async function isInstitutionalReviewer(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, status: true },
  });
  if (!user || user.status !== "ACTIVE") return false;
  // ... existing role grant check ...
}
```

Same pattern applied to `isQualifiedSteward`.

**Regression test:** `g11-00-adversarial-security.test.ts` test #5.

### Shared Root Cause

Both defects share the same root cause: **account-suspension enforcement
was only done at login (`verifyCredentials`) and in some HTTP routes via
`authorize()` checks, but NOT in the service-layer helpers that gate
privileged operations.** The `governance/authorize.ts` helper DOES check
status, but `proposals/service.ts` does not consistently use it.

---

## 3. Audit Categories

### 3.1 Authentication and Sessions

**Existing coverage:**
- `g09-csrf-sessions.spec.ts`: cookie attributes (httpOnly, sameSite=lax,
  secure in production), signout flow, httpOnly enforcement.
- `auth-flow.spec.ts`: signup → verify-email → signin → signout flow.
- `g09-browser-interactive.spec.ts`: real browser interactions (loading
  state, error display, redirect, keyboard nav).

**Audit finding:** No new defects. Sessions are invalidated on signout.
Cookie attributes are correct. Session cookie persists after suspension
(as expected — that's why DEFECT 1 + 2 needed service-layer checks).

**New tests added:** None (existing coverage is sufficient).

### 3.2 Authorization and Multi-Tenant Boundaries

**Existing coverage:**
- `g09-rbac-idor.spec.ts`: 12 IDOR tests covering admin-only endpoints,
  cross-user resource access, role-based access control.
- `g09-cross-isolation.spec.ts`: cross-project, cross-team, cross-org
  isolation at HTTP level. Returns 404 (not 403) for non-participants
  to prevent ID enumeration.
- `g09-anti-self.spec.ts`: segregation of duties (submitter cannot
  approve own proposal, rep cannot verify own org, etc.).

**Audit finding:** DEFECT 1 + DEFECT 2 found (see above). Existing
RBAC/ABAC enforcement at HTTP layer is strong; the gap was at the
service layer for the proposals module specifically.

**New tests added:** Tests #4, #5 (DEFECT 1 + 2 regression tests),
test #6 (role-grant revocation immediate effect).

### 3.3 Input and API Security

**Existing coverage:**
- `g09-injection-file-access.spec.ts`: XSS in proposal title, SQL
  injection in ID parameters, path traversal in file access.
- Input validation is enforced at the service layer via Zod schemas
  (e.g., `charterRevisionSchema`) and explicit length checks (e.g.,
  title >= 5 chars, reason >= 10 chars).

**Audit finding:** No new defects. Input validation is consistent
across all API routes.

**New tests added:** None.

### 3.4 Business Logic Abuse

**Existing coverage:**
- `g09-concurrency-approvals.test.ts`: concurrent approval attempts
  (existing optimistic lock test).
- `g09-anti-self.spec.ts`: segregation of duties.
- `g03-service.test.ts`: proposal state transitions, scope changes,
  suspension lifecycle.

**Audit finding:** No new defects in state-machine logic. The
optimistic locks in `submitProposal`, `reviewProposal`, `withdrawProposal`
work correctly (verified by new tests #1, #2).

**New tests added:** Tests #1 (concurrent approvals), #2 (double-submit),
#7 (project suspension lifecycle).

### 3.5 Email Enumeration

**Existing coverage:**
- Identity service `requestPasswordReset` returns a generic message
  regardless of whether the email exists.

**Audit finding:** No new defects. The generic-message pattern is
correctly implemented.

**New tests added:** Test #3 (verifies same message for known vs.
unknown email).

---

## 4. Areas NOT Audited (Limitations)

### 4.1 Real HTTP-level security tests

The G11-00 audit was performed at the **service layer** (calling service
functions directly, not via HTTP). This is appropriate for finding
service-layer defects like DEFECT 1 + 2. However, it does NOT exercise:

- HTTP middleware (Next.js middleware, rate limiting).
- Cookie attributes at the HTTP layer (covered by G09 E2E tests).
- CORS configuration (Next.js sets `Access-Control-Allow-Origin` per-route).
- Real CSRF token enforcement (deferred to G10 staging).

These are covered by the existing G09 E2E tests, which run in CI on
every PR. The G11-00 audit did NOT re-run them locally (Playwright
needs a dev server + browser binaries).

### 4.2 External adapter security (S3, SMTP, OAuth)

Not audited because the adapters are not yet wired. The mock adapter
is the only one available. When real adapters are wired, they will
need their own security review (especially around secret storage and
credential rotation).

### 4.3 Production-rate load testing

Not performed. Playwright is a functional test tool, not a load
test tool. A proper load test would require k6, Artillery, or similar.
This is out of scope for G11-00.

---

## 5. Recommendations for Follow-up

1. **Apply the same service-layer account-status check pattern to all
   other modules** (teams, projects, organizations, moderation, admin,
   integrations). Tracked in DEFECT_REGISTER.md as FOLLOW-UP-1.

2. **Add an integration test that exercises the FULL HTTP path** for
   the suspended-user scenario (currently only the service-layer path
   is tested). This would catch any future regression in the HTTP layer.

3. **Run the Playwright E2E suite in CI on the new branch** to confirm
   no UI regressions. The G09 E2E suite covers RBAC, IDOR, anti-self,
   injection, CSRF — all the security properties we care about at the
   HTTP layer.

4. **Audit the audit log** for any privileged operations that don't
   emit an audit event. The G09 audit-integrity tests cover the main
   paths (revoke, suspend, denied, atomicity), but a comprehensive
   audit-event-coverage check would be valuable.

---

## 6. Conclusion

The adversarial security audit found 2 real defects in the proposals
module, both related to account-suspension enforcement at the service
layer. Both are fixed and covered by regression tests. The existing
G09 security test suite provides strong coverage of RBAC, IDOR, anti-self,
webhook HMAC, encryption, audit integrity, concurrency, injection, and
CSRF. The G11-00 audit complemented this with 7 new adversarial tests
in areas where coverage was thin.

**No critical or high-severity defects remain unresolved** in the
areas audited. The platform is ready for the next phase (UI/UX work)
subject to MASTER approval, with the caveat that the FOLLOW-UP items
in DEFECT_REGISTER.md should be addressed in subsequent missions.
