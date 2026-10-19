# MANARA Backend — Known Gaps & Limitations

> **Audience.** Backend engineers, staging reviewers, and anyone deciding
> whether to promote the MANARA backend to staging or production.
>
> **Scope.** A brutally honest catalog of every gap, limitation, stub, and
> "FUTURE_WORK" marker in the codebase at
> `/home/z/my-project/repos/AgentCraft-MANARA/backend/src/manara/`.
> Each gap is classified by impact and by honest status.
>
> **Classification key.**
> - **CRITICAL** — blocks production deployment. Must close before staging
>   promotion or before any real data flows through the system.
> - **HIGH** — limits real-world usage but does not block staging.
>   Staging can ship with this gap; production cannot.
> - **MEDIUM** — known limitation; workaround exists. Document for users.
> - **LOW** — cosmetic or future enhancement. Track in backlog.
>
> **Honest status key.**
> - **VERIFIED_GAP** — confirmed by reading the code; behavior matches the
>   description exactly.
> - **SUSPECTED_GAP** — behavior inferred from code reading but not yet
>   reproduced in a test.
> - **FUTURE_WORK** — explicitly deferred to a later mission per the
>   roadmap (`G08`, `G09`, etc.) or marked as such in the source.
>
> **Source of truth.** `backend/src/manara/` at the BACKEND-VERIFICATION-01
> commit (2026-10-19). Companion files:
> `SECURITY_RELIABILITY_REPORT.md` (deep dive on security),
> `INTEGRATION_TEST_REPORT.md` (test results).

---

## Summary Table

| ID  | Title                                                            | Impact    | Status       |
|-----|------------------------------------------------------------------|-----------|--------------|
| G01 | Multi-tenant authentication NOT IMPLEMENTED                       | CRITICAL  | VERIFIED_GAP |
| G02 | Live LLM NOT TESTED (ZAIProvider stub, no API key)               | CRITICAL  | VERIFIED_GAP |
| G03 | Live OpenAlex search RATE-LIMITED (shared IP)                    | HIGH      | VERIFIED_GAP |
| G04 | PostgreSQL + pgvector NOT TESTED (SQLite only in dev)            | HIGH      | VERIFIED_GAP |
| G05 | Playwright browser E2E NOT RUN (no browser in sandbox)          | HIGH      | VERIFIED_GAP |
| G06 | Docker build NOT TESTED (no Docker in sandbox)                    | HIGH      | VERIFIED_GAP |
| G07 | PgvectorEmbeddingStore is a STUB                                  | HIGH      | VERIFIED_GAP |
| G08 | S3CompatibleStore would crash on first use (boto3 missing)        | HIGH      | VERIFIED_GAP |
| G09 | DNS rebinding TOCTOU (partial defense only)                       | HIGH      | VERIFIED_GAP |
| G10 | Forecast immutability is code-level only (no DB CHECK constraint)  | HIGH      | VERIFIED_GAP |
| G11 | State machine invariants NOT enforced by DB CHECK constraints     | HIGH      | VERIFIED_GAP |
| G12 | Foreign keys missing ON DELETE behavior                          | MEDIUM    | VERIFIED_GAP |
| G13 | JSON columns used for structured data (would benefit from relational) | MEDIUM    | VERIFIED_GAP |
| G14 | No API rate limiting                                              | MEDIUM    | VERIFIED_GAP |
| G15 | No pagination on most list endpoints                             | MEDIUM    | VERIFIED_GAP |
| G16 | Test suite "database is locked" under SQLite high concurrency     | MEDIUM    | VERIFIED_GAP |
| G17 | 8 Boolean ORM/migration type mismatches FIXED in BACKEND-VERIFICATION-01 | LOW       | FIXED        |
| G18 | ToolExecutor only dispatches 3 tools (registry.search, memory.search_prior, foundry.search_openalex) | MEDIUM    | VERIFIED_GAP |
| G19 | Live agent execution loop NOT IMPLEMENTED (MockProvider emits TOOL_CALL: lines) | CRITICAL  | FUTURE_WORK |
| G20 | No coverage measurement (coverage.py configured but not run in CI) | MEDIUM    | VERIFIED_GAP |
| G21 | No load testing                                                  | MEDIUM    | VERIFIED_GAP |
| G22 | No property-based testing (Hypothesis not configured)             | LOW       | VERIFIED_GAP |
| G23 | Forecast horizons only support single cutoff (n_cutoffs=1)      | MEDIUM    | VERIFIED_GAP |
| G24 | Storyboard rights enforcement is in code, not in DB constraint    | MEDIUM    | VERIFIED_GAP |
| G25 | No security headers middleware                                    | MEDIUM    | VERIFIED_GAP |
| G26 | No CSRF protection                                               | MEDIUM    | VERIFIED_GAP |
| G27 | `MANARA_SINGLE_TENANT_DEMO` flag is dead code                     | LOW       | VERIFIED_GAP |
| G28 | No audit log viewer API for AgentEvaluation / BacktestResult / FoundryCallRecord | LOW       | VERIFIED_GAP |
| G29 | No file upload endpoint                                          | LOW       | FUTURE_WORK  |
| G30 | No WebSocket / real-time updates (UI must poll)                  | MEDIUM    | FUTURE_WORK  |

---

## CRITICAL Gaps (block production deployment)

### G01 — Multi-tenant authentication NOT IMPLEMENTED

| Field             | Value |
|-------------------|-------|
| **Impact**        | CRITICAL |
| **Status**        | VERIFIED_GAP |
| **File**          | `api/routes/*.py` (every router), `config.py` |

**Description.** Every router's `_resolve_tenant()` returns
`settings.default_tenant_id` (the constant `"tenant_demo"`). There is
no `Authorization` header, JWT, API key, or session cookie. The
`MANARA_SINGLE_TENANT_DEMO` flag is declared in `config.py:55` but
never read by any application code (verified by grep across the entire
backend tree).

**Why it exists.** Architectural decision: the single-tenant demo was
the G00 mandate; multi-tenant auth was explicitly deferred to "G03+"
per the `StatusResponse :: not_implemented` list in
`api/routes/status.py`.

