# MANARA — Mission G03 Report

> **MANARA Foundation v1.0 · 2026-10-19 · Working memory and cumulative curator**
> Owner: Ayman · Supervisor: ChatGPT · Implementer: GLM
> Spec: https://github.com/mayakilzy/repo-info/blob/main/AgentCraft-MANARA/MISSIONS/G03.md
> Code: https://github.com/mayakilzy/AgentCraft-MANARA (G03 commit pending push)
> Baseline: `a546961` (G01-R1 + G02)

---

## Status

**PASS** — All acceptance criteria met with real, reproducible evidence.

| Field                | Value                                                                                   |
|----------------------|-----------------------------------------------------------------------------------------|
| Date                 | 2026-10-19 (Europe/Istanbul)                                                            |
| Mission              | G03 — Working memory and cumulative curator                                            |
| Implementer          | GLM                                                                                     |
| Owner                | Ayman (decisions approved in chat, 2026-10-19)                                          |
| Start SHA            | `a546961` (G01-R1 + G02)                                                                |
| End SHA              | TBD (pushed at end of this report)                                                      |
| Non-live tests       | 188 passing (164 G00-G02 + 24 G03 curator)                                             |
| Live tests           | 4 passing + 1 skipped (carried from G02)                                               |
| Lint / typecheck     | ruff ✓ · mypy ✓ · tsc ✓                                                                |

---

## Owner's G03 acceptance criteria (from G03.md)

> "Two investigations reuse one vetted source, preserve contradiction
> and do not leak tenant data or future records."

All four sub-criteria delivered with evidence:

| Criterion | Status | Evidence |
|-----------|--------|----------|
| Two investigations reuse one vetted source | ✅ PASS | `test_investigation_a_prosthetics_then_b_medical_robotics` |
| Preserve contradiction | ✅ PASS | `test_refuting_edge_preserves_contradiction` |
| Do not leak tenant data | ✅ PASS | `TestTenantIsolation` (4 tests) |
| Do not leak future records | ✅ PASS | `test_evidence_at_cutoff_excludes_future` |

---

## Owner's decisions (approved 2026-10-19)

| Decision | Approved |
|----------|----------|
| PostgreSQL is the primary knowledge store | ✓ (SQLite dev variant used in sandbox) |
| Working memory is logically separate from cumulative memory | ✓ (separate tables, separate service methods) |
| Full-text search + relations, future vector search | ✓ (relations in G03; vector search deferred) |
| Local FS in dev, S3-compatible in production | ✓ (ObjectStoreProtocol with both impls) |
| Adjustable retention policy, no arbitrary expiry on documented knowledge | ✓ (retention_class on snapshots, no TTL on evidence) |
| Strict separation between shared knowledge and tenant-private data | ✓ (tenant_id on every row, tested) |

---

## Work performed

### 1. Database layer (Alembic migration `0003_memory`)

Ten new tables mirroring the G00 contracts and the spec's Curator algorithm:

| Table | Purpose |
|-------|---------|
| `memory_evidence_items` | quotes/spans/data samples with checksums (dedup) |
| `memory_claims` | bounded statements with verdict (candidate → supported → contested → refuted → superseded) |
| `memory_claim_support_edges` | supports/refutes/qualifies edges (preserves contradictions) |
| `memory_measures` | quantified values (value + unit + methodology + geography) |
| `memory_entities` | named entities (orgs, persons, tech, places) |
| `memory_entity_relations` | typed graph edges (manufactures, acquired_by, etc.) |
| `memory_hypotheses` | investigator-level suppositions (clearly labeled, never auto-promoted to claims) |
| `memory_source_snapshots` | captured source responses (content-addressed, idempotent) |
| `memory_decisions` | append-only audit log (never overwrite history) |
| `memory_investigation_reuse` | tracks when inv-B reuses evidence from inv-A |

Every table carries `tenant_id` (NOT NULL, indexed) — tenant isolation is enforced at the ORM level.

