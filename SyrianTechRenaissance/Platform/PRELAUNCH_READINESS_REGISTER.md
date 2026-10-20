# Pre-Launch Readiness Register (Corrected — v2)

**Date:** 2026-10-20
**Audit type:** READ-ONLY — no commits, no pushes, no code changes
**Auditor:** GLM (for MASTER & ChatGPT review)
**Source:** implementation repo (main @ `a8ae4ed`) + governance repo
**Corrections:** deduplication of overlapping items + 4-tier classification
per ChatGPT G10-PRE-02 directive

---

## Classification System (4 tiers)

Each item is classified into exactly ONE tier:

| Tier | Code | Meaning |
|------|------|---------|
| **Staging Blocker** | SB | Prevents staging deployment (G10 cannot complete) |
| **Launch Blocker** | LB | Prevents public launch (but staging can proceed) |
| **Recommended** | RC | Should close before launch but does not block |
| **Deferred Risk** | DR | Accepted risk; needs MASTER risk-acceptance decision |

---

## Deduplication Rules (per ChatGPT)

| Overlap | Resolution |
|---------|-----------|
| N1 (Google OAuth NOT_TESTED) ↔ O8 (Google OAuth env) | MERGE → single item: Google OAuth configuration + E2E |
| D5 (g03 flaky) ↔ F1 (g03 flaky) | MERGE → single item: g03 test stability |
| O1 duplicated in original table | REMOVE duplicate |

---

## Corrected Register (unique items, deduplicated)

### SB — Staging Blockers (prevent G10 staging deployment)

| ID | Item | Source | Current State | Needs Dev? | Effort | Verification |
|----|------|--------|--------------|-------------|--------|--------------|
| SB-1 | Outbox worker not wired | docker-compose.yml + keepalive.ts | `command: bun run src/worker/keepalive.ts` (G01 placeholder); `runWorkerLoop` (G07) exists but NOT wired | NO — config change only | 30 min | Change command to `bun run src/modules/integrations/outbox-worker.ts`; test worker processes a job |
| SB-2 | Object storage placeholder | file-evidence.ts:180 + no S3 library in package.json | `readUrl: storage://placeholder/...`; no `@aws-sdk/client-s3` installed; no multipart upload; no scanner | YES — needs S3 client + signed URL + scanner integration | ~8 hours | Install S3 library; implement upload + readUrl; replace placeholder; E2E with real storage |
| SB-3 | Staging environment config | G10 mission | No `.env.staging.example`; no staging compose override | NO — config creation | 2 hours | Create `.env.staging.example` + `docker-compose.staging.yml` |
| SB-4 | Google OAuth credentials | ADR-03 + auth-config.ts:88 | Code is FULLY implemented (GoogleProvider + safe linking); activates when env vars set | NO — needs MASTER-provided credentials + redirect URI | 1 hour | Set GOOGLE_CLIENT_ID/SECRET; add callback URI to Google console; E2E login |
| SB-5 | Email service credentials | email-service.ts | `LogEmailService` (dev/prod) logs only; `CaptureEmailService` (test) works; flow is complete; NO SMTP library installed | NO — needs library install + SMTP config | 2 hours | Install `nodemailer` or `resend`; create `SmtpEmailService` implementing `EmailService` interface; configure SMTP env vars |
| SB-6 | TLS / reverse proxy | Caddyfile + 02-Architecture §8 | Caddyfile exists (port :81, no domain, no TLS); architecture says "reverse proxy/TLS" | NO — config + domain decision | 2 hours | Configure Caddy with staging domain + auto-TLS OR use Nginx Proxy Manager (MASTER decision — see Section C) |
| SB-7 | Staging hosting | GOVERNANCE-02 (Deferred) | No hosting provider selected | NO — MASTER decision | — | MASTER provides hosting (VPS or cloud) |

### LB — Launch Blockers (staging can proceed, but public launch blocked)

| ID | Item | Source | Current State | Needs Dev? | Effort | Verification |
|----|------|--------|--------------|-------------|--------|--------------|
| LB-1 | g03-proposal-flow flaky test | G08 D5 + G09 closure | PROPOSER_EMAIL module-load reuse; passes on retry | NO — test refactor | 30 min | Per-test email generation; 5 CI runs without retry |
| LB-2 | g05-project-execution-flow flaky test | G09 closure | Similar isolation pattern; root cause not fully diagnosed | NO — test refactor | 2 hours | Diagnose + fix; 5 CI runs without retry |
| LB-3 | g07-integration-flow flaky test | G09 closure | Similar isolation pattern; root cause not fully diagnosed | NO — test refactor | 2 hours | Diagnose + fix; 5 CI runs without retry |
| LB-4 | Charter editor mobile (D1) | G08 D1 | No mobile test for charter editor | NO — test addition | 30 min | Mobile E2E test (en + ar, no overflow) |
| LB-5 | Responsive overflow tests for 15 pages (D2) | G08 D2 | Mobile screenshots exist for 7 pages; strict overflow tests missing for all 15 | NO — test addition | 3 hours | Strict `hasHorizontalScroll=false` for each page |
| LB-6 | Arabic mobile for 3 pages (D4) | G08 D4 | 3 Arabic mobile screenshots missing (partnerships, moderation, integrations) | NO — test addition | 20 min | 3 new mobile E2E tests |
| LB-7 | Backup/restore runbook + verified restore | G10 mission + 02-Architecture §8 | No runbook; no tested restore | NO — documentation + test | 3 hours | Create runbook; test backup + restore on staging |

