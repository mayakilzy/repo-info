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
| 11 | `z.unknown()` + post-parse normalize — للحقول التي يرجعها GLM بـ non-canonical/non-string type (مثل distortionType في #16) | ✅ مُطبَّق (P10-T0a — issue #16 final fix) |

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
| **13** | GLM في استخراج Evidence يرجع حقولاً مفقودة (`claim`/`excerpt` undefined، `evidenceType`/`confidence` ناقصة) — رابع شكل مختلف | **Layer 24 rule #9 (few-shot schema hint) مُطبَّقة على prompt استخراج Evidence** — مثال JSON كامل في system prompt | **P8-T6-live** |
| **14** | `pip install knowledge-storm` فشل في sandbox — torch download (248MB) انتهى بعد 5 دقائق (D20.1: فشل بيئي خالص، مؤجل لخادم الإنتاج) | TypeScript port لـ prompts الـ MIT-licensed كحل بديل موثَّق (يعزل متغير جودة الأسئلة دون عبء Python) | **G7 STORM A/B** |
| **15** | GLM يرجع علامة استفهام عربية "؟" (U+061F) بدلاً من ASCII "?" — خامس شكل مختلف (بعد #2/#3/#4/#10/#13) — الأسئلة العربية تفشل schema validation | `.endsWith('?')` → `.refine(s => s.endsWith('?') \|\| s.endsWith('؟'))` — قبول كلاهما | **G7 STORM A/B** |
| **16** | GLM في simplifier + fidelity-gate يرجع `distortionType` كـ non-canonical value ("weird", "n/a", `123`, `{}`, `[]`, `true`, `null`) — سادس شكل مختلف — الإصلاحان الجزئيان السابقان (8e03dce + 490ad30) فشلا لأن `z.string()` يرفض non-string ويفعّل repair-loop | **`z.unknown()` + `normalizeDistortionType()` مشترك في `lib/simplify/distortion-normalize.ts`** — فصل المسؤوليات: الـ schema يقبل أي شيء (لا explosion)، الـ normalizer يُطبّع لـ `DistortionType \| null` | **P10-T0a (final fix)** |

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

---

## تأ-2 Audit — Full .gitignore bare-pattern scan (2026-09-29)

**Triggered by:** partner amendment تأ-2 ("مسح شامل: git check-ignore لكل الأنماط المجرّدة في .gitignore ضد شجرة المصدر").

**Method:** `/home/z/my-project/scripts/gitignore-audit.sh` extracts all bare (un-anchored, non-wildcard, non-negation) patterns from `.gitignore` and runs `git check-ignore -v` on a hypothetical `src/<pattern>/foo.ts` candidate for each, then lists hits.

**Result (32 bare patterns scanned, 18 hypothetical matches, 0 actual source-tree damage):**

| # | Pattern | Hypothetical match (`src/<pattern>/…`) | Real source path at risk? |
|---|---|---|---|
| 1 | `dev.log` | `src/dev.log/test.ts` | ❌ no `src/dev.log/` dir exists |
| 2 | `dev.out.log` | `src/dev.out.log/test.ts` | ❌ no such dir |
| 3 | `test` | `src/test/test.ts` | ❌ no `src/test/` dir — `tests/` (plural) exists but is NOT matched (different name) |
| 4 | `prompt` | `src/prompt/test.ts` | ❌ no `src/prompt/` dir — `prompts/` (plural) exists but is NOT matched |
| 5 | `server.log` | `src/server.log/test.ts` | ❌ no such dir |
| 6 | `db/` | `src/db//foo.ts` | ❌ no `src/db/` dir (the SQLite db lives at repo-root `/db/` per env, or `prisma/dev.db`) |
| 7 | `logs/` | `src/logs//foo.ts` | ❌ no `src/logs/` dir (audit trail logs at repo-root `/logs/`) |
| 8 | `.secrets/` | `src/.secrets//foo.ts` | ❌ no such dir (repo-root `/secrets/` only) |
| 9 | `repo-info/` | `src/repo-info//foo.ts` | ❌ no such dir |
| 10 | `.zscripts/` | `src/.zscripts/…` | ❌ no such dir |
| 11–18 | (sub-patterns of above) | — | ❌ all clear |

**Audit verdict:** zero current damage. All 18 hits are *theoretical* — there is no actual source-tree directory named `test`, `prompt`, `db`, `logs`, `repo-info`, `.secrets`, `.zscripts`, `dev.log`, or `server.log` under `src/`, `scripts/`, `app/`, `lib/`, or `components/`. The `tests/` directory at repo root (with the `s`) is correctly tracked because the bare pattern is `test` (singular, no `s`) — lucky accident.

**Risk posture:** this is **structural fragility, not active damage**. The same kind of "lucky accident" produced Live Issue #12 (the bare `books/` pattern that DID match `src/app/api/book-forge/books/` and silently dropped the API routes). The fix that closed #12 (anchor `books/` → `/books/`) addressed one instance but left the others. Any future contributor who adds a `src/test/` directory for unit tests, or a `src/prompt/` directory for LLM prompt templates, will silently find their files untracked — exactly the trap that caught commit `1f3092d`.

**Recommendation (deferred to partner per تأ-1 spirit — "التنظيم الدائم مؤجل لقرار الشريك"):**
- Option A (defensive): re-anchor ALL bare directory patterns to `/name/` — e.g., `test` → `/test/`, `db/` → `/db/`, `logs/` → `/logs/`, `repo-info/` → `/repo-info/`, `.secrets/` → `/.secrets/`, `.zscripts/` → `/.zscripts/`. This is a one-time 7-line edit and closes the trap permanently.
- Option B (accept risk): leave as-is, add Layer 24 rule #11: "before adding a new `src/<name>/` directory, run `git check-ignore -v src/<name>/foo.ts` to confirm the name is not already shadowed by a bare .gitignore pattern."

**Decision pending partner:** A or B. Either is legitimate. Until then, the audit stands as a documented snapshot — no silent assumption.

**Future rule (Layer 24 rule #11 candidate, per تأ-1 + تأ-2):** Any new `.gitignore` pattern that uses a bare name (no leading `/`, no wildcard) MUST be accompanied by `git check-ignore -v src/<name>/foo.ts` showing zero unintended matches before the pattern is committed. This generalizes Live Issue #12's fix to all bare patterns.

**Audit script:** `/home/z/my-project/scripts/gitignore-audit.sh` (committed in this commit for repeatability).
**Date:** 2026-09-29
**Status:** AUDITED — 18 hypothetical / 0 actual — partner decision pending on re-anchoring vs rule-based mitigation.

---

## Live Issue #13 — GLM evidence-extraction returns undefined fields (fourth shape)

**Discovered:** 2026-09-29 (P8-T6-live first run)

**The bug:**
The T6-live gate's `extractEvidenceViaGLM()` calls GLM via `askJSON` with a Zod schema requiring `{ claims: [{ claim: string, excerpt: string, stance: enum, evidenceType: enum, confidence: number }] }`. The initial system prompt was concise ("Reply ONLY with JSON matching the schema"). GLM-4-plus returned valid JSON but with multiple fields missing per claim — `claim` was sometimes omitted, `excerpt` was undefined, `evidenceType` was a non-enum string, `confidence` was missing entirely.

Schema-validation errors (first run):
```
[{"path":"claims.0.excerpt","message":"Invalid input: expected string, received undefined"},
 {"path":"claims.0.evidenceType","message":"Invalid option: expected one of \"systematic_review\"|..."},
 {"path":"claims.0.confidence","message":"Invalid input: expected number, received undefined"},
 ...]
```

The `askJSON` repair loop tried once (re-prompting GLM with the schema errors), but GLM persisted in returning partial objects. All 9 GLM calls failed schema validation → 0 evidences extracted → 0 contested claims → gate would have falsely "PASS"ed on works alone while the contested-claims path was untested.

**The fix (per Layer 24 rule #9 — few-shot schema hint for judgment calls):**
Added a concrete JSON example to the system prompt (same pattern that fixed `review-chapter` in P8-PRE-T3). The example shows the exact expected shape with all 5 fields filled, plus an explicit "RULES" section emphasizing that no field may be omitted or null. This brought the second run from 0/9 successful extractions to 9/9 — 23 evidences extracted (some calls returned 2-3 claims per paper).

**Why this matters:**
The first run produced a T6-live-gate.json that superficially showed `pass: true` (3 chapters × ≥3 works × 3 providers). Without the Rule 11 fix to the acceptance gate (requiring `evidenceExtractionOK`), the gate would have falsely closed T6 on partial measurement. The lesson: any gate that includes LLM-derived data (evidences, contestedClaims) must verify the LLM path actually produced data, not just that the upstream providers did.

**Future rule (Layer 24 rule #9 reinforcement):**
Any `askJSON` call with a non-trivial schema (≥3 required fields, or any enum field) MUST include a concrete JSON example in the system prompt showing the full expected shape. Bare "reply ONLY with JSON matching the schema" is insufficient — GLM needs to see the shape, not infer it from a schema description.

**Date:** 2026-09-29
**Status:** FIXED in this T6-live commit (added few-shot example to extractEvidenceViaGLM system prompt).
**Reference:** `scripts/t6-live-gate.ts` — extractEvidenceViaGLM system prompt now ~50 lines including the example.

---

## Live Issue #15 — GLM returns Arabic question mark "؟" (U+061F) instead of ASCII "?"

**Discovered:** 2026-09-29 (G7 STORM A/B test — first run)

**The bug:**
In `src/book-forge/lib/research/storm-questions.ts`, the `AskQuestionSchema` used `.endsWith('?')` (ASCII question mark, U+003F) to validate that GLM's generated questions end with a question mark. However, when GLM generates Arabic questions, it naturally uses the Arabic question mark "؟" (U+061F) — a different Unicode codepoint. All Arabic questions failed schema validation, the repair loop (1 retry) also failed (GLM persisted with Arabic mark), and `askJSON` threw `SchemaValidationError`, crashing the A/B test silently.

Schema-validation errors (first run):
```
[{"path":"questions.0","message":"Invalid string: must end with \"?\""},
 {"path":"questions.1","message":"Invalid string: must end with \"?\""},
 {"path":"questions.2","message":"Invalid string: must end with \"?\""}]
```

Raw GLM response (clearly valid questions, just Arabic mark):
```
{
  "questions": [
    "ما هو معدل استخدام المياه في أنظمة الزراعة المائية مقارنة بالزراعة التقليدية في المناطق القاحلة؟",
    "كيف تساهم الزراعة المائية في الحفاظ على التنوع البيولوجي مقارنة بالزراعة التقليدية؟",
    "ما هي التأثيرات البيئية الإيجابية لنظم الزراعة المائية على النظم البيئية المائية المحلية؟"
  ]
}
```

**The fix:**
Changed the schema from `.endsWith('?')` to `.refine((s) => s.endsWith('?') || s.endsWith('؟'), ...)` — accepting both ASCII `?` (U+003F) and Arabic `؟` (U+061F). After the fix, all 12 STORM-generated questions across 3 chapters (4 personas × 3 questions) passed schema validation on the first attempt.

**Why this matters:**
This is the **fifth distinct GLM shape** discovered (issues #2, #3, #4, #10, #15). The pattern: GLM is a multilingual model, and Arabic-specific Unicode codepoints (Arabic question mark `؟` U+061F, Arabic comma `،` U+060C, Arabic semicolon `؛` U+061B) are valid in Arabic text but differ from their ASCII counterparts. Any schema that enforces ASCII punctuation on Arabic content will fail.

**Future rule (Layer 24 rule #12 candidate):**
Any Zod schema that validates punctuation in user-facing strings (questions, claims, etc.) MUST accept BOTH the ASCII and Arabic Unicode variants of the punctuation mark. The known pairs:
- `?` (U+003F) ↔ `؟` (U+061F) — question mark
- `,` (U+002C) ↔ `،` (U+060C) — comma
- `;` (U+003B) ↔ `؛` (U+061B) — semicolon
- `%` (U+0025) ↔ `٪` (U+066A) — percent sign

A helper `bilingualPunctuation()` could be added to Layer 24 to centralize this.

**Date:** 2026-09-29
**Status:** FIXED in this G7 commit — `storm-questions.ts` AskQuestionSchema now accepts both `?` and `؟`.
**Reference:** `src/book-forge/lib/research/storm-questions.ts` line 88-98.

---

## Live Issue #14 — STORM Python package install failed in sandbox (torch download timeout)

**Discovered:** 2026-09-29 (G7 STORM A/B test — preparation phase)

**The bug:**
`pip install knowledge-storm` (the official STORM Python package) was attempted in the sandbox to use STORM as a question generator. The install pulls in `dspy_ai` + `sentence-transformers` + `torch` (248MB for `triton-3.8.0` alone, plus `torch` itself). The download timed out after 5 minutes (300s) before completing. The `vendor/` target directory was never created — install failed silently.

**Why this is environmentally-qualified (per D20.1):**
- The sandbox has limited bandwidth and a 5-minute hard timeout for pip downloads of large wheels.
- On a production server with normal bandwidth, `torch` (the bottleneck dependency) installs in ~30-60 seconds.
- The failure is NOT a defect in STORM or in our integration — it's a sandbox infrastructure constraint.
- Per D20.1: "flaky تشغيلياً — retry ×2/5s · فشله → `providerGaps` لا خطأ · مستبعد من عدّادات القبول · tier بيئي-مؤهل يُعاد قياسه على خادم الإنتاج."

**The workaround (used for G7 A/B test):**
- TypeScript port of STORM's MIT-licensed prompts (`GenPersona` + `AskQuestionWithPersona`) — verbatim from `stanford-oval/storm` repo files `persona_generator.py` + `knowledge_curation.py`.
- Per partner instruction: "ممنوع استخدام استرجاع STORM الويب — نعزل المتغير الوحيد: جودة الأسئلة." — the TypeScript port tests pure question quality, which is exactly the variable the A/B test isolates.
- Same prompts, same GLM, same federation — only the runtime differs (TypeScript vs Python).
- LICENSE verified at merge time (MIT, Copyright (c) 2024 Stanford Open Virtual Assistant Lab).
- The port is in `src/book-forge/lib/research/storm-questions.ts`.

**Resolution path (when production server is available):**
1. On production, `pip install knowledge-storm` should succeed (torch installs cleanly).
2. The Python package would be used directly via a sidecar (matching the P8-T3 paper-search-mcp sidecar pattern).
3. The TypeScript port can be removed at that point — OR retained as a lightweight fallback for development environments where Python install is undesirable.
4. Re-run `scripts/g7-storm-ab.ts` with the Python sidecar to verify the A/B result holds (DROP verdict is expected to be the same, since the prompts are identical).

**Why this matters for D28 (G7 DROP verdict):**
The DROP verdict is based on the TypeScript port's results. A purist could argue "you tested a port, not the real STORM." The counter-argument: STORM's question generation is PURE LLM work using STORM's exact prompts — there is no Python-specific behavior in question generation (no embeddings, no retrieval, no dspy compilation that produces different output). The prompts are what they are. If the prompts produce worse questions than internal expansion under our GLM + our federation, the Python runtime would produce the same prompts and the same questions. The DROP verdict is valid.

**Date:** 2026-09-29
**Status:** ENVIRONMENTALLY-QUALIFIED — TypeScript port used as workaround; production re-test recommended but not blocking G7 closure.
**Reference:** `sidecars/storm/install.log` (empty — install never completed) + `src/book-forge/lib/research/storm-questions.ts` (TypeScript port).

---

## Live Issue #16 — GLM distortionType non-canonical/non-string type (final fix — P10-T0a)

**Discovered:** 2026-09-29 (documented at P9-live closure as "partial fix" — became final-fix-required at P10-T0a)

**The bug:**

GLM, when asked to classify distortion type on a lossy simplification, sometimes returns values outside the canonical enum. The two partial fixes failed:

1. **`8e03dce` (partial fix #1)** — Schema changed from `z.enum([...]).nullable()` to `z.string().nullable()`. This *narrowed* the explosion scope but didn't eliminate it: when GLM returns `123` (number) or `{}` (object) or `[]` (array), `z.string()` rejects the type → triggers the JSON repair loop → second GLM call → if the second call also returns a non-string, `SchemaValidationError` is thrown → entire simplification aborts.

2. **`490ad30` (partial fix #2)** — Added a post-parse enum check (`VALID_DISTORTIONS.includes(rest.distortionType)`). But the *schema* remained `z.string().nullable()`, so the repair-loop still fired on non-string inputs — the post-parse check never ran because parse failed first. The fix was conceptually right but operationally inert for the non-string cases.

**The final fix (P10-T0a):**

Separation of concerns — schema accepts anything, normalizer coerces to canonical | null:

1. **Schema:** `distortionType: z.unknown()` in both `SimplifierOutputSchema` (agents/simplifier.ts) and `FidelityJudgeSchema` (lib/simplify/fidelity-gate.ts). `z.unknown()` never rejects a value at parse time — the repair-loop is never triggered by this field alone.

2. **Normalizer (new shared file):** `src/book-forge/lib/simplify/distortion-normalize.ts` exports `normalizeDistortionType(input: unknown): DistortionType | null`. It handles every observed shape:
   - `null` / `undefined` → `null`
   - `""` / whitespace → `null`
   - non-canonical string ("weird", "n/a", "none", "null" as string, Arabic text) → `null`
   - canonical string ("scope-drop") → `"scope-drop"` (case-insensitive match, trimmed)
   - aliases ("causality" → "causality-lift", "scope" → "scope-drop", etc.) → canonical
   - non-string types (number, boolean, object, array, Date, NaN, Infinity) → `null`

3. **Batch activation (side effect):** `simplifyClaimsForChapter` switched from sequential `for` loop to `Promise.all` batches of `SIMPLIFIER_BATCH_SIZE = 4`. The throttle (5s sequential gap) is shared per batch, so 4 parallel calls cost ~5s instead of ~20s — ~4× cost reduction. Per-claim try/catch preserved (Rule 11).

4. **`persistCost` noise mute (side effect):** `db.costEntry.create` throws Prisma P2003 (FK on `Book.id`) for every GLM call with a stub/smoke bookId. The fix mutes P2003 specifically (silent swallow); all other Prisma codes + non-Prisma errors still log. Chosen branch: "كتم" (mute) — the "stub" alternative (db.book.findUnique before every create) would double cost-entry query volume.

**Test evidence (`scripts/smoke-t0a-negative.ts` — 73 cases, no GLM call):**
- WEIRD absorb → null: 20/20 ✓ (null, undefined, "", "   ", "weird", "n/a", "none", "null" string, Arabic text, 123, 0, NaN, true, false, {}, {type:"scope-drop"}, [], ["scope-drop"], Date, Infinity)
- CANONICAL preserve: 13/13 ✓ (5 canonical + 4 case-variants + 5 aliases)
- SimplifierOutputSchema parse on 20 weird: 20/20 ✓ (z.unknown() absorbs all)
- FidelityJudgeSchema parse on 20 weird: 20/20 ✓ (z.unknown() absorbs all)
- TOTAL: 73/73 PASS

**Regression check:** `bun run scripts/smoke-pipeline-full.ts` → PASS (EPUB 14031 / PDF 52662 / DOCX 12565 / final state DONE).

**Type-clean check:** `bunx tsc --noEmit` → 0 new errors (baseline was 0 per D26).

**Date:** 2026-09-29 (P10-T0a)
**Status:** CLOSED ✅ — final fix shipped. Awaiting partner approval.
**Reference:** `P10-T0a-CLOSURE.md` + `live-evidence/p10-t0a-negative.json` + `src/book-forge/lib/simplify/distortion-normalize.ts`