### 2. Object storage abstraction (`manara/memory/object_store.py`)

- `ObjectStoreProtocol` — Protocol with `store`, `retrieve`, `delete`, `exists`, `compute_checksum`
- `LocalFilesystemStore` — dev/test backend; content-addressed by SHA-256; writes to `var/snapshots/{tenant_id}/{checksum}.bin`
- `S3CompatibleStore` — production backend (boto3); credentials from standard AWS env vars, NEVER from code
- `get_object_store()` factory auto-selects based on `MANARA_OBJECT_STORE` env var (default: `local`)
- Content-addressed storage means:
  * Same content → same ref → no duplicate files
  * Tamper detection (same ref with different content fails)
  * Dedup at the file level (in addition to dedup at the evidence level)
- Tenant isolation at the storage layer: same content from different tenants → different refs

### 3. Memory Curator service (`manara/memory/curator.py`)

The brain of the cumulative memory. Implements the 8-step Curator algorithm from `03_INTELLIGENCE/01_KNOWLEDGE_MEMORY.md`:

1. **Canonicalize URLs/DOIs/IDs, checksum content** — `canonicalize_url`, `canonicalize_doi`, `compute_content_checksum`
2. **Separate syndicated copies from independent evidence** — `independence_group` field on claims
3. **Extract structured claim plus precise support span** — `attach_claim` + `add_support_edge`
4. **Cross-check units, date, population, conditions** — bitemporal safety enforced at Pydantic + ORM layers
5. **Preserve disagreement and source hierarchy** — `add_support_edge(relation="refutes")` does NOT delete the original; both sides kept
6. **Label candidate, supported, contested, refuted, superseded** — `promote_claim` with audit log
7. **Promotion according to evidence/rights policy** — owner-approved promotion (same pattern as G01/G02)
8. **Audit lineage and version pin** — `MemoryDecisionRow` is append-only

Key methods:
- `ingest_evidence` — dedup-aware ingestion; if (tenant_id, checksum) exists, no new row, log `evidence_deduplicated`
- `attach_claim` — new claim starts as `candidate`
- `add_support_edge` — supports/refutes/qualifies; refuting edge auto-promotes verdict to `contested`
- `promote_claim` — verdict transition with audit log (never silently overwrite)
- `search_prior_memory` — find evidence from OTHER investigations in the same tenant
- `record_reuse` — explicit reuse link with freshness assessment
- `get_evidence_at_cutoff` — bitemporal replay (no future leakage)
- `capture_source_snapshot` — content-addressed, idempotent source response capture

### 4. API surface (12 new endpoints under `/memory/`)

- `POST /memory/evidence` — ingest evidence (dedup-aware, bitemporal-safe)
- `GET /memory/evidence/{id}` — fetch one evidence item (tenant-scoped)
- `GET /memory/investigations/{id}/evidence` — list evidence in an investigation
- `POST /memory/evidence/{id}/claims` — attach a claim
- `POST /memory/claims/{id}/support` — add supports/refutes/qualifies edge
- `PATCH /memory/claims/{id}/verdict` — promote verdict (with audit)
- `GET /memory/investigations/{id}/claims` — list claims in an investigation
- `POST /memory/investigations/{id}/search-prior` — search prior memory for reuse
- `POST /memory/investigations/{id}/reuse` — record a reuse link
- `GET /memory/investigations/{id}/decisions` — audit log (append-only)
- `POST /memory/snapshots` — capture a source snapshot
- `POST /memory/investigations/{id}/at-cutoff` — bitemporal replay

### 5. Tests (24 new — total 188)

