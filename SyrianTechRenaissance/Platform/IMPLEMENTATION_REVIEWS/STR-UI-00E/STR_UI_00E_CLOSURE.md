# STR-UI-00E — Mission Closure & Mandatory Rules for Subsequent Pages

**Project:** Syrian Tech Renaissance Platform
**Executor:** GLM Engineering Agent
**Mission:** STR-UI-00E — Exact Approved Reference Implementation
**Status:** CLOSED — final visual reference locked; mandatory rules issued for all subsequent pages
**Date:** 2026-10-22
**Decision authority:** MASTER (Project Owner)
**Standard followed:** AgentCraft Universal Project Delivery & Visual Fidelity Standard v1.0

---

## 1. MASTER's final decision (verbatim summary)

> "نعتمد الصورة الأصلية التي اخترتها مرجعاً بصرياً نهائياً، ونؤجل تعديل موضع الشريط الجانبي في تنفيذ الصفحة الرئيسية إلى مرحلة التحسين على السيرفر."

> "لا تُعد تصميم الصفحة الرئيسية، ولا تُنشئ نسخة بصرية بديلة، ولا تعتبر v1.1 أو v1.2 أو v2.0 مرجعاً يحل محل الصورة الأصلية."

### 1.1 Page 01 (Homepage) — visual reference LOCKED

- **Authoritative reference:** `https://raw.githubusercontent.com/mayakilzy/repo-info/feat/str-ui-00e-checkpoint/SyrianTechRenaissance/Platform/IMPLEMENTATION_REVIEWS/STR-UI-00E/checkpoint/approved-reference.png`
- **SHA-256:** `1066016010130adccf1338a7bac46ef5754891901f3ef88d80e3979355b1a276`
- **Dimensions:** 1536 × 1024
- **Status:** FINAL — no further visual reconstruction attempts permitted.

### 1.2 Sidebar position in Page 01 — DEFERRED

- The approved image shows the sidebar on the LEFT.
- The required Arabic RTL behavior is sidebar on the RIGHT.
- This mismatch will be addressed in a **server-stage refinement** pass — NOT during the current UI/UX implementation phase.
- GLM will NOT attempt another visual correction round for Page 01. No v1.3 / v2.1 / v2.2 / etc. visual iterations.

### 1.3 Trial versions — status

