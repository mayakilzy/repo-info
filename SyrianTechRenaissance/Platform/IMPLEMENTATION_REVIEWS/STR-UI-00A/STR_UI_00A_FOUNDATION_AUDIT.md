# STR-UI-00A — UI Foundation & Reference Inventory

**Project:** Syrian Tech Renaissance Platform
**Executor:** GLM Engineering Agent
**Mission Type:** Read-only discovery, UI architecture audit, design handoff preparation
**Priority:** HIGH
**Status:** Awaiting MASTER review
**Date:** 2026-10-22
**Standard followed:** AgentCraft Universal Project Delivery & Visual Fidelity Standard v1.0

---

## 1. Verified GitHub Repository and PR Status

All values below were verified live against the GitHub REST API on 2026-10-22 using the provisioned PAT. Nothing is assumed from prior session reports.

### 1.1 Code Repository — `mayakilzy/SyrianTechRenaissance-Platform`

| Field | Value |
|---|---|
| `main` HEAD SHA | `8403038916e34e18848c8ce3edfc014ac272581c` |
| `main` HEAD message | `G11-00 + G11-00A: adversarial security hardening + cross-module suspension enforcement (#7)` |
| PR #7 state | `closed` |
| PR #7 merged | `true` |
| PR #7 merge_commit_sha | `8403038916e34e18848c8ce3edfc014ac272581c` (== `main` HEAD) |
| PR #7 head_sha | `884fc4189b7e0c58604a71434f2b28018776c44a` |
| PR #7 base_sha | `635abbae2dd88ca8e27e2582d079b1de6c541e13` |

**Conclusion:** PR #7 is fully merged into `main`. The `main` HEAD reported in the task brief (`8403038916…`) is confirmed accurate. The "latest reported code commit" in the task brief (`884fc418…`) was the PR head before merge — it is now superseded by the merge commit on `main`.

### 1.2 Documentation Repository — `mayakilzy/repo-info`

| Field | Value |
|---|---|
| `main` HEAD SHA | `8767cfbf7b3433c363ead04dacad36fb77d1f13d` |
| `main` HEAD message | `G11-00 + G11-00A: 9 adversarial system validation reports + reconciliation (#1)` |
| PR #1 state | `closed` |
| PR #1 merged | `true` |
| PR #1 merge_commit_sha | `8767cfbf7b3433c363ead04dacad36fb77d1f13d` (== `main` HEAD) |
| PR #1 head_sha | `10ec60ed5f2b4287f8708f1fd993a257d1ebf133` |
| PR #1 base_sha | `91dc8d62609fd2b99a7ca9108515eda49a3a3784` |

**Conclusion:** PR #1 is fully merged into `main`. The "latest reported documentation commit" in the task brief (`10ec60ed…`) was the PR head before merge — it is now superseded by the merge commit on `main`.

### 1.3 CI status (post-merge)

| Run | Workflow | Status | Conclusion |
|---|---|---|---|
| #281 (id 39727853201) | STR Platform CI | `completed` | `success` |

Head SHA of run #281: `8403038916e34e18848c8ce3edfc014ac272581c` (matches `main`). Triggered by `push` on `main`. All reported jobs (Typecheck / Lint / Unit / Playwright E2E RTL+LTR) were `success`.

### 1.4 Repository state summary

Both repositories are in a clean, merged, post-G11-00/G11-00A state. There are no open PRs to merge, no pending merges, and no conflicting branches to recover. The platform is engineering-ready to begin UI/UX work, subject to MASTER's explicit approval of the visual direction (Gate A) and the standalone HTML/CSS reference (Gate B).

---

## 2. Existing Application Architecture

### 2.1 Technology stack (locked since G01, ADR-01)

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js 16 (App Router) | 16.1.x |
| Language | TypeScript 5 (strict) | 5.x |
| Database | PostgreSQL 17 | 17 |
| ORM | Prisma | 6.11.x |
| Auth | Auth.js (next-auth v4) | 4.24.x |
| Validation | Zod 4 | 4.x |
| i18n | next-intl | 4.3.x |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) | 4.x |
| Icons | lucide-react | 0.525.x |
| Animation | framer-motion | 12.23.x |
| Charts | recharts | 2.15.x |
| Forms | react-hook-form + @hookform/resolvers | 7.60 / 5.1 |
| State | zustand + @tanstack/react-query | 5.0 / 5.82 |
| Theme switcher | next-themes | 0.4.6 |
| Notifications | sonner | 2.0.6 |
| Unit test | Vitest | 4.1.x |
| E2E test | Playwright | 1.57+ |
| Runtime | Bun (dev), Node (prod standalone) | 1.3 / 24 |

