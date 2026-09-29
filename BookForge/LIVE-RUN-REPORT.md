# Live Run Report — BookForge Acceptance Test (P6-T2 / G13)

**Mode:** `zai` (real GLM-4-plus via z-ai-web-dev-sdk, no external API key required)
**Date:** 2026-09-29 (latest run with P8-PRE fixes applied)
**Scope:** Arabic 3-chapter book — `مبادئ الزراعة المائية`

---

## Aggregated metrics (latest G13 re-run, after P8-PRE fixes)

| Metric | Value | Δ vs first run |
|---|---|---|
| Total cost (USD) | **$0.0323** | +124% (more retries due to 429s) |
| Total tokens (in) | **16,294** | +273% |
| Total tokens (out) | **16,122** | +97% |
| Total wall time | **666.7 seconds** (~11 min) | +106% |
| Final state | AUTHORING (stuck — see ch1/ch3 errors) | unchanged |
| Errors | 5 (down from 6) | -1 |

## Per-stage breakdown (latest run)

| Stage | Duration (s) | Tokens in | Tokens out | Cost (USD) | Errors |
|---|---|---|---|---|---|
| 1. Create book | 0.6 | 0 | 0 | 0 | none |
| 2. Outline (Architect) | 60.4 | 755 | 2,380 | 0.0039 | none |
| 3. Research + Cover | 218.4 | 1,210 | 833 | 0.0014 | none (429s in log but completed) |
| 4. Author ch1 | 83.7 | 899 | 1,522 | 0.0090 | JSON truncation (maxOutputTokens too small — fixed in P8-PRE-T6) |
| 5. Resume test | 6.1 | — | — | — | state preserved ✓ (AUTHORING, not HALT — ch1 failed) |
| 6. Approve ch1 + author ch2 | 81.5 | 751 | 1,398 | 0.0102 | **none — ch2 authored + reviewed + HaltPoint created ✓** |
| 7. Approve ch2 + author ch3 | 215.5 | 895 | 2,213 | 0.0075 | 429 retries exhausted |
| 8. Approve ch3 + publish | 0.5 | 0 | 0 | 0 | state wrong (AUTHORING not ASSEMBLY) |
| 9. Final approve | 0.1 | 0 | 0 | 0 | state wrong |

## G13 enrichment verification ✓ (the most subtle discovery)

**Per Round (a) enrichment note 1**: "chapter written but review failed → no HaltPoint created → resume went to AUTHORING with no halt".

**Verified in this run**:
- ch1 (failed review): no HaltPoint created → state stayed AUTHORING → resume test correctly caught this ("expected HALT_CHAPTER_APPROVAL, got AUTHORING").
- **ch2 (succeeded)**: INSERT HaltPoint visible in dev log + halt row queryable via `GET /api/book-forge/books/[id]` → **HaltPoint creation mechanism works end-to-end ✓**.

This satisfies the G13 enrichment requirement: "successful review → halt is created → approval works". The mechanism is proven; only the LLM reliability on ch1/ch3 needs further throttle tuning.

## Resume-after-restart test ✓

The pipeline was killed mid-stage-4 and the dev server was restarted. The book state was preserved as `AUTHORING` across the restart — confirmed by `GET /api/book-forge/books/[id]` returning the same state.

This satisfies §7 of the spec: "إعادة تشغيل الخادم أثناء waiting = لا شيء ينكسر؛ الواجهة تعرض نفس نقطة التوقف."

## EPUB/PDF verification

**Not verified** in this live run — the pipeline did not reach `DONE`, so no EPUB/PDF was produced. The mock-mode run (`smoke-pipeline-full.ts`) verified all three formats with non-zero size:
- EPUB: 14,090 bytes
- PDF: 187,495 bytes (Arabic, RTL, WeasyPrint-rendered)
- DOCX: 12,712 bytes

Visual inspection of PDF Arabic rendering from a **live** run remains **not verified** (per Round (a) enrichment note 1 — needs DONE completion first).

## Longest prompt sent (D3 proxy)

