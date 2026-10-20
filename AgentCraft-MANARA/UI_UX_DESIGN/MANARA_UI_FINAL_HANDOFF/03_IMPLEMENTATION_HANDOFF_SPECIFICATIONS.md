# MANARA — Implementation Handoff Specifications

> **Document type.** Per-page implementation specifications: what to build, what to remove, what to mark as future.
> **Date.** 2026-10-21.
> **Code baseline.** `6efac89bda807825f1cc29b44a59cbd11168fb69`.
> **Authorization.** DOCUMENTATION-ONLY. No frontend implementation.

---

## 1. Purpose

This document translates the approved visual assets + the backend API contracts into actionable implementation specifications for the future frontend implementation team. It is **NOT** an authorization to implement — it is a specification for the owner's review.

**Every specification is traceable to:**
- An approved visual reference (see `01_VISUAL_ASSET_MANIFEST_FINAL.md`).
- A backend endpoint at SHA `6efac89` (see `BACKEND_CLOSURE_01_02/API_REFERENCE_ADDENDUM.md`).
- A page in the 9-page UI design (see `MANARA_UI_UX_DESIGN_FOUNDATION.md`).

---

## 2. Shared Component Library

### 2.1 Components to build

| Component | Source | States | Boundary |
|---|---|---|---|
| `AppShell` / `Sidebar` | Client routing among 9 pages | Collapsible desktop; tablet drawer; mobile drawer; EN LTR / AR RTL | No invented account dashboard |
| `ServiceStatus` | `GET /status` | Show service availability + honest limitations | `/health` is monitoring-only |
| `LanguageSwitcher` | Client i18n state | English default; Arabic RTL; extensible locale keys | No server-synced preferences |
| `StudioObservatorySwitch` | Local view state | Same source records, no altered analysis | No fabricated graph links |
| `StateBadge` | Entity status fields | Icon + text + semantic color | Do not equate APPROVED with VERIFIED |
| `CoverageBadge` | `coverage[].coverage_level` | NONE/CATALOG/OPERATIONAL/VERIFIED | Per-need, not global percentage |
| `APIErrorNotice` | HTTP error envelope | User-safe message; trace_id details; retry | Never disclose internal secrets |
| `AsyncRegion` | Request lifecycle | Skeleton; spinner; screen-reader announcement | No fabricated progress |
| `ConfirmationDialog` | Admin transitions, publish, archive, terminate | Explain irreversible/risky action | Confirmation UI is not RBAC |
| `EvidenceReference` | Evidence/claim identifiers + timestamps | Provenance, checksum, freshness, verdict | Never invent confidence ratings |
| `GraphCanvas` | Only known source/capability/evidence relationships | Accessible list alternative, node details, touch zoom | Aesthetic ambient nodes must be visibly decorative |
| `MockBanner` | `is_mock=true` | Yellow banner + diagonal watermark | Impossible to miss |

### 2.2 Design tokens

| Token | Value | Usage |
|---|---|---|
| `--color-porcelain` | `#F7F8F6` | Primary background (light) |
| `--color-ink` | `#19334A` | Primary text / dark surfaces |
| `--color-teal` | `#2C7380` | Accent / links / primary actions |
| `--color-brass` | `#BB9362` | Secondary accent / highlights |
| `--color-mist` | `#E8EFF1` | Secondary background / dividers |
| `--font-heading` | `Source Serif 4` | Headings |
| `--font-ui-en` | `Inter` | English UI text |
| `--font-ui-ar` | `IBM Plex Sans Arabic` | Arabic UI text |
| `--font-mono` | `IBM Plex Mono` | Code / IDs / trace_id |

---

## 3. Per-Page Build Specifications

### 3.1 Page 01 — Investigation Home