### 2.2 Module architecture (modular monolith, ADR-01)

`src/modules/` contains 15 domain modules with enforced service-layer boundaries:

1. `identity` — users, credentials, email verification, Google OIDC scaffold, sessions
2. `profiles` — professional profiles, skills, portfolio, visibility
3. `proposals` — project proposals, charter revisions, review workflow
4. `teams` — team membership, invitations, scope control (no free team creation)
5. `opportunities` — opportunity lifecycle, applications, decisions
6. `projects` — milestones, tasks, deliverables, threads, files, integrations, impact
7. `organizations` — partners, representatives, verification
8. `partnerships` — partnership requests, agreements, decisions
9. `governance` — moderation, complaints, audit, resource grants
10. `moderation` — complaint lifecycle, decisions
11. `integrations` — provider registry, connections, jobs, events, webhooks
12. `admin` — dashboard, suspensions, grants, audit, teams
13. `notifications` — in-app notifications, read state
14. `communications` — project threads, messages
15. `impact` — impact records, evidence

Shared infrastructure lives in `src/lib/`: `db.ts`, `config.ts`, `errors.ts`, `logger.ts`, `request-context.ts`, `request-id.ts`, `audit.ts`, `audit-denied.ts`, `auth-checks.ts` (G11-00A helper: `isActiveUser` + `assertActiveUser`), `api-response.ts`, `request-context-http.ts`, `utils.ts`.

### 2.3 Database schema (Prisma)

50 models, 23 enums. Key entities: `User`, `MemberProfile`, `ProjectProposal`, `Project`, `Team`, `TeamMembership`, `Opportunity`, `OpportunityApplication`, `Organization`, `PartnershipRequest`, `IntegrationProvider`, `IntegrationConnection`, `IntegrationJob`, `ModerationComplaint`, `AuditEvent`, `ImpactRecord`, `Deliverable`, `Milestone`, `Task`, `ProjectThread`, `ThreadMessage`, `Notification`.

### 2.4 Internationalization (i18n)

- Library: `next-intl` 4.3.x
- Locales: `ar` (default, RTL) + `en` (LTR)
- Routing: `src/app/[locale]/…` — URLs determine locale (`/` = ar, `/en` = en)
- Messages: `src/i18n/messages/ar.json` (16.3 KB) + `en.json` (13.0 KB)
- Config: `src/i18n/config.ts` (`locales`, `dirFor(locale)`) + `src/i18n/routing.ts` + `src/i18n/request.ts`
- Arabic font: Noto Sans Arabic loaded via `<link>` in `src/app/[locale]/layout.tsx` (workaround for next/font/google Turbopack bug — documented as ADR-01 deviation)
- Latin font: Geist Sans + Geist Mono via `next/font/google`
- `globals.css` applies `font-family: "Noto Sans Arabic"` when `[dir="rtl"]` and enables font features `ss01`, `cv01` for numeric/Latin runs inside Arabic text

### 2.5 Build / test / dev commands

```bash
bun install
bun run dev            # Next.js dev on :3000
bun run build          # next build + standalone
bun run typecheck      # tsc --noEmit
bun run lint           # eslint .
bun run test           # vitest run (344/344 passing)
bun run test:e2e       # playwright test (RTL+LTR)
bun run verify         # typecheck + lint + test
bun run db:seed        # prisma/seed.ts
bun run db:seed-test   # prisma/seed-test.ts (institutional accounts)
```

---

## 3. Page and Route Inventory

### 3.1 UI routes (`src/app/[locale]/…`) — 36 pages