### RC — Recommended (should close, but not blocking)

| ID | Item | Source | Current State | Needs Dev? | Effort | Verification |
|----|------|--------|--------------|-------------|--------|--------------|
| RC-1 | Loading/Empty/Error states (D3) | G08 D3 | 21 pages use inline conditionals instead of shared states.tsx | NO — refactor | 4 hours | Wire shared components per page |
| RC-2 | Health API version stamp (D6) | G08 D6 | `1.0.0-g01` in package.json/health route | NO — decision + config | 15 min | MASTER decides convention; update |
| RC-3 | README says "G01 in progress" | README.md:6 | Outdated status text | NO — documentation | 15 min | Update to reflect G01–G09 complete |
| RC-4 | README mentions middleware.ts | README.md:125 | File doesn't exist; not needed (next-intl [locale] segment works) | NO — documentation | 5 min | Remove reference from README |
| RC-5 | DB ping in health endpoint | health/route.ts | Returns `database: "not_checked"` | NO — small code addition | 1 hour | Add DB ping; return `database: "ok"/"unavailable"` |
| RC-6 | Incident response runbook | G10 mission | None | NO — documentation | 2 hours | Create incident response basics |
| RC-7 | Dependency scanning | 02-Architecture §9 | None | NO — CI config | 1 hour | Add `bun audit` or Snyk to CI |
| RC-8 | API documentation | G10 mission #5 | None | NO — documentation | 4 hours | Create OpenAPI or equivalent |

### DR — Deferred Risk (accepted risk, needs MASTER decision)

| ID | Item | Source | Risk | Needs Dev? | Effort | Verification |
|----|------|--------|------|-----------|--------|--------------|
| DR-1 | Encryption key failure in isolated process | G09 NOT_TESTED N2 | LOW — unit test covers algorithm; isolated-process failure is ops concern | NO — test addition | 2 hours | Run test in isolated child process with TS transpilation |
| DR-2 | File read-before-CLEAN HTTP E2E | G09 NOT_TESTED N3 | LOW — 5 service-level tests cover this with real file states | NO — test addition | 1 hour | Add HTTP E2E test for file read URL before scan |
| DR-3 | Session expiration (JWT maxAge) | G09 NOT_TESTED N4 | MEDIUM — standard Auth.js behavior; untested edge case | NO — test addition | 2 hours | Mock clock or manipulate JWT to test expiry |

---

## Corrected Summary (deduplicated)

| Tier | Count | Unique Items |
|------|-------|-------------|
| SB — Staging Blocker | 7 | SB-1 through SB-7 |
| LB — Launch Blocker | 7 | LB-1 through LB-7 |
| RC — Recommended | 8 | RC-1 through RC-8 |
| DR — Deferred Risk | 3 | DR-1 through DR-3 |
| **Total unique items** | **25** | |

**Previous report claimed 16 launch blockers.** Corrected count:
- 7 staging blockers (must fix before G10 staging deployment)
- 7 launch blockers (must fix before public launch, but staging can proceed)
- = **14 blocking items** (not 16 — 2 were duplicates: N1/O8 and D5/F1)

**Of the 14 blocking items:**
- 2 need functional development (SB-2: S3/storage; SB-5: email library)
- 12 need configuration, test fixes, or documentation only

---

## Code Verification Summary (per ChatGPT Task B)

| Component | Code Status | Needs Dev? | Needs Config Only? |
|-----------|------------|-----------|-------------------|
| Outbox worker (`runWorkerLoop`) | ✅ Fully implemented (G07); has `require.main` guard | NO — wire entry point | YES — change docker-compose command |
| Object storage (S3) | ❌ Placeholder readUrl; no S3 library; no upload; no scanner | YES — ~8 hours | NO |
| Email verification | ✅ Fully implemented (EmailService interface + LogEmailService); flow complete | PARTIAL — install SMTP library + implement `SmtpEmailService` | YES for library; YES for SMTP config |
| Google OAuth | ✅ Fully implemented (GoogleProvider + safe linking); activates with env vars | NO | YES — credentials + redirect URI |
| middleware.ts | ✅ Not needed — next-intl [locale] segment handles routing; CI proves it works | NO | NO — just update README |

**Key finding:** Only **2 components need functional development** (S3 storage + SMTP email library). The other 3 are configuration-only or documentation-only.