**Build:**
- `AppShell` with sidebar (9 pages).
- `ServiceStatus` banner (`GET /status`).
- Lighthouse hero artwork (preserve from approved visual).
- Research question textarea (10–1000 chars, character counter, keyboard submit).
- "Start Investigation" button → `POST /mold-factory/compose` → navigate to Page 02 with `investigation_id`.
- 3-step workflow explanation (static copy).
- Synthetic discovery example (`GET /discovery`, labeled SYNTHETIC).

**Remove:**
- User profile avatar + label.
- Global search bar with `Ctrl+K`.
- Language selector showing French/German/Spanish (only EN + AR).
- Sun/moon dark mode toggle.

**States:** idle, invalid input, composing, success, partial coverage, coverage blocker, network/API failure.

### 3.2 Page 02 — Investigation Workspace

**Build:**
- 13-state workflow stepper (`GET /mold-factory/investigations/{id}/workflow`).
- "Advance state" button → `POST /mold-factory/investigations/{id}/transition`. Show `blocker` when `transitioned=false`.
- Coverage panel with per-need `coverage_level` badges.
- Evidence list (`GET /memory/investigations/{id}/evidence`) + ingest (`POST /memory/evidence`).
- Claim attachment (`POST /memory/evidence/{id}/claims`) + edge (`POST /memory/claims/{id}/support`) + verdict (`PATCH /memory/claims/{id}/verdict`).
- Agent sessions: resolve → instantiate → execute → get. Show `is_mock`, `granted_tools`, `tool_invocations[]`.
- Foresight + publication integration (cross-link to Pages 08 + 09).
- Audit timeline (`GET /memory/investigations/{id}/decisions`).
- Knowledge graph edges (`GET /memory/investigations/{id}/edges` — R-01).
- Dark Observatory surface for analytical panels.

**Remove:**
- Share, PDF export, edit question, pause workflow.

**States:** all 7 foundation states + mock, blocked transition, leak detection, coverage blocker.

### 3.3 Page 03 — Memory Explorer

**Build:**
- Evidence list (`GET /memory/investigations/{id}/evidence`) + detail (`GET /memory/evidence/{id}`).
- Claim list with verdict filter (`GET /memory/investigations/{id}/claims?verdict=...`).
- **Claim Examination split**: Supporting / Refuting / Qualifying columns (from `GET /memory/investigations/{id}/edges` — R-01).
- Bitemporal replay (`POST /memory/investigations/{id}/at-cutoff` — POST confirmed).
- Prior memory search (`POST /memory/investigations/{id}/search-prior`) + reuse (`POST /memory/investigations/{id}/reuse`).
- Audit timeline (`GET /memory/investigations/{id}/decisions`).
- Snapshot capture (`POST /memory/snapshots`).

**Remove:**
- Global full-text search, arbitrary knowledge graph explorer, confidence scores.

### 3.4 Page 04 — Capability Registry

**Build:**
- Card catalog (`GET /registry/capabilities`) + detail (`GET /registry/capabilities/{id}`).
- Semantic search (`GET /registry/search?q=...`) + coverage search (`GET /registry/search/coverage?q=...`).
- Create (`POST /registry/capabilities`) + seed (`POST /registry/capabilities/seed`).
- Promote (`PATCH .../promote`) + delete (`DELETE .../{id}`) + reindex (`POST .../reindex`).
- Evaluations (`GET/POST .../evaluations`) + relationships (`GET/POST .../relationships`).

**Remove:**
- Arbitrary PATCH edit (C-04: DELETE + re-POST only).
- "Use in agent" direct invocation.
- Fictitious agents, stats, connectors.

### 3.5 Page 05 — Source Foundry

**Build:**
- Candidate list (`GET /foundry/candidates`) + detail (`GET /foundry/candidates/{id}`).
- Lifecycle: discover → assess → register-connector → sandbox-test → approve.
- Quarantine action.
- OpenAlex sandbox test with provenance + error handling.

**Remove/Disable:**
- Crossref + arXiv sandbox test buttons (422 — no connector code).
- Extra providers (PubMed, Scopus, World Bank).
- Custom source wizard (FUTURE_DESIGN — backlog only).