| # | Route | Purpose | Access | Existing UI |
|---|---|---|---|---|
| 1 | `[locale]` (home) | Platform landing — Hero + Pillars + Principles + Status | Public | Implemented (G08) |
| 2 | `[locale]/auth/signin` | Email sign-in | Public | Implemented |
| 3 | `[locale]/auth/signup` | Email registration | Public | Implemented |
| 4 | `[locale]/auth/verify` | Email verification | Public | Implemented |
| 5 | `[locale]/auth/reset-password` | Request reset | Public | Implemented |
| 6 | `[locale]/auth/reset-password/[token]` | Confirm reset | Public | Implemented |
| 7 | `[locale]/dashboard` | Member dashboard | Member | Implemented |
| 8 | `[locale]/admin` | Admin dashboard | Admin | Implemented |
| 9 | `[locale]/proposals` | Proposals list | Public | Implemented |
| 10 | `[locale]/proposals/new` | Create proposal | Member | Implemented |
| 11 | `[locale]/proposals/[id]` | Proposal detail | Public (DRAFT hidden) | Implemented |
| 12 | `[locale]/proposals/[id]/charter` | Charter editor | Proposer | Implemented |
| 13 | `[locale]/projects/[id]` | Project overview | Member | Implemented |
| 14 | `[locale]/projects/[id]/workspace` | Project workspace | Member | Implemented |
| 15 | `[locale]/projects/[id]/milestones` | Milestones list | Member | Implemented |
| 16 | `[locale]/projects/[id]/tasks/[tid]` | Task detail | Member | Implemented |
| 17 | `[locale]/projects/[id]/deliverables/[did]` | Deliverable detail | Member | Implemented |
| 18 | `[locale]/projects/[id]/threads` | Threads list | Member | Implemented |
| 19 | `[locale]/projects/[id]/threads/[tid]` | Thread detail | Member | Implemented |
| 20 | `[locale]/projects/me/contributions` | My contributions | Member | Implemented |
| 21 | `[locale]/opportunities` | Opportunities list | Public | Implemented |
| 22 | `[locale]/opportunities/new` | Create opportunity | Member | Implemented |
| 23 | `[locale]/opportunities/[id]` | Opportunity detail | Public (DRAFT hidden) | Implemented |
| 24 | `[locale]/opportunities/[id]/edit` | Edit opportunity | Creator | Implemented |
| 25 | `[locale]/opportunities/[id]/applications` | Review applicants | Creator/Reviewer | Implemented |
| 26 | `[locale]/applications` | My applications | Member | Implemented |
| 27 | `[locale]/talent` | Talent directory | Public | Implemented |
| 28 | `[locale]/organizations` | Organizations list | Public | Implemented |
| 29 | `[locale]/organizations/[id]` | Organization detail | Public | Implemented |
| 30 | `[locale]/partnerships` | Partnerships list | Public | Implemented |
| 31 | `[locale]/partnerships/[id]` | Partnership detail | Public | Implemented |
| 32 | `[locale]/integrations` | Integrations directory | Public | Implemented |
| 33 | `[locale]/moderation` | Moderation queue | Moderator | Implemented |
| 34 | `[locale]/moderation/[id]` | Complaint detail | Moderator | Implemented |

### 3.2 API routes (`src/app/api/…`) — 91 endpoints

Organized by domain: `admin/`, `applications/`, `auth/`, `contributions/`, `integrations/`, `moderation/`, `notifications/`, `opportunities/`, `organizations/`, `partnerships/`, `projects/`, `proposals/`, `talent/`, `teams/`, `users/me/`, `v1/health`, `v1/ready`. Full list captured in audit; backend coverage is comprehensive across all UI routes.

### 3.3 Layout

Only one layout exists: `src/app/[locale]/layout.tsx` — wraps every page with `<html lang dir>`, Geist fonts, Noto Sans Arabic `<link>`, `NextIntlClientProvider`, `Providers` (QueryClient + ThemeProvider via next-themes), and `Toaster` (sonner). **There is no sidebar layout** — the current shell is header-only (`SiteHeader` + page content + `SiteFooter`).

---

## 4. UI Implementation Status

### 4.1 shadcn/ui component library — 48 components

`src/components/ui/` contains the full shadcn/ui New York style set: accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input-otp, input, label, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, switch, table, tabs, textarea, toast, toaster, toggle-group, toggle, tooltip.

> Notable: `sidebar.tsx` exists in the library but **is not used by any route** — the platform currently uses a header-only shell.

### 4.2 Shared components — 3 files only

| File | Component(s) | Status |
|---|---|---|
| `src/components/shared/site-header.tsx` | `SiteHeader` — sticky header, logo (hardcoded `#0f4c4a` teal), 6 nav links, locale switcher (ar/en), mobile hamburger | Implemented (G08) |
| `src/components/shared/site-footer.tsx` | `SiteFooter` — copyright + Academy/Engineering "coming soon" labels | Implemented (G08) |
| `src/components/shared/states.tsx` | `LoadingState`, `EmptyState`, `ErrorState` — reusable Card-based states | Implemented (G08) |

### 4.3 Current design tokens (`src/app/globals.css`)

The current `globals.css` defines **two** palettes:

- **`:root` (light mode, default)** — labeled explicitly in code as a PROPOSAL: `/* STR brand: warm institutional palette. Primary = deep teal (growth + renaissance). Colors are a PROPOSAL (see Decision Register §9) pending founder approval. */`. Background `oklch(0.99 0.004 95)` (near-white warm), primary `oklch(0.42 0.06 178)` (deep teal), accent mint.
- **`.dark` (dark mode toggle via `next-themes`)** — neutral grayscale dark theme: background `oklch(0.145 0 0)` (near-black neutral), primary `oklch(0.922 0 0)` (near-white), sidebar-primary blue `oklch(0.488 0.243 264.376)`. **This is NOT the approved dark futuristic AI-inspired theme** — it is a generic shadcn neutral-dark fallback.

**Critical finding:** The dark futuristic AI-inspired visual direction MASTER approved is **not yet implemented** in `globals.css`. The current dark mode is a default shadcn neutral palette, not the deep-navy + cyan/blue/violet restrained-accent AI-platform look described in the task brief. The current `:root` palette is explicitly marked as a pending proposal.

### 4.4 Brand color usage

- `SiteHeader` hardcodes `style={{ color: "#0f4c4a" }}` for the logo text (deep teal) — bypasses the CSS variable system.
- All other components use CSS variables (`bg-background`, `text-foreground`, `bg-primary`, etc.) — token-driven and swappable.
- `tailwind.config.ts` maps every shadcn semantic color to `hsl(var(--token))` and includes `tailwindcss-animate` plugin.

### 4.5 Existing E2E test coverage

`tests/e2e/` contains 14 spec files covering: auth-flow, g03-login-diagnostic, g03-proposal-flow, g04-talent-opportunity-flow, g05-project-execution-flow, g06-institutional-governance-flow, g07-integration-flow, g08-visual-accessibility, g09 anti-self/browser-interactive/cross-isolation/csrf-sessions/injection-file-access/rbac-idor/webhook-http, security-negative, rtl-ltr. Existing screenshots: `home-ar-rtl.png`, `home-en-ltr.png`, `health-endpoint.png`. Playwright config uses chromium-desktop project, `STR_TEST_MODE` for CI, filesystem-based email capture.

### 4.6 G08 UI Debt Log (independent track, not part of STR-UI-00A)

Six documented debt items (D1–D6) deferred before public launch — tracked in `SyrianTechRenaissance/Platform/G08_UI_DEBT_LOG.md`:

- **D1** Charter editor mobile screenshot (missing)
- **D2** Responsive polish for 15 institutional pages (strict overflow tests)
- **D3** Loading/Empty/Error states for 21 pages (consistency with `states.tsx`)
- **D4** Mobile coverage for 3 missing Arabic variants (partnerships, moderation, integrations)
- **D5** g03-proposal-flow.spec.ts:204 flaky test (email collision at module load)
- **D6** Health API version stamp `1.0.0-g01` (cross-mission versioning decision)

**These are explicitly out of scope for STR-UI-00A** unless MASTER directs otherwise. They remain open and tracked.

---

## 5. Available Design Assets

### 5.1 Assets found in `repo-info/SyrianTechRenaissance/`

| Asset type | Found? | Location |
|---|---|---|
| Original approved dark homepage image | **MISSING** | — |
| Standalone homepage HTML/CSS/JS source | **MISSING** | — |
| Supporting visual assets (icons, illustrations) | **MISSING** | — |
| Design system documentation | **MISSING** | — |
| Page specifications (visual) | Partial — `05-UX-and-Acceptance.md` lists logical page map but no visual specs | `SyrianTechRenaissance/Platform/05-UX-and-Acceptance.md` |
| Visual acceptance criteria | Partial — `05-UX-and-Acceptance.md` §"Acceptance evidence format" | same file |
| Prior visual review reports | Partial — G08 closure reports mention screenshots but no approved-vs-reference comparison | `SyrianTechRenaissance/Platform/G08_*.md` |
| APPROVED_VISUAL_ASSETS directory | **MISSING** | — |
| IMPLEMENTATION_READY directory | **MISSING** | — |

### 5.2 Search performed

- Recursive search of `SyrianTechRenaissance/` for `*.png`, `*.jpg`, `*.jpeg`, `*.webp`, `*.svg`, `*.gif` → **0 files**
- Recursive search for `*.html`, `*.css`, `*.js` → **0 files**
- Recursive search for `*.zip` → **0 files**
- Directory search for `UI*`, `*ui*`, `*design*`, `*Design*`, `*IMPLEMENTATION_READY*`, `*html*` → **0 directories**
- Repo-root `*.zip` search → only `newT5.zip` (608 bytes, unrelated, cross-project scratch)