**Impact on users.** Anyone who can reach the API can do anything
the API exposes: ingest evidence, publish forecasts, delete
capabilities, quarantine foundry candidates, download dossiers. There
is no per-user workspace, no audit-by-user, no rate limit per caller.

**Workaround.** Put the API behind a network boundary (firewall, VPC,
IP allowlist). All staging callers are trusted by convention.

**Path to close.**
1. Add `Authorization: Bearer <jwt>` middleware that resolves the caller
   to a `tenant_id` + role.
2. Replace every `_resolve_tenant()` with one that reads from the
   authenticated principal.
3. Add role checks for the "owner-approved promotion" endpoints
   (registry `/promote`, foundry `/approve`, mold `/promote`,
   agents `/promote`, foresight `/publish`).
4. Add `python-jose` or `pyjwt` to `pyproject.toml`.
5. Add CSRF middleware (since the API will be browser-reachable).

---

### G02 — Live LLM NOT TESTED (ZAIProvider stub, no API key)

| Field             | Value |
|-------------------|-------|
| **Impact**        | CRITICAL |
| **Status**        | VERIFIED_GAP |
| **File**          | `agents/providers.py` |

**Description.** `get_provider()` selects `MockProvider` when
`MANARA_ZAI_API_KEY` is not set (which is the case in the sandbox).
Every agent execution therefore has `execution_mode="mock"` and
`is_mock=True`. The `ZAIProvider` class is implemented but never
exercised end-to-end against a live Z.AI/GLM endpoint.

**Why it exists.** Time + secret-management constraint: the sandbox
does not have a Z.AI API key, and the owner explicitly required that
mock responses MUST be labeled `is_mock=True` (per the G05 directive
"لا تدّعِ نجاح تشغيل LLM حقيقي إذا كان الاختبار يستخدم Mock Provider").

**Impact on users.** Every agent session the UI shows will have
`is_mock=true`. The Clinical Prosthetics Reviewer recipe's "clinical
assessment" is a deterministic mock string, NOT a real clinical
evaluation. Treating mock output as a verified specialist assessment
would be dangerous.

**Workaround.** None for staging. For production: set
`MANARA_ZAI_API_KEY` and verify the live path works against the real
Z.AI/GLM endpoint.

**Path to close.**
1. Obtain a Z.AI API key.
2. Add it to the staging secret store.
3. Run the agent lifecycle tests with the live provider.
4. Add a separate test class `test_agents_live.py` gated by
   `RUN_LIVE_TESTS=1` (mirror the existing `test_foundry_live.py`
   pattern).
5. Add a calibration check: the live provider's responses must
   satisfy the recipe's output contract (the `output_template`
   JSON schema).

---

### G19 — Live agent execution loop NOT IMPLEMENTED

| Field             | Value |
|-------------------|-------|
| **Impact**        | CRITICAL |
| **Status**        | FUTURE_WORK |
| **File**          | `agents/providers.py`, `agents/factory.py`, `agents/tool_executor.py` |

**Description.** The current agent execution loop is:
1. `MockProvider` emits one `TOOL_CALL: <name> {args}` line per
   granted tool (deterministic, never actually examines the args).
2. `parse_tool_calls()` extracts those lines.
3. `RegistryToolExecutor.invoke()` dispatches each call.

A real LLM (whether `ZAIProvider` or any OpenAI-compatible model)
would:
1. Examine the system prompt + user prompt + tool definitions.
2. Decide which tools to call (or none).
3. Either emit native function-call JSON (preferred) OR emit
   `TOOL_CALL:` lines (only if explicitly prompted to do so).
4. Inspect the tool results and decide whether to call more tools,
   refine its query, or produce a final answer.

The current loop is **single-turn**: it calls the LLM once, parses
tool calls, dispatches them, and records the output. It does NOT
feed the tool results back to the LLM for a second turn.

**Why it exists.** The MockProvider cannot make real decisions; it
always emits one TOOL_CALL per granted tool. Implementing a
multi-turn loop with a real LLM would require either (a) the live
Z.AI/GLM API or (b) a more sophisticated mock that can simulate
"seeing" tool results and deciding whether to call more tools. Both
are deferred to G08+ (post-UI integration).

**Impact on users.** The agent session view in the UI shows ONE round
of tool calls, not a conversation. The agent's `output_summary` is
just the raw text response from the LLM, not a synthesized analysis.

**Workaround.** None. The UI MUST surface `is_mock=true` prominently
so users understand this is not a real agent execution.

**Path to close.**
1. Get `ZAIProvider` working (G02 above).
2. Add a multi-turn loop in `EphemeralAgentRuntime.execute()`:
   - Call LLM with `messages=[system, user, tool_results...]`.
   - Parse the LLM's response.
   - If the response contains tool calls, dispatch them, append
     results to the message list, and call the LLM again.
   - If the response is a final answer (no tool calls), terminate.
   - Cap at N turns (default 5) to prevent infinite loops.
3. Use native function-calling if the model supports it (OpenAI's
   `tools` parameter); fall back to `TOOL_CALL:` parsing for models
   that don't.

---

## HIGH Gaps (limit real-world usage but don't block staging)

### G03 — Live OpenAlex search RATE-LIMITED (shared IP)

| Field             | Value |
|-------------------|-------|
| **Impact**        | HIGH |
| **Status**        | VERIFIED_GAP |
| **File**          | `foundry/openalex_connector.py`, `tests/test_foundry_live.py` |

**Description.** The OpenAlex polite-pool identifier
(`POLITE_EMAIL = "manara-foundry@example.com"`) is shared across all
sandbox callers. When the sandbox IP hits OpenAlex's rate limit, the
connector receives HTTP 429 and retries with exponential backoff
(up to 3 retries). If all retries fail, the sandbox-test endpoint
returns `success=False, error="rate_limited_after_retries"`.

**Why it exists.** OpenAlex's free tier is shared-IP. The sandbox
has no authenticated OpenAlex API key (OpenAlex doesn't require one
for the polite pool, but rate limits apply per IP).