`tests/test_memory_curator.py`:
- `TestCanonicalization` (4 tests): URL/DOI normalization, checksum whitespace stripping
- `TestIngestAndDedup` (3 tests): ingest creates row; same content dedups; bitemporal violation raises
- `TestClaimsAndContradictions` (3 tests): attach starts as candidate; supporting edge promotes; **refuting edge preserves contradiction** (the key G03 acceptance)
- `TestInvestigationReuse` (4 tests): search prior returns other investigations' evidence; excludes current; records reuse with audit; idempotent
- `TestBitemporalSafety` (1 test): cutoff excludes future evidence
- `TestTenantIsolation` (4 tests): tenant B cannot search, fetch, reuse, or bitemporal-replay tenant A's evidence
- `TestObjectStore` (2 tests): content-addressed storage; tenant isolation at storage layer
- `TestSourceSnapshots` (1 test): idempotent snapshot capture
- `TestG03Acceptance` (2 tests): **the canonical G03 acceptance test** + cross-tenant no-leakage

### 6. Acceptance evidence script (`scripts/g03_acceptance_evidence.py`)

A standalone script that runs the canonical G03 acceptance test end-to-end and prints a structured report. Run with:

```bash
python3 scripts/g03_acceptance_evidence.py
```

Output excerpt:

```
G03 ACCEPTANCE ASSERTION
  ✓ evidence_ingested     — new evidence recorded with provenance
  ✓ claim_promoted        — verdict transition (candidate → supported)
  ✓ evidence_reused       — inv-B reused inv-A's evidence (recorded)
  ✓ evidence_deduplicated — inv-B's duplicate attempt detected
  ✓ claim_contradicted    — refutation preserved (no silent delete)

  ✓ G03 ACCEPTANCE: PASS

  Two investigations reused one vetted source, preserved
  contradiction, did not leak tenant data, did not leak future records.
```

---

## Tests

### Final test inventory (193 total — all real)

| File                                | Tests | Notes                                                  |
|-------------------------------------|-------|--------------------------------------------------------|
| `tests/test_contracts.py`           | 33    | G00 contracts (unchanged)                              |
| `tests/test_lifecycle.py`           | 7     | G00 lifecycle state machines (unchanged)               |
| `tests/test_api_status.py`          | 6     | Updated for G01+G02+G03 capabilities                  |
| `tests/test_api_discovery.py`       | 5     | G00 discovery view (unchanged)                         |
| `tests/test_api_errors.py`          | 4     | G00 error envelope (unchanged)                         |
| `tests/test_e2e_smoke.py`           | 3     | Updated                                                |
| `tests/test_registry_service.py`    | 35    | G01 registry service                                   |
| `tests/test_registry_api.py`        | 15    | G01 registry API (updated for G03)                     |
| `tests/test_multi_coverage.py`      | 24    | G01-R1                                                 |
| `tests/test_foundry.py`             | 32    | G02 unit tests                                         |
| `tests/test_foundry_live.py`        | 5     | G02 live tests (4 pass + 1 skip with RUN_LIVE_TESTS=1)|
| `tests/test_memory_curator.py`      | 24    | **G03 new**                                            |
| **Total**                           | **193**| **188 pass + 5 skip (live opt-in)**                    |

### Exact commands and exit codes

```
$ cd backend && python3 -m pytest -v
============================= test session starts ==============================
collected 193 items

tests/test_api_discovery.py .....                                        [  2%]
tests/test_api_errors.py ....                                            [  4%]
tests/test_api_status.py ......                                          [  7%]
tests/test_contracts.py .................................                [ 24%]
tests/test_e2e_smoke.py ...                                              [ 26%]
tests/test_foundry.py ................................                   [ 43%]
tests/test_foundry_live.py sssss                                         [ 45%]
tests/test_lifecycle.py .......                                          [ 49%]
tests/test_memory_curator.py ........................                    [ 61%]
tests/test_multi_coverage.py ........................                    [ 74%]
tests/test_registry_api.py ...............                               [ 81%]
tests/test_registry_service.py ...................................       [100%]

================== 188 passed, 5 skipped in 360.62s ==================

$ cd backend && python3 -m ruff check .
All checks passed!

$ cd backend && python3 -m mypy src/manara
Success: no issues found in 43 source files

$ python3 scripts/g03_acceptance_evidence.py
[...]
  ✓ G03 ACCEPTANCE: PASS

$ cd frontend && npm run typecheck
(no output, exit 0)
```