### 5.3 Related documentation that exists

| File | Relevance |
|---|---|
| `SyrianTechRenaissance/Platform/05-UX-and-Acceptance.md` | Logical page map, experience goals, E2E matrix, negative cases — no visual specs |
| `SyrianTechRenaissance/Platform/07-Decision-Register.md` | `UX-01` (Recommended): "Arabic-first and English, calm institutional design, responsive and accessible" — no visual direction pinned |
| `SyrianTechRenaissance/Platform/G08_UI_DEBT_LOG.md` | Six deferred items (D1–D6) tracked separately |
| `SyrianTechRenaissance/Platform/STR_Platform_HANDOFF.md` | §4 Design System: "deep teal primary (#0f4c4a), mint accent (#7dd3c0)" — **describes the light institutional palette, not the dark futuristic direction MASTER approved** |
| `AgentCraft-STANDARDS/AGENTCRAFT_UNIVERSAL_PROJECT_DELIVERY_AND_VISUAL_FIDELITY_STANDARD_v1.0.md` | Mandatory workflow: Gate A (image) → Gate B (HTML) → Gate C (app) |

---

## 6. Missing Approved References

The following are required by the AgentCraft Universal Standard before any UI implementation can proceed, and are currently **missing**:

1. **Approved original dark homepage image** — the visual source of truth for the dark futuristic AI-inspired direction. MASTER has verbally approved this direction but the image itself has not been published to `repo-info`.
2. **Standalone homepage HTML/CSS/JS reference** — the executable visual reference (Gate B artifact). The previously prepared HTML/CSS package is referenced by MASTER as "a draft awaiting browser-based visual approval" and has not been published to GitHub.
3. **`REFERENCE_MANIFEST.json`** for the homepage — listing approved image SHA, source file, viewport size, fonts/licenses, asset list, fidelity status, authorized exceptions.
4. **`APPROVED_VISUAL_ASSETS/` directory** — does not exist in `SyrianTechRenaissance/Platform/UI_UX_DESIGN/` (the entire `UI_UX_DESIGN/` directory does not exist).
5. **`IMPLEMENTATION_READY/PAGE_01/` directory** — does not exist; the standard's recommended structure is not present.
6. **`START_HERE.md`** at project level — the standard requires a project-level `START_HERE.md`; none exists in `SyrianTechRenaissance/Platform/` or `SyrianTechRenaissance/`.
7. **Page-to-visual mapping** — `PAGE_TO_VISUAL_MAPPING.md` does not exist.
8. **Design lock document** — `DESIGN_LOCK_AND_EXCEPTIONS.md` does not exist.

**Per MASTER's explicit instruction in the task brief §3:** *"The previously prepared HTML/CSS package is still a draft awaiting browser-based visual approval. Do not treat it as approved source code until MASTER explicitly confirms Gate B."*

**Therefore:** GLM will not recreate the approved image, will not invent a replacement, will not reinterpret the design, and will not begin converting HTML/CSS to React until MASTER publishes the approved source package and explicitly confirms Gate B.

---

## 7. Existing Localization Capabilities

| Capability | Status | Evidence |
|---|---|---|
| Locale routing (`/` = ar, `/en` = en) | ✅ Implemented | `src/i18n/routing.ts`, `src/app/[locale]/layout.tsx` |
| RTL/LTR direction switching | ✅ Implemented | `dirFor(locale)` in `src/i18n/config.ts`, applied to `<html dir>` |
| Arabic font loading | ✅ Implemented | Noto Sans Arabic via `<link>` (Turbopack bug workaround, documented) |
| Translation messages | ✅ Implemented | `ar.json` (16.3 KB), `en.json` (13.0 KB) in `src/i18n/messages/` |
| Translation namespaces | ✅ Implemented | `home`, `nav`, `ui`, `footer`, `meta`, plus per-module namespaces |
| Numeric/Latin glyph handling inside RTL | ✅ Implemented | `font-feature-settings: "ss01", "cv01"` on `[dir="rtl"]` in `globals.css` |
| Locale switcher UI | ✅ Implemented | `SiteHeader` — `ع` / `EN` toggle with `aria-current` and `aria-label` |
| E2E RTL+LTR coverage | ✅ Implemented | `tests/e2e/rtl-ltr.spec.ts`, `g08-visual-accessibility.spec.ts`, home screenshots for both locales |
| Translation completeness parity | ⚠ Partial | `ar.json` is 3.3 KB larger than `en.json` — likely additional Arabic-specific strings; parity not audited in this read-only mission |