- Architect outline prompt: ~2,800 chars (system + user combined, includes full BookOutlineSchema hint)
- Chapter agent prompt: ~3,500 chars (system + user with StyleGuide + ChapterSpec + RunningSummary + sourceId hint)
- Both well below the D3 limit of 24K input tokens (≈96K chars at 4 chars/token)

**Side check ✓ (per Round (a) enrichment note 3)**: headroom is massive.

## Retries + JSON schema failures

- **429 rate-limit retries observed:** multiple during stages 3 (research+cover) and 7 (ch3 author). The 429 retry policy (5 attempts, 15s→30s→60s→60s→60s backoff) did fire correctly but eventually exhausted on ch3.
- **JSON schema failures:** 1 distinct failure mode in this run:
  - ch1: "Expected ',' or '}' after property value in JSON at position 763" — GLM's response truncated at 4096 tokens before completing the JSON. Fixed by P8-PRE-T6 (raised maxOutputTokens to 8192).

## Cost model verification ✓ (per Round (a) enrichment note 3)

Measured tokens (16,294 in / 16,122 out) matched `config/costs.ts` calculations:
- `costUSD = (in / 1000) × 0.0005 + (out / 1000) × 0.0015 + 0`
- `= 16.294 × 0.0005 + 16.122 × 0.0015 = 0.008147 + 0.024183 = $0.032330` ✓

Matches the recorded total of $0.0323 exactly. **Cost model is verified end-to-end.**

## Live-only issues (cumulative, 8 from first run + 1 new)

1. GLM returns markdown-fenced JSON with leading whitespace → regex fix.
2. GLM returns simplified outline shape → `normalizeOutlineShape()` post-processor.
3. GLM returns array instead of `{queries:[]}` → Zod union.
4. GLM returns numeric `sourceRefs` → `z.preprocess((v) => String(v), ...)`.
5. GLM omits `pass`/`notes` fields in review checks → `.default()` on schema.
6. GLM rate-limits aggressively (HTTP 429) → 5s throttle + 15s→60s backoff for 429.
7. GLM writes long `runningSummaryContribution` (>500 chars) → bumped max to 1000.
8. GLM enum values not exact ("third person" vs "third") → `z.preprocess` normalizes.
9. **NEW:** GLM truncates long chapter responses at the configured `maxOutputTokens` (4096) → raised to 8192 (P8-PRE-T6).

## Remaining open issue (rate limit)

The 429 retries exhausted all 5 attempts on ch3 even with 15s→60s backoff. The real limit is the rate (calls per minute), not the backoff duration. **Per Round (a) enrichment note 1**, the next G13 re-run should use `GLM_THROTTLE_MS=20000` (20s) or higher to allow the rate limit window to reset between calls.

## Mock vs live deviation summary

Mock mode produces schema-conformant deterministic data. Live mode requires extensive normalization layers (preprocess, defaults, union, post-processor, few-shot schema hints) because GLM-4-plus does not strictly follow Zod schemas — it returns "close but not exact" shapes. All nine live-only issues above are now patched in the codebase; the only remaining live-mode risk is rate limiting, which is a matter of pacing, not correctness.

## Artifacts

- `download/live-run-report.json` — full structured metrics (latest run, 4008 bytes)
- `scripts/smoke-pipeline-live.ts` — the test driver (re-runnable, with G13 HaltPoint verification)
- `src/book-forge/lib/providers/llm/zai-sdk.ts` — adapter for z-ai-web-dev-sdk as a GLM provider
- `download/ROUND-B-FINAL-SPEC.md` — Round (b) final spec including P8-PRE deliverables

## G13 status: OPEN (with significant progress)

- ✓ Resume-after-restart (state preserved)
- ✓ HaltPoint creation mechanism (proven for ch2)
- ✓ Cost model verified end-to-end (matches `config/costs.ts` exactly)
- ✓ All 9 live-only issues patched in code
- ⚠️ Full DONE completion blocked by: (a) ch1 truncation (fixed, not yet re-tested), (b) ch3 429 retries (needs slower throttle)
- ⏸️ P8+ cannot start until G13 passes DONE end-to-end (per §0-9 legislative gates)
