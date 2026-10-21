# MANARA — Verification Items (All Closed — Owner Approved)

> **Document type.** Verification items — all 10 now CLOSED by owner approval.
> **Original date.** 2026-10-21 (when items were first identified as OPEN).
> **Closure date.** 2026-10-21 (owner approved all 10 decisions in mission `MANARA-UI-DESIGN-DECISIONS-CLOSURE-01`).
> **Authorization.** DOCUMENTATION-ONLY. No frontend implementation.

---

## 1. Purpose

This document originally listed 10 items that could not be resolved definitively from the approved visual assets + the backend code. Each item was marked **OPEN** and required the owner's decision before frontend implementation.

**All 10 items are now CLOSED — OWNER APPROVED.** The owner's decisions are recorded below. The original identifiers (OPEN-01 through OPEN-10) are retained for traceability; the history is preserved.

**Per the mission directive:** "Mark missing, ambiguous, or contradictory visual references as OPEN rather than guessing." — This was done. The owner has now resolved every OPEN item. No guessing remains.

---

## 2. Closed Items (OPEN-01 through OPEN-10)

### OPEN-01 — Investigation Workflow — ✅ CLOSED — OWNER APPROVED

**Original issue.** The approved visual shows a 7-state workflow stepper. The backend FSM has 13 states.

**Owner decision.** APPROVED. Display all 13 real investigation FSM states using the approved Investigation Observatory Concept 02 visual style. States may be visually grouped for readability, but the interface must preserve each real state independently.

**Requirements (binding on implementation).**
- Highlight the actual current state.
- Expose all 13 states through expansion or detailed navigation.
- Preserve transition blockers.
- Do not invent intermediate states.
- Support desktop, tablet, and mobile layouts.

**Backend fact.** The 13 FSM states are: `received`, `scoped`, `coverage_checked`, `building_capabilities`, `mold_ready`, `acquiring`, `normalizing`, `evidencing`, `forecasting_or_scenarios`, `drafting`, `verification`, `deliverable_ready`, `archived`. These are non-negotiable.

**Affected pages.** Page 02 (Investigation Workspace).

**Status.** ✅ **CLOSED — OWNER APPROVED.**

---

### OPEN-02 — Knowledge Graph — ✅ CLOSED — OWNER APPROVED

**Original issue.** The approved visuals show knowledge graph visualizations. The backend provides per-investigation edge reads + per-capability relationship reads, but no system-wide graph endpoint.

**Owner decision.** APPROVED. Implement a hybrid interactive graph experience.

**Requirements (binding on implementation).**
- Real claim/evidence and capability relationships only.
- Interactive graph with zoom, pan, node selection, and accessible detail inspection.
- List/table representation must always remain available.
- Progressive loading or suitable performance adaptations for larger datasets.
- No fixed artificial limit of 50 nodes.
- Preserve supports/refutes/qualifies distinctions.
- Do not fabricate relationships or credibility scores.

**Backend fact.** `GET /memory/investigations/{id}/edges` (R-01) returns claim↔evidence edges. `GET /registry/capabilities/{id}/relationships` returns capability↔capability edges (per-capability). No system-wide graph endpoint.

**Affected pages.** Page 02 (Investigation Workspace), Page 03 (Memory Explorer), Page 04 (Capability Registry).

**Status.** ✅ **CLOSED — OWNER APPROVED.**

---

### OPEN-03 — Studio / Observatory — ✅ CLOSED — OWNER APPROVED

**Original issue.** The design system mentions a "Studio/Observatory" mode switch. The scope was ambiguous (global toggle vs per-page vs automatic).

**Owner decision.** APPROVED. Use Modern Knowledge Studio as the default visual language. Use dark Intelligence Observatory surfaces selectively for analytical components.

**Requirements (binding on implementation).**
- Default: Modern Knowledge Studio (light).
- Observatory (dark) surfaces applied selectively to: investigation graphs, evidence relationships, foresight charts.
- Preserve the dark-blue Mold Blueprint panel from Mold Factory Concept 02.
- Do not introduce a global dark-mode toggle as a required feature.

**Backend fact.** Frontend-only concern — no backend impact.

**Affected pages.** All pages (cross-cutting).

**Status.** ✅ **CLOSED — OWNER APPROVED.**

---

### OPEN-04 — Role Switcher — ✅ CLOSED — OWNER APPROVED

**Original issue.** The design system mentions a "role switcher" (Researcher / Investigation Manager / Factory Manager). The backend has NO authentication (G01).

**Owner decision.** APPROVED. Remove the interactive role switcher.

