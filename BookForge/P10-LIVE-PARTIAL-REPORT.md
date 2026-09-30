# 📋 P10 LIVE Integrated Run — Status Report (partial)

**التاريخ:** 2026-09-30 (التشغيل الحي المدمج — "الكتاب المزدوج")
**الوكيل:** عصر الصوت
**الحالة:** جزئي — text pipeline وصل إلى COVER_GENERATING + chapter 1 authoring فشل على 429

---

## 🎯 ما تحقق

### ✅ D34 — Mishkal GPL-2.0 isolation (مكتمل)
- Sidecar منتقل من `src/` إلى `sidecars/arabic-normalizer/server.py`
- HTTP service (نمط T1 worker) — GET /health + POST /normalize
- TS adapter يستخدم fetch() بدلاً من subprocess spawn
- 8/8 acceptance tests PASS
- `grep -rn 'from mishkal\|import mishkal' src/` = 0 matches ✓

### ✅ Live Issue #17 — zai-sdk max_tokens fix (مكتمل)
- **المشكلة:** `callZaiSdkGLM` adapter لم يمرّر `max_tokens` للـ SDK. GLM كان يقطع الاستجابة عند ~1871 tokens (default SDK limit)، مما يسبب فشل parse JSON.
- **الإصلاح:** adapter يبني request body مع `max_tokens` + `temperature` عند توفرهما.
- **الاختبار:** `max_tokens=4000` يُنتج استجابة كاملة (928 tokens، نهاية صحيحة).
- **الأثر:** Outline endpoint (الذي فشل بـ 500 بعد 89s) نجح الآن في 44s.
- مُلتزم في `src/book-forge/lib/providers/llm/zai-sdk.ts` + commit `c774c01`.