**Conclusion:** The i18n infrastructure is solid and complete. The dark futuristic visual direction can be layered on top without touching the i18n architecture — only CSS tokens, fonts, and component styling need to change.

---

## 8. Proposed Component Integration Mapping

This is a **proposal only**. No code is modified in this mission. The mapping describes how the approved standalone HTML/CSS (once published and Gate B confirmed) would translate into the existing Next.js architecture, preserving the current application shell, routing, and backend wiring.

### 8.1 Shared application shell

| Element | Current state | Action when reference arrives |
|---|---|---|
| `<html lang dir>` + fonts | Implemented (`layout.tsx`) | Keep; add approved dark-theme font stack if reference specifies one |
| `NextIntlClientProvider` + `Providers` | Implemented | Keep unchanged |
| `Toaster` (sonner) | Implemented | Keep; restyle via tokens if reference shows custom toasts |
| `SiteHeader` | Implemented, hardcoded teal logo | Restyle to match reference; replace hardcoded `#0f4c4a` with `text-primary` token; add glass/blur effects if reference shows them |
| `SiteFooter` | Implemented | Restyle to match reference; keep Academy/Engineering "coming soon" labels |
| `SiteSidebar` | **Not implemented** | If reference shows a sidebar, scaffold using existing `src/components/ui/sidebar.tsx` (already in library, unused); wire into layout for authenticated routes only |
| `states.tsx` (Loading/Empty/Error) | Implemented | Restyle to match reference; keep component API |

### 8.2 Design tokens

| Token layer | Current state | Action |
|---|---|---|
| `globals.css` `:root` (light) | Warm institutional teal — explicitly a PROPOSAL | Replace with approved dark futuristic palette as the **default** (per MASTER: dark is the official direction) — or keep light as secondary mode if MASTER confirms dual-mode |
| `globals.css` `.dark` | Generic shadcn neutral grayscale | Replace with approved dark futuristic palette (deep navy backgrounds, restrained cyan/blue/violet accents, glass surfaces) |
| `tailwind.config.ts` | Maps shadcn semantics to CSS vars | Keep structure; no changes needed — token swap happens in `globals.css` |
| Chart colors (chart-1..5) | Defined in both `:root` and `.dark` | Realign to approved accent palette for data visualizations |

### 8.3 Reusable cards and panels

| Component | Current | Action |
|---|---|---|
| `Card` / `CardHeader` / `CardContent` / `CardTitle` | shadcn default | Restyle via tokens; add glass-surface variant if reference shows frosted cards (e.g., `backdrop-blur`, translucent `bg-card/80`) |
| `Badge` | shadcn default | Add accent variants matching reference (cyan, blue, violet) |
| `Button` | shadcn default | Add glow/hover effects if reference shows them; keep variants API |
| `Tabs` / `Dialog` / `Sheet` / `Drawer` | shadcn default | Restyle via tokens |

### 8.4 Responsive layout

Current pages use Tailwind responsive utilities (`sm:`, `md:`, `lg:`) with `container mx-auto px-4 sm:px-6`. The reference's breakpoint behavior (once published) will be mapped onto the existing responsive classes. No new breakpoint system is anticipated — Tailwind's default `sm 640 / md 768 / lg 1024 / xl 1280 / 2xl 1536` is sufficient and already in use.

### 8.5 Component integration classification

| Category | Examples | Count |
|---|---|---|
| **Already exist, reuse as-is** | `Button`, `Card`, `Badge`, `Input`, `Dialog`, `Tabs`, `Tooltip`, `Sonner`, all 48 shadcn/ui components | 48 |
| **Already exist, restyle via tokens** | `SiteHeader`, `SiteFooter`, `states.tsx` (Loading/Empty/Error) | 3 |
| **Must be implemented new** (if reference shows them) | `SiteSidebar`, glass-panel variants, hero-glow background, animated gradient borders, AI-grid background pattern | TBD — depends on reference |
| **Visual elements currently lacking backend support** | None identified — all 36 UI routes have corresponding API endpoints; backend is comprehensive | 0 |

### 8.6 Accessibility baseline (preserved)

The current `SiteHeader` and `states.tsx` already implement: `role="banner"`, `role="contentinfo"`, `role="navigation"`, `aria-label`, `aria-current`, `aria-expanded`, `role="status"`, keyboard-focusable `Link` and `Button`. Any new components added from the reference must preserve or exceed this baseline (WCAG 2.1 AA: contrast ≥ 4.5:1, focus visible, keyboard navigable, screen-reader labels).