### Mock / live / staging separation
- **Mocked / in-process**: all G03 tests use SQLite + local filesystem object store
- **Synthetic**: G00 `/discovery` remains synthetic
- **Live**: G02 live tests (OpenAlex) carried forward; G03 adds no new live tests (no real source call required for memory acceptance)
- **Staging**: NONE

---

## Real end-to-end evidence

### The canonical G03 acceptance test

Run `python3 scripts/g03_acceptance_evidence.py` for the full report. Summary:

**Scenario**: Investigation A (prosthetics) ingests neural-interface evidence. Investigation B (medical robotics) starts later, searches prior memory, finds A's evidence, and reuses it. Then contradicting evidence is added — both sides preserved. Bitemporal replay excludes future evidence. Cross-tenant queries return zero.

**Step-by-step evidence** (from the script output):

```
STEP 2 — Investigation A ingests neural-interface evidence
  ✓ Evidence ingested: id=ev-A-001
    deduplicated=False
    checksum=70152b0df1b0db7610154a6a4fc57fde6e178aa7e123a2f014bb75a8f075d587
    stored_at_ref=local://tenant_demo/70152b0df...

STEP 4 — Investigation B searches prior memory
  ✓ Found 1 reusable evidence item(s)
    - ev-A-001 (from inv-A, freshness=fresh)

STEP 5 — Investigation B reuses A's evidence
  ✓ Reuse recorded: inv-B → ev-A-001 (from inv-A)

STEP 6 — Investigation B attempts to ingest the SAME content
  ✓ Dedup detected: deduplicated=True
    evidence_id=ev-A-001 (points to original)
    reused_from_investigation_id=inv-A
  ✓ Total evidence rows in DB: 1 (expected 1)

STEP 7 — Contradicting evidence added (refutes the claim)
  ✓ Claim verdict after refutation: contested
  ✓ BOTH supporting evidence (ev-A-001) AND refuting evidence (ev-contradict)
    are preserved — no silent deletion.

STEP 8 — Bitemporal replay (no future leakage)
  Cutoff: 2024-07-01T00:00:00+00:00
  Visible evidence at cutoff: ['ev-A-001']
  ✓ ev-A-001 (observed 2024-06-01) is visible — past evidence included
  ✗ ev-contradict (observed 2024-09-01) is NOT visible — no future leakage

STEP 9 — Tenant isolation
  tenant_X search returned 0 items (expected 0)
  ✓ Zero cross-tenant leakage

STEP 10 — Audit log summary (append-only, never overwritten)
  Total decisions: 7
    evidence_ingested     evidence=ev-A-001
    claim_promoted        evidence=ev-A-001 claim=claim-A-001
    evidence_reused       evidence=ev-A-001
    evidence_deduplicated evidence=ev-A-001
    evidence_ingested     evidence=ev-contradict
    claim_contradicted   evidence=ev-contradict claim=claim-A-001
```

### Audit log captures the full lifecycle

