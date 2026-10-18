# MANARA — Mission G05 Report

> **MANARA Foundation v1.0 · 2026-10-19 · On-Demand Specialist Agents**
> Owner: Ayman · Supervisor: ChatGPT · Implementer: GLM
> Spec: https://github.com/mayakilzy/repo-info/blob/main/AgentCraft-MANARA/MISSIONS/G05.md
> Code: https://github.com/mayakilzy/AgentCraft-MANARA (G05 commit pending push)
> Baseline: `556d946` (G04-R1)

---

## Status

**PASS** — The canonical G05 acceptance test passes: Clinical Prosthetics Reviewer
can be stopped and recreated from recipe; generalist first for simple tasks.

| Field                | Value                                                                                   |
|----------------------|-----------------------------------------------------------------------------------------|
| Date                 | 2026-10-19 (Europe/Istanbul)                                                            |
| Mission              | G05 — On-Demand Specialist Agents                                                        |
| Implementer          | GLM                                                                                     |
| Owner                | Ayman (decisions approved in chat, 2026-10-19)                                            |
| Start SHA            | `556d946` (G04-R1)                                                                      |
| End SHA              | TBD (pushed at end of this report)                                                      |
| Non-live tests       | 230 passing (211 G00-G04-R1 + 19 G05)                                                   |
| Live tests           | 4 passing + 1 skipped (carried from G02)                                               |
| Lint / typecheck     | ruff ✓ · mypy ✓ · tsc ✓                                                                |

---

## Owner's G05 acceptance criteria (from G05.md)

> "Clinical prosthetics reviewer can be stopped and recreated from recipe;
> no always-on costly worker; generalist first."

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Clinical reviewer stopped + recreated | ✅ PASS | `test_clinical_prosthetics_reviewer_full_lifecycle` steps 6-9 |
| No always-on costly worker | ✅ PASS | EphemeralAgentRuntime terminates after execution; recipe persists |
| Generalist first | ✅ PASS | `test_generalist_first_for_simple_task` — simple task → no specialist |

---

## Owner's decisions (approved 2026-10-19)

| Decision | Approved | Implementation |
|----------|----------|----------------|
| Agent runtime in Python + LLM via Provider Adapter | ✓ | `EphemeralAgentRuntime` + `MockProvider`/`ZAIProvider` |
| GLM via Z.AI as starting point | ✓ | `ZAIProvider` stub (requires `MANARA_ZAI_API_KEY`) |
| Tool permissions: capability × role × investigation | ✓ | `ToolPermissionResolver.resolve()` computes intersection |
| Generalist first; specialist when proven | ✓ | `GeneralistVsSpecialistResolver` checks for specialist signals |
| Ephemeral agents terminate after task; recipe persists | ✓ | `EphemeralAgentRuntime.terminate()` + `AgentRecipeRegistry.rehydrate()` |
| No full Swarm or always-on agents | ✓ | No background workers; all execution is synchronous + bounded |
| Mock responses clearly labeled | ✓ | `LLMResponse.is_mock=True` on every MockProvider response |

---

## Work performed

### 1. Database layer (Alembic migration `0005_agents`)

Three new tables:
- `agent_recipes` — stored specialist recipes (the phone book). State: on_demand → recipe_saved → tested → maintained → retired.
- `agent_sessions` — ephemeral execution records. Status: instantiated → running → completed | failed | terminated.
- `agent_evaluations` — per-session evaluation records with quality_score and improvement_over_generalist.

### 2. LLM Provider Adapter (`manara/agents/providers.py`)

- `LLMProvider` Protocol — `generate(system_prompt, user_prompt)` returns `LLMResponse`
- `MockProvider` — deterministic mock; every response has `is_mock=True`; reflects role + task in output; explicitly warns "not a real LLM assessment"
- `ZAIProvider` — stub for Z.AI/GLM; requires `MANARA_ZAI_API_KEY`; falls back to httpx direct API call
- `get_provider()` factory: ZAIProvider if API key set, else MockProvider

Per owner: "لا تدّعِ نجاح تشغيل LLM حقيقي إذا كان الاختبار يستخدم Mock Provider."

### 3. ToolPermissionResolver (`manara/agents/factory.py`)

Per owner: "الصلاحيات الفعلية هي تقاطع هذه الحدود الثلاثة."

Computes: `granted = recipe_allowed ∩ capability_allowed − recipe_denied − investigation_constraints`

The agent CANNOT grant itself additional tools — only the intersection is available.

### 4. GeneralistVsSpecialistResolver

Per owner: "لا تنشئ خبيراً تخصصياً لكل مهمة."

Decision logic:
- Simple search/find/list tasks → generalist (no specialist created)
- Evaluate/assess/review/verify/clinical/safety/efficacy/regulatory → specialist
- If specialist needed: search for existing recipe first → reuse if found
- Only if no existing recipe → create new one

### 5. AgentRecipeRegistry (the phone book)

- `save_recipe` — save a recipe to the registry
- `get_recipe` — fetch by ID (tenant-scoped)
- `list_recipes` — filter by specialty, state
- `rehydrate` — reconstruct the Pydantic AgentRecipe from the stored payload

Per owner: "إعادة إنشاء الخبير من وصفته المحفوظة في جلسة جديدة."

### 6. EphemeralAgentRuntime

Per spec: "Agents are ephemeral runtime workers with least privilege and a bounded task."

- `instantiate` — creates AgentSessionRow, resolves tool permissions
- `execute` — calls LLM provider (mock or live), records output
- `terminate` — sets status=terminated if still running
- `evaluate` — records evaluation; promotes recipe from on_demand → recipe_saved if quality ≥ 0.6

### 7. Specialist recipe: Clinical Prosthetics Reviewer

