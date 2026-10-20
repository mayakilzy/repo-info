# G10 — Execution Proposal (Corrected — v2)

**Date:** 2026-10-20
**Proposal type:** READ-ONLY — no implementation yet
**Proposer:** GLM (for MASTER & ChatGPT decision)
**Corrections:** deduplication, code-verified status, Caddy vs Nginx comparison,
G10-01 task draft
**Status:** PROPOSED — AWAITING MASTER APPROVAL

---

## 1. Two-Track Proposal (unchanged from v1)

### Track 1 — G10 Core: Deployment & Operational Handoff
### Track 2 — Pre-Launch Closure: Debt & Flaky Tests

(Same structure as v1 — see G10_EXECUTION_PROPOSAL.md v1 for full
rationale. This v2 corrects the item counts and adds code-verified status.)

---

## 2. Track 1 — G10 Core (Corrected)

### 2.1 Prerequisites (MASTER-provided)

Same as v1. MASTER must provide:
1. Staging domain + DNS
2. Google OAuth credentials
3. Email service credentials (SMTP or transactional)
4. S3-compatible storage credentials
5. Staging hosting (VPS or cloud)
6. Versioning convention decision (D6)
7. **Reverse proxy decision: Caddy vs Nginx Proxy Manager (NEW — see Section C)**

### 2.2 Track 1 Work Items (corrected with code-verified status)

| # | Work Item | Code Status | Needs Dev? | Effort | Depends On |
|---|-----------|------------|-----------|--------|------------|
| T1.1 | Wire real outbox worker entry point | ✅ runWorkerLoop implemented; has require.main guard | NO — config change | 30 min | None |
| T1.2 | Create `.env.staging.example` | N/A | NO — config creation | 1 hour | None |
| T1.3 | Create staging `docker-compose.staging.yml` override | N/A | NO — config creation | 2 hours | None |
| T1.4 | Configure reverse proxy (Caddy or NPM) with TLS | Caddyfile exists but no domain/TLS | NO — config + MASTER decision | 2 hours | Staging domain + proxy decision |
| T1.5 | Configure Google OAuth redirect URI for staging | ✅ Code fully implemented; activates with env vars | NO — config + Google console | 1 hour | Google credentials + staging domain |
| T1.6 | Install email library + implement SmtpEmailService | ✅ EmailService interface exists; LogEmailService works | PARTIAL — install library + implement adapter | 3 hours | Email service credentials |
| T1.7 | Wire S3-compatible storage (replace placeholder) | ❌ Placeholder readUrl; no S3 library; no multipart upload; no scanner | YES — full implementation | 8 hours | S3 credentials |
| T1.8 | Create migration/backup/restore runbook | N/A | NO — documentation | 3 hours | None |
| T1.9 | Add DB ping to health endpoint | health/route.ts returns "not_checked" | NO — small code addition | 1 hour | None |
| T1.10 | Create incident response basics document | N/A | NO — documentation | 2 hours | None |
| T1.11 | Update README (Arabic + English) for G10 status | README says "G01 in progress" | NO — documentation | 2 hours | None |
| T1.12 | Create API documentation | N/A | NO — documentation | 4 hours | None |
| T1.13 | Create operator/user guide | N/A | NO — documentation | 3 hours | None |
| T1.14 | Create known issues document | N/A | NO — documentation | 1 hour | None |
| T1.15 | Deploy to staging + smoke tests + E2E | N/A | NO — deployment + verification | 4 hours | T1.1–T1.7 + all prerequisites |
| T1.16 | Test backup + restore on staging | N/A | NO — testing | 2 hours | T1.8 + T1.15 |
| T1.17 | Release candidate report + version tag | N/A | NO — documentation | 2 hours | T1.15 + T1.16 |
| T1.18 | Founder acceptance review | N/A | — | — | T1.17 |

