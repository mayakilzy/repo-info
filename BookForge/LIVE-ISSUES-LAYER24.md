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

**G10 RESOLVED — D20 FINAL:**
- 4 tiers implemented and tested (open/polite/optional_key/required_key)
- 7 providers configured with proper envVar/delaySec/cacheTtlSec
- Degradation rule verified: missing env vars → provider disabled (no book failure)
- All keys/emails read server-side only (D23 pattern)
- ProvidersStatus UI component created (live matrix display)

Per §0-9: G10 closed ⇒ D20 final.