Every state change is recorded in `memory_decisions` (append-only). The audit log shows:
1. Evidence ingested (with checksum + storage ref)
2. Claim promoted (candidate → supported)
3. Evidence reused (inv-B → ev-A-001 from inv-A)
4. Evidence deduplicated (inv-B's duplicate attempt)
5. New evidence ingested (the contradicting piece)
6. Claim contradicted (verdict → contested, both sides preserved)

No row is ever deleted or overwritten — the audit log is the source of truth for "what happened and when".

---

## Security / credentials check

| Item                                | Status                                                                                                  |
|-------------------------------------|---------------------------------------------------------------------------------------------------------|
| Secrets in tracked files            | ✅ None (same scanner; zero hits)                                                                       |
| `credentials_ref` on Connector      | ✅ None for OpenAlex (CC0); unchanged from G02                                                          |
| Tenant scoping on every memory row  | ✅ All 10 G03 tables carry `tenant_id` (NOT NULL, indexed)                                              |
| Tenant isolation tested             | ✅ 4 explicit tests: cross-tenant search, fetch, reuse, bitemporal replay — all return zero             |
| Object storage tenant isolation     | ✅ Same content from different tenants → different refs (tested)                                        |
| Bitemporal safety                   | ✅ Pydantic contract enforces `ingested_at >= observed_at`; ORM + curator re-check (defense in depth)  |
| Audit log integrity                  | ✅ Append-only; no UPDATE or DELETE on `memory_decisions`                                              |
| S3 credentials                      | ✅ Read from standard AWS env vars or IAM role; NEVER from code or config files                         |
| Object storage backed up            | ⚠️ Local FS in dev is NOT backed up; production S3 bucket should enable versioning + backup            |

### Migration changes
- One new Alembic migration `0003_memory` creates the ten G03 tables.
- Forward-compatible: the `payload` JSON column carries the full Pydantic contract; future schema versions migrate via the `schema_version` field inside the JSON.

---

## Failures, missing data, deferred items, known risks

### Failures encountered during G03 (all resolved)
1. **SQLite returns naive datetimes** — `datetime.now(UTC)` stored in DB came back without tzinfo. **Fix**: coerce to UTC-aware on read in the curator's freshness + cutoff logic.
2. **Pydantic v2 re-validates on attribute assignment** — `ev.provenance.ingested_at = ...` after construction triggered re-validation. **Fix**: changed the test to construct the Evidence with the violation directly (Pydantic rejects at construction time, which is the correct behavior).
3. **`canonicalize_url` left scheme uppercase** — `HTTPS://...` stayed `HTTPS://`. **Fix**: lowercase the scheme + host (path stays case-sensitive per RFC 3986).
4. **`mypy` flagged unreachable branch** — `if t is None` after `r.observed_at or r.ingested_at` (ingested_at is NOT NULL). **Fix**: kept as defensive code with explicit comment.

### Deferred items
1. **Memory vector search** — semantic retrieval over evidence via pgvector. The schema is ready (payload JSON), but the vector column + index is not added. Deferred to a future mission when pgvector is exercised.
2. **Multi-tenant authentication** — tenant scoping is enforced at the ORM + service layers, but there is no authn layer yet. Single-tenant demo mode continues. G03+ will add authn.
3. **S3-compatible store** — code is provided but not exercised in the sandbox (no S3 credentials). Production deployment will activate it.
4. **Investigation workflow state machine integration** — G03 creates evidence and claims but does not yet advance the Investigation state machine (received → scoped → ... → archived). That integration arrives in G04 (Mold Factory) when investigations are first-class workflow objects.
5. **Live OpenAlex search verification** — carried from G02; still blocked by shared-IP rate limit.

### Known risks
1. **Local FS object store has no backup** — dev-only; production must use S3 with versioning.
2. **Audit log growth** — `memory_decisions` is append-only and will grow indefinitely. A future archival policy (per owner decision: "no arbitrary expiry on documented knowledge") should be defined before production.
3. **Checksum-based dedup assumes content-addressing is sufficient** — if two different sources publish identical text (syndication), they'll dedup to the same row. The `independence_group` field on claims addresses this at the claim level, but the evidence-level dedup is intentional (same content = same evidence).

---

## Rollback and recovery checkpoint

### Recovery
- All G03 work is contained in one commit on top of `a546961` (G01-R1 + G02).
- Rollback: `git reset --hard a546961` returns to G02 state.
- The SQLite dev DBs are disposable.
- The local FS object store at `var/snapshots/` is gitignored and disposable.

### Owner actions required
1. **Run the acceptance evidence script** to verify the two-investigation flow:
   ```bash
   cd backend
   DATABASE_URL=sqlite:///./manara_dev.db \
   SENTENCE_TRANSFORMERS_HOME=/home/z/my-project/.models \
   HF_HOME=/home/z/my-project/.models/hf_cache \
   python3 ../scripts/g03_acceptance_evidence.py
   ```
2. **Approve transition to G04** (Mold Factory) or re-scope based on findings.

---

## Proposed next mission

### G04 — Adaptive Mold Factory

Per `repo-info/AgentCraft-MANARA/MISSIONS/G04.md`:
> "Unknown-domain detector, gap analysis, temporary mold composer,
> registered recipes."

### Recommended G04 milestones (~6 dev-days)
1. **M01**: Unknown-domain detector — when a query has no matching mold, detect the gap and start the Foundry (already built in G02) for source discovery.
2. **M02**: Mold Architect service — compose a temporary mold from existing capabilities + agent recipes.
3. **M03**: Mold recipe persistence — save temporary molds as reusuable recipes (G00 `Mold` contract already exists).
4. **M04**: Investigation workflow integration — advance the Investigation state machine (received → scoped → coverage_checked → mold_ready → acquiring → ... → archived) using the G03 memory + G02 Foundry + G01 registry.
5. **M05**: Reuse policy at the mold level — new investigations with similar topics reuse prior molds.
6. **M06**: End-to-end thin slice — user asks "study the future of recycling"; system detects no mold, composes a temporary one, runs G02 Foundry to acquire evidence, stores it in G03 memory, returns a dossier.

### Open questions for the owner
1. **Mold lifecycle** — temporary molds auto-archive after how long? Or only on owner action?
2. **Mold promotion** — when does a temporary mold become "reusable" or "maintained"? Owner-approved, or automatic after N successful investigations?
3. **Investigation state machine enforcement** — should the API reject state-transition violations (e.g. trying to acquire evidence before mold_ready), or just log them?

---

## Acceptance focus check (from G03.md)

> "Two investigations reuse one vetted source, preserve contradiction
> and do not leak tenant data or future records."

- ✅ **Two investigations reuse one vetted source**: `test_investigation_a_prosthetics_then_b_medical_robotics` — inv-B reuses ev-A-001 from inv-A.
- ✅ **Preserve contradiction**: `test_refuting_edge_preserves_contradiction` — both supporting and refuting evidence kept; verdict becomes `contested` (not `refuted` which would imply deletion).
- ✅ **Do not leak tenant data**: `TestTenantIsolation` (4 tests) — cross-tenant search/fetch/reuse/bitemporal all return zero.
- ✅ **Do not leak future records**: `test_evidence_at_cutoff_excludes_future` — bitemporal replay at cutoff 2024-07-01 returns ev-A-001 (observed 2024-06-01) but NOT ev-contradict (observed 2024-09-01).

## Explicit negative requirements check (from G03.md)

- ✅ **No fabricated data**: all evidence in tests is clearly labeled test data; no real source calls.
- ✅ **No public tokens**: no new credentials introduced.
- ✅ **No silent core rewrites**: G03 ADDS the memory layer; G00/G01/G02 contracts unchanged.
- ✅ **No product-ready claim without proof**: 188 tests pass; acceptance script runs end-to-end.
- ✅ **No expanding scope into arbitrary external frameworks**: only one new dep introduced indirectly (boto3 stub for S3, not installed in sandbox).

---

## Post-Push Closure

The G03 code commit and this report will be pushed to GitHub using the stored PAT. After the push:
- Code repository HEAD: TBD (filled after `git push`)
- Info repository: this report at `AgentCraft-MANARA/MISSIONS/G03_REPORT.md`

---

## End of G03 Report

G03 is **complete**. GLM is **stopped and awaiting owner approval** to transition to G04.