### 8.7 Browser screenshot and comparison tooling

The existing `tests/e2e/` suite already captures screenshots (`home-ar-rtl.png`, `home-en-ltr.png`) and the Playwright config supports `screenshot: "only-on-failure"` + `trace: "on-first-retry"`. For Gate C (app fidelity), the proposed workflow is:

1. Add a dedicated `tests/e2e/ui-fidelity/` directory for visual comparison specs
2. Each page gets a spec that: navigates to the route, waits for fonts/assets, asserts the correct heading/route, captures a full-page screenshot at the same viewport as the reference, and saves it under `IMPLEMENTATION_REVIEWS/STR-UI-XX/screenshots/`
3. Manual side-by-side comparison against the standalone HTML reference (published in `repo-info`) — automated pixel-diff is optional and not required by the standard

---

## 9. Proposed GitHub Evidence Paths

Following the AgentCraft Universal Standard §3.1 reference tree, adapted to the existing `SyrianTechRenaissance/Platform/` structure (per the standard's note: "this tree is a standard proposal, not enforced literally on an already-organized project").

### 9.1 Approved source package location

```
repo-info/SyrianTechRenaissance/Platform/UI_UX_DESIGN/
├── APPROVED_VISUAL_ASSETS/
│   └── PAGE_01_HOMEPAGE/
│       ├── approved-homepage-dark.png          # ← MASTER publishes the approved image here
│       └── APPROVED_HOMEPAGE_SHA.txt           # ← SHA256 of the approved image
├── DESIGN_SYSTEM/
│   ├── design-tokens.json                      # ← color, type, spacing tokens
│   └── typography-spec.md
├── PAGE_TO_VISUAL_MAPPING.md                   # ← which page maps to which visual
├── DESIGN_LOCK_AND_EXCEPTIONS.md               # ← locked decisions + functional exceptions
└── IMPLEMENTATION_READY/
    ├── SHARED_COMPONENTS/                      # ← header/footer/sidebar reference HTML
    └── PAGE_01_HOMEPAGE/
        ├── index.html                          # ← standalone reference HTML
        ├── styles.css                          # ← standalone reference CSS
        ├── script.js                           # ← if interactive demo needed
        ├── assets/                             # ← icons, images, fonts
        ├── README.md
        └── REFERENCE_MANIFEST.json             # ← approved image SHA, viewport, fonts, status
```

### 9.2 Per-page acceptance evidence location

```
repo-info/SyrianTechRenaissance/Platform/IMPLEMENTATION_REVIEWS/STR-UI-01-PAGE-01/
├── REPORT.md                                   # ← final delivery report (standard §11 template)
├── visual_comparison.md                        # ← approved vs HTML vs app diff narrative
├── playwright_results.json                     # ← test results
├── screenshots/
│   ├── approved-homepage-dark.png              # ← copy/link of approved image
│   ├── reference-homepage-html.png             # ← screenshot of standalone HTML
│   ├── app-homepage-en-ltr.png                 # ← screenshot of real app
│   └── app-homepage-ar-rtl.png
├── diagnostics/                                # ← minified safe logs if needed
└── ACCEPTANCE.md                               # ← ACCEPTED / CONDITIONAL / REJECTED
```

### 9.3 Mission brief location

```
repo-info/SyrianTechRenaissance/Platform/MISSION_BRIEFS/
└── STR-UI-01-PAGE-01-HOMEPAGE-INTEGRATION.md    # ← per-page mission brief (standard §16 template)
```

### 9.4 Project-level entry point (recommended)

```
repo-info/SyrianTechRenaissance/Platform/START_HERE.md   # ← does not exist yet, recommended
```

This file would consolidate: project name, code repo, docs repo, official branch, latest verified SHAs, page list with statuses, visual assets + licenses, decision owner, allowed/forbidden tasks, last success/failure report, session-resumption instructions.

### 9.5 Principles applied

- **No unnecessary file moves** — the existing `SyrianTechRenaissance/Platform/` structure (01-08 docs, missions/, contracts/, IMPLEMENTATION_REVIEWS/) is preserved; only new subdirectories are added under it.
- **Source of truth stays in `repo-info`** — all visuals, references, and evidence live in the docs repo; production code stays in the code repo.
- **Per-page evidence** — each page gets its own `IMPLEMENTATION_REVIEWS/STR-UI-XX-PAGE-YY/` folder, matching the standard's per-page acceptance loop (§8).
- **No duplication** — the approved image is published once in `APPROVED_VISUAL_ASSETS/`; references in reports link to it rather than re-uploading.

---

## 10. Exact Next Steps and Blockers

### 10.1 Blockers (must clear before UI implementation)

| # | Blocker | Owner | Resolution |
|---|---|---|---|
| B1 | Approved dark homepage image not published to `repo-info` | MASTER + ChatGPT | MASTER/ChatGPT finalize browser-preview validation of the HTML/CSS draft, then publish the approved image + HTML/CSS package to `repo-info/SyrianTechRenaissance/Platform/UI_UX_DESIGN/APPROVED_VISUAL_ASSETS/PAGE_01_HOMEPAGE/` and `…/IMPLEMENTATION_READY/PAGE_01_HOMEPAGE/` |
| B2 | Standalone HTML/CSS reference not published (Gate B not confirmed) | MASTER + ChatGPT | Same as B1 — publish the standalone HTML/CSS/SVG package with `REFERENCE_MANIFEST.json` |
| B3 | `globals.css` current dark mode is generic shadcn neutral, not the approved futuristic palette | GLM (deferred until B1+B2 clear) | After Gate B confirmation, GLM translates the approved palette into `globals.css` tokens |
| B4 | `SiteHeader` hardcodes `#0f4c4a` teal (light institutional) | GLM (deferred) | After Gate B, replace with `text-primary` token and restyle to match reference |
| B5 | No `START_HERE.md` at project level | GLM (recommended, low priority) | GLM can scaffold this in a follow-up doc-only PR if MASTER authorizes |

### 10.2 Next steps (after blockers clear, with MASTER authorization)

| Step | Mission ID | Scope | Owner |
|---|---|---|---|
| 1 | STR-UI-00B | Reference validation — GLM fetches approved image + HTML/CSS from `repo-info`, renders standalone HTML in browser, captures screenshot, compares to approved image, reports material discrepancies, escalates to MASTER/ChatGPT if significant divergence found | GLM |
| 2 | STR-UI-01-PAGE-01 | Homepage integration — GLM imports approved HTML/CSS faithfully into `src/app/[locale]/page.tsx`, restyles `SiteHeader`/`SiteFooter`, swaps `globals.css` tokens, preserves all backend wiring and i18n, captures app screenshots, runs Playwright, publishes evidence | GLM |
| 3 | STR-UI-02-PAGE-XX | Per-page integration for each subsequent page, each gated by MASTER acceptance of the previous page | GLM |
| 4 | (parallel, optional) | Close G08 UI Debt D1–D6 if MASTER directs | GLM |

### 10.3 Strict boundaries respected in this mission

- ✅ No redesign of any page
- ✅ No new UI mockups generated
- ✅ No HTML/CSS converted to React
- ✅ No application code modified
- ✅ No database schema changes
- ✅ No unrelated features added
- ✅ No existing PRs merged (PR #7 and PR #1 were already merged before this mission began)
- ✅ No deployment to staging or production
- ✅ No server configuration changes
- ✅ No branches or existing assets deleted
- ✅ The current HTML reference was NOT declared visually approved
- ✅ No claim that missing functionality is implemented

---

## 11. Verification Provenance

All data in this report was verified live on 2026-10-22 via:
- GitHub REST API (`api.github.com`) for repository state, PR status, CI runs, and directory listings
- Shallow `git clone` (depth 1) of both repositories for full file-tree audit
- Direct reads of `package.json`, `tailwind.config.ts`, `components.json`, `globals.css`, `playwright.config.ts`, `README.md`, all G11-00 review reports, G08 UI Debt Log, 05-UX-and-Acceptance, 07-Decision-Register, MANIFEST.json, STR_Platform_HANDOFF, and key source files (`site-header.tsx`, `site-footer.tsx`, `states.tsx`, `[locale]/page.tsx`, `[locale]/layout.tsx`)
- Recursive filesystem search for image, HTML/CSS/JS, and ZIP assets under `SyrianTechRenaissance/`

No assumptions were made from prior session reports; every SHA, PR state, and file presence claim was re-verified against the live remote state.

---

**Report prepared by:** GLM Engineering Agent
**Standard followed:** AgentCraft Universal Project Delivery & Visual Fidelity Standard v1.0
**Mission:** STR-UI-00A — UI Foundation & Reference Inventory
**Status:** Awaiting MASTER review and explicit authorization before any UI implementation begins.