| Version | Status |
|---|---|
| v1.0 (STR-UI-00B) | Historical validation record (PR #3). NOT the final visual reference. |
| v1.1 (STR-UI-00C) | REJECTED by MASTER. Historical record (PR #4). |
| v1.2 (STR-UI-00D) | REJECTED by MASTER. Historical record (PR #5). |
| v2.0 (STR-UI-00E checkpoint) | Not completed. Only Desktop AR checkpoint published (PR #6). NOT a final visual reference. |

All trial versions are preserved as engineering history. None of them replaces the approved original image as the visual reference for Page 01.

### 1.4 Gate B status for Page 01

**NOT APPROVED.** No trial version achieved visual match with the approved original. Gate B for Page 01 will not be declared PASS until the server-stage refinement pass successfully produces a Next.js implementation that visually matches the approved image (with sidebar on the RIGHT, per the RTL requirement).

---

## 2. Mandatory rules for all subsequent pages

Per MASTER's directive, these rules apply to every page from Page 02 onward. **No exceptions.**

### Rule R-A1 — Arabic typography: Cairo

- The Arabic font for ALL pages is **Cairo** (SIL Open Font License 1.1).
- Loaded via Google Fonts: `family=Cairo:wght@400;500;600;700;800;900`.
- Weights hierarchy to be consistent across pages:
  - 400 — body text
  - 500 — emphasized body, small labels
  - 600 — section sub-headings
  - 700 — feature panel headings (h2)
  - 800 — page hero headlines (h1)
  - 900 — reserved for hero numbers / large display (use sparingly)
- Latin text (English LTR mode): **IBM Plex Sans** (SIL OFL 1.1) as companion — `family=IBM+Plex+Sans:wght@400;500;600;700`.
- Numerals and code: IBM Plex Mono as needed.

### Rule R-A2 — Sidebar position: language-driven, automatic

| Locale | Direction | Sidebar position |
|---|---|---|
| Arabic (`ar`) | RTL | **RIGHT** |
| English (`en`) | LTR | **LEFT** |

- The sidebar MUST change position automatically when the user toggles language — NO page-by-page decision.
- Implementation strategy (per MASTER's engineering recommendation): a single **`AppShell` component** controls sidebar position based on `useLocale()` from `next-intl`. This solves the problem once for all pages, including Page 01 during the server-stage refinement.

### Rule R-A3 — Visual identity preserved across pages

Every page inherits from the approved reference's visual system:

- **Background:** deep navy `#030a16` (token: `--bg`)
- **Panel backgrounds:** linear-gradient `#0a1e37 → #071326` (token: `--panel`)
- **Text primary:** `#f4f7ff` (token: `--text`)
- **Text muted:** `#a6badc` (token: `--muted`)
- **Accents:** cyan `#00c7ff`, blue `#087bff`, purple `#8a2eff`
- **Brand gold:** `#ffc72e` (used for brand star only)
- **Danger:** `#ed315f` (notification badges)
- **Borders:** `#193453` (token: `--line`)
- **Cards:** rounded `--radius:13px`, glass-like surfaces where appropriate
- **Hero scenes:** use the same overlay technique (`linear-gradient` over photographic webp)
- **Stat cards:** 5-column grid with colored icon tiles
- **Feature panels:** 3-column grid with `glow-icon` circular icons
- **Lower grid:** 3-column with project cards (light cards `#f6f9ff` for contrast)
- **Shadows:** soft `0 5px 18px rgba(0,0,0,.2)` for panels, `0 8px 16px rgba(0,0,0,.32)` for stats
- **Icons:** inline SVG, 24px viewBox, stroke-2, Lucide-compatible (same paths used in v1.x)
- **Density:** match the approved image's information density — do NOT simplify pages to ease implementation

### Rule R-A4 — Shared components

- A single `AppShell` component provides: `<Topbar>`, `<Sidebar>`, font loading, color tokens, RTL/LTR direction handling.
- All pages render inside `<AppShell>{pageContent}</AppShell>`.
- The Topbar and Sidebar are NEVER re-implemented per page.
- The font stack (`--font-ar` Cairo, `--font-en` IBM Plex Sans) is defined once in `AppShell` and inherited via CSS variables.

### Rule R-A5 — Next.js implementation stack

When implementing in Next.js (Gate C work):
- `next-intl` for locale routing (`/` = ar, `/en` = en) and translation messages.
- `next/font/google` for Cairo + IBM Plex Sans loading (avoids `<link>` to Google Fonts CDN; resolves the Turbopack bug noted in the existing `layout.tsx`).
- `lucide-react` for icons (drop-in replacement for the inline SVG paths used in the reference package; preserves the Lucide-compatible stroke style).
- The existing `src/app/[locale]/layout.tsx` becomes the host for `<AppShell>`.
- The existing `src/i18n/messages/{ar,en}.json` is extended with new page namespaces.

### Rule R-A6 — No content simplification

> "حافظ على التفاصيل والكثافة البصرية، ولا تختصر محتوى الصفحات لمجرد تسهيل التنفيذ."

When implementing a page:
- Every section in the approved visual reference MUST appear in the implementation.
- Empty states, loading states, error states are wired to real APIs (or honest "no data" placeholders, never fabricated counts).
- Demo data in standalone HTML references remains clearly labeled as demo (per STR-UI-00C R7).
- No page section is removed to make implementation easier. If a section cannot be implemented (e.g., requires an API that doesn't exist), escalate to MASTER via a `FUNCTIONAL_GAP` note — do not silently drop it.

---

## 3. Historical work preserved (DO NOT DELETE, DO NOT MERGE)

The following PRs are the engineering history of the Page 01 visual exploration. They are preserved as record, not as active branches to merge.

| PR | Branch | Mission | Status | SHA |
|---|---|---|---|---|
| #2 | `feat/str-ui-00a-foundation-audit` | STR-UI-00A — UI Foundation & Reference Inventory | Open, preserved | `b983bd88d76f...` |
| #3 | `feat/str-ui-00b-visual-validation` | STR-UI-00B — v1.0 Visual Validation | Open, preserved | `70865126bd05...` |
| #4 | `feat/str-ui-00c-refinement` | STR-UI-00C — v1.1 Visual Refinement (REJECTED) | Open, preserved | `46e5d3bd6021...` |
| #5 | `feat/str-ui-00d-regression-recovery` | STR-UI-00D — v1.2 Regression Recovery (REJECTED) | Open, preserved | `f73bfda77efc...` |
| #6 | `feat/str-ui-00e-checkpoint` | STR-UI-00E — v2.0 Desktop AR Checkpoint (CLOSED, not completed) | Open, preserved | `5d5cc20075a3...` |

The v1.0 reference ZIP remains on `repo-info/main`:
- Path: `SyrianTechRenaissance/Platform/IMPLEMENTATION_REVIEWS/STR-G11-00/STR_UI_01_HOME_REFERENCE_v1.zip`
- SHA-256: `0717bdd7127535bcfdec78a5c935913ae7284a002a170d9afdb491a9dd9526d6`

The approved reference image is duplicated across multiple evidence folders — all copies are byte-identical (SHA-256 `1066016010130adccf1338a7bac46ef5754891901f3ef88d80e3979355b1a276`).

---

## 4. Engineering recommendation acknowledged

MASTER's recommendation (with ChatGPT concurrence):

> "لا ينبغي أن يكون موضع الشريط الجانبي قراراً مستقلاً في كل صفحة. عندما ننتقل إلى التنفيذ الحقيقي، يجب أن يتحكم به مكوّن `AppShell` مشترك وفق اتجاه اللغة؛ بذلك نحل المشكلة مرة واحدة لجميع صفحات المنصة، بما فيها الصفحة الرئيسية لاحقاً."

GLM acknowledges and will implement this when reaching Gate C (Next.js integration). The single `AppShell` component will:
1. Read `locale` from `next-intl`'s `useLocale()` hook.
2. Apply `dir={locale === 'ar' ? 'rtl' : 'ltr'}` to `<html>`.
3. Render the sidebar in the correct grid column based on direction.
4. Load Cairo + IBM Plex Sans via `next/font/google`.
5. Apply the shared color tokens (`--bg`, `--panel`, `--text`, etc.) via CSS variables on the root.
6. Wrap every page's content uniformly.

This means **Page 01's sidebar position will be corrected automatically** when the AppShell is built — no separate correction pass needed. The server-stage refinement pass becomes: "use AppShell on Page 01 and verify visual match with the approved image."

---

## 5. Next step — Page 02

Per MASTER's directive, GLM now moves to the **next page** in the UI/UX plan.

The next page candidate is determined by the existing application's UI route inventory (from STR-UI-00A):
- Logical next page after the homepage is **Sign In** (`/auth/signin`) — the first step of the user journey after landing.
- Alternative candidates per the UX flow document (`05-UX-and-Acceptance.md`): Sign Up, Verify Email, Dashboard, Proposals List.

GLM will await MASTER's explicit selection of Page 02 before starting any work, and will apply all six mandatory rules (R-A1 through R-A6) from the first commit.

---

## 6. Strict boundaries respected during STR-UI-00E

| Boundary | Compliance |
|---|---|
| Did not redesign Page 01 after MASTER's checkpoint review | ✅ Stopped at Desktop AR |
| Did not create a new visual replacement for the approved image | ✅ |
| Did not treat v1.1/v1.2/v2.0 as the visual reference | ✅ |
| Did not declare Gate B PASS for Page 01 | ✅ |
| Did not delete historical work | ✅ All PRs preserved open |
| Did not merge any PR | ✅ |
| Did not modify Next.js application code | ✅ |
| Did not consume further time on Page 01 visual reconstruction | ✅ Moving to Page 02 |

---

## 7. Mission closure statement

STR-UI-00E is **CLOSED**. The visual reference for Page 01 is locked. The mandatory rules for subsequent pages are issued. The next page awaits MASTER's selection.

The engineering history of Page 01's visual exploration (PRs #2 through #6) is preserved as a record of what was attempted, what was learned (Tajawal vs Changa vs Cairo, SVG sizing cascades, sidebar positioning via grid columns in RTL/LTR), and why MASTER chose to defer the Page 01 sidebar fix to the server-stage refinement via the `AppShell` component.

**No further Page 01 visual reconstruction attempts will be made by GLM.**

---

**Report prepared by:** GLM Engineering Agent
**Decision authority:** MASTER (Project Owner)
**Standard followed:** AgentCraft Universal Project Delivery & Visual Fidelity Standard v1.0
**Mission:** STR-UI-00E — closure
**Next mission:** Awaiting MASTER's selection of Page 02.
