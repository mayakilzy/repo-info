# MANARA Backend — UI Functional Handoff

> **Audience.** A UI/UX design team that has NEVER worked on the MANARA
> backend. Read this document once and you should be able to design
> every screen the backend supports, know exactly what API call to make
> for each user action, and understand every honest data quality flag
> you must surface to the user.
>
> **Scope.** This is the single source of truth for the UI↔API contract.
> You should NOT need to read any prior session transcript, GitHub
> issue, or code file to design the UI. Everything you need is here or
> in the companion files referenced inline.
>
> **Companion files (read these when referenced, not before).**
> - `BACKEND_ARCHITECTURE.md` — full data model and module map.
> - `INVESTIGATION_LIFECYCLE.md` — the 13-state investigation FSM
>   (this document summarizes the parts you need; only consult the
>   full doc if you need transition-level detail).
> - `API_REFERENCE.md` — every endpoint, every parameter, every response
>   shape (this document summarizes the 20 most important endpoints;
>   consult the full reference for the rest).
> - `FUNCTIONAL_CAPABILITY_CATALOG.md` — what each module actually does.
> - `SECURITY_RELIABILITY_REPORT.md` — what's enforced, what isn't.
> - `KNOWN_GAPS_AND_LIMITATIONS.md` — every known limitation.
>
> **Code source.** `backend/src/manara/` (Python 3.12, FastAPI, SQLAlchemy).
> **Frontend source.** `frontend/src/` (React + Vite + TypeScript).
> **Doc status.** Generated 2026-10-19 by reading the actual code.

---

## 1. What is MANARA?

### 1.1 Plain-English explanation

MANARA — **the Adaptive Intelligence Factory** — is a research
intelligence backend that takes a natural-language research question
("study the future of intelligent prosthetics") and produces an
evidence-backed, downloadable research dossier. It is **not** a
chatbot. It is **not** a search engine. It is a structured pipeline
that:

1. **Discovers** external data sources (academic publishers, patent
   offices, clinical trial registries, statistical agencies) and
   catalogs them in a **Foundry**.
2. **Catalogues** searchable capabilities over those sources in a
   **Registry** — each capability card describes *what you can
   search for* and *which connectors can execute that search*.
3. **Composes** investigation **Molds** from those capabilities — a
   mold is a recipe that says "for this question, use these three
   search engines, expect these data types, and report these gaps."
4. **Spins up** ephemeral specialist **Agents** (a clinical reviewer,
   a patent analyst, a general analyst) to extract evidence from the
   mold's sources. Agents are short-lived: they execute one task,
   record the result, and terminate. Their recipe is preserved for
   future rehydration.
5. **Curates** evidence in a cumulative **Memory** — every evidence
   item, every claim, every contradiction, every measure. Memory is
   tenant-scoped, deduplicated by checksum, and bitemporal (it
   distinguishes *when the event happened* from *when we learned of it*
   from *when the source published it*).
6. **Forecasts** quantitative outcomes with **bitemporal safety** —
   a published forecast is immutable; revisions create new records
   that link back to the original. Backtests refuse to use data that
   wasn't available at the simulation cutoff.
7. **Publishes** the evidence into downloadable **Dossiers**
   (research reports), **Presenter Editions** (3-5 minute media
   scripts), and **Visual Storyboards** (scene-by-scene visual plans).
   Every claim links back to the evidence ID it came from. Every
   fictional scene is explicitly labeled as fictional.

### 1.2 Why it exists

The world has too many "AI research assistants" that fabricate
citations, hallucinate statistics, and produce polished deliverables
with no provenance. MANARA is the opposite: it refuses to fabricate
numbers when evidence is insufficient, it preserves contradictions
rather than resolving them silently, and every published claim can be
traced back to the exact source row in the cumulative memory.

The system is **tenant-scoped**: every row in every table carries a
`tenant_id`. In the current deployment this is single-tenant
(`tenant_demo`), but the schema is designed for multi-tenant
onboarding as a configuration flip.

### 1.3 What the UI is NOT

- **Not a chatbot.** There is no free-text conversation with an LLM.
  The "agent session" executes one bounded task, records the result,
  and terminates.
- **Not a search box.** Typing a query kicks off a structured pipeline
  (mold composition → evidence acquisition → analysis → publishing).
  The UI must show the pipeline progress, not a search results page.
- **Not a content management system.** There is no rich-text editor.
  Publications are generated from evidence by the backend; the UI
  displays them and offers downloads.
- **Not a personalization engine.** There are no user accounts, no
  saved searches, no per-user preferences (see §7 "What's NOT in the
  backend").

---

## 2. User Personas

The UI must serve four personas. Today all four share a single
tenant (`tenant_demo`); in the future each persona will be a distinct
authenticated user with role-based permissions.

### 2.1 The Researcher

> **Goal.** Ask a research question and get an evidence-backed answer.

**What they do:**
- Type a natural-language query into the InvestigationHome.
- Watch the mold composition result (which capabilities match).
- Trigger evidence acquisition (which sources get queried).
- Browse the collected evidence in the MemoryExplorer.
- Read the generated dossier.

**What they need to see:**
- The coverage_level of each need in the mold (NONE / CATALOG /
  OPERATIONAL / VERIFIED — see §5).
- The is_mock flag on agent responses (every response today is mock).
- The deliverable_type of the publication (research_deliverable vs.
  coverage_blocker_report).

### 2.2 The Reviewer

> **Goal.** Validate the evidence behind a published claim.

**What they do:**
- Browse the MemoryExplorer for a specific investigation.
- Open an evidence item, read its content_preview, check its source.
- Attach a `refutes` edge to a claim they disagree with (the original
  claim is preserved, marked as `contested`).
- Promote a claim's verdict (candidate → supported → contested →
  refuted → superseded) with a rationale.
- Verify that the audit log captures every decision.

**What they need to see:**
- The full audit log (every claim promotion, every contradiction).
- The bitemporal timestamps (observed_at, ingested_at, published_at).
- The rights_status of every storyboard scene they're asked to
  approve.

### 2.3 The Publisher

> **Goal.** Turn an investigation's evidence into a downloadable
> deliverable.

**What they do:**
- Trigger the publishing pipeline for a completed investigation.
- Choose the output type (research_dossier / presenter_edition /
  visual_storyboard).
- Review the QualityGate result (6 rejection rules).
- Download the publication in JSON, Markdown, or plain text.

**What they need to see:**
- The `quality_gate_passed` flag and the list of `quality_gate_issues`.
- The `deliverable_type` (research_deliverable vs.
  coverage_blocker_report).
- The `downloadable` flag (true only if quality gate passed).

### 2.4 The Admin

> **Goal.** Manage capabilities, sources, molds, and agent recipes.

**What they do:**
- Promote a capability from `candidate` to `approved` (with a
  reviewer name + rationale).
- Approve a foundry source after sandbox testing.
- Promote a mold from `temporary` to `reusable` to `maintained`.
- Promote an agent recipe from `on_demand` to `recipe_saved`.
- Publish a forecast (immutable once published).

**What they need to see:**
- The current state of every entity (candidate / approved / etc.).
- The promotion history (ApprovalRow, transitions_json, etc.).
- The audit log of every decision.

---

## 3. The 9 UI Sections That Exist Today

The frontend (`frontend/src/App.tsx`) currently has 9 tabs. Each maps
to one or more API endpoints. This section documents each: what it
calls, what it displays, what user actions are valid.

### 3.1 InvestigationHome

> **Tab name:** `home`
> **What it is:** The landing page. The user types a research question
> here and submits it.

**API calls:**
| When | Endpoint | Purpose |
|------|----------|---------|
| On submit | `POST /mold-factory/compose` | Compose a temporary mold for the query. Returns `investigation_id`, `mold_recipe_id`, `is_complete`, `is_catalog_complete`, `deliverable_type`, `coverage[]`, `gaps[]`. |
| On page load | `GET /status` | Show the StatusBanner (build info, capabilities count). |
| On page load | `GET /discovery` | Show the synthetic discovery view (a clearly-labeled synthetic capability card). |