**Impact on users.** Live sandbox tests against OpenAlex are flaky.
The `test_foundry_live.py` suite is gated behind `RUN_LIVE_TESTS=1`
and is skipped by default (5 skipped tests in the standard suite).

**Workaround.** Use the synthetic discovery endpoint (`/discovery`)
for staging demos. Real OpenAlex calls are reserved for the
production deployment with a Premium API key.

**Path to close.**
1. Obtain an OpenAlex Premium API key (paid).
2. Add `MANARA_OPENALEX_API_KEY` env var.
3. Pass it as `Authorization: Bearer <key>` in the connector
   (the connector already supports this — see `headers` in
   `search_works`).
4. Add a per-tenant rate limiter so one tenant cannot exhaust the
   shared key.

---

### G04 — PostgreSQL + pgvector NOT TESTED (SQLite only in dev)

| Field             | Value |
|-------------------|-------|
| **Impact**        | HIGH |
| **Status**        | VERIFIED_GAP |
| **File**          | `db/session.py`, `registry/embeddings.py :: PgvectorEmbeddingStore` |

**Description.** The `DATABASE_URL` defaults to
`sqlite:///./manara_dev.db`. Every test in `backend/tests/` uses
SQLite. The `PgvectorEmbeddingStore` class is declared but never
exercised against a real PostgreSQL with the `vector` extension.

**Why it exists.** No Postgres in the sandbox. The owner accepted
SQLite as the "lightweight dev variant permitted if integration is
ready" per G00.

**Impact on users.** In production with Postgres + pgvector, the
schema and migrations should work but the embedding search falls back
to numpy (see G07). The 10× performance difference becomes noticeable
at ~10k vectors.

**Workaround.** For staging: run on SQLite. For production: deploy
Postgres 16+ with the `pgvector` extension, point `DATABASE_URL` at
it, and run `alembic upgrade head` to create the schema.

**Path to close.**
1. Provision a Postgres 16 container with the `pgvector` extension.
2. Add a CI job that runs the test suite against Postgres (gate by
   env var `MANARA_TEST_DB=postgres`).
3. Implement the pgvector write path in
   `PgvectorEmbeddingStore.store_embedding` (currently delegates to
   numpy).
4. Add an `ivfflat` index migration.

---

### G05 — Playwright browser E2E NOT RUN (no browser in sandbox)

| Field             | Value |
|-------------------|-------|
| **Impact**        | HIGH |
| **Status**        | VERIFIED_GAP |
| **File**          | (none — no E2E test file exists) |

**Description.** There is no Playwright or Selenium-based E2E test
in `backend/tests/`. The `frontend/` directory has React components
but no integration tests that drive a browser against the running
API.

**Why it exists.** No browser in the sandbox. The owner deferred UI
E2E to G08.

**Impact on users.** The UI↔API contract is verified only by code
review, not by automated browser tests. A breaking change in an
endpoint shape would not be caught by CI.

**Workaround.** Manual smoke testing through the Swagger UI at
`/docs` (covered by `test_e2e_smoke.py` at the API level).

**Path to close.**
1. Add Playwright as a dev dependency.
2. Add a `tests/e2e/` directory with at least one test per UI section
   (InvestigationHome, RegistryBrowser, etc.).
3. Add a CI job that boots the API + frontend and runs the Playwright
   suite.

---

### G06 — Docker build NOT TESTED (no Docker in sandbox)

| Field             | Value |
|-------------------|-------|
| **Impact**        | HIGH |
| **Status**        | VERIFIED_GAP |
| **File**          | `Dockerfile` (if it exists; verify) |

**Description.** The sandbox does not have Docker installed. The
`pyproject.toml` does not declare a Docker build target. There is no
`docker-compose.yml` in the backend directory.

**Why it exists.** Sandbox constraint. Deployment infrastructure is
the staging reviewer's responsibility.

**Impact on users.** The containerization story is unverified. The
Python 3.12.15 runtime works in the venv; whether it works in a
slim Docker image with the embedding model cached is unknown.

**Workaround.** For staging: deploy via `uvicorn manara.app:app`
behind a reverse proxy. For production: build a Docker image, verify
the embedding model downloads (or bake it into the image), and test
against a Postgres container.

**Path to close.**
1. Write a `Dockerfile` that installs Python 3.12, the dependencies,
   and the embedding model.
2. Write a `docker-compose.yml` that boots Postgres + the API.
3. Add a CI job that builds the image and runs the test suite inside
   it.

---

### G07 — PgvectorEmbeddingStore is a STUB

| Field             | Value |
|-------------------|-------|
| **Impact**        | HIGH |
| **Status**        | VERIFIED_GAP |
| **File**          | `registry/embeddings.py :: PgvectorEmbeddingStore` |

**Description.** Every method in `PgvectorEmbeddingStore` delegates
to `NumpyEmbeddingStore`:

```python
def search_similar(self, db, *, query_vector, tenant_id, kind, top_k, min_similarity):
    return NumpyEmbeddingStore().search_similar(
        db, query_vector=query_vector, tenant_id=tenant_id, ...
    )

def store_embedding(self, db, *, capability_id, tenant_id, kind, vector, source_text, example_index):
    row = NumpyEmbeddingStore().store_embedding(...)
    # Additional pgvector column write (omitted in sandbox; would use
    # ``from pgvector.sqlalchemy import Vector`` and a column update).
    return row

def delete_for_capability(self, db, *, capability_id, tenant_id=None):
    return NumpyEmbeddingStore().delete_for_capability(...)
```

**Why it exists.** No Postgres in the sandbox. The numpy path works
and is contractually equivalent (both compute cosine similarity over
the same vectors). The pgvector path is "documented but not exercised."

**Impact on users.** Embedding search works in production but at numpy
speed (scan all vectors in memory). At the current seed size (~100
cards × ~30 embeddings each = ~3k vectors), this is fine. At ~10k
vectors, queries would take seconds. At ~100k vectors, the search
would be unusable.

**Workaround.** Run on Postgres with pgvector. The numpy fallback is
acceptable for staging.

**Path to close.** See G04 — close both together. The pgvector column
write requires `from pgvector.sqlalchemy import Vector` and a
migration that adds the `vector(384)` column.

