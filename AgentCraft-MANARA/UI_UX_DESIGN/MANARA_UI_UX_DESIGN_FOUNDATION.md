# MANARA — UI/UX Design Foundation

> **Document type.** Functional reference for the independent UI/UX design team.
> **Author.** GLM (Implementer).
> **Reviewer.** Ayman (Owner), ChatGPT (Supervisor).
> **Date.** 2026-10-19.
> **Status.** Submitted — awaiting owner review and visual design kickoff.
> **Source baseline.** `AgentCraft-MANARA` code at SHA `91f2909` + `repo-info` at SHA `67203f6` (BACKEND-VERIFICATION-01 deliverable).

---

## 0. How to Read This Document

This document is the **single functional source of truth** for designing the new MANARA UI. It is intentionally self-contained: a designer who has never read a backend source file, a backend docstring, or a prior session transcript should be able to design every screen the backend supports after reading this file alone.

### 0.1 Golden rule — Do not invent functionality

> **لا تخترع وظائف لا يدعمها الباك إند.**

If a feature, button, field, page, state, transition, badge, flag, or interaction is **not documented in this file**, it does not exist in the backend and must not appear in the UI design. Every screen, every interaction, every visual element in the design must be traceable to a numbered item in this document. If the designer believes a feature is missing and is needed, the correct response is to **escalate the question to the backend team**, never to invent the missing piece.

This rule is non-negotiable. Inventing UI surface area for backend capabilities that do not exist is the single most expensive mistake a UI team can make on this project, because:

1. It produces false expectations in user testing.
2. It forces the backend team to either build the missing capability under time pressure (introducing risk) or explicitly de-scope the UI work (introducing conflict).
3. It breaks the honest-data contract: every flag in this document is an honest signal about what the backend can and cannot do. Inventing UI hides that honesty.

When in doubt: **ask, do not assume.**

### 0.2 Document structure

| Section | Purpose |
|---|---|
| §1 | Acceptance criteria for this deliverable. |
| §2 | Glossary of terms used throughout. |
| §3 | What MANARA is and what the UI must NOT be. |
| §4 | The three user roles the UI must serve. |
| §5 | Master functional inventory — every backend capability the UI may surface, classified by honest status. |
| §6 | Required pages and their internal interactions. |
| §7 | Required UI states (loading / success / failure / insufficient-evidence / approval-required / source-unavailable / investigation-complete). |
| §8 | The full user journey from research question to download. |
| §9 | Binding of every user action to a real API endpoint, with the endpoint's honest status. |
| §10 | Backend gaps that affect UI design (do not attempt to fix — document only). |
| §11 | The honest data quality flag catalog and rendering rules. |
| §12 | Accessibility, bilingual, and polling contracts. |
| §13 | Open design questions deferred to the visual design phase. |
| §14 | Acceptance checklist for the visual design phase. |

### 0.3 Source documents (do not need to be re-read by the designer)

This document consolidates and supersedes the following for UI design purposes. They are listed for traceability only:

- `BACKEND_VERIFICATION_01/FINAL_MASTER_REPORT.md`
- `BACKEND_VERIFICATION_01/FUNCTIONAL_CAPABILITY_CATALOG.md`
- `BACKEND_VERIFICATION_01/UI_FUNCTIONAL_HANDOFF.md`
- `BACKEND_VERIFICATION_01/API_REFERENCE.md`
- `BACKEND_VERIFICATION_01/INVESTIGATION_LIFECYCLE.md`
- `BACKEND_VERIFICATION_01/KNOWN_GAPS_AND_LIMITATIONS.md`

If a discrepancy is ever found between this document and the source documents, the source documents win. Report the discrepancy to the backend team.

---

## 1. Acceptance Criteria for This Deliverable

This document is considered accepted by the owner when **all** of the following are true:

| # | Criterion | How to verify |
|---|---|---|
| AC-1 | Every backend capability catalogued in `FUNCTIONAL_CAPABILITY_CATALOG.md` (36 capabilities) appears in §5 of this document, with its honest tier preserved verbatim. | Cross-check §5 against FCC §2 summary table. |
| AC-2 | Every API endpoint (67 endpoints across 10 routers) appears in §9 of this document, with its HTTP method, path, and honest status. | Cross-check §9 against API_REFERENCE.md endpoint count. |
| AC-3 | Every gap in `KNOWN_GAPS_AND_LIMITATIONS.md` (30 gaps) that affects the UI is listed in §10 of this document with its impact classification. | Cross-check §10 against KGL summary table; UI-irrelevant gaps (e.g. G20 coverage measurement, G21 load testing) are explicitly excluded with a one-line rationale. |
| AC-4 | Every UI state defined in §7 has at least one trigger condition grounded in a real backend response shape (no speculative states). | Each state in §7 references the API response field that triggers it. |
| AC-5 | Every user action in §6 binds to a real API endpoint documented in `API_REFERENCE.md`. No action binds to a missing endpoint. | The "missing endpoints" list in §10.4 covers exactly the 2 endpoints documented as NOT_IMPLEMENTED in the backend. |
| AC-6 | The "do not invent" rule (§0.1) is enforced: every page, every action, every badge, every flag is traceable to a numbered item in §5, §9, or §11. | Designer-facing checklist in §14 enforces this. |
| AC-7 | The user journey in §8 maps 1:1 to the owner's canonical stage list (Question → Investigation → Needs Analysis → Mold → Operational Source Selection → Real Evidence Acquisition → Memory → Analysis → Specialist Execution → Foresight → Publishing → Download). | Cross-check §8 against INVESTIGATION_LIFECYCLE.md §0. |
| AC-8 | The three user roles (Researcher, Investigation Manager, Factory Manager) defined in §4 cover every action in §6 without overlap or omission. | Each action in §6 is tagged with exactly one primary role. |
| AC-9 | The honest data quality flag catalog (§11) is identical to the one in `UI_FUNCTIONAL_HANDOFF.md` §5 — no flag added, no flag removed, no semantics changed. | Cross-check §11 against UI_HANDOFF §5.1. |
| AC-10 | The file is committed to `repo-info/AgentCraft-MANARA/UI_UX_DESIGN/` and the SHA is reported to the owner. | Git log on `repo-info` repository. |

If any criterion fails, the document is not accepted and must be revised before the visual design phase begins.

---

## 2. Glossary

These terms are used throughout the document with the exact meanings below. Designers must use these terms verbatim in their copy — synonyms create confusion.

| Term | Definition |
|---|---|
| **Investigation** | A specific research question plus its full lifecycle. Stored in `InvestigationRow`. Identified by `investigation_id`. |
| **Mold** | A recipe that says "for this kind of query, use these capabilities." Stored in `MoldRecipeRow`. Identified by `mold_recipe_id`. |
| **Capability** | A typed contract describing what you can search for over a source. Stored in `CapabilityRow`. Identified by `capability_id` (e.g. `search.academic-publications`). |
| **Connector** | An implementation of access to a specific source. Stored in `ConnectorRow`. Today: only OpenAlex. |
| **Source** | A discovered external data provider. Stored in `SourceRow`. Today: only OpenAlex. |
| **Foundry Candidate** | A source that has been catalogued but not yet approved. Stored in `SourceCandidate`. Today: OpenAlex (assessable), Crossref + arXiv (catalog-only). |
| **Evidence** | A single piece of ingested data (a quote, a dataset, a measure). Stored in `EvidenceItemRow`. Identified by `evidence_id`. |
| **Claim** | A statement attached to evidence, with a verdict (`candidate` / `supported` / `contested` / `refuted` / `superseded`). Stored in `ClaimRow`. |
| **Support / Refute Edge** | A link between evidence and a claim with a relation (`supports` / `refutes` / `qualifies`) and a weight. Stored in `ClaimSupportEdgeRow`. Both sides are always preserved. |
| **Measure** | A structured numeric value extracted from evidence. Stored in `MeasureRow`. |
| **Forecast** | A quantitative prediction with bitemporal safety. Stored in `ForecastRow`. Status: `draft` → `published` (immutable) → `superseded` (when revised). |
| **Backtest** | A historical replay of a forecast with leakage detection. Stored in `BacktestResultRow`. |
| **Publication** | A downloadable deliverable. Three output types: `research_dossier`, `presenter_edition`, `visual_storyboard`. Stored in `PublicationRow`. |
| **Agent Recipe** | A "shift worker" definition (role, tools, prompts). Stored in `AgentRecipeRow`. |
| **Agent Session** | A specific execution of a recipe. Stored in `AgentSessionRow`. Always ephemeral; the recipe is what persists. |
| **Tenant** | The isolation boundary. Today: always `tenant_demo` (single-tenant demo mode). |
| **Bitemporal** | Distinguishes when the event happened (`observed_at`) from when we learned of it (`ingested_at`) from when the source published it (`published_at`). |
| **Coverage Level** | The four-tier model: `NONE` / `CATALOG` / `OPERATIONAL` / `VERIFIED`. See §11. |
| **Quality Gate** | The 6-rule validator that runs before a publication can be downloaded. |
| **SSRF** | Server-Side Request Forgery. The Foundry blocks private IPs and non-allowlisted hosts. |
| **Mock Provider** | The deterministic mock LLM. Always used today (`is_mock=true`). |
| **Z.AI Provider** | The live LLM (Z.AI/GLM). Requires `MANARA_ZAI_API_KEY`. Not exercised in the sandbox. |
| **Tool Invocation** | A record of a single tool call attempted by an agent (`executed` / `denied_not_in_granted_set` / `not_implemented` / `error`). |
| **Coverage Blocker Report** | A publication with `deliverable_type="coverage_blocker_report"`. NOT a research deliverable — it is a structured gap report. Must be visually distinct. |
| **Honest Flag** | Any field in §11 that signals a backend limitation the user must see. Never hide these. |

---

## 3. What MANARA Is — and What the UI Must NOT Be

### 3.1 Plain-English explanation

MANARA — **the Adaptive Intelligence Factory (منارة)** — is a research intelligence backend that takes a natural-language research question ("study the future of intelligent prosthetics") and produces an evidence-backed, downloadable research dossier. It is a structured pipeline that:

1. **Discovers** external data sources (academic publishers, patent offices, clinical trial registries, statistical agencies) and catalogs them in a **Foundry**.
2. **Catalogues** searchable capabilities over those sources in a **Registry** — each capability card describes *what you can search for* and *which connectors can execute that search*.
3. **Composes** investigation **Molds** from those capabilities — a mold is a recipe that says "for this question, use these three search engines, expect these data types, and report these gaps."
4. **Spins up** ephemeral specialist **Agents** (a clinical reviewer, a patent analyst, a general analyst) to extract evidence from the mold's sources. Agents are short-lived: they execute one task, record the result, and terminate. Their recipe is preserved for future rehydration.
5. **Curates** evidence in a cumulative **Memory** — every evidence item, every claim, every contradiction, every measure. Memory is tenant-scoped, deduplicated by checksum, and bitemporal.
6. **Forecasts** quantitative outcomes with **bitemporal safety** — a published forecast is immutable; revisions create new records that link back to the original. Backtests refuse to use data that wasn't available at the simulation cutoff.
7. **Publishes** the evidence into downloadable **Dossiers** (research reports), **Presenter Editions** (3-5 minute media scripts), and **Visual Storyboards** (scene-by-scene visual plans). Every claim links back to the evidence ID it came from. Every fictional scene is explicitly labeled as fictional.

### 3.2 What the UI must NOT be

These constraints are enforced by the backend today and must be reflected in the UI design. Designing any of the following is a violation of the "do not invent" rule (§0.1).

| The UI must NOT be … | Why |
|---|---|
| A chatbot | There is no free-text conversation with an LLM. The "agent session" executes one bounded task, records the result, and terminates. |
| A search box that returns a search results page | Typing a query kicks off a structured pipeline (mold composition → evidence acquisition → analysis → publishing). The UI must show the pipeline progress, not a search results page. |
| A content management system | There is no rich-text editor. Publications are generated from evidence by the backend; the UI displays them and offers downloads. |
| A personalization engine | There are no user accounts, no saved searches, no per-user preferences (see §10.1 G01). |
| A multi-user workspace | Single-tenant demo mode only. There is exactly one tenant today (`tenant_demo`). Do not design per-user dashboards. |
| A real-time dashboard | There is no WebSocket. The API is purely HTTP request-response. The UI must poll for long-running operations (see §12.3). |
| A file uploader | There is no multipart upload endpoint. Evidence is ingested as a JSON `Evidence` contract with optional base64-encoded raw content. |
| A live LLM playground | Every agent response today has `is_mock=true` until `MANARA_ZAI_API_KEY` is provided (see §10.1 G02). The UI must never let the user mistake a mock response for a real LLM response. |

### 3.3 Why MANARA exists

The world has too many "AI research assistants" that fabricate citations, hallucinate statistics, and produce polished deliverables with no provenance. MANARA is the opposite:

- It refuses to fabricate numbers when evidence is insufficient (`recommended_method="insufficient_evidence"`).
- It preserves contradictions rather than resolving them silently (both `supports` and `refutes` edges are kept on every claim).
- Every published claim can be traced back to the exact source row in the cumulative memory.
- Every fictional storyboard scene is explicitly labeled as fictional.
- Every mock response is watermarked.

The UI must reflect this honesty. Every page, every state, every flag must reinforce the principle: **MANARA would rather publish a "Coverage Blocker Report" than fabricate a fake dossier.**

---

## 4. User Roles

The owner's directive (this mission brief) groups the UI's audience into three roles. The backend's prior documentation (`UI_FUNCTIONAL_HANDOFF.md`) defined four personas; this document consolidates them into the three roles the owner requested. The mapping is explicit so no capability is lost.

### 4.1 Role A — The Researcher (الباحث)

> **Goal.** Ask a research question and get an evidence-backed answer.

This is the primary end-user. The Researcher is the persona who types a natural-language question and follows the investigation through to download. They need to see honest signals about coverage gaps, mock data, and quality gate failures, but they do not administer the factory.

**Maps to backend persona**: `UI_FUNCTIONAL_HANDOFF.md §2.1 The Researcher` (primary) + parts of `§2.3 The Publisher` (download).

**Primary pages (see §6 for detail):**

- `InvestigationHome` — type a research question.
- `InvestigationWorkspace` — follow the investigation through its 13 states.
- `MemoryExplorer` — browse the collected evidence and claims.
- `PublishingView` — create and download the publication.

**What they need to see at all times:**

- The `coverage_level` of each need in the mold (NONE / CATALOG / OPERATIONAL / VERIFIED — see §11).
- The `is_mock` flag on agent responses (every response today is mock).
- The `deliverable_type` of the publication (research_deliverable vs. coverage_blocker_report).
- The `quality_gate_passed` flag and the `quality_gate_issues` list.

### 4.2 Role B — Investigation Manager (إدارة التحقيقات)

> **Goal.** Validate the evidence behind a published claim, manage the audit log, and curate the memory.

This role supervises the investigation's analytical integrity. They attach claims, add refuting edges (preserving contradictions), promote claim verdicts, run backtests, and review the audit log. They do not manage capabilities or sources — that is Role C.

**Maps to backend persona**: `UI_FUNCTIONAL_HANDOFF.md §2.2 The Reviewer` (full) + parts of `§2.3 The Publisher` (Quality Gate inspection, forecast publishing).

**Primary pages:**

- `InvestigationWorkspace` (analytical view — claims, edges, audit log).
- `MemoryExplorer` (full memory browse, bitemporal replay, audit log timeline).
- `ForesightView` (forecast assessment, draft/publish/revise, backtest).
- `PublishingView` (quality gate inspection, publication generation).

**What they need to see at all times:**

- The full audit log (every claim promotion, every contradiction, every transition).
- The bitemporal timestamps (`observed_at`, `ingested_at`, `published_at`).
- The `rights_status` of every storyboard scene they're asked to approve.
- The `leakage_detected` flag on every backtest.
- The `verdict` chain on every claim (candidate → supported → contested → refuted → superseded).

### 4.3 Role C — Factory Manager (إدارة المصنع)

> **Goal.** Manage capabilities, sources, molds, and agent recipes.

This role administers the factory floor. They promote capabilities from `candidate` to `approved`, run the Foundry lifecycle (discover → assess → register connector → sandbox test → approve) on sources, promote molds from `temporary` to `reusable` to `maintained`, and seed agent recipes. They do not run investigations — that is Role A.

**Maps to backend persona**: `UI_FUNCTIONAL_HANDOFF.md §2.4 The Admin` (full).

**Primary pages:**

- `RegistryBrowser` — capability CRUD, promotion, evaluations, relationships.
- `FoundryBrowser` — source candidate lifecycle, sandbox testing.
- `MoldFactoryView` — mold recipe CRUD, promotion, archiving, gap analysis.
- `AgentRegistry` — agent recipe seeding, session instantiation (for testing).

**What they need to see at all times:**

- The current `status` of every entity (candidate / approved / rejected, etc.).
- The promotion history (ApprovalRow, transitions_json).
- The audit log of every admin decision.
- Honest "planned" badges for catalog-only sources (Crossref, arXiv — see §10.4).

### 4.4 Role overlap and shared surfaces

The three roles share several surfaces:

| Surface | Role A | Role B | Role C |
|---|---|---|---|
| `InvestigationHome` | Primary (writes the question) | Reads | Reads |
| `InvestigationWorkspace` | Primary (follows the pipeline) | Primary (curates claims/edges) | Reads (verifies mold, gaps) |
| `RegistryBrowser` | Reads (browses cards) | Reads (verifies capability) | Primary (CRUD + promotion) |
| `FoundryBrowser` | Reads | Reads | Primary (full lifecycle) |
| `MemoryExplorer` | Reads (browses evidence) | Primary (full memory + audit) | Reads |
| `MoldFactoryView` | Reads | Reads | Primary (CRUD + promotion) |
| `AgentRegistry` | Reads | Reads (verifies session) | Primary (seeds + tests) |
| `ForesightView` | Reads | Primary (assess, create, publish, backtest) | Reads |
| `PublishingView` | Primary (creates + downloads) | Primary (quality gate) | Reads |