**Requirements (binding on implementation).**
- Remove the interactive role switcher entirely.
- Display a clear, unobtrusive single-tenant demo-mode explanation where appropriate.
- Do not imply actual permissions or role-based security.

**Backend fact.** No auth. Every caller is `tenant_demo`. The role switcher was purely cosmetic.

**Affected pages.** All pages (the role switcher was in the header).

**Status.** ✅ **CLOSED — OWNER APPROVED.**

---

### OPEN-05 — Mobile Navigation — ✅ CLOSED — OWNER APPROVED

**Original issue.** The mobile navigation pattern was ambiguous (hamburger drawer vs bottom bar vs tab bar).

**Owner decision.** APPROVED. Use a hamburger-triggered navigation drawer for mobile.

**Requirements (binding on implementation).**
- All nine major pages remain accessible.
- Accessible focus management and keyboard operation.
- Proper RTL mirroring.
- Clear active-page indication.
- No mandatory bottom navigation bar.
- Desktop retains the approved collapsible sidebar.

**Backend fact.** Frontend-only concern.

**Affected pages.** All pages (mobile navigation).

**Status.** ✅ **CLOSED — OWNER APPROVED.**

---

### OPEN-06 — Arabic Typography — ✅ CLOSED — OWNER APPROVED WITH TECHNICAL VERIFICATION

**Original issue.** The design system proposes "IBM Plex Sans Arabic" for Arabic UI text. Licensing + weight availability + rendering needed verification.

**Owner decision.** APPROVED WITH TECHNICAL VERIFICATION. Use IBM Plex Sans Arabic for Arabic interface typography.

**Requirements (binding on implementation — verify before implementation).**
- Compatible open-source license (IBM Plex Sans Arabic is SIL OFL 1.1).
- Required font weights (Regular, Medium, SemiBold are available).
- Correct Arabic shaping and rendering.
- Browser and device compatibility.
- Responsive behavior and accessibility.

**Additional requirements.**
- Do not include font binaries in documentation or handoff archives unnecessarily.
- Any required substitution must be documented without changing the approved visual identity.

**Backend fact.** Frontend-only concern.

**Affected pages.** All pages (Arabic RTL mode).

**Status.** ✅ **CLOSED — OWNER APPROVED WITH TECHNICAL VERIFICATION.**

---

### OPEN-07 — Polling Strategy — ✅ CLOSED — OWNER APPROVED

**Original issue.** The design foundation specifies polling (no WebSocket). The exact intervals + backoff + timeout were not finalized.

**Owner decision.** APPROVED. Initial polling intervals: agent sessions 2 seconds, investigation workflow 5 seconds.

**Requirements (binding on implementation).**
- Apply adaptive backoff when appropriate.
- Stop polling upon terminal states.
- Cancel polling when leaving the relevant view.
- Avoid duplicate requests and concurrent polling storms.
- Provide manual refresh and retry behavior.
- After five minutes without a confirmed terminal result, indicate that automatic status monitoring has paused or timed out.
- **Do not equate a polling timeout with failure of the underlying operation.**
- Do not introduce unsupported WebSocket behavior.

**Backend fact.** G16: SQLite "database is locked" under high concurrency. G14: no API rate limiting. G30: no WebSocket.

**Affected pages.** Page 02 (Investigation Workspace — workflow polling), Page 07 (Agent Registry — session polling).

**Status.** ✅ **CLOSED — OWNER APPROVED.**

---

### OPEN-08 — Coverage Blocker Report — ✅ CLOSED — OWNER APPROVED

**Original issue.** `deliverable_type="coverage_blocker_report"` must be visually distinct from a research dossier. The exact visual treatment was ambiguous.

**Owner decision.** APPROVED. Render `coverage_blocker_report` using a clearly distinct report layout.

**Requirements (binding on implementation).**
- Prominent coverage-blocker identification.
- Explain that the output is not a completed evidence-backed research deliverable.
- Show missing capabilities, sources, and unresolved research needs.
- Preserve links to actual available evidence and gap records.
- Do not show fabricated research conclusions.
- Respect the backend `downloadable` field for download eligibility.
- Maintain the overall MANARA visual identity.

**Backend fact.** `deliverable_type` is returned by `GET /publishing/publications/{id}`. The `downloadable` field gates the download button.

**Affected pages.** Page 09 (Publishing Studio).

**Status.** ✅ **CLOSED — OWNER APPROVED.**

---

### OPEN-09 — Audit Log — ✅ CLOSED — OWNER APPROVED

**Original issue.** The Memory Explorer shows an audit timeline. The visualization style was ambiguous.