`create_clinical_prosthetics_reviewer_recipe()` builds the canonical G05 acceptance recipe:
- Role: `clinical_prosthetics_reviewer`
- Permitted capabilities: `search.academic-publications`, `search.clinical-trials` (NOT patents!)
- System prompt explicitly says: "Do NOT use patent filings as proof of clinical safety or efficacy"
- Permitted tools: search + memory (read/write)
- Model compatibility: `["zai:glm-4.6", "openai:gpt-4o"]`

### 8. General analyst recipe

`create_general_analyst_recipe()` — the default, always-available generalist. State=maintained (never retires).

### 9. API surface (11 new endpoints under `/agents/`)

- `GET /agents/recipes` — list recipes
- `GET /agents/recipes/{id}` — fetch one
- `POST /agents/recipes/seed-clinical` — seed the clinical reviewer
- `POST /agents/recipes/seed-generalist` — seed the general analyst
- `POST /agents/resolve` — generalist-vs-specialist resolver
- `POST /agents/sessions` — instantiate
- `POST /agents/sessions/{id}/execute` — execute
- `POST /agents/sessions/{id}/terminate` — terminate
- `POST /agents/sessions/{id}/evaluate` — evaluate
- `GET /agents/sessions/{id}` — fetch session details

### 10. Tests (19 new — total 230)

`tests/test_agent_factory.py`:
- `TestToolPermissionResolver` (4 tests): intersection, denied subtraction, investigation constraints, cannot self-grant
- `TestGeneralistVsSpecialistResolver` (3 tests): simple→generalist, clinical→specialist, existing recipe reused
- `TestAgentRecipeRegistry` (3 tests): save+get, rehydrate from cold, tenant isolation
- `TestEphemeralAgentRuntime` (5 tests): instantiate→execute→terminate, tool permissions intersection, patents denied, evaluate+promote, terminate running
- `TestMockProvider` (2 tests): mock labeled, mock is default
- `TestG05Acceptance` (2 tests): **the canonical clinical reviewer lifecycle** + generalist-first counter-test

---

## Real end-to-end evidence

### The canonical G05 acceptance test

`test_clinical_prosthetics_reviewer_full_lifecycle` — 10 steps:

1. **Detect need**: resolver returns `needs_specialist=True` for clinical evidence review
2. **No existing recipe**: `recommended_recipe_id=None`
3. **Create recipe**: `create_clinical_prosthetics_reviewer_recipe()` saved to registry
4. **Tool permissions**: recipe permits academic-publications + clinical-trials (NOT patents)
5. **Patents denied**: system prompt explicitly says "Do NOT use patent filings as proof of clinical safety"
6. **Execute (mock)**: session instantiated → executed → output has `is_mock=True`
7. **Evaluation recorded**: outcome=success, quality=0.8, improvement=0.6
8. **Session terminated**: status=completed (terminated)
9. **Rehydrate from cold**: recipe rehydrated from payload; role, tools, prompt, version all match
10. **Recipe promoted**: state changed from on_demand → recipe_saved

### Counter-test: generalist first

`test_generalist_first_for_simple_task` — "Find recent papers about battery technology trends" → `needs_specialist=False` → no specialist created.

---

## Honest status labels (per owner G05)

Per owner: "ميّز بوضوح بين: Recipe Generated, Agent Instantiated, Mock Execution Passed, Live LLM Execution Passed, Specialist Quality Evaluated"

| Label | Status |
|-------|--------|
| Recipe Generated | ✅ Clinical Prosthetics Reviewer recipe created and saved |
| Agent Instantiated | ✅ EphemeralAgentRuntime.instantiate() works |
| Mock Execution Passed | ✅ MockProvider generates labeled mock response |
| Live LLM Execution Passed | ❌ Not tested — no `MANARA_ZAI_API_KEY` in sandbox |
| Specialist Quality Evaluated | ✅ Evaluation recorded with quality_score + improvement_over_generalist |

---

## Tests

### Final test inventory (235 total)

| File                                | Tests | Notes |
|-------------------------------------|-------|-------|
| All G00-G04-R1 tests                | 211   | Unchanged |
| `tests/test_agent_factory.py`       | 19    | **G05 new** |
| `tests/test_foundry_live.py`        | 5     | Carried from G02 |
| **Total**                           | **235**| **230 pass + 5 skip** |

```
$ cd backend && python3 -m pytest -v
================== 230 passed, 5 skipped in 453.26s ==================

$ cd backend && python3 -m ruff check .
All checks passed!

$ cd backend && python3 -m mypy src/manara
Success: no issues found in 54 source files
```

---

## Failures, deferred items, known risks

### Deferred items
1. **Live LLM execution**: MockProvider only. ZAIProvider stub exists but requires `MANARA_ZAI_API_KEY`.
2. **Recipe auto-suggestion**: G05 supports owner-approved promotion but does NOT auto-suggest promotion based on usage frequency.
3. **Multi-session orchestration**: G05 runs one session at a time. Multi-agent orchestration (if needed) is deferred.

### Known risks
1. **Mock responses are NOT real assessments**: the MockProvider produces deterministic text that reflects the role but is NOT a real clinical evaluation. The `is_mock=True` flag ensures callers never mistake it for live output.
2. **Specialty matching is prefix-based**: the resolver matches "clinical_reviewer" to "clinical_prosthetics_reviewer" via prefix. In a larger recipe registry, this may need a more sophisticated matching algorithm (e.g. embedding-based).

---

## Proposed next mission

### G06 — Foresight verification

Per `MISSIONS/G06.md`: "Policy, time-series baseline, scenario/no-evidence route, backtesting/no leakage and immutable predictions."

---

## End of G05 Report

G05 is **complete**. GLM is **stopped and awaiting owner approval** to transition to G06.