**Single-tenant implication.** Today all three roles share the same `tenant_demo` namespace. There is no role-based access control at the API layer (see §10.1 G01). The UI MAY visually distinguish the roles (e.g. a role switcher in the header for demo purposes) but MUST NOT enforce role-based access — the backend does not support it. When the backend adds auth (post-G01), the UI role switcher becomes real.

---

## 5. Master Functional Inventory

This section is the **definitive list** of every capability the UI may surface. It is organized by the backend's 7-tier classification scheme (defined in `FUNCTIONAL_CAPABILITY_CATALOG.md §1`). The headline tier is preserved verbatim from the source; the UI implication is what the designer must do with it.

### 5.1 Tier classification (verbatim from source)

| Tier | Meaning |
|---|---|
| `IMPLEMENTED_AND_VERIFIED` | Code complete AND end-to-end tests pass. The UI may treat the capability as reliable. |
| `IMPLEMENTED_NOT_LIVE_TESTED` | Code complete, unit tests pass, but NO live API/network/LLM test was exercised in the sandbox. The UI must show a "not live-tested" badge and handle unexpected failures gracefully. |
| `PARTIALLY_IMPLEMENTED` | Some aspects work; others don't (specifically called out per capability). The UI must show the partial state honestly. |
| `CONTRACT_OR_CATALOG_ONLY` | Type/contract or catalog entry exists but no runtime behavior is wired. The UI must show a "planned" badge and disable the action button. |
| `MOCK_ONLY` | Only the mock path works; the real backend is stubbed. The UI must show a "mock" badge. |
| `NOT_IMPLEMENTED` | Declared in spec or router docstring but absent from code. The UI must NOT surface this as a feature. |
| `BLOCKED_BY_ENVIRONMENT` | Code present but blocked (needs Docker, API key, browser, Postgres+pgvector, etc.). The UI must show a "blocked" badge with the blocker reason. |

### 5.2 Capability inventory (36 capabilities)

The numbering matches `FUNCTIONAL_CAPABILITY_CATALOG.md §2`. Each row carries the headline tier from the source and a one-line UI implication. Detailed UI requirements per capability appear in §6 (pages) and §9 (API bindings).