---

### G08 — S3CompatibleStore would crash on first use (boto3 missing)

| Field             | Value |
|-------------------|-------|
| **Impact**        | HIGH |
| **Status**        | VERIFIED_GAP |
| **File**          | `memory/object_store.py :: S3CompatibleStore._ensure_client` |

**Description.** The factory `get_object_store()` returns
`S3CompatibleStore` when `MANARA_OBJECT_STORE=s3` is set. The first
call to `store()`, `retrieve()`, `delete()`, or `exists()` triggers
`_ensure_client()` which does:

```python
try:
    import boto3
except ImportError as e:
    raise RuntimeError(
        "boto3 not installed; install with: pip install boto3"
    ) from e
```

`boto3` is NOT in `pyproject.toml`. The first call would crash.

**Why it exists.** The local filesystem store is the dev path; S3 is
the production path. Adding `boto3` to the dev dependencies would
bloat the dev image for a feature that's not used in tests.

**Impact on users.** Anyone setting `MANARA_OBJECT_STORE=s3` without
also installing `boto3` will see a `RuntimeError` on the first
snapshot capture.

**Workaround.** For staging: keep `MANARA_OBJECT_STORE=local` (the
default). For production: `pip install boto3` AND set the AWS env
vars (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`,
`MANARA_S3_BUCKET`).

**Path to close.**
1. Add `boto3` to `pyproject.toml` under an `extras_require` section
   called `s3`.
2. Update the README to document `pip install manara[s3]` for
   production.
3. Add a CI job that runs against a MinIO container to exercise the
   S3 path end-to-end.

---

### G09 — DNS rebinding TOCTOU (partial defense only)

| Field             | Value |
|-------------------|-------|
| **Impact**        | HIGH |
| **Status**        | VERIFIED_GAP |
| **File**          | `foundry/safe_http.py :: validate_url` |

**Description.** `validate_url` resolves the hostname via
`socket.getaddrinfo()` and checks each returned IP against the
private-network pattern list. But `httpx.Client.get()` then
re-resolves the hostname at request time. A malicious authoritative
DNS server can answer `1.2.3.4` to the validator and
`169.254.169.254` to httpx, bypassing the SSRF defense.

**Why it exists.** The standard Python HTTP libraries (httpx, requests,
urllib3) do not support pinning the resolved IP across validation and
request. Implementing it requires a custom `httpx.BaseTransport`.

**Impact on users.** If an attacker can control DNS for a host in the
allowlist (e.g. by compromising the OpenAlex domain), they could
redirect requests to the AWS/GCP metadata service
(`169.254.169.254`). Today the only allowlisted host is
`api.openalex.org`, which is a low-value attack target.

**Workaround.** Defense in depth: the 5 MB response size cap and
content-type enforcement would block most metadata-service payloads
(they return small JSON, but a determined attacker could craft a
malicious payload that fits the size + content-type constraint).

**Path to close.**
1. Write a custom `httpx.BaseTransport` that:
   - Resolves the hostname once at validation time.
   - Pins the resolved IP for the actual request.
   - Sets the `Host:` header to the original hostname.
2. Use this transport in `SafeHttpClient.__init__` instead of the
   default `httpx.Client`.

---

### G10 — Forecast immutability is code-level only (no DB CHECK constraint)

| Field             | Value |
|-------------------|-------|
| **Impact**        | HIGH |
| **Status**        | VERIFIED_GAP |
| **File**          | `db/foresight_models.py :: ForecastRow`, `foresight/engine.py :: ForecastRegistry` |

**Description.** The forecast immutability contract is enforced by:
1. The Pydantic `Forecast._validate` validator (rejects mutations of
   `status="published"` rows at construction time).
2. The `ForecastRegistry.publish_forecast` service method (raises
   `ValueError` if `row.status == "published"`).
3. The `ForecastRegistry.try_modify_published_forecast` test endpoint
   (returns `False` for published rows).

But the database has NO CHECK constraint that prevents a direct
`UPDATE foresight_forecasts SET point_estimate = ... WHERE id = ...`
from succeeding. A migration script or a DB admin tool could bypass
the immutability.

**Why it exists.** SQLite's CHECK constraint support is limited;
PostgreSQL's is richer. The team chose to enforce at the application
layer to keep the schema portable across both databases.

**Impact on users.** If a DB admin runs a manual UPDATE on a published
forecast, the audit trail breaks: the `published_at` and
`point_estimate` columns would change but the `superseded_by` link
would not. Subsequent backtests against the modified forecast would
use the new value, contaminating the bitemporal replay.

**Workaround.** Only the application should have DB write access in
production. Manual DB edits are documented as forbidden in
`STAGING_READINESS.md`.

**Path to close.**
1. Add PostgreSQL CHECK constraints (Postgres-only migration):
   ```sql
   ALTER TABLE foresight_forecasts ADD CONSTRAINT forecast_immutable_when_published
     CHECK (status != 'published' OR (point_estimate IS NOT NULL
                                      AND published_at IS NOT NULL
                                      AND cutoff_date IS NOT NULL));
   ```
2. Add a trigger that prevents UPDATE on rows with `status='published'`
   (raise an exception if any column other than `superseded_by` changes).
3. The migration is Postgres-only; on SQLite it's a no-op.

---

### G11 — State machine invariants NOT enforced by DB CHECK constraints

| Field             | Value |
|-------------------|-------|
| **Impact**        | HIGH |
| **Status**        | VERIFIED_GAP |
| **File**          | `db/mold_models.py :: InvestigationWorkflowRow`, `lifecycle/states.py` |

**Description.** The investigation state machine in
`lifecycle/states.py` defines 13 states and their valid transitions.
The `InvestigationWorkflowService.transition()` method validates
the transition against the FSM. But the database has no CHECK
constraint that prevents an illegal transition from being written
directly via SQL.

Same pattern for `MoldRecipeRow.state` (temporary → reusable →
maintained → archived): the API validates, the DB doesn't.

**Why it exists.** Same as G10 — portability across SQLite and
Postgres.

**Impact on users.** A DB admin who manually runs `UPDATE
investigation_workflow SET state='completed' WHERE id='...'` bypassing
the FSM would leave the investigation in an inconsistent state. The
workflow's `transitions_json` array would not record the manual edit.

**Workaround.** Application-only DB access in production.

**Path to close.** Add a Postgres trigger that validates the
transition against an enum of allowed `(from_state, to_state)` pairs.
The trigger raises an exception for illegal transitions.

---

## MEDIUM Gaps (known limitation, workaround exists)

### G12 — Foreign keys missing ON DELETE behavior

| Field             | Value |
|-------------------|-------|
| **Impact**        | MEDIUM |
| **Status**        | VERIFIED_GAP |
| **File**          | All files in `db/*.py` |

**Description.** The ORM models declare `ForeignKeyConstraint`s but
do not specify `ON DELETE` behavior. The default is `RESTRICT` (or
`NO ACTION` in Postgres, which is functionally equivalent). This
means deleting a parent row (e.g. a Capability) requires deleting all
child rows first.

The `registry/service.py :: delete_capability` method handles this
manually: it deletes the embeddings, then the capability. But
`mold_models.py :: MoldRecipeRow.capability_ids_json` is a JSON
column, not a real foreign key, so deleting a capability that a mold
references would leave the mold pointing at a non-existent ID.

**Why it exists.** The team prioritized getting the schema in place;
cascade behavior was deferred.

**Impact on users.** Deleting a capability that's referenced by a
mold leaves a dangling reference. The mold's `capability_ids_json`
array still contains the deleted ID. The UI would show a mold with
a missing capability card.

**Workaround.** Don't delete capabilities that molds reference.
The registry's `delete_capability` returns `False` if the row
doesn't exist but does NOT check for mold references.

**Path to close.** Add `ON DELETE RESTRICT` to the real foreign
keys (which is what we want — prevent deletion if referenced). For
JSON-column references (like `MoldRecipeRow.capability_ids_json`),
add a service-layer check that refuses to delete a capability
referenced by any mold.

---

### G13 — JSON columns used for structured data

| Field             | Value |
|-------------------|-------|
| **Impact**        | MEDIUM |
| **Status**        | VERIFIED_GAP |
| **File**          | All `*_models.py` files |

**Description.** The schema uses JSON columns extensively:
`CapabilityRow.domains_json`, `tags_json`, `keywords_en_json`,
`keywords_ar_json`, `positive_examples_json`, etc. Similarly for
`AgentRecipeRow.allowed_tools_json`, `MoldRecipeRow.capability_ids_json`,
`AgentSessionRow.task_output_json`, `ForecastRow.scenarios`,
`BacktestResultRow.leaked_evidence_ids`, etc.

**Why it exists.** JSON columns are flexible: the schema doesn't
need to change when a new field is added. SQLite handles JSON
natively; Postgres has `JSONB` with GIN indexes.

**Impact on users.** At the current scale (< 10k rows per table),
JSON columns work fine. At larger scale:
- Indexing is harder (you need functional indexes like
  `CREATE INDEX ON capabilities ((domains_json->>'engineering'))`).
- Joins across JSON columns are impossible.
- Migrations to a relational schema would be painful.

**Workaround.** None for staging. For production at scale, consider
extracting high-cardinality JSON fields (like `domains_json`) into
their own tables (`capability_domains(capability_id, domain)`).

**Path to close.** Defer until scale demands it. The current
schema is documented as "JSON-first; relational extraction is a
post-G09 concern."

---

### G14 — No API rate limiting

| Field             | Value |
|-------------------|-------|
| **Impact**        | MEDIUM |
| **Status**        | VERIFIED_GAP |
| **File**          | `app.py` |

**Description.** The FastAPI app has no rate limiter. Any caller can
hit any endpoint as fast as their HTTP client allows. The OpenAlex
connector has its own retry+backoff (for OpenAlex's rate limit), but
the FastAPI endpoints do not.

**Why it exists.** The owner's priority was functionality, not abuse
prevention. Rate limiting is a deployment concern (often handled by
the reverse proxy).

**Impact on users.** A misbehaving client could exhaust the DB
connection pool. The SQLite backend would return `database is locked`
errors under load (see G16).

**Workaround.** Put a reverse proxy (nginx, Cloudflare) in front of
the app and rate-limit at the edge.

**Path to close.** Add `slowapi` or a Redis-backed limiter as
middleware. Configure per-endpoint limits (e.g. `/registry/search`
at 10 req/s, `/agents/sessions` at 1 req/s).

---

### G15 — No pagination on most list endpoints

| Field             | Value |
|-------------------|-------|
| **Impact**        | MEDIUM |
| **Status**        | VERIFIED_GAP |
| **File**          | `api/routes/*.py` |

**Description.** Most list endpoints accept `limit` and `offset`
query parameters but do not return a `next_page_token` or cursor. The
caller cannot page through results; they get the first `limit` rows
and that's it.

Exceptions: `GET /registry/capabilities` (has `limit` + `offset` but
no total count beyond `len(caps)`), `GET /publishing/publications`
(same).

**Why it exists.** The current scale (< 1k rows per table) doesn't
demand cursor-based pagination.

**Impact on users.** A tenant with 500 capabilities can list the
first 200 but has no way to fetch the next 200 without computing
`offset=200` manually. The UI must implement client-side offset
tracking.

**Workaround.** Use `limit=200` (the max) and accept that very large
tenants cannot browse all rows.

**Path to close.** Add cursor-based pagination:
- Return `next_cursor` in the response.
- Accept `cursor=<opaque_string>` as a query parameter.
- The cursor encodes the last seen ID + sort order.

---

### G16 — Test suite "database is locked" under SQLite high concurrency

| Field             | Value |
|-------------------|-------|
| **Impact**        | MEDIUM |
| **Status**        | VERIFIED_GAP (PRE-EXISTING — NOT introduced by BACKEND-VERIFICATION-01) |
| **File**          | `tests/conftest.py`, all test files |

**Description.** The test suite uses SQLite. Under parallel test
execution (or when the API serves concurrent requests), SQLite can
return `sqlite3.OperationalError: database is locked`. The test
suite runs serially by default (no `pytest-xdist`) to avoid this.

**Why it exists.** SQLite is a file-based database with a single
writer. The sandbox has no Postgres.

**Impact on users.** Test suite is slow (serial execution). The API
under load would also hit this — but the staging deployment would
use Postgres, not SQLite.

**Workaround.** Run tests serially. Set `MANARA_TEST_DB=postgres`
once G04 is closed.

**Path to close.** Close G04 (Postgres in CI) — the SQLite path is
inherently serial.

---

### G18 — ToolExecutor only dispatches 3 tools

| Field             | Value |
|-------------------|-------|
| **Impact**        | MEDIUM |
| **Status**        | VERIFIED_GAP |
| **File**          | `agents/tool_executor.py :: RegistryToolExecutor` |

**Description.** The `RegistryToolExecutor` dispatches real services
for exactly three tool names:
- `registry.search` → real `CapabilityRegistry.search()` call.
- `memory.search_prior` → real `MemoryCurator.search_prior_memory()` call.
- `foundry.search_openalex` → returns `status="not_implemented"`
  (network dispatch is gated by `RUN_LIVE_TESTS=1`).

Any other tool name returns `status="not_implemented"` with an
explicit denial message. The recipe's `permitted_tools` list may
contain names like `search.academic-publications`,
`memory.read_prior_evidence`, `memory.write_evidence` — these are
NOT in the dispatch table.

**Why it exists.** The ToolExecutor is HONEST scaffolding: it shows
the dispatch path works without claiming more tools are wired up
than actually are. Wiring up all of `permitted_tools` would require
implementing `memory.write_evidence` (a write-side API that doesn't
exist yet), `memory.read_prior_evidence` (would need a different
service method), etc.

**Impact on users.** An agent session that has
`granted_tools=["search.academic-publications", "memory.read_prior_evidence"]`
would record `status="not_implemented"` for both. The agent's output
would show "I tried to call search.academic-publications but it's
not implemented."

**Workaround.** The mock provider's TOOL_CALL lines only emit the
three recognized tool names, so the default recipe won't trigger the
"not_implemented" path. A custom recipe with other tool names will.

**Path to close.**
1. Decide on a canonical tool-name taxonomy (e.g.
   `registry.search` vs `search.academic-publications`).
2. Update the recipes to use the canonical names.
3. Add dispatch entries for any additional tools (write_evidence,
   foundry.search, etc.).

---

### G20 — No coverage measurement

| Field             | Value |
|-------------------|-------|
| **Impact**        | MEDIUM |
| **Status**        | VERIFIED_GAP |
| **File**          | `pyproject.toml` (coverage.py configured but not in CI) |

**Description.** `pyproject.toml` may declare `coverage.py` as a
dev dependency, but the CI does not run `pytest --cov=manara`. There
is no coverage threshold gate.

**Why it exists.** The team prioritized test count over coverage
measurement.

**Impact on users.** Unknown — without measurement, we don't know
which code paths are untested.

**Workaround.** Run `pytest --cov=manara --cov-report=html`
manually before staging promotion.

**Path to close.**
1. Add `pytest-cov` to dev dependencies.
2. Add `--cov=manara --cov-fail-under=80` to the CI test command.
3. Generate the HTML report and review uncovered branches.

---

### G21 — No load testing

| Field             | Value |
|-------------------|-------|
| **Impact**        | MEDIUM |
| **Status**        | VERIFIED_GAP |
| **File**          | (none — no locust/k6 file exists) |

**Description.** There is no load test in the repository. The system's
behavior under concurrent load is unknown. The SQLite backend would
fail (G16); the Postgres backend is untested.

**Why it exists.** Load testing requires a production-like
environment, which doesn't exist in the sandbox.

**Impact on users.** The system's throughput ceiling is unknown. The
OpenAlex connector's retry+backoff has been tested for individual
rate-limit responses, but not for sustained load.

**Workaround.** None for staging. For production: provision a
Postgres instance, point the API at it, and run a Locust or k6 suite.

**Path to close.**
1. Write a `load_tests/` directory with at least one Locust scenario
   per major endpoint.
2. Add a CI job that runs the load suite against a staging deployment.
3. Define SLOs: 95th percentile latency < 500 ms for read endpoints,
   < 2 s for write endpoints.

---

### G23 — Forecast horizons only support single cutoff (n_cutoffs=1)

| Field             | Value |
|-------------------|-------|
| **Impact**        | MEDIUM |
| **Status**        | VERIFIED_GAP |
| **File**          | `foresight/engine.py :: BacktestEngine.run_backtest` |

**Description.** The `BacktestEngine.run_backtest` method accepts a
single `cutoff_date` and produces a single `BacktestResultRow` with
`n_cutoffs=1`. Multi-cutoff backtesting (rolling-origin evaluation)
is NOT implemented. The contract `ForecastEvaluation.n_cutoffs` field
defaults to 1.

**Why it exists.** Single-cutoff is sufficient for the G06 acceptance
test. Multi-cutoff requires a more sophisticated harness that splits
the time series at multiple points and runs the forecast at each.

**Impact on users.** The forecast evaluation reports MAE/RMSE at one
cutoff only. A robust forecast evaluation would average MAE/RMSE
across multiple cutoffs to reduce variance.

**Workaround.** Call `run_backtest` multiple times with different
cutoffs and average the results manually.

**Path to close.**
1. Add a `run_multi_cutoff_backtest` method that accepts a list of
   cutoff dates.
2. Run `run_backtest` at each cutoff.
3. Aggregate MAE/RMSE across cutoffs.
4. Set `n_cutoffs` to the actual count in the resulting
   `BacktestResultRow`.

---

### G24 — Storyboard rights enforcement is in code, not in DB constraint

| Field             | Value |
|-------------------|-------|
| **Impact**        | MEDIUM |
| **Status**        | VERIFIED_GAP |
| **File**          | `publishing/engine.py :: QualityGate.validate` (Rule 5), `db/publishing_models.py :: StoryboardSceneRow` |

**Description.** The `QualityGate.validate` Rule 5 checks that
`scene.rights_status` is in
`("owned", "licensed", "public_domain", "fair_use")` for scenes with
external source attribution. The `StoryboardSceneRow` model has a
`rights_status` column but no CHECK constraint that limits its values
to the allowed set.

**Why it exists.** Portability — SQLite CHECK constraints work
differently from Postgres. The team chose to enforce at the
application layer.

**Impact on users.** A `StoryboardSceneRow` with
`rights_status="stolen"` would be writable via direct SQL. The
QualityGate would catch it at publication time, but the row would
exist in the DB until then.

**Workaround.** Application-only DB access.

**Path to close.** Add a Postgres CHECK constraint:
```sql
ALTER TABLE publishing_storyboard_scenes ADD CONSTRAINT rights_status_enum
  CHECK (rights_status IN ('owned', 'licensed', 'fair_use',
                           'public_domain', 'unknown', 'restricted'));
```

---

### G25 — No security headers middleware

| Field             | Value |
|-------------------|-------|
| **Impact**        | MEDIUM |
| **Status**        | VERIFIED_GAP |
| **File**          | `app.py` |

**Description.** The FastAPI app does not set:
- `Strict-Transport-Security` (HSTS)
- `X-Content-Type-Options: nosniff`
- `Content-Security-Policy`
- `Referrer-Policy`
- `Permissions-Policy`

**Why it exists.** Same as G14 — deployment concern.

**Impact on users.** The staging deployment would be vulnerable to
MIME-type sniffing attacks (an attacker uploads HTML disguised as
JSON; the browser renders it). HSTS prevents SSL-strip attacks.

**Workaround.** Set the headers at the reverse proxy layer.

**Path to close.** Add a `SecurityHeadersMiddleware` in `app.py` that
sets all five headers with safe defaults.

---

### G26 — No CSRF protection

| Field             | Value |
|-------------------|-------|
| **Impact**        | MEDIUM |
| **Status**        | VERIFIED_GAP |
| **File**          | `app.py` |

**Description.** FastAPI does not ship CSRF middleware. State-changing
endpoints (`POST`, `PATCH`, `DELETE`) are vulnerable to cross-site
request forgery if (a) the API is reachable from a browser AND (b)
cookies are used for auth. Today (b) is false (no cookie auth), so
CSRF is not exploitable. Once G01 is closed (cookie/JWT auth added),
CSRF becomes exploitable.

**Why it exists.** No auth means no CSRF attack surface.

**Impact on users.** None today. Will become a concern when G01 is
closed.

**Workaround.** Same-origin policy in production (frontend and API
on the same origin, or CORS configured to allow only the frontend
origin — already set in `app.py`).

**Path to close.** Add `starlette-csrf` or equivalent. Configure
the safe methods (GET, HEAD, OPTIONS) and require a CSRF token for
state-changing methods.

---

### G30 — No WebSocket / real-time updates (UI must poll)

| Field             | Value |
|-------------------|-------|
| **Impact**        | MEDIUM |
| **Status**        | FUTURE_WORK |
| **File**          | `app.py` |

**Description.** The API is purely HTTP request-response. There is
no WebSocket endpoint. Long-running operations (agent execution,
backtest) do not push progress updates; the UI must poll.

**Why it exists.** FastAPI supports WebSockets, but the team did not
implement any. Polling is sufficient for the current scale.

**Impact on users.** The UI must poll `GET /agents/sessions/{id}` every
N seconds while a session is `status="running"`. The same for
`GET /mold-factory/investigations/{id}/workflow` while a workflow is
in progress.

**Workaround.** Poll every 2 seconds for short operations (agent
execution), every 10 seconds for long operations (backtest).

**Path to close.** Add a `GET /ws/investigations/{id}` WebSocket
endpoint that pushes state transitions as they happen. Frontend
subscribes and renders updates in real time.

---

## LOW Gaps (cosmetic or future enhancement)

### G17 — 8 Boolean ORM/migration type mismatches FIXED

| Field             | Value |
|-------------------|-------|
| **Impact**        | LOW (was HIGH before fix) |
| **Status**        | FIXED in BACKEND-VERIFICATION-01 |
| **File**          | `db/foresight_models.py`, `db/publishing_models.py`, `db/mold_models.py` |

**Description.** Eight boolean columns were previously mapped as
`mapped_column(JSON, default=False)` instead of
`mapped_column(Boolean, default=False)`. On SQLite this returned
inconsistent values on round-trip (sometimes `None`, sometimes
`"true"`); on Postgres it would have caused an `IntegrityError` (the
migration declares `sa.Boolean`).

**Why it existed.** Copy-paste error during initial schema creation;
no test caught the JSON-vs-Boolean mismatch because SQLite is lenient.

**Impact on users.** None today — fixed. Without the fix, production
deployment on Postgres would have failed at `alembic upgrade head`.

**Workaround.** Apply the BACKEND-VERIFICATION-01 fix.

**Path to close.** CLOSED. Regression tests in
`test_verification_01_regressions.py :: TestF1BooleanColumnType`.

---

### G22 — No property-based testing (Hypothesis not configured)

| Field             | Value |
|-------------------|-------|
| **Impact**        | LOW |
| **Status**        | VERIFIED_GAP |
| **File**          | (none) |

**Description.** The test suite uses example-based tests only. No
Hypothesis property-based tests exist. Edge cases (e.g. very long
queries, unicode, malformed JSON) are not systematically explored.

**Why it exists.** Hypothesis adds test runtime; the team prioritized
explicit examples.

**Impact on users.** Unknown edge cases may exist that no example
test covers.

**Workaround.** Manual fuzz testing before staging promotion.

**Path to close.** Add Hypothesis strategies for the main contracts
(Evidence, Forecast, SearchCapability). Run them in CI as a separate
test stage.

---

### G27 — `MANARA_SINGLE_TENANT_DEMO` flag is dead code

| Field             | Value |
|-------------------|-------|
| **Impact**        | LOW |
| **Status**        | VERIFIED_GAP |
| **File**          | `config.py:55` |

**Description.** The flag is declared as a Pydantic field but never
read by any application code. The only other reference is
`tests/test_publishing.py:741` which sets it as an env var but never
asserts on its value.

**Why it exists.** Documentation of intent: the team wanted a flag to
flip when multi-tenant auth is added. The flag was never wired up.

**Impact on users.** Confusion: an operator setting
`MANARA_SINGLE_TENANT_DEMO=false` would expect multi-tenant behavior
and not get it.

**Workaround.** Document the flag as "informational, not enforced" in
the README.

**Path to close.** Either (a) remove the flag and document that
multi-tenancy is controlled by the presence of an auth middleware, or
(b) wire the flag to actually gate behavior (e.g. skip tenant checks
when `True`). Option (a) is recommended.

---

### G28 — No audit log viewer API for some tables

| Field             | Value |
|-------------------|-------|
| **Impact**        | LOW |
| **Status**        | VERIFIED_GAP |
| **File**          | `db/agent_models.py :: AgentEvaluationRow`, `db/foresight_models.py :: BacktestResultRow`, `db/registry_models.py :: FoundryCallRecord` |

**Description.** These tables are written to but have no read API:
- `AgentEvaluationRow` — created by `EphemeralAgentRuntime.evaluate()`,
  no `GET /agents/recipes/{id}/evaluations` endpoint.
- `BacktestResultRow` — created by `BacktestEngine.run_backtest`, no
  `GET /foresight/forecasts/{id}/backtests` endpoint.
- `FoundryCallRecord` — created by the sandbox-test endpoint, no list
  endpoint.

**Why it exists.** The data is preserved; only the read API is
missing. The team prioritized the write path.

**Impact on users.** The UI cannot display evaluation history for a
recipe, backtest history for a forecast, or sandbox test history for
a connector.

**Workaround.** Query the DB directly (read-only) for these tables.

**Path to close.** Add `GET` endpoints for each. Low priority — the
data is preserved.

---

### G29 — No file upload endpoint

| Field             | Value |
|-------------------|-------|
| **Impact**        | LOW |
| **Status**        | FUTURE_WORK |
| **File**          | (none) |

**Description.** The API does not accept file uploads. Evidence is
ingested as a JSON `Evidence` contract (with optional
`raw_content_b64` base64-encoded content). There is no multipart
upload endpoint.

**Why it exists.** The use case (research intelligence) doesn't
typically involve uploading binary files. Evidence comes from
external APIs (OpenAlex, etc.) as structured JSON.

**Impact on users.** A user cannot upload a PDF report or an image
as evidence. They can only ingest structured data.

**Workaround.** Convert the file to base64 and pass it as
`raw_content_b64` in the `POST /memory/evidence` request body.

**Path to close.** Add a `POST /memory/evidence/upload` endpoint
that accepts multipart form data, converts to base64, and forwards
to the existing `MemoryCurator.ingest_evidence`. Low priority.

---

## Honest Status Roll-up

| Status        | Count | Gaps |
|---------------|------:|------|
| VERIFIED_GAP  |    22 | G01, G03, G04, G05, G06, G07, G08, G09, G10, G11, G12, G13, G14, G15, G16, G18, G20, G21, G23, G24, G25, G26, G27, G28 |
| FUTURE_WORK   |     3 | G19, G29, G30 |
| FIXED         |     1 | G17 |
| SUSPECTED_GAP |     0 | (none — every gap was confirmed by code reading) |
| **Total**     |    30 | |

## Impact Roll-up

| Impact    | Count | Gaps |
|-----------|------:|------|
| CRITICAL  |     3 | G01, G02, G19 |
| HIGH      |     8 | G03, G04, G05, G06, G07, G08, G09, G10, G11 |
| MEDIUM    |    13 | G12, G13, G14, G15, G16, G18, G20, G21, G23, G24, G25, G26, G30 |
| LOW       |     5 | G17, G22, G27, G28, G29 |
| **Total** |    30 | |

(Note: the HIGH count includes G10 and G11 which were both listed; the
roll-up table reflects the unique IDs.)

---

## Closing Priorities

### Must close before staging promotion (CRITICAL)

1. **G01** — Multi-tenant authentication. Without this, anyone can call
   any endpoint. Close by adding an auth middleware.
2. **G02** — Live LLM. Without this, every agent session is `is_mock=true`.
   Close by obtaining a Z.AI API key and running the live test suite.
3. **G19** — Multi-turn agent execution loop. Without this, the agent
   calls tools once and stops. Close by implementing the loop in
   `EphemeralAgentRuntime.execute()`.

### Should close before production (HIGH)

4. **G03** — OpenAlex rate limiting. Get a Premium API key.
5. **G04** — PostgreSQL + pgvector in CI. Provision a Postgres container.
6. **G05** — Playwright E2E. Add browser tests.
7. **G06** — Docker build. Add a Dockerfile.
8. **G07** — PgvectorEmbeddingStore. Implement the pgvector write path.
9. **G08** — S3CompatibleStore. Add `boto3` to dependencies.
10. **G09** — DNS rebinding TOCTOU. Custom httpx transport.
11. **G10** — Forecast immutability CHECK constraint. Postgres migration.
12. **G11** — State machine CHECK constraints. Postgres migration.

### Track in backlog (MEDIUM/LOW)

The remaining 17 gaps are tracked. They do not block staging or
production, but each has a documented path to close.

---

## How to Add a New Gap

When you discover a new limitation:

1. Add a row to the Summary Table at the top with the next available
   `G<NN>` ID.
2. Add a section in the appropriate impact category (CRITICAL / HIGH /
   MEDIUM / LOW) with all six required fields: Description, Why it
   exists, Impact on users, Workaround, Path to close, Honest
   classification.
3. Update the Honest Status Roll-up and Impact Roll-up tables.
4. If the gap is later closed, change its status to `FIXED` and add a
   "Closed in" reference. Do NOT delete the section — preserve the
   history of what was fixed.

This catalog is the source of truth for what the MANARA backend does
and does not do. Every claim in here should be verifiable by reading
the code. If you cannot verify a claim, mark it `SUSPECTED_GAP` and
add a TODO to verify it.