**Track 1 corrected effort:** ~40 hours (increased from 36h due to S3 dev + email library)
**Items needing development:** T1.7 (S3: ~8h) + T1.6 (email: ~3h) = 11 hours of dev
**Items needing config only:** 7 hours
**Items needing documentation only:** 22 hours

### 2.3 Track 1 Phase 1 (can start immediately, no prerequisites)

| Work Item | Effort |
|-----------|--------|
| T1.1 (wire worker) | 30 min |
| T1.8 (runbook) | 3 hours |
| T1.9 (health DB ping) | 1 hour |
| T1.10 (incident doc) | 2 hours |
| T1.11 (README update) | 2 hours |
| T1.12 (API docs) | 4 hours |
| T1.13 (operator guide) | 3 hours |
| T1.14 (known issues) | 1 hour |
| **Phase 1 total** | **~17 hours** |

**Phase 1 has no external dependencies. It can start as soon as MASTER
authorizes Track 1.**

### 2.4 Track 1 Phase 2 (needs MASTER prerequisites)

| Work Item | Prerequisite | Effort |
|-----------|-------------|--------|
| T1.2 (staging env) | None (but needs domain for .env.staging) | 1 hour |
| T1.3 (staging compose) | None | 2 hours |
| T1.4 (reverse proxy TLS) | Domain + proxy decision | 2 hours |
| T1.5 (Google OAuth) | Google credentials + domain | 1 hour |
| T1.6 (email library + SmtpEmailService) | SMTP credentials | 3 hours |
| T1.7 (S3 storage) | S3 credentials | 8 hours |
| **Phase 2 total** | | **~17 hours** |

### 2.5 Track 1 Phase 3 (deployment)

| Work Item | Effort |
|-----------|--------|
| T1.15 (deploy + smoke + E2E) | 4 hours |
| T1.16 (backup/restore test) | 2 hours |
| T1.17 (release report + tag) | 2 hours |
| T1.18 (founder acceptance) | — |
| **Phase 3 total** | **~8 hours** |

---

## 3. Track 2 — Pre-Launch Closure (Corrected)

### 3.1 Track 2 Work Items (deduplicated)

| # | Work Item | Source | Category | Effort |
|---|-----------|--------|----------|--------|
| T2.1 | Fix g03-proposal-flow flaky (merged D5 + F1) | G08 D5 / G09 F1 | Flaky | 30 min |
| T2.2 | Fix g05-project-execution-flow flaky | G09 F2 | Flaky | 2 hours |
| T2.3 | Fix g07-integration-flow flaky | G09 F3 | Flaky | 2 hours |
| T2.4 | Charter editor mobile E2E (D1) | G08 D1 | UI Debt | 30 min |
| T2.5 | Responsive overflow for 15 pages (D2) | G08 D2 | UI Debt | 3 hours |
| T2.6 | Arabic mobile for 3 pages (D4) | G08 D4 | UI Debt | 20 min |
| T2.7 | Loading/Empty/Error states (D3) | G08 D3 | UI Debt | 4 hours |
| T2.8 | Versioning convention (D6) | G08 D6 | UI Debt | 15 min |
| T2.9 | Real Google OAuth E2E (merged N1 + O8) | G09 NOT_TESTED | Security | 2 hours |
| T2.10 | Encryption key isolated process (N2) | G09 NOT_TESTED | Security | 2 hours |
| T2.11 | File read-before-CLEAN HTTP E2E (N3) | G09 NOT_TESTED | Security | 1 hour |
| T2.12 | Session expiration JWT maxAge (N4) | G09 NOT_TESTED | Security | 2 hours |

**Track 2 corrected effort:** ~20 hours (unchanged — dedup removed 2 items but
they were already counted once in the correct column)

---

## 4. Section C — Caddy vs Nginx Proxy Manager Comparison

### Current State

The implementation repo contains a `Caddyfile` (port :81, reverse proxy to
localhost:3000). It was created in G01 as part of the deployment scaffold.
No TLS configuration exists yet.

### Comparison

