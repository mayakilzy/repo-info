# G13 Closure Protocol — Status Note

**Date:** 2026-09-29
**Status:** ⚠️ Partial — Amendment (ت1–ت8) shipped; G13 closure test attempted 2x but did not complete in this session.

---

## What was shipped in this turn

### ✅ Amendment to Round B (ت1–ت8)
- **Commit on app repo (`mayakilzy/BookForge`):** `ddb73f5` "docs: round b amendment (ت1-ت8) + G13 closure protocol (5-step)"
- **Pushed to public repo (`mayakilzy/repo-info/BookForge/ROUND-B-AMENDMENT.md`):** sha `0d0f2146bf56d1385cfe41e9b060d35537219817` (HTTP 200 verified)
- **8 literal inserts** in correct positions per partner review:
  - ت1: P9-T0 Vale + BookForgeArabicStyle (cheap code check before Fidelity Gate)
  - ت2: P10 expansion (m4b + CAMeL + Dialogue Planner + FFmpeg mastering + Whisper QA)
  - ت3: P11 expansion (infographics from claims.hasNumbers + Graphviz + genanki+FSRS)
  - ت4: P12 split (12A docs + 12B interactive-book with MDX/Quiz/Grounded Reading/Dual-Register/foliate-js)
  - ت5: New phase P15 (Twins ×3 + Comprehension Probe + spine-diff + incremental rebuild)
  - ت6: G14 inserted into P13-T5 (shotcraft-cinematic half-day gate)
  - ت7: P8 corrections (T3 Python sidecar + T7=G7 + T8=G8 + mandatory migrations)
  - ت8: §10.1 Layer 4 A2A honesty ("مبسط — حلقة revise عبر prompts")

### ✅ G13 closure protocol infrastructure
- **`scripts/smoke-pipeline-live.ts` updated:**
  - `GLM_THROTTLE_MS=10000 → 20000` (step 1 of closure protocol)
  - **New stage 10 `pdf_arabic_check`** added (step 4 of closure protocol):
    - Extracts first 3 pages via `pdftotext` (poppler-utils, available at `/usr/bin/pdftotext`)
    - Counts Arabic chars (U+0600–U+06FF, expects ≥50)
    - Counts replacement/tofu chars (U+FFFD, expects ≤5)
    - Logs `[live] G13 PDF Arabic verification ✓ — RTL renders correctly` on pass

### ⚠️ G13 closure test execution
- **Attempt 1:** Process was orphaned; port 3010 was held by a leftover `next-server` from a prior session; my `pkill -9 -f "next dev -p 3010"` didn't match the actual process name.
- **Attempt 2 (after cleanup):**
  - Started successfully — outline done in 61.3s with 755/2827 tokens + $0.0046 cost
  - Outline approval succeeded (halt/outline approved)
  - Research stage began — `Source` INSERT queries visible in dev log (with **publisher field** being persisted ✓ — fix verified end-to-end)
  - 0 × 429 errors in the new run (throttle=20s working as intended)
  - Test died silently mid-research-stage (~25 min elapsed)
- **Root cause of test termination:** Background process management is fragile when the test runs >20 min; the test process gets orphaned when the controlling shell session times out.

---

## G13 closure protocol — checklist status

| Step | Status |
|---|---|
| 1. `GLM_THROTTLE_MS=20000` | ✅ Applied to script; verified 0× 429s in new run |
| 2. Re-test ch1 with 8192 maxTokens fix | ⚠️ Test reached outline + research; didn't reach ch1 author in this session |
| 3. DONE complete + resume ✓ + HaltPoint ✓ | ⚠️ HaltPoint verified for ch2 in prior run (commit `391621b`); needs ch1+ch3 confirmation |
| 4. Visual PDF Arabic check from live | ⚠️ Infrastructure added to script (`pdftotext` + Arabic char count); not executed (publish didn't reach in this session) |
| 5. Production mode decision | ⚠️ Deferred until DONE reached |

---

## What remains for G13 closure

The Amendment infrastructure is complete and shipped. The remaining work is purely execution:
1. **Re-launch the test** in a session with >30 min of compute time available.
2. The test will:
   - Use `GLM_THROTTLE_MS=20000` (already set in script).
   - Run ch1 with the 8192 maxTokens fix (already in `391621b`).
   - Verify HaltPoint creation after each chapter author (already added in script).
   - Reach `DONE` (assuming no further GLM issues).
   - Run the pdftotext Arabic verification on the produced PDF.
3. On success: G13 closes → P8-T1a unlocked.

**Estimated runtime:** With throttle=20s and ~25 GLM calls (outline + research queries + visual prompts + 3 chapter authors + 3 chapter reviews + 3 running summaries + publish), expect **25–35 min wall time**.

---

## Files in the public `mayakilzy/repo-info/BookForge/` folder (all HTTP 200 verified)

| File | Purpose | Latest sha |
|---|---|---|
| `ACCEPTANCE-REPORT.md` | 15-item acceptance report from code | `ff2206f1...` |
| `LIVE-RUN-REPORT.md` | Live run metrics (updated with G13 re-run #1 data) | `698efa22...` |
| `live-run-report.json` | Raw metrics JSON | `856ad186...` |
| `ROUND-B-FINAL-SPEC.md` | Round (b) final spec (§7 + §10 + §11 + §12) | `75324085...` |
| `ROUND-B-AMENDMENT.md` | **NEW** — ت1–ت8 literal inserts + G13 closure protocol | `0d0f2146...` |