### ✅ Text pipeline (جزئي — حتى COVER_GENERATING)
عبر `FORGE_MODE=zai` (z-ai-web-dev-sdk بدون API key):
- ✅ Book creation (Arabic, 6 chapters, brief حقيقي)
- ✅ Outline generation — **44.2s** (بعد إصلاح Live Issue #17)
- ✅ Outline approval → RESEARCH_RUNNING
- ✅ Research (academic + web sweep) — **31.3s** (30 sources, 31 works, 0 contested)
- ✅ Cover generation — **79.8s**
- ⚠️ Chapter 1 authoring — فشل على 429 Too many requests بعد 3.6min (chapter 1 sections OK, review-chapter call rate-limited)

**Book state in DB:** `AUTHORING` (chapter 1 mid-review when 429 hit)

### ✅ CostEntry موثّقة (live numbers)
27 CostEntry rows captured before chapter 1 review failed:

| Agent | Kind | Calls | Input tok | Output tok | Cost USD |
|---|---|---|---|---|---|
| architect | createBookOutline | 1 | 727 | 4049 | $0.006437 |
| chapter | authorChapter | 2 | 1562 | 3124 | $0.005467 |
| research | generateQueries | 6 | 648 | 414 | $0.000946 |
| supervisor | reviewChapter | 2 | 2119 | 533 | $0.001860 |
| visual | generatePrompt | 16 | 1221 | 1010 | $0.002127 |

**Total cost so far:** $0.016837 (~$0.017) for partial book (~1/6 chapters).

**Projected full-book cost:** ~$0.10 (extrapolating from 1/6 of pipeline).

---

## ❌ ما لم يكتمل (مؤجل بسبب بيئي)

### Live Issue #18 — z-ai-web-dev-sdk rate limit (429 Too many requests)

**المشكلة:** Chapter 1 authoring calls GLM multiple times (research → write-section × N → review-chapter). الـ z-ai-web-dev-sdk rate-limited بعد عدة calls متتالية. retry ×5 فشل (كلها 429).

**السجل:**
```
[glm-client] retry attempt 1/5 in 15000ms (rateLimited=true)
[glm-client] retry attempt 2/5 in 30000ms (rateLimited=true)
[glm-client] retry attempt 3/5 in 60000ms (rateLimited=true)
[glm-client] retry attempt 4/5 in 60000ms (rateLimited=true)
GLM call exhausted retries
```

**التشخيص الطبقي:** هذا قيد بيئي خالص (D20.1-style) — z-ai-web-dev-sdk له حد من JO. الـ sandbox يصل له بعد ~27 calls خلال ~6 دقائق. على خادم إنتاجي مع IP مختلف أو throttle أطول (30s بدلاً من 5s) قد ينجح.

**الحلول المقترحة:**
1. **رفع throttle**: `GLM_THROTTLE_MS=30000` (30s between calls) بدلاً من 5s default
2. **batch processing**: تجميع calls (الـ batches مُفعّلة في T2 للـ simplifier — تحتاج لتفعيلها لـ chapter authoring)
3. **production server**: على خادم بإنتاجي مختلف، حد الـ rate يكون أعلى

**Per D20.1:** "tier بيئي-مؤهل يُعاد قياسه على خادم الإنتاج" — environmental qualification, re-test on production.

---

## 📊 القياسات المُكتسبة (live)

| القياس | القيمة | حالة |
|---|---|---|
| Wall time (brief → cover) | 2:35 (155s) | ✅ موثّق |
| Outline generation | 44.2s | ✅ موثّق |
| Research sweep | 31.3s | ✅ موثّق |
| Cover generation | 79.8s | ✅ موثّق |
| CostEntry total | $0.017 (partial) | ✅ موثّق |
| Calls before rate-limit | ~27 (over 6 min) | ✅ موثّق |
| Wall time (brief → m4b) | غير مكتمل (chapter 1 authoring فشل) | ❌ مؤجل |
| WER إنتاجي/مقطع | غير مكتمل | ❌ مؤجل |
| كلفة/دقيقة صوت | غير مكتمل | ❌ مؤجل |
| كلفة تبسيط بعد الدفعات | غير مكتمل | ❌ مؤجل |

---

## 📦 الملفات المُلتزمة

### mayakilzy/BookForge (الكود)
```
c774c01 fix(LIVE Issue #17): zai-sdk adapter now passes max_tokens + temperature
ceb7665 feat(D34): isolate Mishkal GPL-2.0 in HTTP sidecar at sidecars/arabic-normalizer/
```

### mayakilzy/repo-info (التقارير)
```
4722b0f docs(D34): insert Mishkal GPL-2.0 isolation decision
3b36a26 docs(P10): mirror T1-T5 final report (mock-PASS)
```

---

## 🎯 المسار القادم

### خيار A (موصى به): رفع throttle + إعادة التشغيل الحي
```bash
GLM_THROTTLE_MS=30000 FORGE_MODE=zai bun run scripts/live-twin-book-text.ts
```
متوقع: الـ pipeline يستغرق ~30-60 دقيقة بدلاً من ~6 دقائق، لكن يتجنب 429.

### خيار B: الانتظار لخادم الإنتاج
الـ rate limit بيئي — على خادم بإنتاجي مختلف (مع IP مختلف أو bearer token أعلى) قد لا يكون له نفس القيد.

### خيار C: تقصير الكتاب
تفعيل `chapterCountHint: 3` بدلاً من 6 — يقلل calls بنسبة 50%.

---

## ✅ الخلاصة

**ما تحقق:**
- ✅ D34 Mishkal isolation (مكتمل + موثّق)
- ✅ Live Issue #17 fix (zai-sdk max_tokens) — مكتمل + موثّق
- ✅ Text pipeline جزئي (brief → outline → research → cover) — first half of pipeline يعمل بشكل صحيح في zai mode
- ✅ CostEntry live موثّقة ($0.017 for partial run, 27 calls)

**ما لم يكتمل (بيئي):**
- ❌ Chapter authoring (full 6 chapters) — 429 rate limit
- ❌ T1-T5 audio production line (تتطلب نصاً مكتمل)
- ❌ Live WER/segment + cost/minute + simplification cost after batches + full wall time
- ❌ m4b final + podcast episode + complete JSON report

**الحالة الكلية:** P10 mock-PASS 31/31 (مكتمل) + D34 isolation (مكتمل) + Live Issue #17 fix (مكتمل) + Live partial run (نص + cost موثّق). الـ LIVE phase acceptance الكاملة مؤجلة لـ rate limit بيئي — يحتاج خادم إنتاجي أو throttle أطول.

**في انتظار مصادقة الشريك** على:
1. D34 isolation ✓ (مكتمل)
2. Live Issue #17 fix ✓ (مكتمل)
3. Live Issue #18 environmental qualification (D20.1 pattern — re-test on production)
4. continuation strategy (خيار A/B/C above)

🚀 البنية التحتية لخط الإنتاج الصوتي كاملة — المتخلف هو فقط قيد rate limit بيئي يحتاج بيئة إنتاجية.