**What it displays:**
- A large text input for the query (min 10 chars, max 1000).
- A "Submit" button (disabled if query < 10 chars).
- The mold composition result:
  - `is_unknown_domain` flag (was this a recognized domain?).
  - `detection_reasoning` (why the mold was composed this way).
  - `detected_needs[]` — the research needs the query decomposed into.
  - `coverage[]` — for each need: the selected capability, its
    coverage_level, the connector_ids, the selection_reasoning.
  - `gaps[]` — needs with no matching capability, with the
    foundry_resolution notes.
  - `is_complete` (true only if EVERY need has OPERATIONAL+ coverage).
  - `is_catalog_complete` (true if every need has CATALOG+ coverage).
  - `deliverable_type` (research_deliverable vs. coverage_blocker_report).
  - `mold_recipe_id` (the ID of the saved mold, for later inspection).

**Valid user actions:**
- Type a query (≥10 chars).
- Submit (calls `POST /mold-factory/compose`).
- After submission, the app navigates to InvestigationWorkspace with
  the returned `investigation_id` and `mold_result`.

**ASCII mockup:**
```
┌─ InvestigationHome ──────────────────────────────────────────┐
│                                                              │
│  MANARA · منارة                                              │
│  Adaptive Intelligence Factory                               │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Ask a research question...                             │  │
│  │ (min 10 chars, max 1000)                               │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  [ Submit ]   [ Clear ]                                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 InvestigationWorkspace

> **Tab name:** `workspace`
> **What it is:** The active investigation view. After the user
> submits a query, this tab shows the mold, the coverage, the gaps,
> and provides actions to acquire evidence, run agents, and publish.

**API calls:**
| When | Endpoint | Purpose |
|------|----------|---------|
| On tab open | `GET /mold-factory/investigations/{id}/workflow` | Fetch the workflow state (current FSM state, mold_id, blocker, transitions[]). |
| Acquire evidence | `POST /memory/evidence` | Ingest a piece of evidence (caller supplies the Evidence contract + raw_content_b64). |
| Search prior memory | `POST /memory/investigations/{id}/search-prior` | Look for reusable evidence from other investigations. |
| List evidence | `GET /memory/investigations/{id}/evidence` | List all evidence items for this investigation. |
| Attach claim | `POST /memory/evidence/{id}/claims` | Attach a claim to an evidence item. |
| Add refutes edge | `POST /memory/claims/{id}/support` | Mark evidence as refuting a claim (preserves both sides). |
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

**What it displays:**
- The investigation's current state (one of 13 FSM states: `received`,
  `decomposing`, `mold_composed`, `selecting_sources`, `acquiring`,
  `analyzing`, `specialist_running`, `foresight`, `publishing`,
  `completed`, `blocked`, `failed`, `archived`).
- The mold composition result (same fields as §3.1, but now the
  investigation is "live" — actions are enabled).
- The collected evidence (one card per evidence item, with source_id,
  observed_at, ingested_at, kind).
- The agent sessions (one card per session, with status, is_mock,
  granted_tools, tool_invocations).
- The forecasts (one card per forecast, with status, point_estimate,
  cutoff_date, subsequent_revision_of).
- The publications (one card per publication, with deliverable_type,
  quality_gate_passed, downloadable).
- The audit log (decisions, transitions).

**Valid user actions:**
- Acquire evidence (calls the Foundry sandbox-test endpoint, then
  ingests the result via `POST /memory/evidence`).
- Run an agent (resolve → instantiate → execute).
- Attach a claim to evidence.
- Add a refutes edge (preserves the original claim).
- Promote a claim's verdict.
- Create + publish a forecast.
- Run a backtest.
- Create + download a publication.
- View the audit log.

**ASCII mockup:**
```
┌─ InvestigationWorkspace ─────────────────────────────────────┐
│ ● تحقيق نشط · Active Investigation                            │
│   "Study the future of intelligent prosthetics"  (✓ complete)│
│                                                              │
│  STATE: mold_composed → acquiring                            │
│  Investigation ID: inv-abc12345                              │
│  Mold ID: mold-xyz78910                                      │
│                                                              │
│  ┌─ Coverage ─────────────────────────────────────────────┐  │
│  │ Need: academic literature                              │  │
│  │   → search.academic-publications  [OPERATIONAL]        │  │
│  │ Need: patent landscape                                 │  │
│  │   → search.patent-intelligence   [CATALOG]             │  │
│  │     ⚠ No approved connector (coverage blocker)         │  │
│  │ Need: clinical trials                                  │  │
│  │   → search.clinical-trials        [OPERATIONAL]        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌─ Evidence (3) ────────────────────────────────────────┐    │
│  │ ev-001  OpenAlex  2024-06-01  quote                   │    │
│  │ ev-002  OpenAlex  2024-06-15  dataset                 │    │
│  │ ev-003  OpenAlex  2024-07-01  quote                   │    │
│  └────────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─ Agent Sessions (1) ─────────────────────────────────┐    │
│  │ session-abc  Clinical Prosthetics Reviewer           │    │
│  │   status: completed  ·  is_mock: true  ⚠             │    │
│  │   granted_tools: [registry.search, memory.search_*]  │    │
│  │   tool_invocations: 2 (executed: 2)                   │    │
│  └────────────────────────────────────────────────────────┘   │
│                                                              │
│  [ Acquire Evidence ]  [ Run Agent ]  [ Publish ]           │
└──────────────────────────────────────────────────────────────┘
```

### 3.3 RegistryBrowser

> **Tab name:** `registry`
> **What it is:** Browse the capability catalog. Each capability is
> a card describing *what you can search for* and *which connectors
> can execute that search*.

**API calls:**
| When | Endpoint | Purpose |
|------|----------|---------|
| On tab open | `GET /registry/capabilities?limit=50` | List capabilities (with optional domain/tag/status filters). |
| On card click | `GET /registry/capabilities/{id}` | Fetch full card. |
| On search | `GET /registry/search?q=...&top_k=10` | Run the 5-stage retrieval pipeline (text + semantic + negative rerank). |
| On multi-coverage search | `GET /registry/search/coverage?q=...` | Decompose the query into research needs and report coverage gaps. |
| Promote capability | `PATCH /registry/capabilities/{id}/promote` | Admin: candidate → approved (with reviewer + rationale). |
| Seed cards | `POST /registry/capabilities/seed` | Dev helper: load the 8 seed cards (idempotent). |
| Reindex embeddings | `POST /registry/capabilities/{id}/reindex` | Regenerate embeddings after a model upgrade. |

**What it displays:**
- A list of capability cards, each showing:
  - `id` (e.g. `search.academic-publications`).
  - `display_name` (e.g. "Academic Publications Search").
  - `status` (candidate / approved / rejected).
  - `domains[]`, `tags[]`, `languages[]`.
  - `keywords_en[]` and `keywords_ar[]` (bilingual).
  - `positive_examples[]` and `negative_examples[]`.
  - `connector_ids[]` (empty for the seed cards; populated after the
    Foundry registers a connector for the source).
  - `evaluations[]` (precision / recall / false_positive_misuse_rate).
  - `relationships[]` (complements / specializes / replaces /
    conflicts_with edges to other capabilities).

**Valid user actions:**
- Filter by domain, tag, status.
- Search with a natural-language query.
- Click a card to see the full detail.
- Promote a capability (admin only — see §5 honest flags).
- Reindex embeddings (after a model upgrade).

### 3.4 FoundryBrowser

> **Tab name:** `foundry`
> **What it is:** Browse the source candidate catalog. Today there
> is ONE candidate: OpenAlex. More candidates will arrive in future
> missions.

**API calls:**
| When | Endpoint | Purpose |
|------|----------|---------|
| On tab open | `GET /foundry/candidates` | List all candidates (just OpenAlex today). |
| On card click | `GET /foundry/candidates/{id}` | Fetch full candidate metadata. |
| Discover | `POST /foundry/candidates/{id}/discover` | Register the source in the live registry (state=discovered). |
| Assess | `POST /foundry/candidates/{id}/assess` | Basic structural checks (state=assessed). |
| Register connector | `POST /foundry/candidates/{id}/register-connector` | Register the OpenAlex connector (state=candidate). |
| Sandbox test | `POST /foundry/candidates/{id}/sandbox-test` | Execute ONE real API call to OpenAlex. Records provenance. |
| Approve | `POST /foundry/candidates/{id}/approve` | Admin: promote to `approved` state. |
| Quarantine | `POST /foundry/candidates/{id}/quarantine` | Mark as quarantined (failed test or revoked). |

**What it displays:**
- The candidate card showing:
  - `id`, `display_name`, `homepage`, `api_doc_url`.
  - `license` (e.g. "CC0-1.0" for OpenAlex).
  - `data_reuse_rights`, `commercial_rights`.
  - `auth_required` (false for OpenAlex polite pool).
  - `rate_limit_policy`.
  - `allowed_hosts[]` (just `api.openalex.org` today).
  - `primary_data_types[]`, `coverage_geographies[]`, `languages[]`.
  - `description`, `notes`.

**Valid user actions:**
- Discover → Assess → Register connector → Sandbox test → Approve
  (the full Foundry lifecycle).
- Quarantine at any point if the source misbehaves.

### 3.5 MemoryExplorer

> **Tab name:** (currently part of InvestigationWorkspace; the
> standalone browser is a future enhancement)
> **What it is:** Browse the cumulative knowledge memory. Filter by
> investigation, by source, by claim verdict, by evidence kind.

**API calls:**
| When | Endpoint | Purpose |
|------|----------|---------|
| List evidence | `GET /memory/investigations/{id}/evidence` | List evidence items in an investigation. |
| Get evidence | `GET /memory/evidence/{id}` | Fetch one evidence item's full payload. |
| List claims | `GET /memory/investigations/{id}/claims?verdict=...` | List claims (filterable by verdict). |
| Search prior | `POST /memory/investigations/{id}/search-prior` | Search for reusable evidence. |
| Bitemporal replay | `POST /memory/investigations/{id}/at-cutoff` | Show evidence visible at a cutoff time. |
| List decisions | `GET /memory/investigations/{id}/decisions` | The audit log. |
| Capture snapshot | `POST /memory/snapshots` | Content-addressed snapshot of a source response. |

**What it displays:**
- Evidence cards: id, source_id, kind, observed_at, ingested_at,
  content_preview (truncated), checksum.
- Claim cards: id, evidence_id, statement, verdict (candidate /
  supported / contested / refuted / superseded), independence_group,
  superseded_by.
- Support/refute edges: claim_id ↔ evidence_id with relation (supports
  / refutes / qualifies) and weight.
- The audit log: every decision with decision_type, actor, rationale,
  decided_at.

**Valid user actions:**
- Filter by verdict.
- Open an evidence item to see its full content.
- Bitemporal replay (set a cutoff, see what was known then).
- Read the audit log.

### 3.6 MoldFactoryView

> **Tab name:** `molds`
> **What it is:** Browse saved mold recipes. Each mold is a recipe
> that says "for this kind of query, use these capabilities."

**API calls:**
| When | Endpoint | Purpose |
|------|----------|---------|
| On tab open | `GET /mold-factory/molds?limit=20` | List saved molds (with optional state/domain filter). |
| On card click | `GET /mold-factory/molds/{id}` | Fetch full mold recipe. |
| Promote mold | `PATCH /mold-factory/molds/{id}/promote` | Admin: temporary → reusable → maintained. |
| Archive mold | `POST /mold-factory/molds/{id}/archive` | Archive (no active execution). |
| List gaps | `GET /mold-factory/molds/{id}/gaps` | List gap analyses for a mold. |
| Get workflow | `GET /mold-factory/investigations/{id}/workflow` | Fetch the workflow state for an investigation. |
| Transition | `POST /mold-factory/investigations/{id}/transition` | Attempt a state transition (validates pre-conditions). |

**What it displays:**
- Mold cards: id, display_name, state (temporary / reusable /
  maintained / archived), domain, version, origin (composed / reused),
  capability_ids[], last_piloted_at.
- Gap analyses: need, need_label, status, resolution_notes,
  candidate_capability_ids[], foundry_candidate_id.

**Valid user actions:**
- Filter by state (temporary, reusable, maintained, archived) or domain.
- Promote a mold (admin only).
- Archive a mold.
- View the gap analyses.

### 3.7 AgentRegistry

> **Tab name:** `agents`
> **What it is:** Browse the agent recipe phone book. Each recipe is
> a "shift worker" definition that can be rehydrated on demand.

**API calls:**
| When | Endpoint | Purpose |
|------|----------|---------|
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

**What it displays:**
- Recipe cards: id, display_name, role, specialty, state (on_demand /
  recipe_saved / tested / maintained), version, allowed_tools[],
  created_at.
- Session cards (when a session exists): id, recipe_id, status
  (instantiated / running / completed / failed / terminated),
  execution_mode (mock / live_llm), is_mock, granted_tools,
  task_output_json (including tool_invocations).

**Valid user actions:**
- Seed the clinical reviewer or general analyst recipe.
- Resolve a task (generalist vs. specialist).
- Instantiate + execute + evaluate a session.
- View session details (including the tool_invocations audit trail).

### 3.8 ForesightView

> **Tab name:** `foresight`
> **What it is:** Create and inspect quantitative forecasts. Run
> backtests with bitemporal leakage prevention.

**API calls:**
| When | Endpoint | Purpose |
|------|----------|---------|
| Assess evidence | `POST /foresight/assess` | Decide if evidence is sufficient for a quantitative forecast. |
| Create forecast | `POST /foresight/forecasts` | Create a draft forecast. |
| Publish forecast | `POST /foresight/forecasts/{id}/publish` | Publish (immutable). |
| Revise forecast | `POST /foresight/forecasts/{id}/revise` | Create a revision (original becomes superseded). |
| Try modify | `POST /foresight/forecasts/{id}/try-modify` | Test immutability (returns false for published). |
| Run backtest | `POST /foresight/backtest` | Historical replay with leakage check. |
| Get forecast | `GET /foresight/forecasts/{id}` | Fetch a forecast. |

**What it displays:**
- Forecast cards: id, status (draft / published / superseded), method
  (trend_ets / arima / naive_seasonal / ... / insufficient_evidence),
  target, metric, unit, point_estimate, cutoff_date, issue_date,
  subsequent_revision_of, superseded_by, assumptions[], scenarios[].
- Backtest result: leakage_detected (bool), leaked_evidence_ids[],
  mae, rmse, baseline_mae, improvement_over_baseline,
  data_points_used, data_cutoff_verified.

**Valid user actions:**
- Assess evidence (decide if a quantitative forecast is feasible).
- Create a draft forecast.
- Publish a forecast (immutable — the UI should warn the user that
  this action is irreversible).
- Create a revision (the original is preserved as superseded).
- Run a backtest (the UI must show leakage_detected prominently).

### 3.9 PublishingView

> **Tab name:** `publishing`
> **What it is:** Create downloadable publications from investigation
> evidence. Three output types: research dossier, presenter edition,
> visual storyboard.

**API calls:**
| When | Endpoint | Purpose |
|------|----------|---------|
| Create publication | `POST /publishing/publications` | Create a publication. |
| List publications | `GET /publishing/publications?limit=20` | List (with optional output_type filter). |
| Get publication | `GET /publishing/publications/{id}` | Fetch one publication's content. |
| Download | `GET /publishing/publications/{id}/download?format=json\|markdown\|text` | Download as a file. |
| Quality gate | `GET /publishing/publications/{id}/quality-gate` | Fetch the quality gate result. |

**What it displays:**
- Publication cards: id, title, output_type, status, deliverable_type
  (research_deliverable vs. coverage_blocker_report),
  quality_gate_passed (bool), quality_gate_issues[], downloadable
  (bool), created_at.
- Download buttons (Markdown / JSON / Text) — only enabled if
  `downloadable=true`.

**Valid user actions:**
- Create a publication (choose output_type, set title).
- View the quality gate result.
- Download in the chosen format.

---

## 4. The Investigation Journey

This is what the user sees, step by step, from typing a question to
downloading a dossier. Each step maps to a backend stage documented
in `INVESTIGATION_LIFECYCLE.md`.

### Step 1: Question (state: `received`)

The user types: "Study the future of intelligent prosthetics."

The UI calls `POST /mold-factory/compose` with the query. The backend:
1. Creates an `InvestigationRow` (the MoldArchitect is the SOLE owner
   of investigation creation).
2. Detects whether the domain is known (existing mold matches) or
   unknown.
3. Decomposes the query into research needs (reuses the G01-R1
   decomposer).
4. For each need, finds matching capabilities in the registry.
5. For each capability, checks the three-tier coverage (NONE / CATALOG
   / OPERATIONAL / VERIFIED).
6. Records operational gaps AUTOMATICALLY when a capability has no
   approved connector.
7. Sets `is_complete=True` ONLY when every need has OPERATIONAL+
   coverage.
8. Sets `deliverable_type="coverage_blocker_report"` when operational
   gaps exist.

The UI receives the mold composition result and transitions to the
InvestigationWorkspace tab.

### Step 2: Decomposition (state: `decomposing` → `mold_composed`)

The workspace shows the decomposed needs. For "intelligent prosthetics,"
the needs might be:
- Academic literature (matches `search.academic-publications`).
- Patent landscape (matches `search.patent-intelligence`).
- Clinical trials (matches `search.clinical-trials`).
- Robotics code activity (matches `search.github-activity`).

For each need, the UI shows the coverage_level:
- `search.academic-publications` → OPERATIONAL (has approved OpenAlex
  connector).
- `search.patent-intelligence` → CATALOG (no approved connector — the
  EPO/Google Patents connector is not yet built).
- `search.clinical-trials` → CATALOG (no approved connector — the
  ClinicalTrials.gov connector is not yet built).
- `search.github-activity` → CATALOG (no approved connector).

The mold reports `is_complete=False` because most needs are only
CATALOG-covered. The deliverable_type is `coverage_blocker_report`.

### Step 3: Mold (state: `mold_composed`)

The UI shows the mold recipe ID and the gaps. The user can:
- Proceed with the operational capabilities (just academic publications).
- Wait for the admin to add connectors for the catalog-only
  capabilities.
- Quarantine the investigation (it cannot proceed without more
  connectors).

### Step 4: Operational Source Selection (state: `selecting_sources`)

For each operational capability, the backend selects the approved
connector. The UI shows the connector's `implementation_sha` and
`status`. The user can manually trigger a sandbox test of the connector
via `POST /foundry/candidates/{id}/sandbox-test`.

### Step 5: Real Evidence Acquisition (state: `acquiring`)

The user clicks "Acquire Evidence." The UI calls the OpenAlex
connector's `search_works` method (via the Foundry sandbox-test
endpoint), then ingests the results via `POST /memory/evidence`.

For each evidence item:
- `observed_at` is the publication date from OpenAlex.
- `ingested_at` is the current UTC timestamp.
- `content_checksum` is the SHA-256 of the raw content.
- The `Evidence` contract is validated by Pydantic.

If OpenAlex returns 429 (rate-limited), the connector retries with
exponential backoff. If all retries fail, the Foundry returns an error
record (NOT a crash) and the UI shows a gap message.

### Step 6: Memory (state: `acquiring` → `analyzing`)

The user browses the collected evidence in the MemoryExplorer. Each
evidence card shows:
- The source (OpenAlex).
- The observed_at / ingested_at timestamps.
- The content_preview.
- The checksum (for dedup verification).

The user can attach claims to evidence. A claim has a verdict
(candidate / supported / contested / refuted / superseded). The user
can add supports/refutes edges between evidence and claims. Adding a
`refutes` edge does NOT delete the original evidence — both sides are
preserved.

### Step 7: Analysis (state: `analyzing`)

The user can:
- Search prior memory for reusable evidence from other investigations.
- Record a reuse link (with freshness assessment: fresh / stale /
  outdated).
- Promote a claim's verdict (with a rationale and actor).
- View the audit log (every decision).

### Step 8: Specialist Execution (state: `specialist_running`)

If the task requires specialized expertise (clinical safety assessment,
patent landscape analysis, regulatory submission), the user runs an
agent:

1. `POST /agents/resolve` — the backend decides if a generalist or
   specialist is needed.
2. `POST /agents/sessions` — instantiate an ephemeral session with
   the recipe's `permitted_tools` intersected with the capability's
   `allowed_tools` and the investigation's constraints.
3. `POST /agents/sessions/{id}/execute` — run the session.

The MockProvider emits one `TOOL_CALL:` line per granted tool. The
runtime dispatches each through the `RegistryToolExecutor`, which:
- Returns `status="executed"` for `registry.search` and
  `memory.search_prior` (real DB queries).
- Returns `status="not_implemented"` for `foundry.search_openalex`
  (live dispatch is gated by `RUN_LIVE_TESTS=1`).
- Returns `status="denied_not_in_granted_set"` for any tool not in
  the granted set.

The UI must show:
- The is_mock flag (always true today — see §5).
- The granted_tools list.
- The tool_invocations[] array with each call's status.
- The output_summary (the LLM's text response, truncated to 500 chars).

### Step 9: Foresight (state: `foresight`)

If the evidence supports a quantitative forecast, the user can:
1. `POST /foresight/assess` — assess evidence sufficiency. If the
   evidence is insufficient, the recommended_method is
   `insufficient_evidence` and the UI must NOT let the user create a
   quantitative forecast.
2. `POST /foresight/forecasts` — create a draft forecast. The
   `method="insufficient_evidence"` is allowed (and the
   `probability_distribution` MUST be empty).
3. `POST /foresight/forecasts/{id}/publish` — publish the forecast.
   This is IMMUTABLE. The UI must warn the user.
4. `POST /foresight/forecasts/{id}/revise` — create a revision (the
   original is preserved as superseded).
5. `POST /foresight/backtest` — run a backtest with bitemporal leakage
   prevention. If `leakage_detected=true`, the UI must show this
   prominently and the backtest FAILS.

### Step 10: Publishing (state: `publishing` → `completed` or `blocked`)

The user creates a publication:
1. `POST /publishing/publications` with output_type
   (research_dossier / presenter_edition / visual_storyboard).
2. The backend builds the publication from the investigation's evidence
   + claims + forecasts.
3. The QualityGate validates 6 rejection rules:
   - Rule 1: fact claim without verified evidence → rejected.
   - Rule 2: data_viz scene without verified source → rejected.
   - Rule 3: fictional scene presented as documentary → rejected.
   - Rule 4: uncalibrated forecast as confirmed probability → rejected.
   - Rule 5: third-party material without adequate rights → rejected.
   - Rule 6: coverage_blocker_report claiming research completion →
     rejected.
4. If any rule is violated, `quality_gate_passed=false` and
   `downloadable=false`. The UI shows the issues.
5. If all rules pass, `downloadable=true` and the user can download
   via `GET /publishing/publications/{id}/download?format=json|markdown|text`.

The publication's `deliverable_type` is either `research_deliverable`
(has evidence) or `coverage_blocker_report` (no evidence collected).
The UI must distinguish these visually.

---

## 5. Honest Data Quality Flags

Every entity in MANARA carries at least one honest flag. The UI MUST
surface these flags prominently. **Never hide them.** Never design a
"clean" view that suppresses them.

### 5.1 The complete flag catalog

| Flag                                  | Where it appears                                       | Values                                                          | What it means to the user |
|---------------------------------------|--------------------------------------------------------|-----------------------------------------------------------------|---------------------------|
| `is_mock`                             | AgentSessionRow, agent execution result                | `true` / `false`                                                | True = no real LLM was called. The response is a deterministic mock. **Today this is ALWAYS true.** |
| `status` (capability)                 | CapabilityRow.status                                    | `candidate` / `approved` / `rejected`                           | Candidate = not yet promoted by an admin. Approved = owner-approved. Rejected = explicitly rejected. |
| `status` (forecast)                  | ForecastRow.status                                      | `draft` / `published` / `superseded`                             | Draft = mutable. Published = immutable. Superseded = a revision exists. |
| `status` (agent session)              | AgentSessionRow.status                                  | `instantiated` / `running` / `completed` / `failed` / `terminated` | The session lifecycle. |
| `status` (publication)                | PublicationRow.status                                   | `draft` / `published`                                            | Draft = not yet downloadable. Published = downloadable. |
| `coverage_level` (mold need)         | MoldCompositionResult.coverage[].coverage_level         | `NONE` / `CATALOG` / `OPERATIONAL` / `VERIFIED`                  | NONE = no capability card matches. CATALOG = card exists, no approved connector. OPERATIONAL = card + approved connector. VERIFIED = operational + successful sandbox test. |
| `deliverable_type` (publication)      | PublicationRow.deliverable_type                         | `research_deliverable` / `coverage_blocker_report`              | research_deliverable = real evidence was collected. coverage_blocker_report = no evidence (a deliberately incomplete report). |
| `quality_gate_passed`                | PublicationRow.quality_gate_passed                      | `true` / `false`                                                | True = all 6 quality gate rules passed. False = at least one rule violated. |
| `quality_gate_issues[]`              | PublicationRow.quality_gate_issues                      | list of human-readable strings                                  | The list of rule violations. Each string identifies the rule and the offending claim/scene. |
| `downloadable`                        | PublicationRow.downloadable                              | `true` / `false`                                                | True = quality_gate_passed AND content is non-empty. The download button is enabled. |
| `rights_status` (storyboard scene)    | StoryboardSceneRow.rights_status                        | `owned` / `licensed` / `fair_use` / `public_domain` / `unknown` / `restricted` | owned = MANARA created. licensed = third-party with cleared rights. fair_use = asserted fair use. public_domain = explicitly PD. unknown / restricted = NOT cleared for publication (QualityGate Rule 5 will reject). |
| `verdict` (claim)                     | ClaimRow.verdict                                        | `candidate` / `supported` / `contested` / `refuted` / `superseded` | candidate = initial. supported = evidence-backed. contested = refuting evidence exists. refuted = explicitly refuted. superseded = a newer claim replaces this one. |
| `execution_mode` (agent session)      | AgentSessionRow.execution_mode                          | `mock` / `live_llm`                                              | mock = MockProvider. live_llm = ZAIProvider. Today always mock. |
| `is_unknown_domain` (mold)            | MoldCompositionResult.is_unknown_domain                 | `true` / `false`                                                | True = no existing mold matched the query; a new temporary mold was composed. |
| `is_complete` (mold)                  | MoldCompositionResult.is_complete                       | `true` / `false`                                                | True ONLY when every need has OPERATIONAL+ coverage. |
| `is_catalog_complete` (mold)          | MoldCompositionResult.is_catalog_complete               | `true` / `false`                                                | True when every need has CATALOG+ coverage (a weaker bar). |
| `leakage_detected` (backtest)         | BacktestResultRow.leakage_detected                      | `true` / `false`                                                | True = a data point's publication date is after the cutoff. The backtest FAILED. |
| `data_cutoff_verified` (backtest)     | BacktestResultRow.data_cutoff_verified                  | `true` / `false`                                                | True = no leakage detected AND the cutoff was respected. |
| `method` (forecast)                  | ForecastRow.method                                      | `trend_ets` / `arima` / `naive_seasonal` / `insufficient_evidence` / ... | `insufficient_evidence` = the engine refused to fabricate numbers; the UI must NOT show a probability distribution. |
| `probability_distribution`            | ForecastRow.probability_distribution                    | `dict` (possibly empty)                                         | Empty when method=insufficient_evidence. Non-empty when method justifies a probability. |

### 5.2 UI rendering rules

1. **`is_mock=true` MUST be visible.** Suggested rendering: a
   yellow warning banner above the agent's output that reads "⚠ This
   is a MOCK response. No real LLM was called." Plus a watermark
   on every paragraph of the output. The user must not be able to
   mistake a mock response for a real one.
2. **`status=candidate` MUST be visible.** Suggested rendering: a
   gray "CANDIDATE" badge next to the capability name. Approved
   capabilities get a green "APPROVED" badge.
3. **`coverage_level` MUST be visible per need.** Suggested rendering:
   | Level        | Color  | Icon  | Description shown to user |
   |--------------|--------|-------|---------------------------|
   | NONE         | red    | ✗     | No capability matches this need. |
   | CATALOG      | orange | △     | A capability card exists but no approved connector. Cannot execute. |
   | OPERATIONAL  | yellow | ○     | Approved connector exists. Can execute. |
   | VERIFIED     | green  | ✓     | Connector has a successful sandbox test. Production-ready. |
4. **`deliverable_type="coverage_blocker_report"` MUST be visually
   distinct.** Suggested rendering: a red header bar that reads
   "COVERAGE BLOCKER REPORT — This is NOT a research deliverable. No
   evidence was collected." The download button is enabled but the
   file is a structured gap report, not a research dossier.
5. **`quality_gate_passed=false` MUST be visible.** Suggested
   rendering: a red "QUALITY GATE FAILED" badge. The list of
   `quality_gate_issues` is shown verbatim. The download button is
   disabled.
6. **`rights_status="unknown"` or `"restricted"` MUST be visible.**
   Suggested rendering: a red "RIGHTS UNCLEARED" badge on the
   storyboard scene. The QualityGate will reject publication if
   the scene has external source attribution.

---

## 6. API Endpoint Quick Reference — The 20 Most Important

These are the endpoints the UI will call most frequently. For the
complete reference, see `API_REFERENCE.md`.

| # | Method | Path                                                    | What it returns                                                  | When to call |
|---|--------|----------------------------------------------------------|------------------------------------------------------------------|--------------|
| 1 | GET    | `/status`                                                 | Service status, build info, capabilities list, not_implemented list. | On every page load (for the StatusBanner). |
| 2 | POST   | `/mold-factory/compose`                                  | Mold composition result (investigation_id, mold_recipe_id, coverage, gaps, deliverable_type). | When the user submits a research question. |
| 3 | GET    | `/mold-factory/investigations/{id}/workflow`              | Workflow state (FSM state, mold_id, blocker, transitions[]).     | When the user opens the InvestigationWorkspace. |
| 4 | POST   | `/mold-factory/investigations/{id}/transition`            | Transition result (transitioned bool, blocker).                   | When the user advances the investigation to the next state. |
| 5 | GET    | `/registry/capabilities`                                  | List of capability cards (with optional filters).                | On RegistryBrowser load. |
| 6 | GET    | `/registry/search?q=...`                                  | 5-stage retrieval results (stage_traces, hits, gaps).             | When the user searches the registry. |
| 7 | POST   | `/memory/evidence`                                       | Ingest result (evidence_id, deduplicated bool, checksum).        | When the user acquires evidence (after a Foundry sandbox test). |
| 8 | GET    | `/memory/investigations/{id}/evidence`                    | List of evidence items in the investigation.                      | On InvestigationWorkspace load. |
| 9 | POST   | `/memory/evidence/{id}/claims`                           | Attached claim (claim_id, verdict).                               | When the user attaches a claim to evidence. |
| 10 | POST  | `/memory/claims/{id}/support`                            | Created edge (edge_id, relation). Both sides preserved.           | When the user adds a refutes/supports edge. |
| 11 | GET   | `/memory/investigations/{id}/decisions`                  | Audit log (decisions array, ordered by decided_at DESC).          | When the user views the audit log. |
| 12 | POST  | `/foundry/candidates/{id}/sandbox-test`                   | Sandbox test result (success, work_count, sample_works, error).   | When the user tests a foundry candidate. |
| 13 | POST  | `/agents/resolve`                                        | Resolution result (needs_specialist, recommended_recipe_id).      | When the user runs the generalist-vs-specialist resolver. |
| 14 | POST  | `/agents/sessions`                                       | Session (session_id, status=instantiated, granted_tools).         | When the user instantiates an agent session. |
| 15 | POST  | `/agents/sessions/{id}/execute`                           | Execution result (status=completed, is_mock, output, tool_invocations). | When the user runs the agent. |
| 16 | POST  | `/foresight/forecasts`                                   | Created forecast (forecast_id, status=draft, method).             | When the user creates a draft forecast. |
| 17 | POST  | `/foresight/forecasts/{id}/publish`                      | Published forecast (status=published, published_at). IMMUTABLE.   | When the user publishes a forecast (warn: irreversible). |
| 18 | POST  | `/foresight/backtest`                                    | Backtest result (leakage_detected, mae, rmse, baseline_mae).      | When the user runs a backtest. |
| 19 | POST  | `/publishing/publications`                               | Created publication (publication_id, deliverable_type, quality_gate_passed, downloadable). | When the user creates a publication. |
| 20 | GET   | `/publishing/publications/{id}/download?format=...`       | File download (Content-Type + Content-Disposition set).           | When the user downloads. |

### Error envelope

Every error response (404, 409, 422, 500, 503) is serialized into:

```json
{
  "code": "not_found",
  "message": "capability 'foo' not found",
  "details": null,
  "trace_id": "req_abc123"
}
```

| HTTP status | `code` value        | Meaning                                                       |
|-------------|---------------------|---------------------------------------------------------------|
| 404         | `not_found`         | Resource does not exist (or belongs to a different tenant).   |
| 409         | `conflict`          | Duplicate ID, illegal state, etc.                            |
| 422         | `validation_error`  | Pydantic contract validation failed OR business rule.        |
| 500         | `internal_error`    | Unhandled exception. Generic message in production.          |
| 503         | `service_unavailable` | A dependency (LLM provider, OpenAlex) is unavailable.      |

The UI should display `message` to the user (it's safe — no internal
details leak) and log `trace_id` for support.

---

## 7. What's NOT in the Backend

The UI team must know what they CANNOT build today. These features
are explicitly NOT implemented and any UI attempt to surface them
will fail.

| Feature                          | Why it's missing                                                  | What the UI must NOT do |
|----------------------------------|-------------------------------------------------------------------|-------------------------|
| User accounts / login             | Single-tenant demo (see KNOWN_GAPS G01). No `Authorization` header. | Do NOT show login/signup screens. Do NOT show per-user workspaces. |
| Saved searches / personalization  | No per-user state.                                                | Do NOT show "save this search" buttons. |
| Real-time updates (WebSocket)      | No WS endpoint. The API is purely HTTP request-response.         | Do NOT subscribe to a socket. POLL the API every 2-10 seconds for long-running operations (agent execution, backtest). |
| File upload                       | No multipart upload endpoint.                                     | Do NOT show a file upload widget. Evidence is ingested as a JSON `Evidence` contract (with optional base64-encoded raw content). |
| Comments / annotations            | No comment table.                                                 | Do NOT show a comment thread UI. |
| Audit log viewer API for some tables | `AgentEvaluationRow`, `BacktestResultRow`, `FoundryCallRecord` are written but have no GET endpoint. | Do NOT show "evaluation history" for a recipe or "backtest history" for a forecast. The data exists but the API is missing (KNOWN_GAPS G28). |
| Live LLM responses                | MockProvider only (KNOWN_GAPS G02).                               | Do NOT design assuming the agent's output is a real LLM response. Always code defensively against `is_mock=true`. |
| Multi-cutoff backtesting          | `n_cutoffs=1` only (KNOWN_GAPS G23).                              | Do NOT show a "rolling-origin" backtest view. Single cutoff only. |
| Real OpenAlex search at scale      | Shared IP rate-limited (KNOWN_GAPS G03).                           | Expect 429 errors. Show a "rate limited, retrying" message. Do NOT design assuming instant search results. |
| Pagination beyond `limit+offset`  | No cursor pagination (KNOWN_GAPS G15).                             | For lists > 200 items, the UI must implement client-side offset tracking. |

### 7.1 Honest workarounds

- **No login:** every page assumes the caller is `tenant_demo`. The UI
  should display "Single-tenant demo mode" in the footer.
- **No real-time updates:** poll `GET /agents/sessions/{id}` every 2
  seconds while `status="running"`. Stop polling when
  `status` becomes `completed` / `failed` / `terminated`.
- **No file upload:** if the user wants to ingest a PDF, they must
  first convert it to base64 and pass it as `raw_content_b64` in the
  `POST /memory/evidence` request body. The UI can offer a "paste
  base64" textarea.
- **No audit log viewer for some tables:** the UI should display a
  "Data preserved in DB; viewer coming in a future mission" message
  for the missing endpoints.

---

## 8. Suggested UI States for Each Section

Every section must handle four states: loading, empty, error, partial.
The backend returns enough signal for the UI to distinguish them.

### 8.1 State matrix

| Section                  | Loading                                            | Empty                                                                     | Error                                                                   | Partial                                                                 |
|--------------------------|----------------------------------------------------|---------------------------------------------------------------------------|-------------------------------------------------------------------------|-------------------------------------------------------------------------|
| InvestigationHome        | Spinner on Submit button.                          | N/A (input is always shown).                                              | Red banner with error.message + trace_id.                              | Mold composed with `is_complete=false` — show coverage gaps.            |
| InvestigationWorkspace   | Spinner on each card while fetching.              | "No investigation active. Submit a question to begin."                   | Red banner with error.message + trace_id. Investigation ID preserved.   | Investigation has SOME evidence but is `blocked` — show blocker.       |
| RegistryBrowser          | Spinner on the card list.                          | "No capabilities match the filter. Try seeding: POST /registry/capabilities/seed." | Red banner. Filters preserved.                                         | Capabilities exist but all are `status=candidate` — show a "no approved capabilities" notice. |
| FoundryBrowser           | Spinner on the candidate list.                    | "No candidates in the catalog. Foundry catalog ships in G02."             | Red banner.                                                             | Candidates exist but none are `approved` — show "no operational sources." |
| MemoryExplorer           | Spinner on the evidence list.                     | "No evidence in this investigation. Acquire evidence from the Foundry."  | Red banner.                                                             | Evidence exists but all claims are `verdict=candidate` — show "no claims have been promoted." |
| MoldFactoryView          | Spinner on the mold list.                          | "No saved molds. Submit a question to compose one."                     | Red banner.                                                             | Molds exist but all are `state=temporary` — show "no reusable molds yet." |
| AgentRegistry            | Spinner on the recipe list.                        | "No recipes. Seed the Clinical Reviewer or General Analyst."             | Red banner.                                                             | Recipes exist but all sessions are `is_mock=true` — show the mock warning. |
| ForesightView            | Spinner on the forecast list.                      | "No forecasts. Create one from an investigation's evidence."             | Red banner.                                                             | Forecasts exist but all are `status=draft` — show "no published forecasts." |
| PublishingView           | Spinner on the publication list.                   | "No publications. Create one from a completed investigation."             | Red banner.                                                             | Publications exist but all are `quality_gate_passed=false` — show "no downloadable publications." |

### 8.2 Loading state best practices

- Use skeleton loaders (gray rectangles) for cards while fetching.
- Show a progress message that matches the backend's stage (e.g.
  "Composing mold..." while `POST /mold-factory/compose` is in
  flight).
- For long-running operations (agent execution, backtest), show a
  progress bar with periodic status updates from polling.

### 8.3 Empty state best practices

- Always show a call-to-action button (e.g. "Seed the registry" →
  `POST /registry/capabilities/seed`).
- Never show an empty page with just "No data." Always explain why
  the data is missing and how to add it.

### 8.4 Error state best practices

- Show the `error.message` field verbatim (it's user-safe).
- Show the `trace_id` in a collapsible "details" section for support.
- Offer a "Retry" button that re-calls the same endpoint.

### 8.5 Partial state best practices

- Use the honest data quality flags (see §5) to render the partial
  state visually distinct from a complete state.
- For example, an investigation with `is_complete=false` should have
  a yellow "PARTIAL" badge in the header.
- A publication with `quality_gate_passed=false` should have a red
  "QUALITY GATE FAILED" badge.

---

## 9. Bilingual Support

### 9.1 The contract

Every text field in the seed capability cards has both English and
Arabic keywords:

```python
# from registry/seed_cards.py :: card_academic_publications()
keywords_en=["publication", "paper", "article", "journal", "preprint", ...],
keywords_ar=["منشور", "بحث علمي", "مقالة", "مجلة", "استشهاد", "مؤلف", ...],
```

The agent recipes' display names and descriptions are in English.
The UI labels (tab names, button labels) should be bilingual.

### 9.2 RTL/LTR switching

The frontend should support:
- LTR (left-to-right) for English content.
- RTL (right-to-left) for Arabic content.
- A language toggle in the header ( globe icon).
- CSS `direction: rtl` on the body when Arabic is selected.
- Logical CSS properties (`margin-inline-start` instead of `margin-left`)
  so the layout flips correctly.

### 9.3 The current frontend

The existing frontend (`frontend/src/App.tsx`) uses bilingual labels
in the tab navigation (e.g. "الخبراء · Agent Phone Book"). The
StatusBanner shows both English and Arabic. The InvestigationHome
input has a placeholder in English.

The UI team should:
- Audit every user-visible string and ensure it has both an English
  and Arabic translation.
- Store the translations in a single i18n file (e.g.
  `frontend/src/i18n.ts`) keyed by string ID.
- Use the user's browser language as the default, with a manual
  toggle.

### 9.4 Embedding model supports both

The embedding model (`paraphrase-multilingual-MiniLM-L12-v2`) handles
both English and Arabic. A query in Arabic will match capabilities
whose Arabic keywords overlap. This is verified by
`test_verification_01_regressions.py ::
TestF2SearchPriorMemoryQueryFiltering :: test_arabic_query_filters_correctly`
— an Arabic query `"الأطراف الصناعية"` matches Arabic content
`"الأطراف الصناعية والتحكم العصبي"`.

The UI search box should accept both scripts. No special handling
needed; the backend tokenizes both.

---

## 10. Accessibility

### 10.1 The contract

Every interactive element must be operable by:
- Keyboard only (Tab, Shift+Tab, Enter, Escape).
- Screen reader (NVDA, JAWS, VoiceOver).
- Users with low vision (high contrast, large fonts).
- Users with color blindness (status badges must NOT rely on color
  alone — include an icon or text label).

### 10.2 Requirements

| Requirement                              | How to satisfy                                                                                  |
|------------------------------------------|------------------------------------------------------------------------------------------------|
| Keyboard navigation                      | Every button, link, input has `tabindex="0"` (or implicit via semantic HTML). Use `<button>` not `<div onclick=...>`. |
| Focus indicator                          | Visible focus ring (CSS `:focus-visible { outline: 2px solid var(--accent); }`).                |
| ARIA labels                              | Every icon-only button has `aria-label`. Every form input has `<label for="...">`.             |
| Status badge accessibility               | The `coverage_level` badge has both a color AND an icon AND a text label. Never color-only.    |
| Color contrast                           | Text on background ≥ 4.5:1 contrast ratio (WCAG AA). Status badge colors must meet this.        |
| Screen reader announcements              | When a long-running operation completes, use `aria-live="polite"` to announce it.               |
| Skip-to-content link                     | First focusable element on every page is a "Skip to main content" link (visually hidden until focused). |
| Heading hierarchy                        | One `<h1>` per page. Section titles are `<h2>`, subsections `<h3>`. Don't skip levels.         |
| Form validation                          | Errors are announced via `aria-invalid="true"` on the input and `aria-describedby` pointing to the error message. |
| Loading states                           | Spinners have `aria-label="Loading"`. Skeleton loaders have `aria-hidden="true"` (decorative).  |

### 10.3 Status badge color palette (suggested)

The badges must work in both light and dark themes, and must be
distinguishable by users with deuteranopia (red-green color blindness).

| Badge                          | Color (light)        | Color (dark)         | Icon | Text |
|--------------------------------|----------------------|----------------------|------|------|
| `status=candidate`             | gray                 | gray                 | ○    | "CANDIDATE" |
| `status=approved`              | green                | green                | ✓    | "APPROVED" |
| `status=rejected`              | red                  | red                  | ✗    | "REJECTED" |
| `coverage_level=NONE`          | red                  | red                  | ✗    | "NONE" |
| `coverage_level=CATALOG`       | orange               | orange               | △    | "CATALOG" |
| `coverage_level=OPERATIONAL`   | yellow               | yellow               | ○    | "OPERATIONAL" |
| `coverage_level=VERIFIED`      | green                | green                | ✓    | "VERIFIED" |
| `is_mock=true`                 | yellow               | yellow               | ⚠    | "MOCK" |
| `quality_gate_passed=false`    | red                  | red                  | ✗    | "QUALITY GATE FAILED" |
| `deliverable_type=coverage_blocker_report` | red      | red                  | ⚠    | "COVERAGE BLOCKER" |
| `rights_status=unknown`        | red                  | red                  | ⚠    | "RIGHTS UNCLEARED" |

### 10.4 The mock response watermark

Because `is_mock=true` is universal today, the UI MUST make this
impossible to miss. Suggested approach:
- A yellow banner at the top of every agent response: "⚠ MOCK
  RESPONSE — No real LLM was called. Do not treat this as a verified
  assessment."
- A diagonal "MOCK" watermark on every paragraph of the response
  text.
- A tooltip on the watermark explaining what mock means.
- The `is_mock` flag rendered as a yellow badge in the session card
  header.

---

## 11. Test Fixtures the UI Team Can Use

### 11.1 The 8 seed capability cards

Available via `POST /registry/capabilities/seed`. The cards are:

| # | ID                                | Display Name                       | Domains                         |
|---|-----------------------------------|------------------------------------|---------------------------------|
| 1 | `search.academic-publications`    | Academic Publications Search       | academic, research, science     |
| 2 | `search.patent-intelligence`      | Patent Intelligence Search         | industry, ip, patents           |
| 3 | `search.clinical-trials`          | Clinical Trials Search             | medical, clinical               |
| 4 | `search.energy-ev-datasets`       | Energy / EV Datasets Search        | energy, transportation          |
| 5 | `search.agricultural-statistics`  | Agricultural Statistics Search     | agriculture, food               |
| 6 | `search.geopolitical-events`      | Geopolitical Events Search         | politics, news                  |
| 7 | `search.waste-recycling-statistics` | Waste & Recycling Statistics Search | environment, waste            |
| 8 | `search.github-activity`          | GitHub Activity Search             | software, code                  |

Each card has 15-30 positive examples and 5-10 negative examples,
bilingual keywords (en/ar), synonyms, and task intents. The cards
are in `status=candidate` (NOT approved) — promotion requires admin
action.

The prosthetics acceptance test verifies that querying "future of
intelligent prosthetics" retrieves 4 cards (academic-publications,
patent-intelligence, clinical-trials, github-activity) — even though
NONE of them literally contains the word "prosthetics." This is the
cross-domain semantic match the MiniLM model enables.

### 11.2 The Clinical Prosthetics Reviewer recipe

Available via `POST /agents/recipes/seed-clinical`. The recipe is
the canonical G05 acceptance test:
- Role: `clinical_prosthetics_reviewer`.
- Permitted capabilities: `search.academic-publications`,
  `search.clinical-trials`.
- Permitted tools: `search.academic-publications`,
  `search.clinical-trials`, `memory.read_prior_evidence`,
  `memory.write_evidence`.
- System prompt explicitly DENIES using patent filings as proof of
  clinical safety or efficacy.
- State: `on_demand`.

The MockProvider, when this recipe is executed, will emit a response
that explicitly excludes patent-only evidence from the clinical
assessment.

### 11.3 The General Analyst recipe

Available via `POST /agents/recipes/seed-generalist`. The recipe is
the default general-purpose analyst:
- Role: `general_analyst`.
- Permitted capabilities: `[]` (uses whatever the mold provides).
- Permitted tools: a broad list (search.academic-publications,
  search.patent-intelligence, etc.).
- State: `maintained` (always available).

### 11.4 The 10-step lifecycle test

`backend/tests/test_investigation_lifecycle.py` is a 10-step
acceptance test that demonstrates a complete investigation journey:

| Step | What it does                                            | API endpoints exercised |
|------|---------------------------------------------------------|--------------------------|
| 1    | Compose a mold for "intelligent prosthetics"            | `POST /mold-factory/compose` |
| 2    | Verify the mold has the expected coverage gaps         | (assertions on the composition result) |
| 3    | Acquire evidence from OpenAlex                          | `POST /foundry/candidates/openalex/sandbox-test`, `POST /memory/evidence` |
| 4    | Attach a claim and add a refuting edge (contradiction preserved) | `POST /memory/evidence/{id}/claims`, `POST /memory/claims/{id}/support` |
| 5    | Run the Clinical Prosthetics Reviewer agent            | `POST /agents/resolve`, `POST /agents/sessions`, `POST /agents/sessions/{id}/execute` |
| 6    | Create and publish a forecast                           | `POST /foresight/forecasts`, `POST /foresight/forecasts/{id}/publish` |
| 7    | Attempt to modify the published forecast (must fail)   | `POST /foresight/forecasts/{id}/try-modify` (returns `false`) |
| 8    | Create a revision of the forecast                       | `POST /foresight/forecasts/{id}/revise` |
| 9    | Create and download a publication                       | `POST /publishing/publications`, `GET /publishing/publications/{id}/download?format=markdown` |
| 10   | Verify the deliverable is non-empty and Arabic-safe    | (assertions on the downloaded file content) |

The UI team can use this test as a fixture: each step demonstrates a
complete user interaction. The test passes (verified in
`INTEGRATION_TEST_REPORT.md`) so the API responses are known-good.

---

## 12. Open Questions for the UI Team

These are design decisions the backend team has deferred to the UI
team. There is no right answer; we need the UI team's input.

### Q1: How to surface the `coverage_level` of a mold?

**Context.** A mold has multiple needs, each with one of four
coverage levels (NONE / CATALOG / OPERATIONAL / VERIFIED). The user
needs to understand at a glance whether their mold can execute.

**Options:**
- (a) A single aggregate badge on the mold card showing the WORST
  level across all needs (e.g. "CATALOG" if any need is only
  catalog-covered).
- (b) A per-need badge list (more verbose but more informative).
- (c) A traffic-light icon (red/orange/yellow/green) next to each
  need.
- (d) A heatmap matrix (needs × capabilities, colored by coverage).

**What we need from you:** A recommendation + a mockup. Consider both
the mold card list view (compact) and the mold detail view (verbose).

### Q2: How to handle the `coverage_blocker_report` deliverable type?

**Context.** When an investigation has no operational sources, the
publication is a "coverage blocker report" — a structured gap report,
NOT a research deliverable. The user must understand they did NOT
get a research dossier.

**Options:**
- (a) A completely different layout: red header, "COVERAGE BLOCKER"
  in the title, gap list as the body.
- (b) Same layout as a research dossier but with a red "COVERAGE
  BLOCKER" banner at the top.
- (c) A modal that explains the situation before showing the report.
- (d) A separate tab in the PublishingView for coverage blockers.

**What we need from you:** A recommendation. The risk is that a user
mistakes a coverage blocker report for a research deliverable and
shares it externally. The UI must make this mistake impossible.

### Q3: How to present `tool_invocations` in the agent session view?

**Context.** Every agent execution records a `tool_invocations[]`
array with one entry per tool call. Each entry has: `tool_name`,
`arguments`, `status` (executed / denied_not_in_granted_set /
not_implemented / error), `result`, `error`, `timestamp`.

**Options:**
- (a) A collapsible list (one row per invocation, expandable to show
  arguments + result).
- (b) A timeline (chronological, with status icons).
- (c) A table (columns: tool_name, status, duration, error).
- (d) A tree (group by status: executed / denied / not_implemented /
  error).

**What we need from you:** A recommendation. Consider that the user
needs to:
- Quickly see how many tools were called.
- Identify denied / errored calls.
- Drill into the arguments and results.
- Understand the chronological order.

### Q4: How to warn users when an agent response `is_mock=true`?

**Context.** Today every agent response is mock. The user must not
mistake a mock for a real LLM response.

**Options:**
- (a) A yellow banner at the top of the response.
- (b) A diagonal "MOCK" watermark on every paragraph.
- (c) A modal that requires the user to acknowledge the mock before
  viewing the response.
- (d) A separate "mock responses" tab that's visually distinct from
  the (future) "live responses" tab.
- (e) All of the above (banner + watermark + badge).

**What we need from you:** A recommendation. The constraint is that
the warning must be impossible to miss but must not be so aggressive
that it makes the mock response unusable for demonstration purposes.

### Q5: How to handle the bilingual content?

**Context.** Every seed card has both English and Arabic keywords.
The UI labels are bilingual. The agent recipes are in English only.

**Options:**
- (a) A language toggle in the header. Default to the user's
  browser language.
- (b) Always show both languages side-by-side (more verbose).
- (c) Show the user's preferred language with a "show original"
  toggle for the other language.
- (d) Auto-detect from the query (Arabic query → Arabic UI).

**What we need from you:** A recommendation. Consider that the user
might be bilingual and want to switch back and forth.

### Q6: How to show the audit log?

**Context.** The audit log (`GET /memory/investigations/{id}/decisions`)
is an append-only list of decisions. Each decision has: decision_type,
evidence_id, claim_id, actor, rationale, decided_at, payload.

**Options:**
- (a) A reverse-chronological list (newest first), one card per
  decision.
- (b) A timeline visualization (horizontal, with milestones).
- (c) A table (columns: time, type, actor, rationale).
- (d) A filterable list (filter by decision_type, actor).

**What we need from you:** A recommendation. The audit log can grow
to hundreds of entries for a long investigation; the UI must handle
this gracefully.

### Q7: How to handle the polling for long-running operations?

**Context.** There is no WebSocket. The UI must poll `GET
/agents/sessions/{id}` and `GET /mold-factory/investigations/{id}/workflow`
periodically.

**Options:**
- (a) Poll every 2 seconds, indefinitely.
- (b) Poll every 2 seconds for the first 30 seconds, then every 10
  seconds.
- (c) Exponential backoff (2s, 4s, 8s, 16s, max 30s).
- (d) Poll until a timeout (5 minutes), then show "operation timed
  out."

**What we need from you:** A recommendation. Considerate of server
load vs. user experience.

### Q8: How to present the bitemporal replay?

**Context.** `POST /memory/investigations/{id}/at-cutoff` returns the
evidence visible at a specific cutoff time. The user can scrub
through time and see what MANARA knew at each point.

**Options:**
- (a) A date picker + a "replay" button that shows the evidence
  visible at that date.
- (b) A scrubber (horizontal slider) over a timeline.
- (c) A "time travel" mode that re-renders the entire UI as of a
  chosen date.

**What we need from you:** A recommendation. The feature is powerful
but might confuse users who don't understand bitemporal semantics.

---

## 13. Glossary

| Term                  | Definition                                                                                              |
|-----------------------|---------------------------------------------------------------------------------------------------------|
| Capability            | A typed contract describing *what you can search for* over a source. Stored in `CapabilityRow`.        |
| Connector             | An implementation of access to a specific source. Stored in `ConnectorRow`. Today: only OpenAlex.      |
| Source                | A discovered external data provider. Stored in `SourceRow`. Today: only OpenAlex.                       |
| Mold                  | A recipe that says "for this kind of query, use these capabilities." Stored in `MoldRecipeRow`.         |
| Investigation         | A specific research question + its lifecycle. Stored in `InvestigationRow`.                              |
| Evidence              | A single piece of ingested data (a quote, a dataset, a measure). Stored in `EvidenceItemRow`.           |
| Claim                 | A statement attached to evidence, with a verdict (candidate / supported / contested / refuted / superseded). Stored in `ClaimRow`. |
| Measure               | A structured numeric value extracted from evidence. Stored in `MeasureRow`.                            |
| Forecast              | A quantitative prediction with bitemporal safety. Stored in `ForecastRow`.                               |
| Backtest              | A historical replay of a forecast with leakage detection. Stored in `BacktestResultRow`.                |
| Publication           | A downloadable deliverable (dossier, presenter edition, storyboard). Stored in `PublicationRow`.        |
| Agent Recipe          | A "shift worker" definition (role, tools, prompts). Stored in `AgentRecipeRow`.                         |
| Agent Session         | A specific execution of a recipe. Stored in `AgentSessionRow`.                                          |
| Tenant                | The isolation boundary. Today: always `tenant_demo`.                                                    |
| Bitemporal           | Distinguishes *when the event happened* (observed_at) from *when we learned of it* (ingested_at) from *when the source published it* (published_at). |
| Coverage Level        | The three-tier model: NONE / CATALOG / OPERATIONAL / VERIFIED.                                          |
| Quality Gate          | The 6-rule validator that runs before a publication can be downloaded.                                  |
| SSRF                  | Server-Side Request Forgery. The Foundry's `validate_url` blocks private IPs and non-allowlisted hosts. |
| Mock Provider         | The deterministic mock LLM. Always used today (`is_mock=true`).                                          |
| Z.AI Provider         | The live LLM (Z.AI/GLM). Requires `MANARA_ZAI_API_KEY`. Not exercised in the sandbox.                  |
| Tool Invocation       | A record of a single tool call attempted by an agent (executed / denied / not_implemented / error).    |

---

## 14. Final Notes for the UI Team

1. **Read §5 (Honest Data Quality Flags) first.** Every flag in that
   table must be visible in the UI. The single most important flag
   is `is_mock=true` — every agent response today is mock. Design
   accordingly.
2. **Read §7 (What's NOT in the backend) second.** Do not design
   features that depend on capabilities the backend doesn't have
   (login, WebSocket, file upload, etc.).
3. **Use the 10-step lifecycle test (§11.4) as your acceptance
   criteria.** Every UI flow you design should be traceable to one
   of those 10 steps. If a flow doesn't map to a step, the backend
   probably doesn't support it.
4. **Answer the 8 open questions in §12.** The backend team needs
   your input on these design decisions before the next iteration.
5. **Poll, don't subscribe.** There is no WebSocket today. Long-
   running operations require polling. See §8.1 for state handling.
6. **Be bilingual from day one.** Every user-visible string should
   have both English and Arabic translations. The backend supports
   both; the UI must too.
7. **Be accessible from day one.** Keyboard navigation, ARIA labels,
   color-blind-safe badges. See §10.
8. **When in doubt, ask.** The backend team is available. The
   `API_REFERENCE.md` is the source of truth for endpoint shapes;
   the `BACKEND_ARCHITECTURE.md` is the source of truth for the
   data model. If a UI design seems to require something not in
   those docs, it probably doesn't exist yet.

This document is the contract between the backend team and the UI
team. Any change to the backend that affects the UI contract MUST
update this document concurrently. The verification checklist in
`SECURITY_RELIABILITY_REPORT.md §14` should be re-run on every
staging promotion.