| # | Capability | Tier (headline) | UI implication (one line) |
|---|---|---|---|
| 1 | Typed Pydantic v2 Contracts (8) | `IMPLEMENTED_AND_VERIFIED` | Call `GET /contracts/schemas` once at app boot; use it to generate TypeScript types. Never send fields not in the schema. |
| 2 | State Machines (4: Foundry / Mold / Agent / Investigation) | `IMPLEMENTED_AND_VERIFIED` | Render state badges using enum values verbatim. For the 13-state investigation machine, use a horizontal stepper. Never auto-advance — every transition requires an explicit API call. |
| 3 | Capability Registry (CRUD + embeddings) | `IMPLEMENTED_AND_VERIFIED` | 13 endpoints under `/registry`. `update_capability` is NOT implemented — the UI must use DELETE + re-POST. |
| 4 | Semantic Search (MiniLM + numpy cosine) | `IMPLEMENTED_AND_VERIFIED` | `GET /registry/search?q=...`. Each hit has `text_similarity`, `semantic_similarity`, `negative_penalty`, `matched_by`, `final_score`. |
| 5 | Multi-Capability Coverage Search (InvestigationDecomposer) | `IMPLEMENTED_AND_VERIFIED` | `GET /registry/search/coverage?q=...`. Response groups hits by `need` and includes a `gaps` list. Render as a needs × capabilities matrix with gap chips. |
| 6 | 8 Seed Capability Cards | `IMPLEMENTED_AND_VERIFIED` | `POST /registry/capabilities/seed` loads 8 cards. Cards start as `status=candidate` — promotion is an admin action. |
| 7 | SSRF Protection (validate_url + SafeHttpClient) | `IMPLEMENTED_AND_VERIFIED` | SSRF violations surface as `error="ssrf_violation:<rule>"` in FoundryCallRecord. Display verbatim — they are diagnostic. |
| 8 | OpenAlex Connector (live HTTP + retry/backoff) | `IMPLEMENTED_NOT_LIVE_TESTED` | `POST /foundry/candidates/openalex/sandbox-test` makes ONE real API call. Show the `provenance` object. Live search may rate-limit (HTTP 429). |
| 9 | Memory Curator (evidence + dedup + bitemporal) | `IMPLEMENTED_AND_VERIFIED` | 12 endpoints under `/memory`. Use `POST /memory/evidence` to ingest. Use `POST /memory/investigations/{id}/at-cutoff` for bitemporal replay. |
| 10 | Claim Attachment + Contradiction Preservation | `IMPLEMENTED_AND_VERIFIED` | On a claim detail screen, show three columns: Supporting / Refuting / Qualifying evidence. NEVER collapse into a consensus view. |
| 11 | Investigation Reuse (search_prior_memory) | `IMPLEMENTED_AND_VERIFIED` | `POST /memory/investigations/{id}/search-prior`. Each match has a `freshness` chip (fresh / stale / outdated) and `original_investigation_id`. |
| 12 | Mold Factory (Architect + Detector + Workflow) | `IMPLEMENTED_AND_VERIFIED` | `POST /mold-factory/compose` is the entry point. Response includes `is_unknown_domain`, `detected_needs[]`, `coverage[]`, `gaps[]`, `mold_recipe_id`, `is_complete`, `deliverable_type`. |
| 13 | Three-Tier Coverage (NONE / CATALOG / OPERATIONAL / VERIFIED) | `IMPLEMENTED_AND_VERIFIED` | Color-code: NONE=red, CATALOG=amber, OPERATIONAL=yellow, VERIFIED=green-with-check. This is the single most important visual signal in the Mold Factory screen. |
| 14 | Unknown-Domain Detection | `IMPLEMENTED_AND_VERIFIED` | The `detection_reasoning` string is human-readable; show it in a tooltip on the `is_unknown_domain` badge. |
| 15 | Agent Recipe Registry (save / get / list) | `IMPLEMENTED_AND_VERIFIED` | 10 endpoints under `/agents`. `PATCH /agents/recipes/{id}/promote` does NOT exist (see #35) — the UI must NOT show a "promote" button for recipes. |
| 16 | Tool Permission Resolver (recipe ∩ capability ∩ investigation) | `IMPLEMENTED_AND_VERIFIED` | The `POST /agents/sessions` response includes `granted_tools`. Show this list on the session detail page. Denied tools are not returned. |
| 17 | Ephemeral Agent Runtime (instantiate + execute) | `IMPLEMENTED_AND_VERIFIED` | 5 endpoints under `/agents/sessions`. The execute response includes `is_mock`, `provider`, `model`, `duration_ms`, `output`, `granted_tools`, `error`. ALWAYS show a "MOCK EXECUTION" badge when `is_mock=true`. |
| 18 | MockProvider (deterministic responses, is_mock=True) | `IMPLEMENTED_AND_VERIFIED` | Always check `is_mock` on the execute response. When `true`, show a prominent "MOCK EXECUTION" badge. Do NOT display mock confidence scores as if they were real LLM assessments. |
| 19 | ZAIProvider (live LLM) | `BLOCKED_BY_ENVIRONMENT` | Today every agent session will have `is_mock=true`. When the live provider is wired in (post-G02), the badge disappears — no UI changes required. Do NOT design any UI that assumes live LLM responses. |
| 20 | ToolExecutor + RegistryToolExecutor | `PARTIALLY_IMPLEMENTED` | Only 3 tools are dispatched to real services (`registry.search`, `memory.search_prior`, `foundry.search_openalex`). Others are recorded as `not_implemented`. Show 4 status icons: ✅ executed, ❌ denied, ⚠️ not_implemented, ⛔ error. |
| 21 | Forecast Policy Service (methodology + insufficient_evidence) | `IMPLEMENTED_AND_VERIFIED` | `POST /foresight/assess`. When `recommended_method == "insufficient_evidence"`, the UI must NOT show a forecast input form — display the reasoning verbatim. |
| 22 | Baseline Forecaster (naive + seasonal naive + MAE/RMSE) | `IMPLEMENTED_AND_VERIFIED` | The backtest response returns `mae`, `rmse`, `baseline_mae`, `improvement_over_baseline`. Show `improvement_over_baseline` as a percentage; negative values mean the forecast performed WORSE than the baseline. |
| 23 | Backtest Engine (bitemporal leakage prevention) | `IMPLEMENTED_AND_VERIFIED` | When `leakage_detected=true`, show a red "LEAKAGE DETECTED" banner listing the leaked evidence IDs. |
| 24 | Forecast Registry (immutable-at-publication) | `IMPLEMENTED_AND_VERIFIED` | Use `POST /foresight/forecasts/{id}/try-modify` as a regression-test demo — the response `{"modification_accepted": false}` is the expected result. For real revisions call `POST /foresight/forecasts/{id}/revise`. |
| 25 | Publishing Quality Gate (6 rules) | `IMPLEMENTED_AND_VERIFIED` | On `POST /publishing/publications`, the response includes `quality_gate_passed`, `quality_gate_issues`, `downloadable`. If `quality_gate_passed=false`, the publication is created but `downloadable=false`. Show the issues list as a modal "Why can't I download this?" before any download button. |
| 26 | Dossier Builder | `IMPLEMENTED_AND_VERIFIED` | The dossier output is in `content_json` of `GET /publishing/publications/{id}`. Each section has `title` and `content`. The `findings[]` array carries `claim_text`, `claim_type` (fact / analysis / hypothesis), `evidence_ids`, `verified`. Render findings with color-coded chips. |
| 27 | Presenter Edition Builder | `IMPLEMENTED_AND_VERIFIED` | Display `estimated_duration_minutes` as a chip. Show `uncertainty_disclosures[]` with an amber "DISCLOSURE" prefix. The cue sheet can be rendered as a table for teleprompter use. |
| 28 | Storyboard Builder (rights enforcement) | `IMPLEMENTED_AND_VERIFIED` | For each scene, render the `scene_type` as a colored chip. When `disclosure_text` is non-empty, show it as a banner below the scene. |
| 29 | Publication Registry + download API | `IMPLEMENTED_AND_VERIFIED` | 4 endpoints under `/publishing`. The download endpoint returns 404 when `downloadable=false`. The filename is auto-derived from the title. |
| 30 | Tenant Isolation (every query filtered by tenant_id) | `PARTIALLY_IMPLEMENTED` | Data-layer isolation is complete; auth-layer does NOT exist. Show a single "tenant_demo" badge in the corner. Do NOT design a tenant switcher. |
| 31 | `PgvectorEmbeddingStore` (real prod semantic search) | `MOCK_ONLY` | The UI behavior is identical whether the stub or real pgvector is active. When the deployment switches to Postgres, no UI changes are required. |
| 32 | `S3CompatibleStore` (prod object storage) | `MOCK_ONLY` | The `stored_at_ref` field on evidence items is `local://tenant_demo/<checksum>` today; in production it would be `s3://...`. Display as a "stored at" reference string without trying to fetch the URL. |
| 33 | Crossref + arXiv connectors | `CONTRACT_OR_CATALOG_ONLY` | Display Crossref and arXiv in the candidate list with a "Planned" badge — do NOT show a "Sandbox test" button for them; the API will return 422. |
| 34 | Multi-tenant authentication | `NOT_IMPLEMENTED` | Do NOT show per-user workspaces, login screens, or per-user audit logs. There is ONE tenant today. |
| 35 | `PATCH /agents/recipes/{id}/promote` (owner-approved recipe promotion) | `NOT_IMPLEMENTED` | Do NOT show a "promote" button on agent recipes. Recipe state changes today must be done via direct DB update (admin-only). |
| 36 | `GET /publishing/publications/{id}/quality-gate` | `NOT_IMPLEMENTED` | Read `quality_gate_passed` and `quality_gate_issues` from the `GET /publishing/publications/{id}` response instead. |

### 5.3 Tier roll-up (count of capabilities per tier)

| Tier | Count |
|---|---|
| `IMPLEMENTED_AND_VERIFIED` | 22 |
| `IMPLEMENTED_NOT_LIVE_TESTED` | 1 |
| `PARTIALLY_IMPLEMENTED` | 2 |
| `CONTRACT_OR_CATALOG_ONLY` | 1 |
| `MOCK_ONLY` | 2 |
| `NOT_IMPLEMENTED` | 3 |
| `BLOCKED_BY_ENVIRONMENT` | 1 |
| **Total** | **32 catalogued + 4 cross-cutting stubs/gaps = 36 entries** |

The UI surface area is bounded by the `IMPLEMENTED_AND_VERIFIED` + `IMPLEMENTED_NOT_LIVE_TESTED` + `PARTIALLY_IMPLEMENTED` tiers (25 capabilities). The other 11 entries are either invisible to the UI (mock-only stubs where the swap is transparent) or must be rendered as "planned" / "blocked" badges (catalog-only, not-implemented, blocked-by-environment).


---

## 6. Required Pages and Internal Interactions

This section defines the **minimum** page set the UI must implement. Each page lists its primary role(s), the API endpoints it calls, the data it displays, the user actions it supports, and the honest flags it must surface. Designers may add sub-pages, modals, or drawers — but may not omit anything listed here.

The page set is 9 pages, matching the existing frontend's 9 tabs but reorganized around the three roles (§4).

### 6.1 Page map (overview)

| # | Page | Primary role | Backend module |
|---|---|---|---|
| 1 | `InvestigationHome` | Researcher | `mold_factory` |
| 2 | `InvestigationWorkspace` | Researcher + Investigation Manager | `mold_factory`, `memory`, `agents`, `foresight`, `publishing` |
| 3 | `RegistryBrowser` | Factory Manager | `registry` |
| 4 | `FoundryBrowser` | Factory Manager | `foundry` |
| 5 | `MemoryExplorer` | Investigation Manager | `memory` |
| 6 | `MoldFactoryView` | Factory Manager | `mold_factory` |
| 7 | `AgentRegistry` | Factory Manager | `agents` |
| 8 | `ForesightView` | Investigation Manager | `foresight` |
| 9 | `PublishingView` | Researcher + Investigation Manager | `publishing` |

A 10th implicit surface — the global header — appears on every page and contains: the `tenant_demo` badge, the bilingual language toggle, the role switcher (visual only — no auth), and the `GET /status` banner.

### 6.2 Page 1 — InvestigationHome

**Primary role.** Researcher.

**Purpose.** The landing page. The user types a research question and submits it, kicking off the investigation pipeline.

**API calls.**

| When | Endpoint | Purpose |
|---|---|---|
| On page load | `GET /status` | Status banner (build info, capabilities count, not_implemented list). |
| On page load | `GET /discovery` | Synthetic discovery view (a clearly-labeled synthetic capability card). |
| On submit | `POST /mold-factory/compose` | Compose a temporary mold for the query. Returns `investigation_id`, `mold_recipe_id`, `is_complete`, `is_catalog_complete`, `deliverable_type`, `coverage[]`, `gaps[]`. |

**Data displayed.**

- A large text input for the query (min 10 chars, max 1000).
- A "Submit" button (disabled if query < 10 chars).
- A "Clear" button.
- The mold composition result (after submit):
  - `is_unknown_domain` flag (was this a recognized domain?).
  - `detection_reasoning` (why the mold was composed this way).
  - `detected_needs[]` — the research needs the query decomposed into.
  - `coverage[]` — for each need: the selected capability, its `coverage_level`, the `connector_ids`, the `selection_reasoning`.
  - `gaps[]` — needs with no matching capability, with `foundry_resolution` notes.
  - `is_complete` (true only if EVERY need has OPERATIONAL+ coverage).
  - `is_catalog_complete` (true if every need has CATALOG+ coverage).
  - `deliverable_type` (research_deliverable vs. coverage_blocker_report).
  - `mold_recipe_id` (the ID of the saved mold, for later inspection).

**User actions.**

| Action | Effect | Backend call |
|---|---|---|
| Type a query | Validates length (10-1000 chars). Enables/disables Submit. | None. |
| Submit | Composes the mold. Navigates to `InvestigationWorkspace` with `investigation_id` + `mold_result`. | `POST /mold-factory/compose` |
| Clear | Empties the input. | None. |

**Honest flags to surface.**

- `is_unknown_domain=true` → blue "NEW DOMAIN" badge with `detection_reasoning` tooltip.
- `is_complete=false` → amber "PARTIAL COVERAGE" banner listing the unmet needs.
- `deliverable_type="coverage_blocker_report"` → red banner explaining the investigation will produce a gap report, not a research deliverable.

### 6.3 Page 2 — InvestigationWorkspace

**Primary role.** Researcher (follows pipeline) + Investigation Manager (curates claims/edges).

**Purpose.** The active investigation view. Shows the 13-state FSM, the mold, the coverage, the gaps, the evidence, the agent sessions, the forecasts, the publications, and the audit log. Provides actions to acquire evidence, run agents, attach claims, run foresight, and publish.

**API calls (most-called endpoints).**

| When | Endpoint | Purpose |
|---|---|---|
| On tab open | `GET /mold-factory/investigations/{id}/workflow` | Fetch the workflow state (current FSM state, mold_id, blocker, transitions[]). |
| Acquire evidence | `POST /memory/evidence` | Ingest a piece of evidence (caller supplies Evidence contract + raw_content_b64). |
| Search prior memory | `POST /memory/investigations/{id}/search-prior` | Look for reusable evidence from other investigations. |
| List evidence | `GET /memory/investigations/{id}/evidence` | List all evidence items for this investigation. |
| Attach claim | `POST /memory/evidence/{id}/claims` | Attach a claim to an evidence item. |
| Add refutes edge | `POST /memory/claims/{id}/support` | Mark evidence as refuting a claim (preserves both sides). |
| Promote claim verdict | `PATCH /memory/claims/{id}/verdict` | Promote a claim's verdict (candidate → supported → contested → refuted → superseded). |
| Resolve agent | `POST /agents/resolve` | Decide if a generalist or specialist is needed. |
| Instantiate agent | `POST /agents/sessions` | Spin up an ephemeral agent session. |
| Execute agent | `POST /agents/sessions/{id}/execute` | Run the agent (calls LLM, dispatches tools). |
| Get agent result | `GET /agents/sessions/{id}` | Fetch the session's output, is_mock flag, tool_invocations. |
| Create forecast | `POST /foresight/forecasts` | Create a draft forecast. |
| Publish forecast | `POST /foresight/forecasts/{id}/publish` | Publish (immutable). |
| Run backtest | `POST /foresight/backtest` | Run a historical backtest with leakage check. |
| Create publication | `POST /publishing/publications` | Create a research dossier / presenter edition / storyboard. |
| Download publication | `GET /publishing/publications/{id}/download?format=...` | Download as JSON / Markdown / text. |
| List decisions | `GET /memory/investigations/{id}/decisions` | Show the audit log. |
| Transition state | `POST /mold-factory/investigations/{id}/transition` | Attempt a state transition (validates pre-conditions). |

**Data displayed.**

- The investigation's current FSM state (one of 13: `received`, `scoped`, `coverage_checked`, `building_capabilities`, `mold_ready`, `acquiring`, `normalizing`, `evidencing`, `forecasting_or_scenarios`, `drafting`, `verification`, `deliverable_ready`, `archived`). Plus 3 non-FSM terminal markers: `blocked`, `failed`, `terminated` (for agent sessions).
- The mold composition result (same fields as §6.2, but now the investigation is "live" — actions are enabled).
- The collected evidence (one card per evidence item: `source_id`, `observed_at`, `ingested_at`, `kind`, `content_preview`, `checksum`).
- The agent sessions (one card per session: `status`, `is_mock`, `granted_tools`, `tool_invocations`).
- The forecasts (one card per forecast: `status`, `point_estimate`, `cutoff_date`, `subsequent_revision_of`, `superseded_by`).
- The publications (one card per publication: `deliverable_type`, `quality_gate_passed`, `downloadable`).
- The audit log (decisions, transitions).

**User actions.**

| Action | Effect | Backend call(s) | Primary role |
|---|---|---|---|
| Acquire evidence | Foundry sandbox-test → ingest via memory. | `POST /foundry/candidates/{id}/sandbox-test` → `POST /memory/evidence` | Researcher |
| Run an agent | Resolve → instantiate → execute. | `POST /agents/resolve` → `POST /agents/sessions` → `POST /agents/sessions/{id}/execute` | Researcher |
| Attach a claim to evidence | Creates a `ClaimRow` with `verdict=candidate`. | `POST /memory/evidence/{id}/claims` | Investigation Manager |
| Add a refutes edge | Preserves the original claim (both sides remain). | `POST /memory/claims/{id}/support` (with `relation="refutes"`) | Investigation Manager |
| Promote a claim's verdict | Transitions through `candidate → supported → contested → refuted → superseded`. | `PATCH /memory/claims/{id}/verdict` | Investigation Manager |
| Create + publish a forecast | Draft → publish (immutable). | `POST /foresight/forecasts` → `POST /foresight/forecasts/{id}/publish` | Investigation Manager |
| Run a backtest | Historical replay with leakage check. | `POST /foresight/backtest` | Investigation Manager |
| Create + download a publication | Build → quality gate → download. | `POST /publishing/publications` → `GET /publishing/publications/{id}/download?format=...` | Researcher |
| View the audit log | Show every decision in reverse chronological order. | `GET /memory/investigations/{id}/decisions` | Investigation Manager |
| Transition state | Attempt to advance to the next FSM state. | `POST /mold-factory/investigations/{id}/transition` | Researcher |

**Honest flags to surface.**

- `is_mock=true` on every agent session (yellow "MOCK" banner + watermark — see §11.1).
- `coverage_level=CATALOG` on any need (amber chip with "no approved connector" tooltip).
- `deliverable_type="coverage_blocker_report"` (red header on the publication card).
- `quality_gate_passed=false` (red "QUALITY GATE FAILED" badge; download button disabled).
- `leakage_detected=true` on a backtest (red "LEAKAGE DETECTED" banner).
- `transitioned=false` + `blocker` field on a transition attempt (red warning icon with blocker text).

### 6.4 Page 3 — RegistryBrowser

**Primary role.** Factory Manager.

**Purpose.** Browse the capability catalog. Each capability is a card describing what you can search for and which connectors can execute that search.

**API calls.**

| When | Endpoint | Purpose |
|---|---|---|
| On tab open | `GET /registry/capabilities?limit=50` | List capabilities (with optional domain/tag/status filters). |
| On card click | `GET /registry/capabilities/{id}` | Fetch full card. |
| On search | `GET /registry/search?q=...&top_k=10` | Run the 5-stage retrieval pipeline (text + semantic + negative rerank). |
| On multi-coverage search | `GET /registry/search/coverage?q=...` | Decompose the query into research needs and report coverage gaps. |
| Promote capability | `PATCH /registry/capabilities/{id}/promote` | Admin: candidate → approved (with reviewer + rationale). |
| Seed cards | `POST /registry/capabilities/seed` | Dev helper: load the 8 seed cards (idempotent). |
| Reindex embeddings | `POST /registry/capabilities/{id}/reindex` | Regenerate embeddings after a model upgrade. |
| Add evaluation | `POST /registry/capabilities/{id}/evaluations` | Record precision/recall benchmark. |
| Add relationship | `POST /registry/capabilities/{id}/relationships` | Add edge to another capability (complements / specializes / replaces / conflicts_with). |

**Data displayed.**

- A list of capability cards, each showing:
  - `id` (e.g. `search.academic-publications`).
  - `display_name` (e.g. "Academic Publications Search").
  - `status` (candidate / approved / rejected).
  - `domains[]`, `tags[]`, `languages[]`.
  - `keywords_en[]` and `keywords_ar[]` (bilingual).
  - `positive_examples[]` and `negative_examples[]`.
  - `connector_ids[]` (empty for the seed cards; populated after the Foundry registers a connector).
  - `evaluations[]` (precision / recall / false_positive_misuse_rate).
  - `relationships[]` (complements / specializes / replaces / conflicts_with edges).

**User actions.**

| Action | Effect | Backend call | Primary role |
|---|---|---|---|
| Filter by domain, tag, status | Refines the card list. | `GET /registry/capabilities?domains=...&status=...` | Factory Manager |
| Search with a natural-language query | Runs the 5-stage retrieval pipeline. | `GET /registry/search?q=...` | All roles (read) |
| Multi-coverage search | Decomposes the query into needs; reports gaps. | `GET /registry/search/coverage?q=...` | All roles (read) |
| Click a card | Opens the detail drawer. | `GET /registry/capabilities/{id}` | All roles (read) |
| Promote a capability | Admin: candidate → approved (requires reviewer + rationale). | `PATCH /registry/capabilities/{id}/promote` | Factory Manager |
| Reindex embeddings | Regenerate embeddings after a model upgrade. | `POST /registry/capabilities/{id}/reindex` | Factory Manager |
| Seed the registry (dev) | Loads the 8 seed cards. | `POST /registry/capabilities/seed` | Factory Manager |

**Honest flags to surface.**

- `status=candidate` → gray "CANDIDATE" badge.
- `status=approved` → green "APPROVED" badge.
- `status=rejected` → red "REJECTED" badge.
- `connector_ids=[]` → amber "NO CONNECTOR" badge (means coverage_level will be CATALOG, not OPERATIONAL).

### 6.5 Page 4 — FoundryBrowser

**Primary role.** Factory Manager.

**Purpose.** Browse the source candidate catalog and run the Foundry lifecycle. Today there is ONE assessable candidate: OpenAlex. Two additional candidates (Crossref, arXiv) are catalog-only and cannot be tested.

**API calls.**

| When | Endpoint | Purpose |
|---|---|---|
| On tab open | `GET /foundry/candidates` | List all candidates (OpenAlex + Crossref + arXiv). |
| On card click | `GET /foundry/candidates/{id}` | Fetch full candidate metadata. |
| Discover | `POST /foundry/candidates/{id}/discover` | Register the source in the live registry (state=discovered). |
| Assess | `POST /foundry/candidates/{id}/assess` | Basic structural checks (state=assessed). |
| Register connector | `POST /foundry/candidates/{id}/register-connector` | Register the OpenAlex connector (state=candidate). |
| Sandbox test | `POST /foundry/candidates/{id}/sandbox-test` | Execute ONE real API call to OpenAlex. Records provenance. |
| Approve | `POST /foundry/candidates/{id}/approve` | Admin: promote to `approved` state. |
| Quarantine | `POST /foundry/candidates/{id}/quarantine` | Mark as quarantined (failed test or revoked). |

**Data displayed.**

- The candidate card showing:
  - `id`, `display_name`, `homepage`, `api_doc_url`.
  - `license` (e.g. "CC0-1.0" for OpenAlex).
  - `data_reuse_rights`, `commercial_rights`.
  - `auth_required` (false for OpenAlex polite pool).
  - `rate_limit_policy`.
  - `allowed_hosts[]` (just `api.openalex.org` today).
  - `primary_data_types[]`, `coverage_geographies[]`, `languages[]`.
  - `description`, `notes`.
  - `state` (discovered / assessed / candidate / approved / quarantined).

**User actions.**

| Action | Effect | Backend call | Primary role |
|---|---|---|---|
| Discover | Register the source. | `POST /foundry/candidates/{id}/discover` | Factory Manager |
| Assess | Run structural checks. | `POST /foundry/candidates/{id}/assess` | Factory Manager |
| Register connector | Wire up the connector code. | `POST /foundry/candidates/{id}/register-connector` | Factory Manager |
| Sandbox test | Make ONE real API call. Records provenance. | `POST /foundry/candidates/{id}/sandbox-test` | Factory Manager |
| Approve | Promote to `approved`. | `POST /foundry/candidates/{id}/approve` | Factory Manager |
| Quarantine | Mark as quarantined. | `POST /foundry/candidates/{id}/quarantine` | Factory Manager |

**Honest flags to surface.**

- For Crossref and arXiv: "PLANNED" badge. The "Sandbox test" button MUST be disabled for them — the API returns 422 (`ValidationError: No connector implementation registered for candidate 'crossref'`).
- For OpenAlex sandbox test result: show the `provenance` object (`openalex_id`, `publication_year`, `cited_by_count`).
- For OpenAlex sandbox test failure: show `error="rate_limited_after_retries"` as an amber banner with retry guidance.
- `state=quarantined` → red "QUARANTINED" badge.

### 6.6 Page 5 — MemoryExplorer

**Primary role.** Investigation Manager.

**Purpose.** Browse the cumulative knowledge memory. Filter by investigation, by source, by claim verdict, by evidence kind. Run bitemporal replay. View the audit log.

**API calls.**

| When | Endpoint | Purpose |
|---|---|---|
| List evidence | `GET /memory/investigations/{id}/evidence` | List evidence items in an investigation. |
| Get evidence | `GET /memory/evidence/{id}` | Fetch one evidence item's full payload. |
| List claims | `GET /memory/investigations/{id}/claims?verdict=...` | List claims (filterable by verdict). |
| Search prior | `POST /memory/investigations/{id}/search-prior` | Search for reusable evidence. |
| Bitemporal replay | `POST /memory/investigations/{id}/at-cutoff` | Show evidence visible at a cutoff time. |
| List decisions | `GET /memory/investigations/{id}/decisions` | The audit log. |
| Capture snapshot | `POST /memory/snapshots` | Content-addressed snapshot of a source response. |
| Record reuse | `POST /memory/investigations/{id}/reuse` | Record a reuse link with freshness assessment. |

**Data displayed.**

- Evidence cards: `id`, `source_id`, `kind`, `observed_at`, `ingested_at`, `content_preview` (truncated), `checksum`.
- Claim cards: `id`, `evidence_id`, `statement`, `verdict` (candidate / supported / contested / refuted / superseded), `independence_group`, `superseded_by`.
- Support/refute edges: `claim_id` ↔ `evidence_id` with `relation` (supports / refutes / qualifies) and `weight`.
- The audit log: every decision with `decision_type`, `actor`, `rationale`, `decided_at`.

**User actions.**

| Action | Effect | Backend call | Primary role |
|---|---|---|---|
| Filter by verdict | Refines the claim list. | `GET /memory/investigations/{id}/claims?verdict=...` | Investigation Manager |
| Open an evidence item | Shows full content + raw bytes reference. | `GET /memory/evidence/{id}` | Investigation Manager |
| Bitemporal replay | Set a cutoff, see what was known then. | `POST /memory/investigations/{id}/at-cutoff` | Investigation Manager |
| Read the audit log | Show every decision in reverse chronological order. | `GET /memory/investigations/{id}/decisions` | Investigation Manager |

**Honest flags to surface.**

- `verdict=candidate` → gray "CANDIDATE" chip.
- `verdict=supported` → green "SUPPORTED" chip.
- `verdict=contested` → amber "CONTESTED" chip (with both supporting and refuting evidence listed).
- `verdict=refuted` → red "REFUTED" chip.
- `verdict=superseded` → gray "SUPERSEDED" chip with link to the newer claim.
- `stored_at_ref` field: show as a "stored at" reference string; do NOT try to fetch the URL directly (it may be `local://` today).

### 6.7 Page 6 — MoldFactoryView

**Primary role.** Factory Manager.

**Purpose.** Browse saved mold recipes. Each mold is a recipe that says "for this kind of query, use these capabilities."

**API calls.**

| When | Endpoint | Purpose |
|---|---|---|
| On tab open | `GET /mold-factory/molds?limit=20` | List saved molds (with optional state/domain filter). |
| On card click | `GET /mold-factory/molds/{id}` | Fetch full mold recipe. |
| Promote mold | `PATCH /mold-factory/molds/{id}/promote` | Admin: temporary → reusable → maintained. |
| Archive mold | `POST /mold-factory/molds/{id}/archive` | Archive (no active execution). |
| List gaps | `GET /mold-factory/molds/{id}/gaps` | List gap analyses for a mold. |
| Get workflow | `GET /mold-factory/investigations/{id}/workflow` | Fetch the workflow state for an investigation. |
| Transition | `POST /mold-factory/investigations/{id}/transition` | Attempt a state transition (validates pre-conditions). |

**Data displayed.**

- Mold cards: `id`, `display_name`, `state` (temporary / reusable / maintained / archived), `domain`, `version`, `origin` (composed / reused), `capability_ids[]`, `last_piloted_at`.
- Gap analyses: `need`, `need_label`, `status`, `resolution_notes`, `candidate_capability_ids[]`, `foundry_candidate_id`.

**User actions.**

| Action | Effect | Backend call | Primary role |
|---|---|---|---|
| Filter by state (temporary, reusable, maintained, archived) or domain | Refines the mold list. | `GET /mold-factory/molds?state=...&domain=...` | Factory Manager |
| Promote a mold | Admin: temporary → reusable → maintained. | `PATCH /mold-factory/molds/{id}/promote` | Factory Manager |
| Archive a mold | No active execution. | `POST /mold-factory/molds/{id}/archive` | Factory Manager |
| View the gap analyses | Show unmet needs. | `GET /mold-factory/molds/{id}/gaps` | All roles (read) |

**Honest flags to surface.**

- `state=temporary` → gray "TEMPORARY" badge.
- `state=reusable` → blue "REUSABLE" badge.
- `state=maintained` → green "MAINTAINED" badge.
- `state=archived` → gray "ARCHIVED" badge (with reduced opacity).
- For each gap analysis: color-code `status` (NONE=red, CATALOG=amber, OPERATIONAL=yellow, VERIFIED=green).

### 6.8 Page 7 — AgentRegistry

**Primary role.** Factory Manager.

**Purpose.** Browse the agent recipe phone book. Each recipe is a "shift worker" definition that can be rehydrated on demand.

**API calls.**

| When | Endpoint | Purpose |
|---|---|---|
| On tab open | `GET /agents/recipes?limit=20` | List recipes (with optional specialty/state filter). |
| On card click | `GET /agents/recipes/{id}` | Fetch full recipe payload. |
| Seed clinical | `POST /agents/recipes/seed-clinical` | Load the Clinical Prosthetics Reviewer recipe. |
| Seed generalist | `POST /agents/recipes/seed-generalist` | Load the General Analyst recipe. |
| Resolve | `POST /agents/resolve` | Decide if a generalist or specialist is needed for a task. |
| Instantiate | `POST /agents/sessions` | Spin up an ephemeral session. |
| Execute | `POST /agents/sessions/{id}/execute` | Run the session (LLM + tools). |
| Terminate | `POST /agents/sessions/{id}/terminate` | Force-terminate. |
| Evaluate | `POST /agents/sessions/{id}/evaluate` | Record an evaluation. |
| Get session | `GET /agents/sessions/{id}` | Fetch session details. |

**Data displayed.**

- Recipe cards: `id`, `display_name`, `role`, `specialty`, `state` (on_demand / recipe_saved / tested / maintained), `version`, `allowed_tools[]`, `created_at`.
- Session cards (when a session exists): `id`, `recipe_id`, `status` (instantiated / running / completed / failed / terminated), `execution_mode` (mock / live_llm), `is_mock`, `granted_tools`, `task_output_json` (including `tool_invocations`).

**User actions.**

| Action | Effect | Backend call | Primary role |
|---|---|---|---|
| Seed the clinical reviewer or general analyst recipe | Loads the recipe. | `POST /agents/recipes/seed-clinical` or `POST /agents/recipes/seed-generalist` | Factory Manager |
| Resolve a task (generalist vs. specialist) | Decide which recipe to use. | `POST /agents/resolve` | Researcher (via Workspace) |
| Instantiate + execute + evaluate a session | Run the agent. | `POST /agents/sessions` → `POST /agents/sessions/{id}/execute` → `POST /agents/sessions/{id}/evaluate` | Researcher (via Workspace) |
| View session details (including the tool_invocations audit trail) | Show the execution record. | `GET /agents/sessions/{id}` | All roles (read) |

**Honest flags to surface.**

- `state=on_demand` → gray "ON-DEMAND" badge.
- `state=recipe_saved` → blue "SAVED" badge.
- `state=tested` → yellow "TESTED" badge.
- `state=maintained` → green "MAINTAINED" badge.
- `is_mock=true` on a session → yellow "MOCK" banner + watermark (see §11.1).
- For each `tool_invocations[]` entry: status icon (✅ executed / ❌ denied / ⚠️ not_implemented / ⛔ error).
- **DO NOT show a "promote" button on recipes.** The `PATCH /agents/recipes/{id}/promote` endpoint does NOT exist (§10.4).

### 6.9 Page 8 — ForesightView

**Primary role.** Investigation Manager.

**Purpose.** Create and inspect quantitative forecasts. Run backtests with bitemporal leakage prevention.

**API calls.**

| When | Endpoint | Purpose |
|---|---|---|
| Assess evidence | `POST /foresight/assess` | Decide if evidence is sufficient for a quantitative forecast. |
| Create forecast | `POST /foresight/forecasts` | Create a draft forecast. |
| Publish forecast | `POST /foresight/forecasts/{id}/publish` | Publish (immutable). |
| Revise forecast | `POST /foresight/forecasts/{id}/revise` | Create a revision (original becomes superseded). |
| Try modify | `POST /foresight/forecasts/{id}/try-modify` | Test immutability (returns false for published). |
| Run backtest | `POST /foresight/backtest` | Historical replay with leakage check. |
| Get forecast | `GET /foresight/forecasts/{id}` | Fetch a forecast. |

**Data displayed.**

- Forecast cards: `id`, `status` (draft / published / superseded), `method` (trend_ets / arima / naive_seasonal / insufficient_evidence / ...), `target`, `metric`, `unit`, `point_estimate`, `cutoff_date`, `issue_date`, `subsequent_revision_of`, `superseded_by`, `assumptions[]`, `scenarios[]`.
- Backtest result: `leakage_detected` (bool), `leaked_evidence_ids[]`, `mae`, `rmse`, `baseline_mae`, `improvement_over_baseline`, `data_points_used`, `data_cutoff_verified`.

**User actions.**

| Action | Effect | Backend call | Primary role |
|---|---|---|---|
| Assess evidence | Decide if a quantitative forecast is feasible. | `POST /foresight/assess` | Investigation Manager |
| Create a draft forecast | Create a mutable forecast. | `POST /foresight/forecasts` | Investigation Manager |
| Publish a forecast | IMMUTABLE — warn the user. | `POST /foresight/forecasts/{id}/publish` | Investigation Manager |
| Create a revision | The original is preserved as superseded. | `POST /foresight/forecasts/{id}/revise` | Investigation Manager |
| Run a backtest | Historical replay with leakage check. | `POST /foresight/backtest` | Investigation Manager |

**Honest flags to surface.**

- `method="insufficient_evidence"` → red "INSUFFICIENT EVIDENCE" badge. The UI MUST NOT show a probability distribution in this case.
- `status="published"` → green "PUBLISHED — IMMUTABLE" badge.
- `status="superseded"` → gray "SUPERSEDED" badge with link to the revision.
- `leakage_detected=true` → red "LEAKAGE DETECTED" banner listing `leaked_evidence_ids[]`.
- `improvement_over_baseline < 0` → red "WORSE THAN BASELINE" chip.
- `probability_distribution` empty when method=insufficient_evidence → do NOT render a probability chart.

### 6.10 Page 9 — PublishingView

**Primary role.** Researcher (creates + downloads) + Investigation Manager (quality gate inspection).

**Purpose.** Create downloadable publications from investigation evidence. Three output types: research dossier, presenter edition, visual storyboard.

**API calls.**

| When | Endpoint | Purpose |
|---|---|---|
| Create publication | `POST /publishing/publications` | Create a publication. |
| List publications | `GET /publishing/publications?limit=20` | List (with optional output_type filter). |
| Get publication | `GET /publishing/publications/{id}` | Fetch one publication's content. |
| Download | `GET /publishing/publications/{id}/download?format=json\|markdown\|text` | Download as a file. |

> **Note.** The route docstring mentions `GET /publishing/publications/{id}/quality-gate` but this endpoint DOES NOT EXIST (§10.4). Read `quality_gate_passed` and `quality_gate_issues` from the `GET /publishing/publications/{id}` response instead.

**Data displayed.**

- Publication cards: `id`, `title`, `output_type`, `status`, `deliverable_type` (research_deliverable vs. coverage_blocker_report), `quality_gate_passed` (bool), `quality_gate_issues[]`, `downloadable` (bool), `created_at`.
- Download buttons (Markdown / JSON / Text) — only enabled if `downloadable=true`.
- For each publication:
  - Dossier view: `findings[]` with `claim_text`, `claim_type` (fact / analysis / hypothesis), `evidence_ids`, `verified`.
  - Presenter view: `estimated_duration_minutes`, `cue_sheet[]`, `uncertainty_disclosures[]`, `editor_notes[]`.
  - Storyboard view: `scenes[]` with `scene_type`, `rights_status`, `disclosure_text`, `visual_suggestions[]`, `duration_seconds`.

**User actions.**

| Action | Effect | Backend call | Primary role |
|---|---|---|---|
| Create a publication | Choose output_type, set title. | `POST /publishing/publications` | Researcher |
| View the quality gate result | Show `quality_gate_passed` + `quality_gate_issues[]`. | (read from `GET /publishing/publications/{id}`) | Investigation Manager |
| Download in the chosen format | File download (Content-Type + Content-Disposition set). | `GET /publishing/publications/{id}/download?format=...` | Researcher |

**Honest flags to surface.**

- `deliverable_type="coverage_blocker_report"` → red "COVERAGE BLOCKER" header bar. The download button is enabled but the file is a structured gap report, not a research dossier.
- `quality_gate_passed=false` → red "QUALITY GATE FAILED" badge. The download button is disabled. Show `quality_gate_issues[]` verbatim in a modal.
- `downloadable=false` → download buttons disabled.
- For storyboard scenes:
  - `scene_type=fictional_scene` → red chip + `disclosure_text` banner.
  - `scene_type=scenario_illustration` → amber chip + `disclosure_text` banner.
  - `rights_status="unknown"` or `"restricted"` → red "RIGHTS UNCLEARED" badge.
- For presenter edition: `uncertainty_disclosures[]` shown with amber "DISCLOSURE" prefix.


---

## 7. Required UI States

Every page defined in §6 must handle the following 7 state types. Each state has a defined trigger condition grounded in a real backend response shape. Designers must produce a visual mockup for each state on each page.

### 7.1 The 7 states

| # | State | Trigger condition (backend signal) | Visual treatment |
|---|---|---|---|
| S1 | **Loading** | Any in-flight API call (request sent, no response yet). | Skeleton loader (gray rectangles) for the affected card/region. A spinner on the action button. A progress message matching the backend's stage (e.g. "Composing mold..." while `POST /mold-factory/compose` is in flight). For long-running operations (agent execution, backtest), show a progress bar with periodic status updates from polling (§12.3). |
| S2 | **Success** | HTTP 2xx response with expected payload. | Render the data normally. Apply honest-flag badges (§11) where applicable. |
| S3 | **Failure** | HTTP 4xx/5xx response OR network error. | Red banner with `error.message` (user-safe — never contains internal details). `trace_id` shown in a collapsible "details" section. A "Retry" button that re-calls the same endpoint. The investigation_id (if applicable) is preserved in the URL. |
| S4 | **Insufficient-evidence** | `POST /foresight/assess` returns `recommended_method="insufficient_evidence"`. | Amber "INSUFFICIENT EVIDENCE" banner with the `assessment_reasoning` text verbatim. The forecast creation form is HIDDEN (do not let the user create a quantitative forecast). The user may still create a forecast with `method="insufficient_evidence"` and an empty `probability_distribution` — but the UI must make clear this is an explicit refusal to fabricate, not a real forecast. |
| S5 | **Approval-required** | The action calls an admin-only endpoint (`/promote`, `/approve`, `/publish`) OR a transition that returns `transitioned=false` + `blocker`. | Confirmation modal explaining the action is irreversible (for `/publish` forecast) or admin-level (for `/promote` capability/mold, `/approve` foundry). For blocked transitions: red warning icon with the `blocker` text. The user can either retry or escalate to a Factory Manager. |
| S6 | **Source-unavailable** | `POST /foundry/candidates/{id}/sandbox-test` returns `success=false` with `error="rate_limited_after_retries"` OR `error="ssrf_violation:<rule>"` OR any other Foundry error. | Amber "SOURCE UNAVAILABLE" banner with the error string. For rate-limited OpenAlex: show retry guidance ("OpenAlex rate limit reached. The sandbox test will be retried with exponential backoff; if all retries fail, please try again later."). For SSRF violations: show the diagnostic error verbatim. The rest of the page remains functional. |
| S7 | **Investigation-complete** | `GET /mold-factory/investigations/{id}/workflow` returns `state="deliverable_ready"` OR `state="archived"`. | Green "INVESTIGATION COMPLETE" banner (for `deliverable_ready`) or gray "ARCHIVED" banner (for `archived`). The 13-state stepper shows the terminal state. For `deliverable_ready`: the download buttons on the publication card are enabled (subject to `quality_gate_passed`). For `archived`: all edit controls are read-only; the only action is "Reopen as New Investigation" (which calls `POST /mold-factory/compose` with the original query). |

### 7.2 Per-page state matrix

The matrix below specifies which states each page must handle. Every cell that says "Yes" must have a dedicated visual mockup. "N/A" means the state cannot occur on that page.

| Page | S1 Loading | S2 Success | S3 Failure | S4 Insufficient-evidence | S5 Approval-required | S6 Source-unavailable | S7 Investigation-complete |
|---|---|---|---|---|---|---|---|
| `InvestigationHome` | Yes (Submit button) | Yes (mold composed) | Yes (compose failed) | N/A | N/A | N/A | N/A |
| `InvestigationWorkspace` | Yes (each card) | Yes | Yes (with investigation_id preserved) | Yes (foresight step) | Yes (state transitions) | Yes (evidence acquisition) | Yes (`deliverable_ready` / `archived`) |
| `RegistryBrowser` | Yes (card list) | Yes | Yes (filters preserved) | N/A | Yes (promote capability) | N/A | N/A |
| `FoundryBrowser` | Yes (candidate list) | Yes | Yes | N/A | Yes (approve candidate) | Yes (sandbox test) | N/A |
| `MemoryExplorer` | Yes (evidence list) | Yes | Yes | N/A | Yes (promote claim verdict) | N/A | N/A |
| `MoldFactoryView` | Yes (mold list) | Yes | Yes | N/A | Yes (promote/archive mold) | N/A | N/A |
| `AgentRegistry` | Yes (recipe list) | Yes | Yes | N/A | N/A (no promote endpoint) | N/A | N/A |
| `ForesightView` | Yes (forecast list) | Yes | Yes | Yes (`insufficient_evidence`) | Yes (publish forecast — irreversible) | N/A | N/A |
| `PublishingView` | Yes (publication list) | Yes | Yes | N/A | N/A (creation is not admin-gated) | N/A | Yes (`deliverable_ready`) |

### 7.3 Loading state best practices

- Use skeleton loaders (gray rectangles matching the final card shape) for lists.
- Show a progress message that matches the backend's stage (e.g. "Composing mold..." while `POST /mold-factory/compose` is in flight; "Acquiring evidence..." while `POST /foundry/candidates/{id}/sandbox-test` is in flight).
- For long-running operations (agent execution, backtest), show a progress bar with periodic status updates from polling (§12.3). Poll `GET /agents/sessions/{id}` every 2 seconds while `status="running"`.
- Spinners must have `aria-label="Loading"`. Skeleton loaders must have `aria-hidden="true"` (decorative).

### 7.4 Empty state best practices

(Empty state is distinct from the 7 states above; it occurs when a list endpoint returns `[]`.)

- Always show a call-to-action button (e.g. "Seed the registry" → `POST /registry/capabilities/seed`).
- Never show an empty page with just "No data." Always explain why the data is missing and how to add it.
- For `RegistryBrowser` empty: "No capabilities match the filter. Try seeding: `POST /registry/capabilities/seed`."
- For `FoundryBrowser` empty: "No candidates in the catalog. Foundry catalog ships in G02."
- For `MemoryExplorer` empty: "No evidence in this investigation. Acquire evidence from the Foundry."
- For `MoldFactoryView` empty: "No saved molds. Submit a question to compose one."
- For `AgentRegistry` empty: "No recipes. Seed the Clinical Reviewer or General Analyst."
- For `ForesightView` empty: "No forecasts. Create one from an investigation's evidence."
- For `PublishingView` empty: "No publications. Create one from a completed investigation."

### 7.5 Partial state best practices

(Partial state occurs when the data is present but a honest flag indicates incompleteness.)

- Use the honest data quality flags (§11) to render the partial state visually distinct from a complete state.
- For example, an investigation with `is_complete=false` should have a yellow "PARTIAL" badge in the header.
- A publication with `quality_gate_passed=false` should have a red "QUALITY GATE FAILED" badge.
- An agent session with `is_mock=true` should have a yellow "MOCK" banner + watermark.

### 7.6 Error envelope (verbatim from `UI_FUNCTIONAL_HANDOFF.md §6`)

Every error response (404, 409, 422, 500, 503) is serialized into:

```json
{
  "code": "not_found",
  "message": "capability 'foo' not found",
  "details": null,
  "trace_id": "req_abc123"
}
```

| HTTP status | `code` value | Meaning |
|---|---|---|
| 404 | `not_found` | Resource does not exist (or belongs to a different tenant). |
| 409 | `conflict` | Duplicate ID, illegal state, etc. |
| 422 | `validation_error` | Pydantic contract validation failed OR business rule. |
| 500 | `internal_error` | Unhandled exception. Generic message in production. |
| 503 | `service_unavailable` | A dependency (LLM provider, OpenAlex) is unavailable. |

The UI should display `message` to the user (it's safe — no internal details leak) and log `trace_id` for support.

---

## 8. The Full User Journey

This section traces the user's experience from typing a research question to downloading a dossier. Each step maps to a backend stage documented in `INVESTIGATION_LIFECYCLE.md`. The journey has 12 steps (the owner's canonical list); the backend FSM models them as 13 states (it splits a few owner stages into sub-states for finer checkpoint hashing).

### 8.1 The 12-step journey (owner's canonical stage list)

> *Question → Investigation → Needs Analysis → Mold → Operational Source Selection → Real Evidence Acquisition → Memory → Analysis → Specialist Execution when appropriate → Foresight when appropriate → Publishing → Download.*

### 8.2 Step-by-step trace

#### Step 1 — Question (FSM state: `received`)

**User action.** The user types: "Study the future of intelligent prosthetics." in `InvestigationHome`.

**Backend call.** `POST /mold-factory/compose` with `{"query": "..."}`.

**Backend behavior.**
1. Creates an `InvestigationRow` (the MoldArchitect is the SOLE owner of investigation creation).
2. Detects whether the domain is known (existing mold matches) or unknown.
3. Decomposes the query into research needs (reuses the G01-R1 decomposer).
4. For each need, finds matching capabilities in the registry.
5. For each capability, checks the three-tier coverage (NONE / CATALOG / OPERATIONAL / VERIFIED).
6. Records operational gaps AUTOMATICALLY when a capability has no approved connector.
7. Sets `is_complete=True` ONLY when every need has OPERATIONAL+ coverage.
8. Sets `deliverable_type="coverage_blocker_report"` when operational gaps exist.

**UI behavior.** The UI receives the mold composition result and transitions to `InvestigationWorkspace` with `investigation_id` + `mold_result`.

**Honest flag.** `is_unknown_domain=true` → blue "NEW DOMAIN" badge.

#### Step 2 — Investigation / Decomposition (FSM states: `received → scoped → coverage_checked`)

**User action.** The user reviews the decomposed needs in `InvestigationWorkspace`.

**Backend behavior.** For "intelligent prosthetics," the needs might be:
- Academic literature (matches `search.academic-publications`).
- Patent landscape (matches `search.patent-intelligence`).
- Clinical trials (matches `search.clinical-trials`).
- Robotics code activity (matches `search.github-activity`).

**UI behavior.** For each need, the UI shows the `coverage_level`:
- `search.academic-publications` → OPERATIONAL (has approved OpenAlex connector).
- `search.patent-intelligence` → CATALOG (no approved connector).
- `search.clinical-trials` → CATALOG (no approved connector).
- `search.github-activity` → CATALOG (no approved connector).

The mold reports `is_complete=False` because most needs are only CATALOG-covered. The `deliverable_type` is `coverage_blocker_report`.

**Honest flag.** `coverage_level=CATALOG` → amber chip with "no approved connector" tooltip on each affected need.

#### Step 3 — Needs Analysis (FSM state: `coverage_checked`)

**User action.** The user examines the gap analysis and decides how to proceed.

**Backend behavior.** The mold reports `gaps[]` with `foundry_resolution` notes for each unmet need.

**UI behavior.** The user can:
- Proceed with the operational capabilities (just academic publications).
- Wait for the admin to add connectors for the catalog-only capabilities.
- Quarantine the investigation (it cannot proceed without more connectors).

**Honest flag.** `is_complete=false` → amber "PARTIAL COVERAGE" banner.

#### Step 4 — Mold (FSM states: `coverage_checked → mold_ready`)

**User action.** The user accepts the mold.

**Backend behavior.** The `MoldRecipeRow` is persisted with `state="temporary"`. The investigation transitions to `mold_ready`.

**UI behavior.** The UI shows the mold recipe ID and the gaps. The user can proceed to evidence acquisition.

**Honest flag.** `state=temporary` → gray "TEMPORARY" badge on the mold card.

#### Step 5 — Operational Source Selection (FSM state: `coverage_checked` sub-step)

**User action.** For each operational capability, the backend selects the approved connector. The user can manually trigger a sandbox test of the connector.

**Backend call.** `POST /foundry/candidates/{id}/sandbox-test`.

**UI behavior.** The UI shows the connector's `implementation_sha` and `status`.

**Honest flag.** Sandbox test failure → S6 (Source-unavailable) state.

#### Step 6 — Real Evidence Acquisition (FSM state: `acquiring`)

**User action.** The user clicks "Acquire Evidence."

**Backend calls.** The UI calls the OpenAlex connector's `search_works` method (via the Foundry sandbox-test endpoint), then ingests the results via `POST /memory/evidence`.

**Backend behavior.** For each evidence item:
- `observed_at` is the publication date from OpenAlex.
- `ingested_at` is the current UTC timestamp.
- `content_checksum` is the SHA-256 of the raw content.
- The `Evidence` contract is validated by Pydantic.

If OpenAlex returns 429 (rate-limited), the connector retries with exponential backoff. If all retries fail, the Foundry returns an error record (NOT a crash) and the UI shows S6 (Source-unavailable).

**UI behavior.** Show a progress bar during acquisition. Display each new evidence card as it lands.

**Honest flag.** Sandbox test `provenance` object (`openalex_id`, `publication_year`, `cited_by_count`) shown on each evidence card.

#### Step 7 — Memory (FSM states: `acquiring → normalizing → evidencing`)

**User action.** The user browses the collected evidence in `MemoryExplorer`.

**Backend behavior.** Evidence is deduplicated by `(tenant_id, content_checksum)`. The bitemporal fields are persisted.

**UI behavior.** Each evidence card shows:
- The source (OpenAlex).
- The `observed_at` / `ingested_at` timestamps.
- The `content_preview`.
- The `checksum` (for dedup verification).

The user can attach claims to evidence. A claim has a `verdict` (candidate / supported / contested / refuted / superseded). The user can add `supports`/`refutes` edges between evidence and claims. Adding a `refutes` edge does NOT delete the original evidence — both sides are preserved.

**Honest flag.** `deduplicated=true` on the ingest result → blue "DEDUPED" chip on the evidence card.

#### Step 8 — Analysis (FSM state: `evidencing`)

**User action.** The user can:
- Search prior memory for reusable evidence from other investigations.
- Record a reuse link (with freshness assessment: fresh / stale / outdated).
- Promote a claim's verdict (with a rationale and actor).
- View the audit log (every decision).

**Backend calls.**
- `POST /memory/investigations/{id}/search-prior` with the query and an optional `max_age_days`.
- `POST /memory/investigations/{id}/reuse` to record a reuse link.
- `PATCH /memory/claims/{id}/verdict` to promote a claim.
- `GET /memory/investigations/{id}/decisions` for the audit log.

**UI behavior.** The `MemoryExplorer` shows prior-evidence matches with `freshness` chips and `original_investigation_id`. The audit log is an append-only timeline.

**Honest flag.** `freshness="outdated"` → gray "OUTDATED" chip on the reuse link.

#### Step 9 — Specialist Execution (FSM state: stays in `evidencing`; optional detour)

**User action.** If the task requires specialized expertise (clinical safety assessment, patent landscape analysis, regulatory submission), the user runs an agent.

**Backend calls.**
1. `POST /agents/resolve` — the backend decides if a generalist or specialist is needed.
2. `POST /agents/sessions` — instantiate an ephemeral session with the recipe's `permitted_tools` intersected with the capability's `allowed_tools` and the investigation's constraints.
3. `POST /agents/sessions/{id}/execute` — run the session.

**Backend behavior.** The MockProvider emits one `TOOL_CALL:` line per granted tool. The runtime dispatches each through the `RegistryToolExecutor`, which:
- Returns `status="executed"` for `registry.search` and `memory.search_prior` (real DB queries).
- Returns `status="not_implemented"` for `foundry.search_openalex` (live dispatch is gated by `RUN_LIVE_TESTS=1`).
- Returns `status="denied_not_in_granted_set"` for any tool not in the granted set.

**UI behavior.** The UI must show:
- The `is_mock` flag (always true today — see §11.1).
- The `granted_tools` list.
- The `tool_invocations[]` array with each call's status.
- The `output_summary` (the LLM's text response, truncated to 500 chars).

**Honest flag.** `is_mock=true` → yellow "MOCK" banner + watermark (impossible to miss). For each tool invocation: status icon (✅ executed / ❌ denied / ⚠️ not_implemented / ⛔ error).

#### Step 10 — Foresight (FSM state: `forecasting_or_scenarios`; optional detour)

**User action.** If the evidence supports a quantitative forecast, the user can:

**Backend calls.**
1. `POST /foresight/assess` — assess evidence sufficiency. If the evidence is insufficient, the `recommended_method` is `insufficient_evidence` and the UI must NOT let the user create a quantitative forecast (state S4).
2. `POST /foresight/forecasts` — create a draft forecast. The `method="insufficient_evidence"` is allowed (and the `probability_distribution` MUST be empty).
3. `POST /foresight/forecasts/{id}/publish` — publish the forecast. This is IMMUTABLE. The UI must warn the user (state S5).
4. `POST /foresight/forecasts/{id}/revise` — create a revision (the original is preserved as superseded).
5. `POST /foresight/backtest` — run a backtest with bitemporal leakage prevention. If `leakage_detected=true`, the UI must show this prominently and the backtest FAILS.

**UI behavior.** The forecast card shows `status`, `method`, `point_estimate`, `cutoff_date`. The backtest card shows `leakage_detected`, `mae`, `rmse`, `baseline_mae`, `improvement_over_baseline`.

**Honest flags.**
- `method="insufficient_evidence"` → red "INSUFFICIENT EVIDENCE" badge. No probability chart.
- `leakage_detected=true` → red "LEAKAGE DETECTED" banner.
- `improvement_over_baseline < 0` → red "WORSE THAN BASELINE" chip.

#### Step 11 — Publishing (FSM states: `forecasting_or_scenarios → drafting → verification → deliverable_ready`)

**User action.** The user creates a publication.

**Backend calls.**
1. `POST /publishing/publications` with `output_type` (research_dossier / presenter_edition / visual_storyboard).
2. The backend builds the publication from the investigation's evidence + claims + forecasts.
3. The QualityGate validates 6 rules:
   - Rule 1: fact claim without verified evidence → rejected.
   - Rule 2: data_viz scene without verified source → rejected.
   - Rule 3: fictional scene presented as documentary → rejected.
   - Rule 4: uncalibrated forecast as confirmed probability → rejected.
   - Rule 5: third-party material without adequate rights → rejected.
   - Rule 6: coverage_blocker_report claiming research completion → rejected.
4. If any rule is violated, `quality_gate_passed=false` and `downloadable=false`. The UI shows the issues.
5. If all rules pass, `downloadable=true` and the user can download.

**UI behavior.** The publication's `deliverable_type` is either `research_deliverable` (has evidence) or `coverage_blocker_report` (no evidence collected). The UI must distinguish these visually.

**Honest flags.**
- `deliverable_type="coverage_blocker_report"` → red "COVERAGE BLOCKER" header.
- `quality_gate_passed=false` → red "QUALITY GATE FAILED" badge. Download disabled.
- For storyboard scenes: `scene_type` chips, `rights_status` badges, `disclosure_text` banners.

#### Step 12 — Download (FSM state: `deliverable_ready`; no state change)

**User action.** The user clicks one of the download buttons (Markdown / JSON / Text).

**Backend call.** `GET /publishing/publications/{id}/download?format=json|markdown|text`.

**Backend behavior.** The route handler sets `Content-Type` (`application/json`, `text/markdown`, `text/plain`) and `Content-Disposition: attachment; filename="<safe_title>.<format>"`. Arabic content is UTF-8 encoded. The download endpoint returns 404 when `downloadable=false` (i.e. quality gate failed).

**UI behavior.** The browser downloads the file. The UI shows a "Downloaded" toast.

**Honest flag.** The filename is auto-derived from the title (sanitized to alphanum + dash + underscore, max 60 chars).

#### Terminal — Archive (FSM state: `archived`)

**User action.** After download, the user can archive the investigation.

**Backend call.** `POST /mold-factory/investigations/{id}/transition` with `target_state="archived"`.

**UI behavior.** All edit controls become read-only. A gray "ARCHIVED" badge appears. The only action is "Reopen as New Investigation" (which calls `POST /mold-factory/compose` with the original query).

### 8.3 FSM state reference table (verbatim from `INVESTIGATION_LIFECYCLE.md §4`)

| # | FSM state | Must display | Must NOT display | Primary button label |
|---|---|---|---|---|
| 1 | `received` | Investigation ID + question text + tenant | Mold details (none yet) | "Save Scope & Run Needs Analysis" |
| 2 | `scoped` | Scope fields (horizon_end, geography, deliverables) | Gap analyses (none yet) | "Run Needs Analysis" |
| 3 | `coverage_checked` | Detected needs chips (color-coded by coverage_level) | Evidence items (none yet) | "Compose Mold" / "Approve Connectors" |
| 4 | `building_capabilities` | Catalog-only capabilities + Foundry candidates | Approved connectors (none yet) | "Run Sandbox Test" / "Approve Connector" |
| 5 | `mold_ready` | Mold recipe (scope, composition, plan) | Evidence items (none yet) | "Acquire Evidence" |
| 6 | `acquiring` | Live Foundry call log + sample works | — | "Send to Memory" |
| 7 | `normalizing` | Evidence list (with dedup/reuse badges) | Claims (none yet) | "Attach Claim" |
| 8 | `evidencing` | Claims list + contradictions panel + search-prior box | Forecasts (none yet) | "Run Foresight" (optional) / "Compose Dossier" |
| 9 | `forecasting_or_scenarios` | Forecast assessment + draft form (if quantitative) | Probability percentages (if insufficient) | "Publish Forecast" |
| 10 | `drafting` | Output type selector + title + scope JSON editor | Download button (not yet) | "Compose & Run Quality Gate" |
| 11 | `verification` | Quality gate result + issues list + rejected claims/scenes | Download button (not yet) | "Confirm Verified" |
| 12 | `deliverable_ready` | Publication details + 3 download buttons + preview | (nothing — all visible) | "Download JSON/Markdown/Text" + "Archive" |
| 13 | `archived` | Read-only investigation + audit log + Archived badge | Edit controls (read-only) | "Reopen as New Investigation" |

### 8.4 The coverage-blocker path (alternative journey)

When an investigation has no operational sources (all needs are CATALOG or NONE), the publication is a "Coverage Blocker Report" — a structured gap report, NOT a research deliverable. The user must understand they did NOT get a research dossier.

The path is the same as the happy path until Step 11 (Publishing), where:
- `deliverable_type="coverage_blocker_report"` (not `research_deliverable`).
- The QualityGate Rule 6 rejects any claim asserting research "completion".
- The download is still enabled (the user gets the gap report file), but the UI must make it impossible to mistake this for a research deliverable:
  - Red "COVERAGE BLOCKER" header bar on the publication card.
  - The publication title is prefixed with "[COVERAGE BLOCKER]".
  - The download filename is prefixed with `coverage_blocker_`.
  - A modal confirmation appears before the first download: "This is a Coverage Blocker Report, not a research deliverable. No evidence was collected. Continue?"


---

## 9. API Binding — Every User Action Maps to a Real Endpoint

This section is the **definitive** mapping between user actions and API endpoints. It is organized by router (10 routers, 67 endpoints total). For each endpoint, the table lists: HTTP method, path, what it returns, when to call it, the honest status (from `FUNCTIONAL_CAPABILITY_CATALOG.md`), and the UI action(s) it supports.

If an endpoint is in `FUNCTIONAL_CAPABILITY_CATALOG.md`'s NOT_IMPLEMENTED list (§10.4 of this document), it is listed here with the explicit "DO NOT CALL" notice — designers must not surface it as a feature.

### 9.1 Status Router — 2 endpoints

| # | Method | Path | Returns | When to call | Honest status | UI action |
|---|---|---|---|---|---|---|
| 1 | GET | `/status` | Service status, build info, capabilities list, not_implemented list. | On every page load (for the StatusBanner). | IMPLEMENTED_AND_VERIFIED | Header banner on every page. |
| 2 | GET | `/health` | Liveness probe. | For monitoring; not user-facing. | IMPLEMENTED_AND_VERIFIED | (none — monitoring only) |

### 9.2 Discovery Router — 1 endpoint

| # | Method | Path | Returns | When to call | Honest status | UI action |
|---|---|---|---|---|---|---|
| 3 | GET | `/discovery` | Synthetic discovery view (a clearly-labeled synthetic capability card). | On `InvestigationHome` page load. | IMPLEMENTED_AND_VERIFIED | Show synthetic card on `InvestigationHome`. |

### 9.3 Contracts Router — 1 endpoint

| # | Method | Path | Returns | When to call | Honest status | UI action |
|---|---|---|---|---|---|---|
| 4 | GET | `/contracts/schemas` | JSON Schemas for all 8 Pydantic contracts. | Once at app boot (for TypeScript codegen). | IMPLEMENTED_AND_VERIFIED | Internal (codegen); not user-facing. |

### 9.4 Registry Router — 13 endpoints

| # | Method | Path | Returns | When to call | Honest status | UI action |
|---|---|---|---|---|---|---|
| 5 | GET | `/registry/capabilities` | List of capability cards (with optional filters). | On `RegistryBrowser` load. | IMPLEMENTED_AND_VERIFIED | Render card list. |
| 6 | GET | `/registry/capabilities/{id}` | Full capability card. | On card click. | IMPLEMENTED_AND_VERIFIED | Open detail drawer. |
| 7 | POST | `/registry/capabilities` | Created capability (with auto-embedding). | Admin: create a new capability. | IMPLEMENTED_AND_VERIFIED | "Create Capability" form (Factory Manager). |
| 8 | POST | `/registry/capabilities/seed` | Loaded 8 seed cards (idempotent). | Dev helper / first run. | IMPLEMENTED_AND_VERIFIED | "Seed the registry" button. |
| 9 | PATCH | `/registry/capabilities/{id}/promote` | Promoted capability (with reviewer + rationale). | Admin: candidate → approved. | IMPLEMENTED_AND_VERIFIED | "Promote" button (Factory Manager). Requires confirmation modal (S5). |
| 10 | DELETE | `/registry/capabilities/{id}` | Deleted. | Admin: delete a capability. | IMPLEMENTED_AND_VERIFIED | "Delete" button (Factory Manager). Note: `update_capability` is NOT implemented — use DELETE + re-POST. |
| 11 | GET | `/registry/search?q=...` | 5-stage retrieval results (stage_traces, hits, gaps). | User search. | IMPLEMENTED_AND_VERIFIED | Search bar on `RegistryBrowser`. |
| 12 | GET | `/registry/search/coverage?q=...` | Coverage analysis (hits grouped by need + gaps). | Multi-need search. | IMPLEMENTED_AND_VERIFIED | "Multi-coverage search" toggle. |
| 13 | GET | `/registry/capabilities/{id}/evaluations` | List of evaluations. | On card detail. | IMPLEMENTED_AND_VERIFIED | "Evaluations" tab on detail drawer. |
| 14 | POST | `/registry/capabilities/{id}/evaluations` | Added evaluation. | Admin: record precision/recall. | IMPLEMENTED_AND_VERIFIED | "Add Evaluation" form. |
| 15 | GET | `/registry/capabilities/{id}/relationships` | List of relationships. | On card detail. | IMPLEMENTED_AND_VERIFIED | "Relationships" tab. |
| 16 | POST | `/registry/capabilities/{id}/relationships` | Added relationship. | Admin: add edge. | IMPLEMENTED_AND_VERIFIED | "Add Relationship" form. |
| 17 | POST | `/registry/capabilities/{id}/reindex` | Reindexed. | Admin: after model upgrade. | IMPLEMENTED_AND_VERIFIED | "Reindex" button. |

### 9.5 Foundry Router — 8 endpoints

| # | Method | Path | Returns | When to call | Honest status | UI action |
|---|---|---|---|---|---|---|
| 18 | GET | `/foundry/candidates` | List of all candidates (OpenAlex + Crossref + arXiv). | On `FoundryBrowser` load. | IMPLEMENTED_AND_VERIFIED | Render candidate list. Crossref/arXiv get "PLANNED" badge. |
| 19 | GET | `/foundry/candidates/{id}` | Full candidate metadata. | On card click. | IMPLEMENTED_AND_VERIFIED | Open detail drawer. |
| 20 | POST | `/foundry/candidates/{id}/discover` | Source registered (state=discovered). | Admin: start lifecycle. | IMPLEMENTED_AND_VERIFIED | "Discover" button. |
| 21 | POST | `/foundry/candidates/{id}/assess` | Assessment result (state=assessed). | Admin: structural checks. | IMPLEMENTED_AND_VERIFIED | "Assess" button. |
| 22 | POST | `/foundry/candidates/{id}/register-connector` | Connector registered (state=candidate). | Admin: wire up connector. | IMPLEMENTED_AND_VERIFIED for OpenAlex; 422 for Crossref/arXiv | "Register Connector" button (OpenAlex only). |
| 23 | POST | `/foundry/candidates/{id}/sandbox-test` | Sandbox test result (success, work_count, sample_works, error). | Admin: ONE real API call. | IMPLEMENTED_NOT_LIVE_TESTED for OpenAlex; 422 for Crossref/arXiv | "Sandbox Test" button (OpenAlex only). Show provenance. |
| 24 | POST | `/foundry/candidates/{id}/approve` | Approved (state=approved). | Admin: promote. | IMPLEMENTED_AND_VERIFIED | "Approve" button (Factory Manager, S5 confirmation). |
| 25 | POST | `/foundry/candidates/{id}/quarantine` | Quarantined. | Admin: revoke. | IMPLEMENTED_AND_VERIFIED | "Quarantine" button. |

### 9.6 Memory Router — 12 endpoints

| # | Method | Path | Returns | When to call | Honest status | UI action |
|---|---|---|---|---|---|---|
| 26 | POST | `/memory/evidence` | Ingest result (evidence_id, deduplicated, checksum). | Acquire evidence. | IMPLEMENTED_AND_VERIFIED | "Acquire Evidence" button on `InvestigationWorkspace`. |
| 27 | GET | `/memory/evidence/{id}` | Full evidence payload. | Open evidence item. | IMPLEMENTED_AND_VERIFIED | Click evidence card. |
| 28 | GET | `/memory/investigations/{id}/evidence` | List of evidence items. | On `InvestigationWorkspace` / `MemoryExplorer` load. | IMPLEMENTED_AND_VERIFIED | Render evidence list. |
| 29 | POST | `/memory/evidence/{id}/claims` | Attached claim (claim_id, verdict). | Attach a claim. | IMPLEMENTED_AND_VERIFIED | "Attach Claim" form (Investigation Manager). |
| 30 | POST | `/memory/claims/{id}/support` | Created edge (edge_id, relation). Both sides preserved. | Add a refutes/supports edge. | IMPLEMENTED_AND_VERIFIED | "Add Refutes Edge" / "Add Supports Edge" buttons. |
| 31 | PATCH | `/memory/claims/{id}/verdict` | Updated verdict. | Promote a claim's verdict. | IMPLEMENTED_AND_VERIFIED | "Promote Verdict" form (Investigation Manager, S5 confirmation). |
| 32 | GET | `/memory/investigations/{id}/claims` | List of claims (filterable by verdict). | On `MemoryExplorer` load. | IMPLEMENTED_AND_VERIFIED | Render claim list. |
| 33 | POST | `/memory/investigations/{id}/search-prior` | Reusable evidence list (with freshness chips). | Search for reusable evidence. | IMPLEMENTED_AND_VERIFIED | "Search Prior Memory" form. |
| 34 | POST | `/memory/investigations/{id}/reuse` | Recorded reuse link. | Record a reuse. | IMPLEMENTED_AND_VERIFIED | "Record Reuse" form. |
| 35 | GET | `/memory/investigations/{id}/decisions` | Audit log (decisions array, ordered by decided_at DESC). | View the audit log. | IMPLEMENTED_AND_VERIFIED | "Audit Log" tab on `MemoryExplorer`. |
| 36 | POST | `/memory/snapshots` | Captured snapshot (content-addressed). | Capture a source response snapshot. | IMPLEMENTED_AND_VERIFIED | "Capture Snapshot" form (advanced). |
| 37 | POST | `/memory/investigations/{id}/at-cutoff` | Evidence visible at a cutoff time. | Bitemporal replay. | IMPLEMENTED_AND_VERIFIED | "Bitemporal Replay" form (date picker + replay button). |

### 9.7 Mold Factory Router — 9 endpoints

| # | Method | Path | Returns | When to call | Honest status | UI action |
|---|---|---|---|---|---|---|
| 38 | POST | `/mold-factory/compose` | Mold composition result (investigation_id, mold_recipe_id, coverage, gaps, deliverable_type). | Submit a research question. | IMPLEMENTED_AND_VERIFIED | "Submit" button on `InvestigationHome`. |
| 39 | GET | `/mold-factory/molds` | List of saved molds (with optional state/domain filter). | On `MoldFactoryView` load. | IMPLEMENTED_AND_VERIFIED | Render mold list. |
| 40 | GET | `/mold-factory/molds/{id}` | Full mold recipe. | On card click. | IMPLEMENTED_AND_VERIFIED | Open detail drawer. |
| 41 | PATCH | `/mold-factory/molds/{id}/promote` | Promoted mold (temporary → reusable → maintained). | Admin: promote a mold. | IMPLEMENTED_AND_VERIFIED | "Promote" button (Factory Manager, S5 confirmation). |
| 42 | POST | `/mold-factory/molds/{id}/archive` | Archived mold. | Admin: archive. | IMPLEMENTED_AND_VERIFIED | "Archive" button (Factory Manager). |
| 43 | GET | `/mold-factory/molds/{id}/gaps` | List of gap analyses for a mold. | On card detail. | IMPLEMENTED_AND_VERIFIED | "Gap Analysis" tab. |
| 44 | POST | `/mold-factory/investigations/{id}/workflow` | Workflow state (FSM state, mold_id, blocker, transitions[]). | On `InvestigationWorkspace` load. | IMPLEMENTED_AND_VERIFIED | Render 13-state stepper. |
| 45 | POST | `/mold-factory/investigations/{id}/transition` | Transition result (transitioned bool, blocker). | Advance to next state. | IMPLEMENTED_AND_VERIFIED | "Next" button on the stepper. |
| 46 | GET | `/mold-factory/investigations/{id}/workflow` | (Same as #44 — GET variant.) | Poll for workflow state changes. | IMPLEMENTED_AND_VERIFIED | Internal (polling). |

### 9.8 Agents Router — 10 endpoints

| # | Method | Path | Returns | When to call | Honest status | UI action |
|---|---|---|---|---|---|---|
| 47 | GET | `/agents/recipes` | List of recipes. | On `AgentRegistry` load. | IMPLEMENTED_AND_VERIFIED | Render recipe list. |
| 48 | GET | `/agents/recipes/{id}` | Full recipe. | On card click. | IMPLEMENTED_AND_VERIFIED | Open detail drawer. |
| 49 | POST | `/agents/recipes/seed-clinical` | Loaded Clinical Prosthetics Reviewer recipe. | Dev helper / first run. | IMPLEMENTED_AND_VERIFIED | "Seed Clinical Reviewer" button. |
| 50 | POST | `/agents/recipes/seed-generalist` | Loaded General Analyst recipe. | Dev helper / first run. | IMPLEMENTED_AND_VERIFIED | "Seed General Analyst" button. |
| 51 | POST | `/agents/resolve` | Resolution result (needs_specialist, recommended_recipe_id). | Decide generalist vs. specialist. | IMPLEMENTED_AND_VERIFIED | "Resolve Agent" button. |
| 52 | POST | `/agents/sessions` | Session (session_id, status=instantiated, granted_tools). | Instantiate an agent. | IMPLEMENTED_AND_VERIFIED | "Instantiate" button. |
| 53 | POST | `/agents/sessions/{id}/execute` | Execution result (status=completed, is_mock, output, tool_invocations). | Run the agent. | IMPLEMENTED_AND_VERIFIED (mock path); BLOCKED_BY_ENVIRONMENT (live LLM path) | "Execute" button. Always show MOCK badge when `is_mock=true`. |
| 54 | POST | `/agents/sessions/{id}/terminate` | Terminated. | Force-terminate. | IMPLEMENTED_AND_VERIFIED | "Terminate" button. |
| 55 | POST | `/agents/sessions/{id}/evaluate` | Recorded evaluation. | Record an evaluation. | IMPLEMENTED_AND_VERIFIED | "Evaluate" form. |
| 56 | GET | `/agents/sessions/{id}` | Session details (with tool_invocations). | Poll for session status. | IMPLEMENTED_AND_VERIFIED | Internal (polling) + "Session Detail" view. |

> **Missing endpoint.** `PATCH /agents/recipes/{id}/promote` is documented in the router docstring but DOES NOT EXIST (see §10.4). DO NOT surface a "Promote Recipe" button in the UI.

### 9.9 Foresight Router — 7 endpoints

| # | Method | Path | Returns | When to call | Honest status | UI action |
|---|---|---|---|---|---|---|
| 57 | POST | `/foresight/assess` | Assessment (has_time_series, sufficient_for_quantitative, recommended_method, assessment_reasoning, data_points_before_cutoff, data_points_after_cutoff). | Assess evidence sufficiency. | IMPLEMENTED_AND_VERIFIED | "Assess Evidence" button on `ForesightView`. If `recommended_method="insufficient_evidence"`, hide the forecast form (state S4). |
| 58 | POST | `/foresight/forecasts` | Created forecast (forecast_id, status=draft, method). | Create a draft forecast. | IMPLEMENTED_AND_VERIFIED | "Create Forecast" form. |
| 59 | POST | `/foresight/forecasts/{id}/publish` | Published forecast (status=published, published_at). IMMUTABLE. | Publish a forecast (warn: irreversible). | IMPLEMENTED_AND_VERIFIED | "Publish Forecast" button (S5 confirmation). |
| 60 | POST | `/foresight/forecasts/{id}/revise` | Created revision (original becomes superseded). | Create a revision. | IMPLEMENTED_AND_VERIFIED | "Revise Forecast" button. |
| 61 | POST | `/foresight/forecasts/{id}/try-modify` | `{"modification_accepted": false}` (regression test). | Test immutability (demo). | IMPLEMENTED_AND_VERIFIED | "Try Modify" button (demo only). |
| 62 | POST | `/foresight/backtest` | Backtest result (leakage_detected, mae, rmse, baseline_mae, improvement_over_baseline, leaked_evidence_ids, data_points_used, data_cutoff_verified). | Run a backtest. | IMPLEMENTED_AND_VERIFIED | "Run Backtest" button. Show LEAKAGE banner if `leakage_detected=true`. |
| 63 | GET | `/foresight/forecasts/{id}` | Forecast details. | Fetch a forecast. | IMPLEMENTED_AND_VERIFIED | Click forecast card. |

### 9.10 Publishing Router — 4 endpoints

| # | Method | Path | Returns | When to call | Honest status | UI action |
|---|---|---|---|---|---|---|
| 64 | POST | `/publishing/publications` | Created publication (publication_id, deliverable_type, quality_gate_passed, downloadable). | Create a publication. | IMPLEMENTED_AND_VERIFIED | "Create Publication" form on `PublishingView`. |
| 65 | GET | `/publishing/publications` | List of publications (with optional output_type filter). | On `PublishingView` load. | IMPLEMENTED_AND_VERIFIED | Render publication list. |
| 66 | GET | `/publishing/publications/{id}` | Full publication content (content_json, quality_gate_passed, quality_gate_issues, downloadable). | On card click. | IMPLEMENTED_AND_VERIFIED | Open detail view. Read `quality_gate_passed` + `quality_gate_issues` from here (not a separate endpoint). |
| 67 | GET | `/publishing/publications/{id}/download?format=...` | File download (Content-Type + Content-Disposition set). | Download a publication. | IMPLEMENTED_AND_VERIFIED | Download buttons (Markdown / JSON / Text). Disabled when `downloadable=false`. |

> **Missing endpoint.** `GET /publishing/publications/{id}/quality-gate` is documented in the router docstring but DOES NOT EXIST (see §10.4). Read `quality_gate_passed` and `quality_gate_issues` from the `GET /publishing/publications/{id}` response instead.

### 9.11 Endpoint count verification

| Router | Count |
|---|---|
| status | 2 |
| discovery | 1 |
| contracts | 1 |
| registry | 13 |
| foundry | 8 |
| memory | 12 |
| mold_factory | 9 |
| agents | 10 |
| foresight | 7 |
| publishing | 4 |
| **Total** | **67** |

This matches the count in `FUNCTIONAL_CAPABILITY_CATALOG.md §11.4` (the architecture doc's claim of 73 is wrong; the actual count is 67).


---

## 10. Backend Gaps That Affect UI Design

This section catalogs every gap in `KNOWN_GAPS_AND_LIMITATIONS.md` (30 gaps total) that affects the UI. Gaps that are purely backend-internal (e.g. G20 coverage measurement, G21 load testing) are explicitly excluded with a one-line rationale.

**Per the owner's directive:** the UI design phase must not attempt to fix any of these gaps. They are documented here so the design team can:
1. Render honest "blocked" / "planned" badges where appropriate.
2. Avoid designing UI that depends on capabilities the backend doesn't have.
3. Communicate the limitation to the user through the honest-flag system (§11).

### 10.1 CRITICAL gaps (block production deployment; UI must work around)

#### G01 — Multi-tenant authentication NOT IMPLEMENTED

- **Impact.** CRITICAL.
- **What's missing.** No JWT, API key, session cookie, or multi-tenant resolver. Every router's `_resolve_tenant()` returns the hard-coded `"tenant_demo"`.
- **UI implication.** Do NOT show per-user workspaces, login screens, signup flows, or per-user audit logs. There is exactly ONE tenant today. Show a single "tenant_demo" badge in the header corner. Do NOT design a tenant switcher — when auth lands (post-G01), the UI change is local to the badge area.
- **Visual treatment.** A small "Single-tenant demo mode" footer label.

#### G02 — Live LLM NOT TESTED (ZAIProvider stub, no API key)

- **Impact.** CRITICAL.
- **What's missing.** `get_provider()` selects `MockProvider` when `MANARA_ZAI_API_KEY` is not set. Every agent execution has `is_mock=true`.
- **UI implication.** Every agent session the UI shows will have `is_mock=true`. The Clinical Prosthetics Reviewer recipe's "clinical assessment" is a deterministic mock string, NOT a real clinical evaluation. The UI MUST label this prominently (see §11.1 — banner + watermark). When the live provider is wired in (post-G02), the badge disappears — no UI changes required.
- **Visual treatment.** Yellow "MOCK" banner + diagonal "MOCK" watermark on every paragraph of every agent response.

#### G19 — Live agent execution loop NOT IMPLEMENTED

- **Impact.** CRITICAL.
- **What's missing.** The current loop is single-turn: call LLM once, parse tool calls, dispatch them, record output. It does NOT feed tool results back to the LLM for a second turn. The MockProvider emits one `TOOL_CALL:` per granted tool (deterministic, never examines args).
- **UI implication.** The agent session view shows ONE round of tool calls, not a conversation. The agent's `output_summary` is the raw text response, not a synthesized analysis. Do NOT design a chat-style turn-by-turn UI for agent sessions.
- **Visual treatment.** Single execution card per session. The `tool_invocations[]` array is a flat list, not a conversation tree.

### 10.2 HIGH gaps (limit real-world usage; UI must show honest badges)

#### G03 — Live OpenAlex search RATE-LIMITED (shared IP)

- **Impact.** HIGH.
- **UI implication.** Live sandbox tests against OpenAlex are flaky. The `POST /foundry/candidates/openalex/sandbox-test` endpoint may return `success=false, error="rate_limited_after_retries"`. The UI must show S6 (Source-unavailable) state with retry guidance.
- **Visual treatment.** Amber "SOURCE UNAVAILABLE — Rate limited" banner on the sandbox-test result card.

#### G04 — PostgreSQL + pgvector NOT TESTED (SQLite only in dev)

- **Impact.** HIGH (no UI implication — invisible to the user).
- **UI implication.** None. The backend swap from SQLite to Postgres is invisible to the UI.

#### G05 — Playwright browser E2E NOT RUN

- **Impact.** HIGH (no UI implication — testing infrastructure gap).
- **UI implication.** None directly. The UI↔API contract is verified by code review, not automated browser tests. Designers should be aware that breaking changes in endpoint shapes may not be caught by CI.

#### G06 — Docker build NOT TESTED

- **Impact.** HIGH (no UI implication — deployment infrastructure gap).
- **UI implication.** None directly.

#### G07 — PgvectorEmbeddingStore is a STUB

- **Impact.** HIGH (no UI implication — transparent swap).
- **UI implication.** The UI behavior is identical whether the stub or real pgvector is active. No UI changes required when the deployment switches to Postgres.

#### G08 — S3CompatibleStore would crash on first use (boto3 missing)

- **Impact.** HIGH (no UI implication — `LocalFilesystemStore` is used today).
- **UI implication.** The `stored_at_ref` field on evidence items is `local://tenant_demo/<checksum>` today; in production it would be `s3://...`. Display as a "stored at" reference string without trying to fetch the URL directly.

#### G09 — DNS rebinding TOCTOU (partial SSRF defense only)

- **Impact.** HIGH (no direct UI implication).
- **UI implication.** None directly. SSRF violations surface as `error="ssrf_violation:<rule>"` in FoundryCallRecord and are shown verbatim — they are diagnostic, not user-facing faults.

#### G10 — Forecast immutability is code-level only (no DB CHECK constraint)

- **Impact.** HIGH (no UI implication — backend hardening).
- **UI implication.** None. The UI already treats published forecasts as immutable (the `try-modify` endpoint returns `false`).

#### G11 — State machine invariants NOT enforced by DB CHECK constraints

- **Impact.** HIGH (no UI implication — backend hardening).
- **UI implication.** None. The UI already enforces transitions via `POST /mold-factory/investigations/{id}/transition` (which returns `transitioned=false` + `blocker` for invalid transitions).

### 10.3 MEDIUM gaps (workaround exists; UI must accommodate)

#### G12 — Foreign keys missing ON DELETE behavior

- **Impact.** MEDIUM.
- **UI implication.** Deleting a capability that's referenced by a mold leaves a dangling reference. The UI should show a warning when a Factory Manager attempts to delete a capability: "This capability is referenced by N mold(s). Deleting it will leave those molds pointing at a non-existent ID. Continue?"

#### G13 — JSON columns used for structured data

- **Impact.** MEDIUM (no UI implication — schema choice).
- **UI implication.** None directly. JSON columns work fine at the current scale.

#### G14 — No API rate limiting

- **Impact.** MEDIUM.
- **UI implication.** A misbehaving client could exhaust the DB connection pool. The UI should debounce rapid clicks (e.g. on the "Submit" button of `InvestigationHome`) and disable the button while a request is in flight.

#### G15 — No pagination on most list endpoints

- **Impact.** MEDIUM.
- **UI implication.** Most list endpoints accept `limit` and `offset` but do not return a `next_page_token`. The UI must implement client-side offset tracking. For lists > 200 items, the UI shows a "Load more" button that increments `offset` by `limit`.

#### G16 — Test suite "database is locked" under SQLite high concurrency

- **Impact.** MEDIUM (no UI implication — testing infrastructure).
- **UI implication.** None directly.

#### G18 — ToolExecutor only dispatches 3 tools

- **Impact.** MEDIUM.
- **UI implication.** An agent session that has `granted_tools=["search.academic-publications", "memory.read_prior_evidence"]` would record `status="not_implemented"` for both. The agent's output would show "I tried to call search.academic-publications but it's not implemented." The UI must show the `tool_invocations[]` array with 4 status icons (✅ executed / ❌ denied / ⚠️ not_implemented / ⛔ error) so the user understands the limitation.

#### G23 — Forecast horizons only support single cutoff (n_cutoffs=1)

- **Impact.** MEDIUM.
- **UI implication.** The forecast evaluation reports MAE/RMSE at one cutoff only. Do NOT show a "rolling-origin backtest" view. The backtest form has one cutoff date picker, not multiple.

#### G24 — Storyboard rights enforcement is in code, not in DB constraint

- **Impact.** MEDIUM (no UI implication — backend hardening).
- **UI implication.** None. The UI already shows `rights_status` badges per scene.

#### G25 — No security headers middleware

- **Impact.** MEDIUM (no UI implication — deployment concern).
- **UI implication.** None directly.

#### G26 — No CSRF protection

- **Impact.** MEDIUM (no UI implication today; will become a concern when G01 is closed).
- **UI implication.** None today.

#### G30 — No WebSocket / real-time updates (UI must poll)

- **Impact.** MEDIUM.
- **UI implication.** The UI MUST poll for long-running operations. Poll `GET /agents/sessions/{id}` every 2 seconds while `status="running"`. Poll `GET /mold-factory/investigations/{id}/workflow` every 5 seconds while a transition is in progress. Stop polling when the status becomes terminal (`completed` / `failed` / `terminated` for sessions; `deliverable_ready` / `archived` for workflows). See §12.3 for the polling contract.

### 10.4 LOW gaps / NOT_IMPLEMENTED endpoints (UI must NOT surface)

#### G17 — 8 Boolean ORM/migration type mismatches FIXED

- **Impact.** LOW (already fixed in BACKEND-VERIFICATION-01).
- **UI implication.** None. The fix is transparent.

#### G22 — No property-based testing

- **Impact.** LOW (no UI implication — testing infrastructure).
- **UI implication.** None.

#### G27 — `MANARA_SINGLE_TENANT_DEMO` flag is dead code

- **Impact.** LOW (no UI implication).
- **UI implication.** None. The flag is declared but never read.

#### G28 — No audit log viewer API for some tables

- **Impact.** LOW.
- **UI implication.** `AgentEvaluationRow`, `BacktestResultRow`, `FoundryCallRecord` are written to the DB but have no GET endpoint. The UI should NOT show "evaluation history" for a recipe or "backtest history" for a forecast. The data exists but the API is missing. Display a "Data preserved in DB; viewer coming in a future mission" message if the user looks for these views.

#### G29 — No file upload endpoint

- **Impact.** LOW.
- **UI implication.** Do NOT show a file upload widget. Evidence is ingested as a JSON `Evidence` contract with optional base64-encoded `raw_content_b64`. The UI can offer a "paste base64" textarea if the user wants to ingest a PDF (they must first convert it to base64 themselves).

#### NOT_IMPLEMENTED endpoint 1 — `PATCH /agents/recipes/{id}/promote`

- **Impact.** The router docstring lists this endpoint but the route handler is absent.
- **UI implication.** DO NOT show a "Promote Recipe" button on `AgentRegistry`. Recipe state changes today must be done via direct DB update (admin-only).

#### NOT_IMPLEMENTED endpoint 2 — `GET /publishing/publications/{id}/quality-gate`

- **Impact.** The router docstring lists this endpoint but the route handler is absent.
- **UI implication.** Read `quality_gate_passed` and `quality_gate_issues` from the `GET /publishing/publications/{id}` response instead. Do NOT add a button or link that calls the missing endpoint.

### 10.5 Excluded gaps (no UI implication)

The following gaps from `KNOWN_GAPS_AND_LIMITATIONS.md` are excluded from this section because they have no UI implication:

- **G20 — No coverage measurement.** Testing infrastructure gap; no UI implication.
- **G21 — No load testing.** Testing infrastructure gap; no UI implication.

### 10.6 Gap → UI impact roll-up

| Impact tier | # of gaps affecting UI | UI action required |
|---|---|---|
| CRITICAL | 3 (G01, G02, G19) | Honest badges + state restrictions. No login UI; always mock banner; single-turn agent view. |
| HIGH | 8 (G03, G05, G06, G07, G08, G09, G10, G11) | Mostly invisible (transparent swaps). Only G03 (OpenAlex rate-limit) requires a UI state (S6 Source-unavailable). |
| MEDIUM | 8 (G12, G13, G14, G15, G18, G23, G24, G30) | Workarounds: delete warnings, debounce, client-side pagination, tool_invocations icons, single-cutoff backtest, polling contract. |
| LOW / NOT_IMPLEMENTED | 6 (G17, G22, G27, G28, G29, + 2 missing endpoints) | Mostly "do not surface" rules. G28 requires a "viewer coming soon" message. |

---

## 11. Honest Data Quality Flag Catalog

This section is **identical** to `UI_FUNCTIONAL_HANDOFF.md §5` — no flag added, no flag removed, no semantics changed. It is reproduced here so the designer does not need to consult the source document.

Every entity in MANARA carries at least one honest flag. The UI MUST surface these flags prominently. **Never hide them.** Never design a "clean" view that suppresses them.

### 11.1 The complete flag catalog

| Flag | Where it appears | Values | What it means to the user |
|---|---|---|---|
| `is_mock` | `AgentSessionRow`, agent execution result | `true` / `false` | True = no real LLM was called. The response is a deterministic mock. **Today this is ALWAYS true.** |
| `status` (capability) | `CapabilityRow.status` | `candidate` / `approved` / `rejected` | Candidate = not yet promoted by an admin. Approved = owner-approved. Rejected = explicitly rejected. |
| `status` (forecast) | `ForecastRow.status` | `draft` / `published` / `superseded` | Draft = mutable. Published = immutable. Superseded = a revision exists. |
| `status` (agent session) | `AgentSessionRow.status` | `instantiated` / `running` / `completed` / `failed` / `terminated` | The session lifecycle. |
| `status` (publication) | `PublicationRow.status` | `draft` / `published` | Draft = not yet downloadable. Published = downloadable. |
| `coverage_level` (mold need) | `MoldCompositionResult.coverage[].coverage_level` | `NONE` / `CATALOG` / `OPERATIONAL` / `VERIFIED` | NONE = no capability card matches. CATALOG = card exists, no approved connector. OPERATIONAL = card + approved connector. VERIFIED = operational + successful sandbox test. |
| `deliverable_type` (publication) | `PublicationRow.deliverable_type` | `research_deliverable` / `coverage_blocker_report` | research_deliverable = real evidence was collected. coverage_blocker_report = no evidence (a deliberately incomplete report). |
| `quality_gate_passed` | `PublicationRow.quality_gate_passed` | `true` / `false` | True = all 6 quality gate rules passed. False = at least one rule violated. |
| `quality_gate_issues[]` | `PublicationRow.quality_gate_issues` | list of human-readable strings | The list of rule violations. Each string identifies the rule and the offending claim/scene. |
| `downloadable` | `PublicationRow.downloadable` | `true` / `false` | True = quality_gate_passed AND content is non-empty. The download button is enabled. |
| `rights_status` (storyboard scene) | `StoryboardSceneRow.rights_status` | `owned` / `licensed` / `fair_use` / `public_domain` / `unknown` / `restricted` | owned = MANARA created. licensed = third-party with cleared rights. fair_use = asserted fair use. public_domain = explicitly PD. unknown / restricted = NOT cleared for publication (QualityGate Rule 5 will reject). |
| `verdict` (claim) | `ClaimRow.verdict` | `candidate` / `supported` / `contested` / `refuted` / `superseded` | candidate = initial. supported = evidence-backed. contested = refuting evidence exists. refuted = explicitly refuted. superseded = a newer claim replaces this one. |
| `execution_mode` (agent session) | `AgentSessionRow.execution_mode` | `mock` / `live_llm` | mock = MockProvider. live_llm = ZAIProvider. Today always mock. |
| `is_unknown_domain` (mold) | `MoldCompositionResult.is_unknown_domain` | `true` / `false` | True = no existing mold matched the query; a new temporary mold was composed. |
| `is_complete` (mold) | `MoldCompositionResult.is_complete` | `true` / `false` | True ONLY when every need has OPERATIONAL+ coverage. |
| `is_catalog_complete` (mold) | `MoldCompositionResult.is_catalog_complete` | `true` / `false` | True when every need has CATALOG+ coverage (a weaker bar). |
| `leakage_detected` (backtest) | `BacktestResultRow.leakage_detected` | `true` / `false` | True = a data point's publication date is after the cutoff. The backtest FAILED. |
| `data_cutoff_verified` (backtest) | `BacktestResultRow.data_cutoff_verified` | `true` / `false` | True = no leakage detected AND the cutoff was respected. |
| `method` (forecast) | `ForecastRow.method` | `trend_ets` / `arima` / `naive_seasonal` / `insufficient_evidence` / ... | `insufficient_evidence` = the engine refused to fabricate numbers; the UI must NOT show a probability distribution. |
| `probability_distribution` | `ForecastRow.probability_distribution` | `dict` (possibly empty) | Empty when `method=insufficient_evidence`. Non-empty when method justifies a probability. |
| `deduplicated` (evidence ingest) | `IngestResult.deduplicated` | `true` / `false` | True = an existing evidence row with the same checksum was found; no new row was created. |
| `freshness` (reuse link) | `ReuseSearchResult.reusable_evidence[].freshness` | `fresh` / `stale` / `outdated` | Based on `ingested_at` + `max_age_days`. |
| `transitioned` (workflow) | `TransitionResult.transitioned` | `true` / `false` | False = pre-conditions failed; read `blocker` for the reason. |
| `blocker` (workflow) | `TransitionResult.blocker` | string or null | Human-readable reason the transition was refused. Must be surfaced in the UI. |
| `state` (foundry candidate) | `SourceRow.state` | `discovered` / `assessed` / `candidate` / `approved` / `quarantined` | The Foundry lifecycle state. |
| `state` (mold) | `MoldRecipeRow.state` | `temporary` / `reusable` / `maintained` / `archived` | The mold lifecycle state. |
| `state` (agent recipe) | `AgentRecipeRow.state` | `on_demand` / `recipe_saved` / `tested` / `maintained` / `retired` | The recipe lifecycle state. |

### 11.2 UI rendering rules

1. **`is_mock=true` MUST be visible.** Suggested rendering: a yellow warning banner above the agent's output that reads "⚠ This is a MOCK response. No real LLM was called." Plus a watermark on every paragraph of the output. The user must not be able to mistake a mock response for a real one.
2. **`status=candidate` MUST be visible.** Suggested rendering: a gray "CANDIDATE" badge next to the capability name. Approved capabilities get a green "APPROVED" badge.
3. **`coverage_level` MUST be visible per need.** Suggested rendering:

| Level | Color | Icon | Description shown to user |
|---|---|---|---|
| NONE | red | ✗ | No capability matches this need. |
| CATALOG | orange | △ | A capability card exists but no approved connector. Cannot execute. |
| OPERATIONAL | yellow | ○ | Approved connector exists. Can execute. |
| VERIFIED | green | ✓ | Connector has a successful sandbox test. Production-ready. |

4. **`deliverable_type="coverage_blocker_report"` MUST be visually distinct.** Suggested rendering: a red header bar that reads "COVERAGE BLOCKER REPORT — This is NOT a research deliverable. No evidence was collected." The download button is enabled but the file is a structured gap report, not a research dossier.
5. **`quality_gate_passed=false` MUST be visible.** Suggested rendering: a red "QUALITY GATE FAILED" badge. The list of `quality_gate_issues` is shown verbatim. The download button is disabled.
6. **`rights_status="unknown"` or `"restricted"` MUST be visible.** Suggested rendering: a red "RIGHTS UNCLEARED" badge on the storyboard scene. The QualityGate will reject publication if the scene has external source attribution.
7. **`leakage_detected=true` MUST be visible.** Suggested rendering: a red "LEAKAGE DETECTED" banner listing the `leaked_evidence_ids[]`.
8. **`method="insufficient_evidence"` MUST trigger S4 state.** Hide the forecast input form. Show the `assessment_reasoning` verbatim. Do NOT render a probability chart.
9. **`transitioned=false` MUST surface the blocker.** Red warning icon with the `blocker` text. The user can retry or escalate.
10. **`deduplicated=true` MUST be visible.** Blue "DEDUPED" chip on the evidence card. Tooltip: "An existing evidence row with the same checksum was found; no new row was created."

### 11.3 Status badge color palette (suggested)

The badges must work in both light and dark themes, and must be distinguishable by users with deuteranopia (red-green color blindness). Every badge has a color AND an icon AND a text label — never color-only.

| Badge | Color (light) | Color (dark) | Icon | Text |
|---|---|---|---|---|
| `status=candidate` (capability) | gray | gray | ○ | "CANDIDATE" |
| `status=approved` (capability) | green | green | ✓ | "APPROVED" |
| `status=rejected` (capability) | red | red | ✗ | "REJECTED" |
| `coverage_level=NONE` | red | red | ✗ | "NONE" |
| `coverage_level=CATALOG` | orange | orange | △ | "CATALOG" |
| `coverage_level=OPERATIONAL` | yellow | yellow | ○ | "OPERATIONAL" |
| `coverage_level=VERIFIED` | green | green | ✓ | "VERIFIED" |
| `is_mock=true` | yellow | yellow | ⚠ | "MOCK" |
| `quality_gate_passed=false` | red | red | ✗ | "QUALITY GATE FAILED" |
| `deliverable_type=coverage_blocker_report` | red | red | ⚠ | "COVERAGE BLOCKER" |
| `rights_status=unknown` / `restricted` | red | red | ⚠ | "RIGHTS UNCLEARED" |
| `leakage_detected=true` | red | red | ⚠ | "LEAKAGE DETECTED" |
| `method=insufficient_evidence` | amber | amber | ⚠ | "INSUFFICIENT EVIDENCE" |
| `verdict=candidate` (claim) | gray | gray | ○ | "CANDIDATE" |
| `verdict=supported` (claim) | green | green | ✓ | "SUPPORTED" |
| `verdict=contested` (claim) | amber | amber | △ | "CONTESTED" |
| `verdict=refuted` (claim) | red | red | ✗ | "REFUTED" |
| `verdict=superseded` (claim) | gray | gray | ↪ | "SUPERSEDED" |
| `state=temporary` (mold) | gray | gray | ○ | "TEMPORARY" |
| `state=reusable` (mold) | blue | blue | ◉ | "REUSABLE" |
| `state=maintained` (mold) | green | green | ✓ | "MAINTAINED" |
| `state=archived` (mold) | gray | gray | ▣ | "ARCHIVED" |
| `state=quarantined` (foundry) | red | red | ✗ | "QUARANTINED" |
| `freshness=fresh` (reuse) | green | green | ✓ | "FRESH" |
| `freshness=stale` (reuse) | amber | amber | △ | "STALE" |
| `freshness=outdated` (reuse) | gray | gray | ✗ | "OUTDATED" |
| `deduplicated=true` (evidence) | blue | blue | ◉ | "DEDUPED" |
| `transitioned=false` (workflow) | red | red | ⚠ | "BLOCKED" |
| PLANNED (Crossref/arXiv) | gray | gray | ○ | "PLANNED" |

### 11.4 The mock response watermark (mandatory treatment)

Because `is_mock=true` is universal today, the UI MUST make this impossible to miss. Suggested approach:

- A yellow banner at the top of every agent response: "⚠ MOCK RESPONSE — No real LLM was called. Do not treat this as a verified assessment."
- A diagonal "MOCK" watermark on every paragraph of the response text.
- A tooltip on the watermark explaining what mock means.
- The `is_mock` flag rendered as a yellow badge in the session card header.


---

## 12. Accessibility, Bilingual, and Polling Contracts

### 12.1 Accessibility contract

Every interactive element must be operable by:
- Keyboard only (Tab, Shift+Tab, Enter, Escape).
- Screen reader (NVDA, JAWS, VoiceOver).
- Users with low vision (high contrast, large fonts).
- Users with color blindness (status badges must NOT rely on color alone — include an icon or text label).

| Requirement | How to satisfy |
|---|---|
| Keyboard navigation | Every button, link, input has `tabindex="0"` (or implicit via semantic HTML). Use `<button>` not `<div onclick=...>`. |
| Focus indicator | Visible focus ring (CSS `:focus-visible { outline: 2px solid var(--accent); }`). |
| ARIA labels | Every icon-only button has `aria-label`. Every form input has `<label for="...">`. |
| Status badge accessibility | The `coverage_level` badge has both a color AND an icon AND a text label. Never color-only. |
| Color contrast | Text on background ≥ 4.5:1 contrast ratio (WCAG AA). Status badge colors must meet this. |
| Screen reader announcements | When a long-running operation completes, use `aria-live="polite"` to announce it. |
| Skip-to-content link | First focusable element on every page is a "Skip to main content" link (visually hidden until focused). |
| Heading hierarchy | One `<h1>` per page. Section titles are `<h2>`, subsections `<h3>`. Don't skip levels. |
| Form validation | Errors are announced via `aria-invalid="true"` on the input and `aria-describedby` pointing to the error message. |
| Loading states | Spinners have `aria-label="Loading"`. Skeleton loaders have `aria-hidden="true"` (decorative). |

### 12.2 Bilingual contract

#### 12.2.1 The contract

Every text field in the seed capability cards has both English and Arabic keywords:

```python
# from registry/seed_cards.py :: card_academic_publications()
keywords_en=["publication", "paper", "article", "journal", "preprint", ...],
keywords_ar=["منشور", "بحث علمي", "مقالة", "مجلة", "استشهاد", "مؤلف", ...],
```

The agent recipes' display names and descriptions are in English. The UI labels (tab names, button labels) should be bilingual.

#### 12.2.2 RTL/LTR switching

The frontend should support:
- LTR (left-to-right) for English content.
- RTL (right-to-left) for Arabic content.
- A language toggle in the header (globe icon).
- CSS `direction: rtl` on the body when Arabic is selected.
- Logical CSS properties (`margin-inline-start` instead of `margin-left`) so the layout flips correctly.

#### 12.2.3 Bilingual UI labels

The UI team should:
- Audit every user-visible string and ensure it has both an English and Arabic translation.
- Store the translations in a single i18n file (e.g. `frontend/src/i18n.ts`) keyed by string ID.
- Use the user's browser language as the default, with a manual toggle.

#### 12.2.4 Embedding model supports both

The embedding model (`paraphrase-multilingual-MiniLM-L12-v2`) handles both English and Arabic. A query in Arabic will match capabilities whose Arabic keywords overlap. The UI search box should accept both scripts. No special handling needed; the backend tokenizes both.

### 12.3 Polling contract (no WebSocket)

There is no WebSocket endpoint. The API is purely HTTP request-response. Long-running operations require polling.

| Operation | Endpoint to poll | Poll interval | Stop condition |
|---|---|---|---|
| Agent session execution | `GET /agents/sessions/{id}` | 2 seconds | `status` becomes `completed` / `failed` / `terminated` |
| Workflow transition | `GET /mold-factory/investigations/{id}/workflow` | 5 seconds | `state` becomes the target state OR `transitioned=false` + `blocker` |
| Foundry sandbox test | (synchronous — no polling) | — | The `POST /foundry/candidates/{id}/sandbox-test` call returns when done (may take 1-10 seconds for OpenAlex) |
| Backtest | (synchronous — no polling) | — | The `POST /foresight/backtest` call returns when done (may take 1-5 seconds) |

**Polling best practices.**

- Use exponential backoff for the agent session poll: 2s, 2s, 2s, 4s, 4s, 8s, 8s, max 30s. (The agent execution is usually fast — the MockProvider returns in milliseconds — but the live LLM path would take longer.)
- Show a progress bar with periodic status updates.
- Cap at 5 minutes total; if the operation is still running, show "operation timed out" with a retry button.
- Stop polling immediately when the stop condition is met (don't waste requests).

---

## 13. Open Design Questions Deferred to the Visual Design Phase

These are design decisions the backend team has deferred to the UI/UX visual design phase. There is no right answer; the design team's input is needed. Each question is grounded in a real backend signal — the designer is choosing how to render the signal, not whether to render it.

### Q1. How to surface the `coverage_level` of a mold?

**Context.** A mold has multiple needs, each with one of four coverage levels (NONE / CATALOG / OPERATIONAL / VERIFIED). The user needs to understand at a glance whether their mold can execute.

**Backend signals available.**
- `MoldCompositionResult.coverage[]` — one entry per need, with `coverage_level` enum.
- `MoldCompositionResult.is_complete` — true ONLY when every need has OPERATIONAL+ coverage.
- `MoldCompositionResult.is_catalog_complete` — true when every need has CATALOG+ coverage.

**Options for the designer.**
- (a) A single aggregate badge on the mold card showing the WORST level across all needs (e.g. "CATALOG" if any need is only catalog-covered).
- (b) A per-need badge list (more verbose but more informative).
- (c) A traffic-light icon (red/orange/yellow/green) next to each need.
- (d) A heatmap matrix (needs × capabilities, colored by coverage).

**What we need from the designer.** A recommendation + a mockup. Consider both the mold card list view (compact) and the mold detail view (verbose).

### Q2. How to handle the `coverage_blocker_report` deliverable type?

**Context.** When an investigation has no operational sources, the publication is a "coverage blocker report" — a structured gap report, NOT a research deliverable. The user must understand they did NOT get a research dossier.

**Backend signals available.**
- `PublicationRow.deliverable_type` — `research_deliverable` vs. `coverage_blocker_report`.
- `PublicationRow.quality_gate_passed` — usually `true` for blocker reports (the gate's Rule 6 only rejects claims asserting "completion"; a blocker report that honestly says "no evidence" passes the gate).
- `PublicationRow.downloadable` — `true` (the user can download the gap report).

**Options for the designer.**
- (a) A completely different layout: red header, "COVERAGE BLOCKER" in the title, gap list as the body.
- (b) Same layout as a research dossier but with a red "COVERAGE BLOCKER" banner at the top.
- (c) A modal that explains the situation before showing the report.
- (d) A separate tab in the `PublishingView` for coverage blockers.

**What we need from the designer.** A recommendation. The risk is that a user mistakes a coverage blocker report for a research deliverable and shares it externally. The UI must make this mistake impossible.

### Q3. How to present `tool_invocations` in the agent session view?

**Context.** Every agent execution records a `tool_invocations[]` array with one entry per tool call. Each entry has: `tool_name`, `arguments`, `status` (executed / denied_not_in_granted_set / not_implemented / error), `result`, `error`, `timestamp`.

**Backend signals available.**
- `AgentSessionRow.task_output_json.tool_invocations[]` — the full array.
- `AgentSessionRow.granted_tools` — the granted set (tools in this list may or may not appear in `tool_invocations[]`).

**Options for the designer.**
- (a) A collapsible list (one row per invocation, expandable to show arguments + result).
- (b) A timeline (chronological, with status icons).
- (c) A table (columns: tool_name, status, duration, error).
- (d) A tree (group by status: executed / denied / not_implemented / error).

**What we need from the designer.** A recommendation. Consider that the user needs to:
- Quickly see how many tools were called.
- Identify denied / errored calls.
- Drill into the arguments and results.
- Understand the chronological order.

### Q4. How to warn users when an agent response `is_mock=true`?

**Context.** Today every agent response is mock. The user must not mistake a mock for a real LLM response.

**Backend signals available.**
- `AgentSessionRow.is_mock` — always `true` today.
- `AgentSessionRow.execution_mode` — `"mock"` today; `"live_llm"` when G02 is closed.
- The MockProvider's output text already includes a "WARNING: This is a MOCK response" banner in the response body.

**Options for the designer.**
- (a) A yellow banner at the top of the response.
- (b) A diagonal "MOCK" watermark on every paragraph.
- (c) A modal that requires the user to acknowledge the mock before viewing the response.
- (d) A separate "mock responses" tab that's visually distinct from the (future) "live responses" tab.
- (e) All of the above (banner + watermark + badge).

**What we need from the designer.** A recommendation. The constraint is that the warning must be impossible to miss but must not be so aggressive that it makes the mock response unusable for demonstration purposes.

### Q5. How to handle the bilingual content?

**Context.** Every seed card has both English and Arabic keywords. The UI labels are bilingual. The agent recipes are in English only.

**Backend signals available.**
- `CapabilityRow.keywords_en[]` and `keywords_ar[]` — always both present on seed cards.
- `CapabilityRow.display_name` — English only.
- `AgentRecipeRow.display_name` and `description` — English only.

**Options for the designer.**
- (a) A language toggle in the header. Default to the user's browser language.
- (b) Always show both languages side-by-side (more verbose).
- (c) Show the user's preferred language with a "show original" toggle for the other language.
- (d) Auto-detect from the query (Arabic query → Arabic UI).

**What we need from the designer.** A recommendation. Consider that the user might be bilingual and want to switch back and forth.

### Q6. How to show the audit log?

**Context.** The audit log (`GET /memory/investigations/{id}/decisions`) is an append-only list of decisions. Each decision has: `decision_type`, `evidence_id`, `claim_id`, `actor`, `rationale`, `decided_at`, `payload`.

**Backend signals available.**
- `MemoryDecisionRow[]` — the full audit log, ordered by `decided_at DESC`.
- Each row has `decision_type` (e.g. `evidence_deduplicated`, `claim_promoted`, `evidence_quarantined`, `transition_recorded`).

**Options for the designer.**
- (a) A reverse-chronological list (newest first), one card per decision.
- (b) A timeline visualization (horizontal, with milestones).
- (c) A table (columns: time, type, actor, rationale).
- (d) A filterable list (filter by `decision_type`, `actor`).

**What we need from the designer.** A recommendation. The audit log can grow to hundreds of entries for a long investigation; the UI must handle this gracefully.

### Q7. How to handle the polling for long-running operations?

**Context.** There is no WebSocket. The UI must poll `GET /agents/sessions/{id}` and `GET /mold-factory/investigations/{id}/workflow` periodically.

**Backend signals available.**
- `AgentSessionRow.status` — `instantiated` / `running` / `completed` / `failed` / `terminated`.
- `InvestigationWorkflow.state` — the 13 FSM states.
- `TransitionResult.transitioned` — bool.
- `TransitionResult.blocker` — string or null.

**Options for the designer.**
- (a) Poll every 2 seconds, indefinitely.
- (b) Poll every 2 seconds for the first 30 seconds, then every 10 seconds.
- (c) Exponential backoff (2s, 4s, 8s, 16s, max 30s).
- (d) Poll until a timeout (5 minutes), then show "operation timed out."

**What we need from the designer.** A recommendation. Considerate of server load vs. user experience.

### Q8. How to present the bitemporal replay?

**Context.** `POST /memory/investigations/{id}/at-cutoff` returns the evidence visible at a specific cutoff time. The user can scrub through time and see what MANARA knew at each point.

**Backend signals available.**
- `EvidenceItemRow.ingested_at` — when MANARA learned of the evidence.
- `EvidenceItemRow.observed_at` — when the event happened.
- `EvidenceItemRow.published_at` — when the source published it.
- `MemoryCurator.get_evidence_at_cutoff(investigation_id, cutoff)` — returns the subset.

**Options for the designer.**
- (a) A date picker + a "replay" button that shows the evidence visible at that date.
- (b) A scrubber (horizontal slider) over a timeline.
- (c) A "time travel" mode that re-renders the entire UI as of a chosen date.

**What we need from the designer.** A recommendation. The feature is powerful but might confuse users who don't understand bitemporal semantics.

### Q9. How to visualize the 13-state investigation stepper?

**Context.** The investigation FSM has 13 states. The user needs to see where they are in the journey at a glance.

**Backend signals available.**
- `InvestigationWorkflow.state` — the current state (one of 13).
- `InvestigationWorkflow.transitions[]` — the history of transitions (append-only).
- `TransitionResult.transitioned` — bool.
- `TransitionResult.blocker` — string or null.

**Options for the designer.**
- (a) A horizontal stepper with 13 nodes, color-coded by visited / current / future.
- (b) A vertical timeline (more vertical real estate, easier to label).
- (c) A circular/radial layout (visually distinct but harder to scan).
- (d) A compact "current state + next 2 states" view with a "show full journey" expander.

**What we need from the designer.** A recommendation. The 13-state journey is the backbone of the `InvestigationWorkspace`; the visualization must be both compact (for the workspace header) and complete (for the audit view).

### Q10. How to render the 4 tool-invocation statuses distinctly?

**Context.** Each tool invocation has one of 4 statuses: `executed`, `denied_not_in_granted_set`, `not_implemented`, `error`. The user needs to identify each at a glance.

**Backend signals available.**
- `ToolInvocation.status` — enum.
- `ToolInvocation.error` — string (only for `error` status).
- `ToolInvocation.result` — dict (only for `executed` status).

**Options for the designer.**
- (a) Color + icon + text label (the §11.3 default).
- (b) A single icon with a tooltip.
- (c) A status pill with a tooltip.

**What we need from the designer.** A recommendation. The 4 statuses have different severities (executed = ok, denied = security event, not_implemented = honest gap, error = exception). The visual treatment should reflect severity without being overwhelming.

---

## 14. Acceptance Checklist for the Visual Design Phase

Before the visual design phase begins, the design team must confirm the following. This checklist is the operational equivalent of §1 (Acceptance Criteria for this Deliverable) but written for the designer, not the backend reviewer.

### 14.1 Designer's pre-flight checklist

- [ ] I have read this document end-to-end at least once.
- [ ] I understand the "do not invent" rule (§0.1) and will escalate any missing feature to the backend team rather than invent it.
- [ ] I have read §3.2 (What the UI must NOT be) and will not design any of the listed forbidden features.
- [ ] I have read §5 (Master Functional Inventory) and confirmed that every page, action, and badge I plan to design is traceable to a capability in §5.2.
- [ ] I have read §6 (Required Pages) and confirmed that my page set covers all 9 pages (§6.1).
- [ ] I have read §7 (Required UI States) and produced a mockup for every "Yes" cell in the §7.2 state matrix.
- [ ] I have read §8 (The Full User Journey) and confirmed that my design supports all 12 steps + the terminal archive state.
- [ ] I have read §9 (API Binding) and confirmed that every user action in my design binds to a real endpoint in §9.1–§9.10. No action binds to a NOT_IMPLEMENTED endpoint.
- [ ] I have read §10 (Backend Gaps) and confirmed that my design accommodates every gap marked "UI implication" without attempting to fix the gap.
- [ ] I have read §11 (Honest Data Quality Flag Catalog) and confirmed that every flag in §11.1 is visible in my design with the rendering rules in §11.2.
- [ ] I have read §12 (Accessibility, Bilingual, Polling) and confirmed that my design meets the accessibility contract (§12.1), the bilingual contract (§12.2), and the polling contract (§12.3).
- [ ] I have read §13 (Open Design Questions) and have a recommendation for each of the 10 questions, with a mockup where requested.
- [ ] I understand that single-tenant demo mode means there are no user accounts (§10.1 G01) and I will not design login/signup screens.
- [ ] I understand that every agent response today is mock (§10.1 G02) and I will make the `is_mock=true` warning impossible to miss.
- [ ] I understand that there is no WebSocket (§10.3 G30) and I will design polling-based progress indicators.

### 14.2 Page-by-page design checklist

For each of the 9 pages (§6.1), confirm:

- [ ] The page has a clear primary role (Researcher / Investigation Manager / Factory Manager).
- [ ] The page calls only the endpoints listed in its §6 section.
- [ ] The page surfaces every honest flag listed in its §6 "Honest flags to surface" subsection.
- [ ] The page handles every state marked "Yes" in its §7.2 row.
- [ ] The page's user actions are all bound to real endpoints in §9.
- [ ] The page's empty state has a call-to-action button (§7.4).
- [ ] The page's partial state uses honest flags (§7.5).
- [ ] The page's error state shows `error.message` + `trace_id` (§7.6).

### 14.3 Final design deliverable checklist

The visual design phase produces:

- [ ] A mockup for each of the 9 pages (§6.1).
- [ ] A mockup for every "Yes" cell in the §7.2 state matrix (≈45 mockups).
- [ ] A recommendation + mockup for each of the 10 open questions in §13.
- [ ] A bilingual (EN/AR) mockup for at least one page (to validate the RTL/LTR switching).
- [ ] A high-fidelity mockup of the `is_mock=true` watermark treatment (§11.4) — this is the most important honest flag.
- [ ] A high-fidelity mockup of the `coverage_blocker_report` visual treatment (§11.2 rule 4) — this is the second most important honest flag.

---

## 15. Change Log

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | 2026-10-19 | GLM (Implementer) | Initial submission. Consolidates `FINAL_MASTER_REPORT.md`, `FUNCTIONAL_CAPABILITY_CATALOG.md`, `UI_FUNCTIONAL_HANDOFF.md`, `API_REFERENCE.md`, `INVESTIGATION_LIFECYCLE.md`, `KNOWN_GAPS_AND_LIMITATIONS.md` into a single UI/UX design foundation. |

---

## 16. Final Notes

1. **Read §5 (Master Functional Inventory) first.** Every capability the UI may surface is there. If it's not in §5, it doesn't exist.
2. **Read §10 (Backend Gaps) second.** Do not design features that depend on capabilities the backend doesn't have.
3. **Use the 12-step user journey (§8) as your acceptance criteria.** Every UI flow you design should be traceable to one of those 12 steps. If a flow doesn't map to a step, the backend probably doesn't support it.
4. **Answer the 10 open questions in §13.** The backend team needs your input on these design decisions before the next iteration.
5. **Poll, don't subscribe.** There is no WebSocket today. Long-running operations require polling. See §12.3.
6. **Be bilingual from day one.** Every user-visible string should have both English and Arabic translations. The backend supports both; the UI must too.
7. **Be accessible from day one.** Keyboard navigation, ARIA labels, color-blind-safe badges. See §12.1.
8. **When in doubt, ask.** The backend team is available. The `API_REFERENCE.md` is the source of truth for endpoint shapes; the `BACKEND_ARCHITECTURE.md` is the source of truth for the data model. If a UI design seems to require something not in those docs, it probably doesn't exist yet.

This document is the contract between the backend team and the UI/UX design team. Any change to the backend that affects the UI contract MUST update this document concurrently. The verification checklist in §14 should be re-run on every visual design iteration.

— **GLM (Implementer), 2026-10-19**

