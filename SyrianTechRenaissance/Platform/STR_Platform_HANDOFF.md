# STR Platform — Project Chat Handoff Document

> **Protocol:** [Universal Project Chat Handoff Protocol v1.0](https://github.com/mayakilzy/repo-info/blob/main/PROJECT_CHAT_HANDOFF_PROTOCOL.md)
> **Mode:** A — PREPARE_HANDOFF
> **Date:** 2026-10-17
> **Prepared by:** GLM (Lead Development AI)
> **Project:** Syrian Tech Renaissance (STR) — STR Platform v1.0

---

## 1. Executive Project Overview

**Syrian Tech Renaissance (STR)** is a Syrian-origin, globally-open technology initiative building an institutional platform that transforms scattered technical skills into productive teams, real projects, and sustainable opportunities.

**Mission:** "Syrian in origin and mission, global in openness and collaboration."

**Intended users:** Syrian developers, engineers, designers, and technical professionals — plus international collaborators — who want to propose projects, form teams, find opportunities, and contribute to real work under professional governance.

**Vision:** Build a real digital institution, not a forum. The platform manages identity, talent, project governance, opportunities, partnerships, contributions, and integrations — all under transparent, neutral, auditable governance.

**Current scope (v1.0):** The institutional STR Platform only. STR Academy and STR Engineering Ecosystem are separate future projects, explicitly out of scope.

---

## 2. Repositories and Authoritative Resources

### Code Repository
| Field | Value |
|---|---|
| Name | `SyrianTechRenaissance-Platform` |
| URL | https://github.com/mayakilzy/SyrianTechRenaissance-Platform |
| Owner | mayakilzy (Ayman — Project Owner) |
| Visibility | Public |
| Default branch | `main` |
| `main` SHA | `1264c9f` (G03 merged) |
| Working branch | `feat/g04-talent-opportunities` |
| Working branch SHA | `62a6683` (G04 complete, pending merge) |
| CI | GitHub Actions — both jobs (verify + e2e) PASS on `62a6683` |

### Documentation Repository
| Field | Value |
|---|---|
| Name | `repo-info` |
| URL | https://github.com/mayakilzy/repo-info |
| Path | `SyrianTechRenaissance/Platform/` |
| Contents | Product spec, architecture, data model, integration contracts, UX, engineering playbook, decision register, missions G01–G10 |

### Preserved Branches
| Branch | SHA | Purpose |
|---|---|---|
| `main` | `1264c9f` | Default branch (G01+G02+G03 merged) |
| `feat/g01-foundation` | `996ba63` | G01 development (preserved) |
| `feat/g02-recovery` | `996ba63` | G02 recovery (preserved) |
| `feat/g03-proposals-teams` | `1264c9f` | G03 development (merged to main) |
| `feat/g04-talent-opportunities` | `62a6683` | G04 development (pending merge) |

---

## 3. Architecture and Technology

### Stack (locked in G01, ADR-01)
| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | 16.1.x |
| Language | TypeScript 5 (strict mode) | 5.x |
| Database | PostgreSQL 17 | 17 |
| ORM | Prisma | 6.11–6.19 |
| Auth | Auth.js (next-auth v4) | 4.24.x |
| Validation | Zod 4 | 4.x |
| i18n | next-intl | 4.3.x |
| Styling | Tailwind CSS 4 + shadcn/ui | 4.x |
| Unit test | Vitest | 4.1.x |
| E2E test | Playwright | 1.57+ |
| Runtime | Bun (dev), Node (prod standalone) | 1.3 / 24 |

### Architecture: Modular Monolith (ADR-01)
12 modules with enforced boundaries:
1. `identity` — users, credentials, email verification, Google OIDC, sessions
2. `profiles` — professional profiles, skills, portfolio, visibility
3. `proposals` — project proposals, charter revisions, review workflow
4. `teams` — team membership, invitations, scope control (NO direct team creation)
5. `opportunities` — opportunity lifecycle, applications, decisions
6. `projects` — milestones, tasks, deliverables (G05)
7. `organizations` — partners, representatives (G06)
8. `contributions` — contribution attribution, rights (G06)
9. `communications` — notifications, contextual threads
10. `governance` — moderation, approvals, audit, resource grants
11. `impact` — evidence-backed impact measurement
12. `integrations` — registry, capabilities, connections, jobs, events (types only in G01; functional slice in G07)

### Key Architectural Decisions (ADRs)
- **ADR-01:** Modular monolith on Next.js + TS + PostgreSQL + Prisma — ACCEPTED
- **ADR-02:** PostgreSQL outbox + same-codebase worker — ACCEPTED
- **ADR-03:** Auth.js with email/password + Google OIDC — SCAFFOLDED (G02, activates when credentials provided)
- **ADR-04:** Integration Core typed contracts (types only in G01, functional slice in G07) — ACCEPTED
- **ADR-05:** Sandbox dev database constraint (no local PostgreSQL; CI validates) — ACCEPTED

### Database Migrations
| Migration | Mission | Description |
|---|---|---|
| `20261017000000_g01_init` | G01 | 14 tables: identity + integration core + outbox |
| `20261017040000_g02_identity_profiles` | G02 | AuthIdentity.passwordHash, PasswordReset, MemberProfile, Skill, Portfolio, Visibility, RoleGrant |
| `20261017060000_g03_proposals_teams` | G03 | ProjectProposal, CharterRevision, ReviewDecision, Project, Team, TeamMembership, TeamInvitation, StewardAssignment, ResourceGrant |
| `20261017070000_g03_steward_history` | G03-FINAL | Drop @unique on StewardAssignment.projectId, add partial unique index |
| `20261017080000_g04_talent_opportunities` | G04 | Opportunity, OpportunityReview, OpportunityApplication + enums |
| `20261017090000_g04_notifications` | G04-02 | Notification model |

---

## 4. Product and UX Requirements

### Approved Experiences
- **Arabic-first (RTL, default) + English (LTR)** — URLs determine locale (`/` = Arabic, `/en` = English)
- **Calm institutional design** — teal primary, responsive, accessible
- **STR-GOV-TEAM-01:** No operational team without approved project charter + named lead + institutional steward
- **No fake integrations or placeholder buttons** — everything advertised must work
- **Browser E2E testing mandatory** — unit tests alone don't prove delivery

### Design System
- Tailwind CSS 4 + shadcn/ui (New York style)
- STR brand: deep teal primary (#0f4c4a), mint accent (#7dd3c0)
- Noto Sans Arabic loaded via `<link>` (next/font/google Turbopack bug workaround)
- License: UNLICENSED (founder has not approved an open-source license)

---

## 5. Engineering Principles and Constraints

### Team Roles
- **Ayman** — Project Owner & Founder (final decisions, scope, approval)
- **ChatGPT** — Supervising AI (architecture review, independent verification, gap analysis)
- **GLM** — Lead Development AI (implementation, testing, evidence delivery)
- **MASTER** — Tea manager & morale officer ☕

### Reuse Policy
"Small in code, large in capability." Reuse proven libraries. Don't reinvent containers, browsers, auth, or queues.

### Git Protocol (learned from G02/G03 incidents)
- **No Force Push on `main`** without explicit owner approval
- **No `reset --hard` on published branches** without approval
- **Always verify branch name** before commit/push (sandbox shell session drift)
- **Use `git -C` with fixed paths** or safe wrapper scripts
- Fast-forward merges only (no merge commits unless necessary)

### Security Rules
- No secrets in git, logs, screenshots, or chat
- No `/api/test/` routes in production (G02-SECURITY-CLOSE)
- Test email infrastructure: filesystem-based (CaptureEmailService writes to disk; Playwright reads directly)
- `STR_TEST_MODE` env var for test-only behavior (never set in production)
- LogEmailService redacts all tokens/URLs/passwords from logs
- All API routes enforce authorization at service layer (not just UI)
- DRAFT proposals/opportunities hidden from non-owners (404 not 403)

### Test Methodology
- **Unit tests:** Vitest (per-test isolated data via `test-isolation.ts`)
- **E2E tests:** Playwright with real browser + real PostgreSQL (CI provides)
- **Test seed:** `prisma/seed-test.ts` creates institutional accounts with Argon2id passwords
- **No skipped tests, no placeholder tests, no mock-auth for HTTP tests**

---

## 6. Decisions Already Frozen

| Decision | Status | Details |
|---|---|---|
| STR-01 | APPROVED | Politically/religiously/sectarianly neutral |
| STR-GOV-TEAM-01 | APPROVED | No team without approved project + lead + steward |
| STR-06 | APPROVED | Email/password + Google OIDC |
| ADR-01..05 | ACCEPTED | See Architecture section |
| Stack | LOCKED | Next.js 16 + TS + PostgreSQL + Prisma + Auth.js + Zod + Tailwind 4 |
| License | UNLICENSED | Founder has not approved OSS license |
| Test infra | FROZEN | Filesystem-based email capture (no HTTP route); seed-test.ts for institutional accounts |
| Project isolation | ENFORCED | Project/proposal pages check authorization; notFound() for unauthorized |

---

## 7. Work Accomplished

### G01 — Foundation and Architecture Fitness ✅ MERGED
- **Status:** DONE, VERIFIED, APPROVED, MERGED to `main`
- **SHA:** `1264c9f` (includes G01 + G01-FIX)
- **What:** Next.js 16 + TS + PostgreSQL + Prisma foundation, 12-module structure, typed config, structured logging, typed errors, uniform API response, Integration Core types, Docker Compose, CI, 5 ADRs
- **Tests:** 62 unit tests
- **CI:** Green on `main`

### G02 — Identity, Profiles and Roles ✅ MERGED
- **Status:** DONE, VERIFIED, APPROVED, MERGED to `main`
- **SHA:** `1264c9f` (includes G02 + G02-RECOVERY + G02-SECURITY-CLOSE)
- **What:** Email/password signup + verify + login + reset, Argon2id hashing, rate limiting (in-memory, single-instance documented), account enumeration defense, Auth.js config (Google OIDC scaffolded), profile CRUD with visibility, RBAC authorization service, STR-GOV-TEAM-01 enforced
- **Security fixes:** Test route removed (filesystem-based capture), LogEmailService redaction, no STR_TEST_MODE in next.config env
- **Tests:** 62 unit + 12 E2E
- **CI:** Green on `main`

### G03 — Project Proposals and Team Governance ✅ MERGED
- **Status:** DONE, VERIFIED, APPROVED, MERGED to `main`
- **SHA:** `1264c9f`
- **What:** Proposal lifecycle (DRAFT→SUBMITTED→NEEDS_REVISION→APPROVED/REJECTED/WITHDRAWN), charter editor (10 sections), atomic team creation (Project+Team+Steward+Lead in one transaction), institutional reviewer authorization (admin/reviewer role), conflict-of-interest guard, steward history (audit trail), scope change after approval, team invitations/membership, project suspension, project page authorization
- **Key fixes:** test isolation (per-test unique data), steward audit trail, isReviewer in ProjectActor, DRAFT proposal protection (HTTP-tested), central auth consistency
- **Tests:** 103 unit + 21 E2E (including HTTP-level DRAFT protection)
- **CI:** Green on `main`

### G04 — Talent and Opportunity Workflows ✅ COMPLETE (pending merge)
- **Status:** DONE, VERIFIED, NOT YET MERGED
- **Branch:** `feat/g04-talent-opportunities` at `62a6683`
- **8 commits ahead of `main`**
- **What:**
  - Talent Directory: search by name/headline/bio, filter by skill/availability, pagination, visibility enforced in WHERE clause
  - Opportunity lifecycle: DRAFT→SUBMITTED→NEEDS_REVISION→PUBLISHED→CLOSED/CANCELLED
  - Editorial review: institutional reviewer required, creator cannot self-review, atomic optimistic lock
  - Applications: submit, duplicate prevention (unique constraint), creator cannot self-apply, only PUBLISHED accepts applications
  - Decision: accept/reject with reason + private qualificationNotes, atomic transaction with opportunity status lock
  - Withdrawal: atomic optimistic lock, prevents post-decision withdrawal
  - Notifications: in-app (best-effort try/catch), API for read/mark-as-read
  - UI: /talent (search), /opportunities (list+create), /opportunities/[id] (detail+apply+review), /opportunities/[id]/edit, /opportunities/[id]/applications (review), /applications (my applications+withdraw)
  - Privacy: qualificationNotes excluded from getMyApplications (explicit select), non-published opportunities hidden (404), applications private to creator+reviewers
- **Tests:** 132 unit + 25 E2E
- **CI:** Green on `feat/g04-talent-opportunities` (run #39054981188)
- **Pending:** Owner approval to merge to `main`

---

## 8. Present Condition

### Verified State
- `main` at `1264c9f` — G01+G02+G03 merged, CI green
- `feat/g04-talent-opportunities` at `62a6683` — G04 complete, CI green, **NOT merged**
- All branches preserved (no deletions)
- No force push on `main` since G03 merge
- No secrets in git (verified)

### Open Risks and Known Limitations
1. **Rate limiter is single-instance** (in-memory Map) — requires Redis for production (G10)
2. **Google OIDC not externally tested** — code is real but awaiting GOOGLE_CLIENT_ID/SECRET
3. **Email delivery is dev-only** — LogEmailService writes redacted logs; SMTP in G10
4. **Notifications are best-effort** — try/catch prevents decision failure but doesn't guarantee delivery
5. **No production deployment** — founder decides go-live after G10
6. **Dependabot alerts** — all 5 resolved (sharp 0.35.5, vitest 4.1.12)
7. **G04 merge pending** — awaiting owner approval

### Production Readiness Notes (documented in `docs/PRODUCTION-READINESS-NOTES.md`)
1. Test email file permissions — restrict to 0700 directory (G10)
2. Prevent STR_TEST_MODE in production — startup assertion (G10)
3. Real email delivery — SmtpEmailService or provider (G10)
4. Distributed rate limiter — Redis-backed (G10)
5. Google OIDC credentials + redirect configuration (G02 follow-up / G10)

---

## 9. Future Roadmap

| Mission | Title | Status | Dependencies |
|---|---|---|---|
| G04 merge | Merge `feat/g04-talent-opportunities` to `main` | **PENDING OWNER APPROVAL** | None |
| G05 | Project Execution and Deliverables | PLANNED | G04 merge |
| G06 | Institutional Functions and Governance | PLANNED | G05 |
| G07 | Integration Core Functional Vertical Slice | PLANNED | G06 |
| G08 | UI-UX and Localization Completion | PLANNED | G07 |
| G09 | Full Security and Browser Verification | PLANNED | G08 |
| G10 | Deployment and Operational Handoff | PLANNED | G09 |

### Dependency Order
G04 merge → G05 → G06 → G07 → G08 → G09 → G10

---

## 10. Secrets/Access Handoff (Metadata Only)

| Field | Value |
|---|---|
| Credential alias | `PROJECT_GITHUB_TOKEN` |
| Purpose | Read/write to `mayakilzy/SyrianTechRenaissance-Platform` and `mayakilzy/repo-info` |
| Required access | `repo` + `workflow` scopes (classic PAT) or fine-grained equivalent |
| Owner-managed source | GitHub credential settings (Ayman provisions) |
| Storage method | Local `.git-credentials` file (600 perms) in sandbox `secrets/` directory (gitignored) |
| Rotation owner | Ayman |
| Availability | **NOT VERIFIED** — credentials are provisioned per-session from `GeneralGH.zip` in `repo-info/GeneralGH/`; the new session will need re-provisioning |
| Re-provisioning | Download `GeneralGH.zip` from `https://raw.githubusercontent.com/mayakilzy/repo-info/main/GeneralGH/GeneralGH.zip`, deobfuscate (remove `+` chars), store in `secrets/.git-credentials` with 600 perms. **Never print the token value.** |
| End-of-development cleanup | Owner will request token deletion at end of development; agent must verify no secrets in git/logs |

**No secret values are included in this handoff.**

---

## 11. Resumption Checkpoint

```text
PROJECT_NAME = Syrian Tech Renaissance (STR) — STR Platform v1.0
REPOSITORY = https://github.com/mayakilzy/SyrianTechRenaissance-Platform.git
DEFAULT_BRANCH = main
LAST_VERIFIED_CODE_SHA = 1264c9f (main, G03 merged)
WORKING_BRANCH = feat/g04-talent-opportunities
WORKING_BRANCH_SHA = 62a6683 (G04 complete, CI green, pending merge)
LAST_APPROVED_MISSION = G03 (merged to main)
CURRENT_MISSION = G04 (complete, pending owner approval to merge)
NEXT_PLANNED_MISSION = G05 — Project Execution and Deliverables
CI_VERIFIED = YES (run #39054981188, both jobs success, on 62a6683)
RECOVERY_VERIFIED = N/A (no recovery needed since G03 merge)
WORKTREE_STATUS = clean (on feat/g04-talent-opportunities)
ENVIRONMENT = Sandbox (no local PostgreSQL; CI provides PG17)
GITHUB_TOKEN = NOT VERIFIED (needs re-provisioning from GeneralGH.zip)
NEXT_ACTION = WAIT_FOR_OWNER_INSTRUCTIONS
```

---

## 12. Instructions to the Next Conversation

### Verification Checklist
1. Read this handoff document in full
2. Read the handoff protocol: https://github.com/mayakilzy/repo-info/blob/main/PROJECT_CHAT_HANDOFF_PROTOCOL.md
3. Read the G04 mission document: https://github.com/mayakilzy/repo-info/blob/main/SyrianTechRenaissance/Platform/missions/G04-Talent-and-Opportunity-Workflows.md
4. Verify `main` is at `1264c9f` and `feat/g04-talent-opportunities` is at `62a6683`
5. Verify CI is green on `62a6683`
6. Verify no secrets in git history
7. Check GitHub token availability (re-provision from `GeneralGH.zip` if needed)
8. Confirm the owner's intent: merge G04 or start G05

### Stop Boundary
- **Do NOT merge G04** until the owner explicitly approves
- **Do NOT start G05** until G04 is merged and the owner authorizes
- **Do NOT push to `main`** without owner approval
- **Do NOT force push** on any branch
- **Do NOT create new branches** until instructed
- **Do NOT rotate or delete credentials** until instructed

---

## 13. Appendix

### Glossary
- **STR** — Syrian Tech Renaissance
- **STR-GOV-TEAM-01** — Approved policy: no operational team without approved project charter + lead + steward
- **ADR** — Architecture Decision Record
- **OIDC** — OpenID Connect (for Google sign-in)
- **Argon2id** — Password hashing algorithm (OWASP recommended)
- **Optimistic lock** — `updateMany WHERE status=X` pattern for atomic state transitions

### Critical Links
- Code repo: https://github.com/mayakilzy/SyrianTechRenaissance-Platform
- Docs repo: https://github.com/mayakilzy/repo-info/tree/main/SyrianTechRenaissance/Platform
- Handoff protocol: https://github.com/mayakilzy/repo-info/blob/main/PROJECT_CHAT_HANDOFF_PROTOCOL.md
- CI (latest): https://github.com/mayakilzy/SyrianTechRenaissance-Platform/actions
- Credential source: https://raw.githubusercontent.com/mayakilzy/repo-info/main/GeneralGH/GeneralGH.zip

### Key Commands
```bash
# Clone
git clone https://github.com/mayakilzy/SyrianTechRenaissance-Platform.git
cd SyrianTechRenaissance-Platform
git checkout feat/g04-talent-opportunities

# Install
bun install

# Local dev (needs PostgreSQL)
docker compose up -d postgres postgres-shadow
bunx prisma migrate deploy
bun run db:seed
bun run db:seed-test  # institutional accounts for E2E
bun run dev

# Verify
bun run typecheck
bun run lint
bun run test
bun run test:e2e

# CI workflow
.github/workflows/ci.yml
```

### Evidence Index
| Mission | CI Run | SHA | Tests |
|---|---|---|---|
| G01+G02+G03 (main) | Multiple | `1264c9f` | 103 unit + 21 E2E |
| G04 (branch) | #39054981188 | `62a6683` | 132 unit + 25 E2E |

### Unresolved Questions
1. **G04 merge timing:** Owner to confirm when to merge `feat/g04-talent-opportunities` to `main`
2. **Google OIDC credentials:** Owner to provision when ready (not blocking G05)
3. **G05 scope:** Read G05 mission document before starting
4. **Session transfer:** Owner plans to prepare a handoff document in `repo-info` for the new session

---

**Reported by:** GLM (Lead Development AI)
**Reviewed by:** ChatGPT (independent verification throughout) + Ayman (founder approval at each milestone)
**Handoff status:** READY — all critical information captured, no secrets exposed