| Criterion | Caddy (existing) | Nginx Proxy Manager (NPM) |
|-----------|-----------------|--------------------------|
| Already in repo | YES — `Caddyfile` exists | NO — would need separate setup |
| TLS automation | Built-in (Let's Encrypt auto) | Built-in (Let's Encrypt via UI) |
| Configuration | Text file (Caddyfile) | Web UI + docker-compose |
| Learning curve | Low for simple reverse proxy | Low (UI-driven) |
| Performance | Excellent (Go-based) | Excellent (Nginx-based) |
| Maintenance | Single binary, minimal deps | Docker container + database |
| Access control | None built-in | Built-in (users, permissions) |
| Multi-site management | Caddyfile patterns | UI dashboard |
| Community/Docs | Strong | Strong |

### Recommendation

**Use Caddy (existing).** Reasons:
1. Already in the repo — no new infrastructure to set up
2. Caddy's automatic TLS is built-in and proven
3. Caddyfile is simple text — version-controlled, no database
4. Single binary — minimal attack surface
5. The current Caddyfile needs only domain + TLS config (2 lines)

**If MASTER's hosting environment already runs Nginx Proxy Manager**
(e.g., on a server with existing NPM setup), then use NPM instead. The
decision is **MASTER's** based on the hosting environment.

**Do NOT build both paths.** Pick one based on the hosting decision.

---

## 5. Recommended Execution Order (corrected)

```
Step 1: Track 2 Phase A (flaky test fixes — unblocks reliable CI)
  → T2.1, T2.2, T2.3
  → Verify: 5 consecutive CI runs, 0 flaky

Step 2: Track 1 Phase 1 (no prerequisites — start immediately)
  → T1.1 (wire worker) ← CRITICAL: this is the "tea machine" fix
  → T1.8, T1.9, T1.10, T1.11, T1.12, T1.13, T1.14

Step 3: Track 2 Phase B (UI debt — can parallel with Step 2)
  → T2.4, T2.5, T2.6, T2.7, T2.8

Step 4: MASTER provides prerequisites
  → Domain, Google OAuth, email, S3, hosting, proxy decision

Step 5: Track 1 Phase 2 (needs prerequisites)
  → T1.2–T1.7 (T1.7 S3 is the largest dev task: ~8 hours)

Step 6: Track 1 Phase 3 (deployment)
  → T1.15, T1.16, T1.17

Step 7: Track 2 Phase C (security NOT_TESTED — needs Google OAuth)
  → T2.9, T2.10, T2.11, T2.12

Step 8: Track 1 T1.18 (founder acceptance)
```

**Total corrected effort:** ~60 hours (Track 1: 40h + Track 2: 20h)
**Note:** 60 hours is a planning estimate, not a time commitment.
S3, email, and OAuth integration may take longer due to external
service configuration.

---

## 6. Key Decisions Needed from MASTER (corrected)

1. **Staging hosting** — same server or independent? (MASTER asked this)
2. **Reverse proxy** — Caddy (existing) or NPM (if hosting has it)?
3. **Google OAuth app** — create for staging
4. **Email service** — which provider?
5. **S3-compatible storage** — which provider?
6. **Versioning convention (D6)** — `1.0.0`, `1.0.0-g10`, semver?

**MASTER's suggestion:** "يمكننا حسم مزود التخزين والبريد والدومين لاحقاً،
أثناء تنفيذ الأجزاء التي لا تتطلب بيانات اعتماد."

**This is correct.** Steps 1–3 (flaky fixes + Phase 1 docs + UI debt)
require NO external credentials. They can proceed immediately. Steps 4–7
need MASTER-provided prerequisites.

---

## 7. Scope Integrity (unchanged)

This proposal does NOT:
- Add new features beyond G10 mission scope
- Mix Track 1 with Track 2 in same commits
- Start STR Academy or Engineering Ecosystem
- Deploy to production
- Change architecture or approved contracts

---

## 8. Stopping Point

**This is a PROPOSAL.** No implementation has started.
**Awaiting MASTER & ChatGPT decision.**