### 3.6 Page 06 — Mold Factory (Concept 02 — dark-blue blueprint)

**Build:**
- **Mold Recipe Blueprint panel** (dark-blue, prominent). 3-column flow: Research Needs → Selected Capabilities → Coverage Status. Data from `GET /mold-factory/molds/{id}` → `composition_result` (FIX-01).
- Gap analysis table (`GET /mold-factory/molds/{id}/gaps`).
- Mold metadata header (ID, name, domain, version, state, last piloted).
- Mold library list (`GET /mold-factory/molds`) with state/domain filters.
- Promote (`PATCH .../promote`) + archive (`POST .../archive`).

**Remove:**
- "PLANNING" workflow state (not in 13 FSM states).
- Fictitious capability IDs.
- Mold editor / clone / version rollback.
- "Add paid source to close gap" active button.

**Legacy mold fallback:** when `composition_details_available=false`, show "Mold Blueprint details not available for this legacy mold" message.

### 3.7 Page 07 — Agent Registry

**Build:**
- Recipe list (`GET /agents/recipes`) + detail (`GET /agents/recipes/{id}`).
- Seed buttons: Clinical Reviewer + General Analyst (both succeed per FIX-02).
- Session: resolve → instantiate → execute → get. Show `is_mock`, `granted_tools`, `tool_invocations[]` (4 status icons).
- Session list (`GET /agents/sessions` — R-08).
- Terminate + evaluate actions.

**Remove:**
- Promote Recipe button (R-09: not implemented).
- Edit / clone / export configuration.
- Success rate dashboard (G28: no endpoint).

### 3.8 Page 08 — Foresight

**Build:**
- Evidence sufficiency assessment (`POST /foresight/assess`). Hide forecast form when `insufficient_evidence`.
- Forecast creation (`POST /foresight/forecasts`) + publish (`POST .../publish`) + revise (`POST .../revise`).
- Forecast list (`GET /foresight/forecasts` — R-06) + detail (`GET /foresight/forecasts/{id}` with `probability_distribution` — R-03).
- Backtest (`POST /foresight/backtest`) + history list (`GET /foresight/forecasts/{id}/backtests` — R-07).
- Probability chart (only when `probability_distribution` non-empty).

**Remove:**
- Confidence donuts when `insufficient_evidence`.
- PDF / chart exports.
- "Try Modify" as ordinary control (dev-only).

### 3.9 Page 09 — Publishing Studio (Concept 02 + Reader Concept 01)

**Build:**
- Publication list (`GET /publishing/publications`) + detail (`GET /publishing/publications/{id}`).
- Create (`POST /publishing/publications`) with output_type selector.
- **Dark status sidebar** (Concept 02): quality gate checklist from `quality_gate_issues[]`, metadata, evidence sources, related outputs.
- Download: Markdown / JSON / Text (gated by `downloadable`).
- **Reader view** (Concept 01): document viewer with tabs (Read / Presenter Edition / Visual Storyboard / Details).

**Remove:**
- PDF / HTML download options.
- Share Link button.
- Versions tab.
- Online collaborative editor.

---

## 4. Responsive + i18n + Accessibility

### 4.1 Responsive breakpoints

| Device | Layout |
|---|---|
| Desktop (≥1280px) | Sidebar + rich content + details panel |
| Tablet (768–1279px) | Drawer/collapsible sidebar + adaptive columns |
| Mobile (<768px) | Primary content first, drawer/bottom navigation, full-screen detail |

### 4.2 i18n

- Default: English (LTR).
- Alternate: Arabic (RTL).
- i18n keys per string (not concatenated translations).
- Preserve direction of DOI, URLs, source text, IDs, code, numeric axes, chronological timelines.
- Extensible to additional locales in the future.

### 4.3 Accessibility (WCAG 2.2 AA target)

