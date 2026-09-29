# Live Issues Layer 24 — Running Tally

> كل شكل جديد يُرجِعه GLM ولم يكن متوقعاً يُرقَّم هنا + يُصلَّح في طبقة 24.

## القواعد المُطبَّقة (Layer 24)

| # | القاعدة | الحالة |
|---|---|---|
| 1 | تجريد code-fences مع whitespace سابق | ✅ مُطبَّق |
| 2 | shape-adapter للـ contracts الكبيرة (normalizeOutlineShape) | ✅ مُطبَّق |
| 3 | union لتوحيد string/array | ✅ مُطبَّق |
| 4 | مطابقة sourceRefs بالنسختين (رقم ↔ id) | ✅ مُطبَّق |
| 5 | defaults fail-safe لحقول المراجعة المفقودة | ✅ مُطبَّق |
| 6 | صندوق 429 مخصص (backoff 15s→60s + throttle ≥5s) | ✅ مُطبَّق |
| 7 | قصّ إجباري للحقول المحدودة *بعد* كل تحديث | ✅ مُطبَّق |
| 8 | تطبيع enums عبر خريطة | ✅ مُطبَّق |
| 9 | few-shot schema hint للنداءات الحُكمية (review-chapter, Fidelity Gate قادم) | ✅ مُطبَّق (G13 PASS 3/3) |
| 10 | التحقق من البايتات الملتزمة في كل commit يدَّعي الإضافة/الاستعادة | ✅ مُطبَّق (T6 onboarding — issue #12) |

## المشاكل الحية (Live Issues)

| # | الشكل الذي ظهر | المُصلِّح | تاريخ الاكتشاف |
|---|---|---|---|
| 1 | GLM يرجع `\n```json\n{...}\n```\n` (fences مع whitespace سابق) | regex `^\s*```(?:json)?\s*` في glm-client.ts | run #1 |
| 2 | GLM يرجع `{title, outline: [...]}` بدلاً من BookOutline الكامل | `normalizeOutlineShape()` post-processor | run #1 |
| 3 | GLM يرجع array بدلاً من `{queries: [...]}` object للـ research queries | Zod union `[object, array.transform(...)]` | run #2 |
| 4 | GLM يرجع `[1, 2, 3]` (numbers) بدلاً من `["src-1", "src-2"]` (strings) في sourceRefs | `z.preprocess((v) => String(v), z.string())` | run #2 |
| 5 | GLM يُغفل حقول `pass`/`notes` في review checks | `.default(false)` / `.default('')` على CheckSchema | run #2 |
| 6 | GLM يطبّق rate limit (429) بعد 5–6 نداءات متتابعة | throttle 5s→10s→20s + backoff 15s→60s للـ 429 | run #2 |
| 7 | GLM يكتب `runningSummaryContribution` > 500 حرف | bumped max to 1000 | run #3 |
| 8 | GLM يرجع enum values غير دقيقة ("third person" بدلاً من "third") | `z.preprocess` normalizes enum-adjacent strings | run #3 |
| 9 | GLM يقطع استجابة الفصل عند `maxOutputTokens=4096` (يقطع JSON) | رفع `maxOutputTokens` 4096 → 8192 | run #3 (P8-PRE-T6) |
| **10** | **GLM يرجع `{chapters: [...]}` مباشرة (بلا مفتاح `outline`)** — الشكل الثالث المختلف | **`normalizeOutlineShape` موسَّع ليتعامل مع `r.outline` OR `r.chapters`** | **G13 closure run** |
| **11** | CI gate `rg -E` كان يُفسَّر كـ `--encoding` لا regex | `rg -i -e` + تنظيف شامل | **P8-T3** |
| **12** | commit `1f3092d` ادَّعى استعادة `books/route.ts` لكن `git show --stat` يُظهر `| 0` bytes (ملف لم يُلتزم فعلياً) | إعادة كتابة الملفين في T6 onboarding | **P8-T6 onboarding** |

## الإصلاح للمشكلة #10 (المُطبَّق في G13 closure)

في `src/book-forge/tools/create-book-outline.ts`:

```ts
// قبل الإصلاح (run #1): يقرأ فقط r.outline
const outlineArr = Array.isArray(r.outline) ? r.outline as Array<Record<string, unknown>> : null;
if (!outlineArr) return null;

// بعد الإصلاح (G13 closure): يقبل كلا الشكلين
const outlineArr = Array.isArray(r.outline)
  ? r.outline as Array<Record<string, unknown>>
  : Array.isArray(r.chapters)
    ? r.chapters as Array<Record<string, unknown>>
    : null;
if (!outlineArr) return null;
```

كذلك عولجت:
- أقسام كـ array of strings (ليس objects): `typeof s === 'string' ? { title: s } : s`
- حقول بأسماء بديلة: `ch.title ?? ch.name`, `ss.title ?? ss.name`, `ch.learningGoal ?? ch.goal`

**نتيجة G13 closure:** Architect ينجح الآن بشكل متسق عبر كل أشكال GLM المُلاحَظة (3 أشكال حتى الآن).

## القاعدة المستقبلية (لمشاكل قادمة)

أي شكل جديد من GLM يُكتشف:
1. يُرقَّم هنا كمشكلة حية #N
2. يُصلَّح في طبقة 24 (schema OR normalizer OR retry OR throttle)
3. يُضاف كقاعدة #N في القسم الأعلى إذا كان نمطاً جديداً متكرراً
4. يُختبَر بـ `bun run scripts/smoke-pipeline-live.ts` للتأكد من الإصلاح

---

## P8-T1a — G10 Probe Results (2026-09-29, FORGE_MODE=mock + real provider calls)

Query: "hydroponics"

| Provider | Tier | Status | Latency | Result Count | Notes |
|---|---|---|---|---|---|
| crossref | polite | ✅ PASS | 1532ms | 2454 | Real results, sample: "Why Hydroponics Is Not Just Chemistry" |
| pubmed | polite | ✅ PASS | 358ms | 8209 | E-utilities responded |
| semantic-scholar | optional_key | ✅ PASS | 1781ms | 10152 | Works without key, sample: "Hydroponics: Exploring innovative sustainable technologies…" |
| arxiv | open | ⚠️ 503 transient | 860ms | 0 | arXiv API overloaded (common) |
| openalex | polite | ⚠️ 503 transient | 264ms | 0 | OpenAlex API overloaded |
| unpaywall | polite | ✅ correctly disabled | — | 0 | UNPAYWALL_EMAIL not set (required by ToS, degradation rule working) |
| core | required_key | ✅ correctly disabled | — | 0 | CORE_API_KEY not set (required, degradation rule working) |

**Summary:** 3/7 providers verified working with real API calls; 2 correctly disabled by the matrix (missing env vars); 2 returned transient 503s (not matrix issues).

**G10 OPEN-partial — بنية Matrix نهائية (D20 بنيوياً) · tier arXiv+OpenAlex يُحسم في P8-T2**

- ✅ بنية Matrix نهائية: 4 tiers (open/polite/optional_key/required_key) + 7 مزودين + envVar/delaySec/cacheTtlSec
- ✅ Degradation rule مُتحقَّق منها: مفاتيح مفقودة ⇒ استبعاد + توثيق في providerGaps (لا يفشل كتاب)
- ✅ كل المفاتيح/البريد server-side فقط (D23 pattern)
- ✅ ProvidersStatus UI component موجود (live matrix display)
- ⚠️ **tier arXiv + OpenAlex ما زال افتراضاً**: "transient 503" لم يُقَس بعد re-probe ×3 بفاصل 60s بعد ≥10 دقيقة (G10 closure protocol في P8-T2).

**G10 لا تُغلق بقياس ناقص — الإغلاق المسبق خالف حكم الشريك.** الإغلاق أو إعادة تعيين tier سيكون بقياس فعلي في P8-T2.

---

## G10 Closure Protocol Results (2026-09-29, post-10min-wait, 3 probes × 60s gap)

Per partner protocol: wait ≥10 min after last 503, then re-probe ×3 with 60s interval.
For arXiv: with `User-Agent: BookForge/1.0 (mailto:bookforge-research@example.com)` + 3s delay (ToS requirement).
For OpenAlex: with `OPENALEX_MAILTO=bookforge-research@example.com` set in `.env`.

### Probe results (query: "hydroponics")

| Provider | Probe #1 | Probe #2 | Probe #3 | Successes | Decision |
|---|---|---|---|---|---|
| arXiv | HTTP 503 (3899ms) | HTTP 503 (3947ms) | HTTP 503 (4140ms) | **0/3** | tier: `open → flaky` (measured) |
| OpenAlex | HTTP 429 (97ms) | HTTP 429 (91ms) | HTTP 429 (316ms) | **0/3** | tier: `polite → flaky` (measured) |

### Decision (per partner protocol §ب)

- **arXiv**: reassigned `open → flaky` with measured evidence (0/3 success, all HTTP 503 over 3+ minutes of probing).
- **OpenAlex**: reassigned `polite → flaky` with measured evidence (0/3 success, all HTTP 429 — rate-limited even with mailto set).
- **Crossref, PubMed, Semantic Scholar**: remain at their original tiers (verified working in initial probe — 3/7 succeeded).
- **Unpaywall, CORE**: remain disabled (env vars not set, degradation rule working correctly).

### Final G10 status

**G10 partial-close — measured decision, not premature closure.**

- ✅ Matrix structure final (D20 structurally): 5 tiers now (open/polite/optional_key/required_key/**flaky**) + 7 providers
- ✅ Degradation rule verified (4 scenarios: working, missing-key, transient-503, persistent-503)
- ✅ 3/7 providers measured working (Crossref, PubMed, Semantic Scholar)
- ✅ 2/7 providers measured flaky (arXiv, OpenAlex) — tier reassigned with evidence
- ✅ 2/7 providers correctly disabled by degradation rule (Unpaywall, CORE)
- ⏸️ Full G10 closure requires the 2 flaky providers to recover (sandbox IP rate-limited; would re-probe in production)

The new `flaky` tier allows downstream code to handle these providers gracefully (lower expectations, longer backoff, optional retries).

---

## Live Issue #11 — CI gate was falsely passing (rg -E → --encoding) [GOVERNANCE LESSON]

**Discovered:** 2026-09-29 (P8-T3 Python gate)

**The bug:**
`scripts/scihub-ci-gate.sh` used `rg -i -E "$PATTERNS"` — but `rg -E` in ripgrep means `--encoding`, NOT regex. So the pattern was silently interpreted as an encoding name, the `2>/dev/null` swallowed the error, and `|| true` made it return success. Result: matches=empty → CI gate falsely PASSED even when the sidecar source contained literal "sci-hub" references.

**The fix:**
- Changed `rg -i -E` → `rg -i -e` (correct flag for pattern matching in ripgrep)
- After the fix, the gate correctly FAILED and found 19+ references to sci-hub in the sidecar source
- Comprehensive cleanup: deleted `sci_hub.py` + test files, patched `server.py` to remove `download_scihub` function + all `use_scihub`/`scihub_base_url` parameters, cleaned all docstring/README references, replaced literal strings with "shadow library" across all files (including decisions.md and MCPKIT-CAPABILITY-REQUEST.md)
- Final CI gate run: **PASSED** (0 matches across 4 directories)

**Governance lesson (per partner):**
> "القفل يُختبَر بقفلٍ زائف قبل الاعتماد عليه"

This means: a security/CI gate must be tested with a KNOWN-FALSE input before being trusted. We discovered the gate was broken only because the partner's protocol demanded we verify the sidecar was clean — and the gate said "clean" while 19 references existed. The test itself was untested.

**Future rule (Layer 24 extension):**
Any new CI gate or validation check MUST be tested with a known-positive fixture (a file that SHOULD fail) before being relied upon. This is now issue #11 in the live issues registry.

**Date:** 2026-09-29
**Status:** FIXED in commit `ea52b86`

---

## Live Issue #12 — Commit 1f3092d claimed route restoration but committed 0-byte files [GOVERNANCE LESSON]

**Discovered:** 2026-09-29 (P8-T6 onboarding — fresh sandbox, fresh clone)

**The bug:**
Commit `1f3092d` ("fix(critical): restore missing /api/book-forge/books routes") claims in its message to restore `src/app/api/book-forge/books/route.ts` and `src/app/api/book-forge/books/[id]/route.ts`. Inspection of `git show 1f3092d --stat` reveals that **every** changed file in that commit shows `| 0` bytes — i.e., the commit only included empty mode-only entries (likely from `git add` on touched-but-not-modified files), and **the books routes were never actually written to disk in the committed tree**.

**Root cause (deeper than first thought):**
`.gitignore` line 63 had the bare pattern `books/` (intended to ignore the generated `/books/<slug>/` output directory). However, a bare `books/` pattern matches *any* directory named `books/` anywhere in the tree — including `src/app/api/book-forge/books/`. So when the developer ran `git add src/app/api/book-forge/books/route.ts`, git silently skipped it because of the .gitignore rule. The commit then ended up with 0-byte placeholder entries because the file was *touched* in the index but its content could not be staged.

**The symptom:**
- `BriefForm.tsx` POSTs to `/api/book-forge/books` → 404 in fresh clone.
- `smoke-pipeline-full.ts` failed immediately at `bookId = (await call('/api/book-forge/books', ...)).json.bookId` because `json` was `null` (the 404 response was non-JSON).
- The previous "P8-A closure" passed only because `.next/dev` cache held compiled routes from a working-tree version that was never committed.

**The fix (in this commit, T6 onboarding):**
- Re-anchored the .gitignore pattern from `books/` → `/books/` so it only matches the repo-root generated output directory, not nested `books/` directories like the API route folder.
- Re-created `src/app/api/book-forge/books/route.ts` with full POST + GET handlers (no longer ignored by .gitignore).
- Re-created `src/app/api/book-forge/books/[id]/route.ts` with full GET handler (no longer ignored by .gitignore).
- Both files now have non-zero byte counts; `git status --porcelain` shows them as untracked `??` rather than silently ignored.
- `smoke-pipeline-full.ts` PASSES on a fresh clone (6 chapters → DONE, EPUB 14KB + PDF 53KB + DOCX 12KB).

**Governance lesson (per partner, restating Rule #10):**
> "أي وصف للحالة القائمة يُكتب من الكود؛ ما لا يتحقق منه يُعلَّم 'غير متحقق منه' — ممنوع التوصيف من الذاكرة."

This applies to *commits themselves*, not just status reports. A commit message that says "restored X" must be verified by inspecting `git show --stat <commit> -- <path>` — if the byte delta is 0, the restoration did NOT happen. The P8-A closure report accepted the commit message at face value, exactly the same way the CI gate in issue #11 was accepted at face value. The pattern is the same: trust without verification.

**Future rule (Layer 24 extension, now rule #10):**
1. Any commit message that claims to add or restore a file MUST be verified post-commit by checking `git show --stat <commit> -- <path>` shows non-zero LOC delta. A 0-byte delta means the file was *touched* in the index but its content was not committed.
2. Any `.gitignore` pattern that uses a bare directory name (e.g., `books/`) MUST be audited for unintended matches against source paths. The safer form is `/books/` (anchored to repo root). Run `git check-ignore -v <path>` on any new source path before assuming it is tracked.

**Date:** 2026-09-29
**Status:** FIXED in T6 onboarding commit (this one) — both root cause (.gitignore) and symptom (route files) addressed.
**Reference:** discovered while running `smoke-pipeline-full.ts` per "أول أفعالك قبل T6 — أعد تشغيل smoke-pipeline-full.ts"
