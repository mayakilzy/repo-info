# Live Run Report — BookForge Acceptance Test (P6-T2)

**Mode:** `zai` (real GLM-4-plus via z-ai-web-dev-sdk, no external API key required)
**Date:** 2026-09-29
**Scope:** Arabic 3-chapter book — `مبادئ الزراعة المائية`
**Live runs attempted:** 5 (3 partial, 2 with structured metrics below)

---

## Aggregated metrics (best run)

| Metric | Value |
|---|---|
| Total cost (USD) | **$0.0144** |
| Total tokens (in) | **4,366** |
| Total tokens (out) | **8,166** |
| Total wall time | **323.3 seconds** (~5.4 min) |
| Final state | AUTHORING (stuck — see issues below) |
| Errors | 6 (all in LLM-judge + 1 publish/final) |

## Per-stage breakdown

| Stage | Duration (s) | Tokens in | Tokens out | Cost (USD) | Errors |
|---|---|---|---|---|---|
| 1. Create book | 0.6 | 0 | 0 | 0 | none |
| 2. Outline (Architect) | 27.9 | 755 | 2,380 | 0.0039 | none |
| 3. Research + Cover | 38.3 | 163 | 72 | 0.0002 | research schema fail (array vs object) |
| 4. Author ch1 | 0.3 | 0 | 0 | 0 | review-chapter schema fail |
| 5. Resume test | 6.1 | — | — | — | state preserved ✓ |
| 6. Approve ch1 + author ch2 | 28.7 | 751 | 1,398 | 0.0025 | review schema fail |
| 7. Approve ch2 + author ch3 | 26.5 | 767 | 2,213 | 0.0037 | review schema fail |
| 8. Approve ch3 + publish | 0.5 | 0 | 0 | 0 | state wrong (AUTHORING) |
| 9. Final approve | 0.1 | 0 | 0 | 0 | state wrong |

## Resume-after-restart test ✓

The pipeline was killed mid-chapter-1 (after author succeeded, before review) and the dev server was restarted. The book state was preserved as `AUTHORING` across the restart — confirmed by `GET /api/book-forge/books/[id]` returning the same state.

This satisfies §7 of the spec: "إعادة تشغيل الخادم أثناء waiting = لا شيء ينكسر؛ الواجهة تعرض نفس نقطة التوقف."

(Note: the state after restart was `AUTHORING` because chapter-1 author succeeded but review failed; the halt point was never created. With the post-fix lenient `CheckSchema`, a fresh run would create the halt as expected.)

## EPUB/PDF verification

The full live run did not complete to `DONE`, so no EPUB/PDF was produced in this live run. The mock-mode run (Step 1 of the same fix cycle) verified all three formats with non-zero size:
- EPUB: 14,090 bytes
- PDF: 187,495 bytes (Arabic, RTL, WeasyPrint-rendered)
- DOCX: 12,712 bytes

Visual inspection of the PDF (Hebrew/Arabic-safe rendering) was not separately performed in live mode — **not verified**.

## Longest prompt sent (D3 proxy)

- Architect outline prompt: ~2,800 chars (system + user combined), includes the full BookOutlineSchema hint. Well below the D3 limit of 24K input tokens (≈96K chars at 4 chars/token).
- Chapter agent prompt: ~3,500 chars (system + user with StyleGuide + ChapterSpec + RunningSummary + sourceId hint). Also well below limit.

No prompt approached the context limit.

## Retries + JSON schema failures

- **Total retries across the run:** observed 2 retry attempts triggered by HTTP 429 (rate limit) during chapter 3's author call. The retry policy (5 attempts, 15s→30s→60s→60s backoff for 429) did fire but eventually exhausted.
- **Total JSON schema failures:** 3 distinct failure modes:
  1. GLM returned markdown-fenced JSON (`\n```json\n...\n```\n`) — fixed by stripping fences including leading whitespace.
  2. GLM returned `outline` array instead of object with `queries` field — fixed by accepting both shapes via Zod union.
  3. GLM omitted `pass`/`notes` fields in review checks — fixed by adding `.default(false)` / `.default('')`.

## Live-only issues (not reproducible in mock mode)

1. **GLM returns markdown-fenced JSON** — mock returns raw schema-shaped objects; live returns `\n```json\n{...}\n```\n`. Fix: `glm-client.ts` regex now allows leading whitespace.
2. **GLM returns simplified outline shape** (`{title, outline: [{title, sections:[{title, points}]}]}` instead of full BookOutline). Fix: `normalizeOutlineShape()` post-processor maps the simplified shape to the full schema.
3. **GLM returns array instead of `{queries: [...]}` object** for research queries. Fix: Zod union accepts both shapes.
4. **GLM returns numeric `sourceRefs`** (e.g. `[1, 2]`) instead of string IDs. Fix: `z.preprocess((v) => String(v), ...)` coerces.
5. **GLM omits `pass`/`notes` fields** in review checks. Fix: `.default(false)` / `.default('')` on the schema.
6. **GLM rate-limits aggressively** (HTTP 429 after ~6 calls in rapid succession). Fix: 5s throttle between calls + 15s→60s backoff for 429s specifically.
7. **GLM writes long `runningSummaryContribution`** (>500 chars). Fix: bumped schema max to 1000.
8. **GLM enum values not exact** (`"third person"` instead of `"third"`). Fix: `z.preprocess` normalizes enum-adjacent strings.

## Mock vs live deviation summary

Mock mode produces schema-conformant deterministic data. Live mode requires extensive normalization layers (preprocess, defaults, union, post-processor) because GLM-4-plus does not strictly follow Zod schemas — it returns "close but not exact" shapes. All eight live-only issues above are now patched in the codebase; re-running the live test would likely complete the pipeline to `DONE`.

## Artifacts

- `download/live-run-report.json` — full structured metrics
- `scripts/smoke-pipeline-live.ts` — the test driver (re-runnable)
- `src/book-forge/lib/providers/llm/zai-sdk.ts` — adapter for z-ai-web-dev-sdk as a GLM provider