**Owner decision.** APPROVED. Use a filterable audit table with chronological context.

**Requirements (binding on implementation).**
- Date/time, decision type, actor, rationale, and related references.
- Default newest-first ordering.
- Detail inspection for individual decisions.
- Client-side paging where the endpoint returns a bounded complete dataset.
- Do not imply a complete history when only a subset has been fetched.
- No invented audit entries or actors.

**Backend fact.** `GET /memory/investigations/{id}/decisions` returns an append-only list with `limit` + `offset` (no cursor pagination — G15).

**Affected pages.** Page 03 (Memory Explorer), Page 02 (Investigation Workspace audit panel).

**Status.** ✅ **CLOSED — OWNER APPROVED.**

---

### OPEN-10 — Bitemporal Replay — ✅ CLOSED — OWNER APPROVED

**Original issue.** `POST /memory/investigations/{id}/at-cutoff` returns evidence visible at a cutoff time. The visualization style was ambiguous.

**Owner decision.** APPROVED. Use a date-and-time picker with an explicit Replay action.

**Requirements (binding on implementation).**
- Call the actual `POST /memory/investigations/{id}/at-cutoff` endpoint.
- Show evidence visible at the selected cutoff.
- Preserve the distinction between event, publication, and ingestion timestamps when available.
- Explain the selected temporal perspective to the user.
- Show clear empty, loading, and error states.
- No simulated continuous time-travel mode.
- No fabricated historical reconstruction.

**Backend fact.** The endpoint is POST (confirmed in CLOSURE-01 reconciliation). It returns `visible_evidence_count` + `visible_evidence[]` with `observed_at` + `ingested_at`.

**Affected pages.** Page 03 (Memory Explorer).

**Status.** ✅ **CLOSED — OWNER APPROVED.**

---

## 3. Items NOT Open (Resolved by Backend Closure)

The following items were OPEN in the original reconciliation (`MANARA_VISUAL_FUNCTIONAL_RECONCILIATION_v1.md` §5) but were resolved by CLOSURE-01 + CLOSURE-02 (before this mission):

| Original Item | Resolution |
|---|---|
| Q01: GET vs POST workflow state read | RESOLVED: `GET /mold-factory/investigations/{id}/workflow` confirmed (CLOSURE-01 reconciliation). |
| Q02: Evidence-support relationship read shape | RESOLVED: `GET /memory/investigations/{id}/edges` (R-01) returns the full edge shape. |
| Q03: Need→capability edge data for Mold Blueprint | RESOLVED: `GET /mold-factory/molds/{id}` returns `composition_result` (FIX-01). |
| Q04: Graph node/edge read capacity | RESOLVED: R-01 (memory edges) + per-capability relationship reads. No system-wide graph endpoint (by design). |
| Q05: Publication download enum + blocker handling | RESOLVED: formats = json/markdown/text; gated by `downloadable` field. |
| Q06: GET /status payload + role UI | RESOLVED: `GET /status` returns capabilities + not_implemented list. Role switcher is visual-only. |
| Q07: Pagination availability | RESOLVED: `limit` + `offset` on list endpoints. No cursor pagination (G15). |
| Q08: Source licensing + future paid integrations | RESOLVED: documented as FUTURE_DESIGN. Source Connector Framework is a separate backend mission. |
| Q09: Visual asset manifest with checksums | RESOLVED: this package (22 images SHA-256 verified). |
| Q10: Per-page state + keyboard/mobile behavior | RESOLVED: see `03_IMPLEMENTATION_HANDOFF_SPECIFICATIONS.md` §4. |

---

## 4. All Items Closed

**All 10 OPEN items (OPEN-01 through OPEN-10) are now CLOSED — OWNER APPROVED.**

**All 10 backend-closure items (Q01 through Q10) were already RESOLVED.**

**There are no remaining OPEN verification items.** The design is fully locked. The implementation handoff is ready (pending the owner's separate explicit authorization for frontend implementation).

---

## 5. Cross-Reference

The owner-approved decisions are also recorded in:
- `07_FINAL_OWNER_DECISIONS_AND_IMPLEMENTATION_GATE.md` — the consolidated document with all 10 decisions + the implementation gate.

The decisions are reflected in:
- `00_README_AND_APPROVAL_STATUS.md` — the approval status is updated.
- `02_PAGE_TO_VISUAL_MAPPING.md` — the per-page mapping incorporates the decisions.
- `03_IMPLEMENTATION_HANDOFF_SPECIFICATIONS.md` — the per-page specs incorporate the decisions.
- `06_FINAL_DESIGN_LOCK_VERDICT.md` — the final verdict is updated.