- Keyboard navigation (Tab, Shift+Tab, Enter, Escape).
- Visible focus rings.
- Screen reader names (ARIA labels).
- Color-independent statuses (icon + text + color, never color-only).
- Contrast ratio ≥ 4.5:1.
- Text resizing up to 200%.
- 44px minimum touch targets.
- Reduced motion support.
- Skip-to-content link.

### 4.4 Polling (no WebSocket)

- `GET /agents/sessions/{id}` every 2 seconds while `status="running"`.
- `GET /mold-factory/investigations/{id}/workflow` every 5 seconds during transitions.
- Stop polling when terminal state reached.
- Debounce rapid clicks (G14: no API rate limiting; G16: SQLite "database is locked").

---

## 5. Elements to Remove (Consolidated X-Classification)

| Page | Element | Reason |
|---|---|---|
| 01 Home | User profile avatar | No auth (G01) |
| 01 Home | Global search bar (`Ctrl+K`) | No universal search endpoint |
| 01 Home | Language selector with FR/DE/ES | Only EN + AR supported |
| 01 Home | Sun/moon dark mode toggle | Not in scope (Studio/Observatory is per-page) |
| 02 Workspace | Share button | No endpoint |
| 02 Workspace | PDF export button | Not implemented |
| 02 Workspace | Edit investigation question | No endpoint |
| 02 Workspace | Pause workflow | No endpoint |
| 02 Workspace | Fictitious progress percentages | Only derive from real records |
| 03 Memory | Global knowledge explorer search | No endpoint |
| 03 Memory | Confidence percentages (e.g. 92%) | No fabricated certainty |
| 04 Capabilities | Arbitrary PATCH edit | C-04: DELETE + re-POST only |
| 04 Capabilities | "Use in agent" direct invocation | No endpoint |
| 05 Foundry | Crossref/arXiv sandbox test button | 422 — no connector code |
| 05 Foundry | Extra providers (PubMed, Scopus, etc.) | Not wired |
| 05 Foundry | Custom source wizard | FUTURE_DESIGN — backlog only |
| 06 Molds | "PLANNING" workflow state | Not in 13 FSM states |
| 06 Molds | Mold editor / clone / version rollback | No endpoints |
| 07 Agents | Promote Recipe button | R-09: not implemented |
| 07 Agents | Edit / clone / export configuration | No endpoints |
| 07 Agents | Success rate dashboard | G28: no endpoint |
| 08 Foresight | Confidence donuts when insufficient_evidence | Never fabricate |
| 08 Foresight | PDF / chart exports | Not implemented |
| 08 Foresight | "Try Modify" as ordinary control | Dev-only |
| 09 Publishing | PDF / HTML download options | Not implemented |
| 09 Publishing | Share Link button | No endpoint |
| 09 Publishing | Versions tab | No version history endpoint |
| 09 Publishing | Online collaborative editor | Not implemented |

---

## 6. Elements to Mark as Future (FUTURE_DESIGN)

| Element | Reason |
|---|---|
| Source Connector Framework (custom connectors, API key, OAuth, paid subscriptions, institutional access, secret vault, billing) | Owner-approved future product requirement. Requires separate backend mission. |
| Multi-tenant authentication (login, signup, user profiles, RBAC) | G01: not implemented. |
| Live LLM execution | G02: not tested. |
| Multi-turn agent execution loop | G19: not implemented. |
| WebSocket real-time updates | G30: not implemented. |
| PDF export | Not implemented. |
| Publication sharing / public URLs | Not implemented. |
| Document editing | Not implemented. |
| Capability update endpoint (PATCH) | C-04: unsupported. |
| Recipe promotion endpoint | R-09: not implemented. |
| Standalone quality-gate endpoint | R-09: not implemented. |

---

## 7. Implementation Authorization Gate

**This specification is NOT an authorization to implement.** The owner must:

1. Approve this handoff package.
2. Resolve the OPEN items in `04_OPEN_VERIFICATION_ITEMS.md`.
3. Issue a new mission explicitly authorizing frontend implementation.

**No React implementation, no GLM engineering assignment until the owner signs off.**
