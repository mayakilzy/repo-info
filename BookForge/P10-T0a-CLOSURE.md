# 📋 P10-T0a — Live Issue #16 Final Fix — Closure Report

**التاريخ:** 2026-09-29 (P10-T0a — افتتاحية الجلسة الجديدة)
**الوكيل:** عصر الصوت (وكيل التنفيذ الجديد)
**الأمر:** T0a (إصلاح Live Issue #16 نهائياً — إجباري قبل كل شيء)
**السياق:** GLM يهرب من `enum distortionType` في الـ simplifier؛ إصلاحان جزئيان سابقاً فشلا (التقارير `8e03dce` + `490ad30` توثقان المحاولتين).

---

## المطلوب (من ملف تمهيد الجلسة)

1. `z.string()` + تطبيع post-parse كامل.
2. اختبار سلبي: ادخال قيم غريبة يدوياً ("weird", 123, null, "") وتأكيد الامتصاص بلا انفجار.
3. تفعيل الدفعات في `simplifyClaimsForChapter` (خفض كلفة التبسيط ~4×).
4. معالجة ضجيج `persistCost` على `bookId` اصطناعي (stub أو كتم).
5. القبول: اختبار سلبي PASS + type-clean صفر جديد + `smoke-pipeline-full` PASS.

---

## ما نُفِّذ (الكود + المسار)

### 1) التطبيع المشترك (المصدر الوحيد للحقيقة لـ distortionType)

**الملف الجديد:** `src/book-forge/lib/simplify/distortion-normalize.ts`

دالة `normalizeDistortionType(input: unknown): DistortionType | null` — تطبيع أي قيمة GLM يرجعها إلى `DistortionType | null`:

| الإدخال | الإخراج | السبب |
|---|---|---|
| `null` / `undefined` | `null` | لا قيمة |
| `""` / `"   "` | `null` | سلسلة فارغة |
| `"weird"` / `"none"` / `"n/a"` / `"null"` (string) | `null` | قيمة غير كنسية |
| نص عربي (مثل `"لا يوجد"`) | `null` | قيمة غير كنسية |
| `123` (number) | `null` | نوع خاطئ |
| `true` / `false` (boolean) | `null` | نوع خاطئ |
| `{}` / `[]` / `{type:"scope-drop"}` | `null` | object/array لا يُوثَّق من GLM |
| `Date` / `Infinity` / `NaN` | `null` | أنواع غير متوقعة |
| `"scope-drop"` (canonical) | `"scope-drop"` | الكنسي المباشر |
| `"Scope-Drop"` / `"CAUSALITY-LIFT"` | الكنسي المطابق | مطابقة case-insensitive |
| `" scope-drop "` | `"scope-drop"` | trim قبل المطابقة |
| `"causality"` / `"scope"` / `"hedge"` / `"strength"` / `"conflict"` | الكنسي ذو الصلة | alias mapping |

النموذج: قبول `z.unknown()` على مستوى الـ schema (لا يُفجّر repair-loop)، ثم تطبيع post-parse إلى `DistortionType | null`. هذا الفصل بين المسؤوليتين هو جوهر الإصلاح النهائي.

### 2) الـ Simplifier agent

**الملف:** `src/book-forge/agents/simplifier.ts`

- `SimplifierOutputSchema.distortionType`: `z.string().nullable()` → **`z.unknown()`** (لا يُفجّر repair-loop على هذا الحقل وحده).
- `SimplifierResult.distortionType`: `string | null` → **`DistortionType | null`** (تحسين أمان النوع).
- `simplifyClaim` post-parse: يستدعي `normalizeDistortionType(rest.distortionType)`.
- **تفعيل الدفعات في `simplifyClaimsForChapter`**: حلقة `for` تسلسلية → دفعات `Promise.all` بحجم `SIMPLIFIER_BATCH_SIZE = 4`. كل دفعة تطلق 4 نداءات GLM بالتوازي، تتقاسم نافذة throttle واحدة (5s) — مما يخفض زمن التبسيط لكل فصل بمعامل ~4×. كل دعوة لها try/catch مستقل (القاعدة 11: دعوة فاشلة لا تُسقط الفصل).

### 3) الـ Fidelity Gate

**الملف:** `src/book-forge/lib/simplify/fidelity-gate.ts`

- `FidelityJudgeSchema.distortionType`: `z.enum([...]).nullable()` (السبب الجذري لانفجار #16 — rابع شكل مختلف يفشل parse ويُفعّل repair-loop) → **`z.unknown()`**.
- `judgeFidelityLLM` post-parse: `result.distortionType as DistortionType | null` (cast غير آمن) → **`normalizeDistortionType(result.distortionType)`** (تطبيع آمن).

### 4) كتم ضجيج persistCost على bookId اصطناعي

**الملف:** `src/book-forge/lib/glm-client.ts` (دالة `persistCost`)

- الفشل كان: `db.costEntry.create` يرمي Prisma P2003 (FK على `Book.id`) لكل نداء GLM يمر عبر stub/smoke bookId غير موجود. `console.error` لكل نداء = غرقان السجل وفقد الرؤية على الأخطاء الحقيقية.
- الإصلاح: التقاط Prisma error code `P2003` بالتحديد وكتمه صامتاً (لا log). كل الأخطاء الأخرى (P2002 unique, P2004 timeout, network, serialization) تبقى تُسجَّل.
- الاختيار: "كتم" (mute) بدلاً من "stub" (db.book.findUnique قبل كل create) — لأن stub يضاعف حجم استعلامات cost-entry، والكتم أرخص وأحد المسارين صحيحان.

---

## الاختبارات والقياسات

### الاختبار السلبي (smoke-t0a-negative.ts)

**الملف:** `scripts/smoke-t0a-negative.ts` (73 حالة اختبار)

| المجموعة | الحالات | PASSED |
|---|---|---|
| WEIRD (must absorb → null) — null/undefined/""/whitespace/"weird"/"n/a"/"none"/"null" string/123/0/NaN/true/false/`{}`/`{type:"scope-drop"}`/`[]`/`["scope-drop"]`/`Date`/`Infinity` | 20 | ✅ 20/20 |
| CANONICAL (must preserve) — 5 canonical + 4 case-variants + 5 aliases | 13 | ✅ 13/13 |
| SimplifierOutputSchema parse on 20 weird inputs (z.unknown absorption) | 20 | ✅ 20/20 |
| FidelityJudgeSchema parse on 20 weird inputs (z.unknown absorption) | 20 | ✅ 20/20 |
| **TOTAL** | **73** | ✅ **73/73 PASS** |

**الأمر:** `bun run scripts/smoke-t0a-negative.ts` — خروج 0 على PASS، 1 على FAIL. آمن للـ CI (لا DB، لا شبكة، لا Prisma — اختبار نقي للـ schema + الـ normalizer).

### اختبار الانحدار (smoke-pipeline-full.ts)

**الأمر:** `bun run scripts/smoke-pipeline-full.ts`

```
[smoke-full] base=http://localhost:3000
[smoke-full] bookId= cmuna8w7h002hn284iz31dy0z
[smoke-full] outline done
[smoke-full] research done → COVER_GENERATING
[smoke-full] cover done → AUTHORING
[smoke-full] chapter 1..6 authored + approved → ASSEMBLY
[smoke-full] publish done → HALT_FINAL_APPROVAL
[smoke-full] epub: 14031 bytes
[smoke-full] pdf: 52662 bytes
[smoke-full] docx: 12565 bytes
[smoke-full] manuscript OK
[smoke-full] DONE!
[smoke-full] final state= DONE
[smoke-full] PASS
```

### فحص type-clean (tsc --noEmit)

- baseline قبل T0a: **0 أخطاء** (D26 — DEBT CLEANED)
- بعد T0a: **0 أخطاء جديدة** — صفر دَين جديد ✓
- ملاحظة: استيراد `type DistortionType` في simplifier.ts مُستخدم الآن في `SimplifierResult.distortionType` (`DistortionType | null` بدلاً من `string | null` — تحسين أمان النوع).

---

## مقارنة الإصلاحات الثلاثة لـ Live Issue #16

| المحاولة | schema | post-parse | نتيجة |
|---|---|---|---|
| `8e03dce` (partial #1) | `z.string().nullable()` | enum check | يفشل على number/object/array → يُفعّل repair-loop → SchemaValidationError |
| `490ad30` (partial #2) | `z.string().nullable()` (لم يتغير) | enum check مُضاف | يُفعّل repair-loop على غير string — كلفة GLM مزدوجة بلا فائدة |
| **T0a (FINAL)** | **`z.unknown()`** | **`normalizeDistortionType()` مشترك** | **لا repair-loop، لا explosion، تطبيع آمن إلى `DistortionType \| null`** — 73/73 PASSED |

---

## الملفات المُلتزمة على القرص

### mayakilzy/BookForge (الكود)

```
src/book-forge/lib/simplify/distortion-normalize.ts  (جديد — 116 سطر)
src/book-forge/agents/simplifier.ts                  (مُعدَّل — schema + batch + normalize)
src/book-forge/lib/simplify/fidelity-gate.ts        (مُعدَّل — schema + normalize)
src/book-forge/lib/glm-client.ts                    (مُعدَّل — persistCost mute P2003)
scripts/smoke-t0a-negative.ts                       (جديد — 73 حالة اختبار)
```

### mayakilzy/repo-info/BookForge/ (التقارير العامة)

```
P10-T0a-CLOSURE.md                       (هذا الملف)
LIVE-ISSUES-LAYER24.md                   (محدَّث — إضافة #16 CLOSED + القاعدة #11)
live-evidence/p10-t0a-negative.json      (دليل الاختبار السلبي — 73/73 PASSED)
SESSION-BRIDGE.md                        (محدَّث — #16 مرقَّم CLOSED)
```

---

## حالة القبول النهائية

| المعيار | النتيجة |
|---|---|
| اختبار سلبي: "weird"/123/null/"" تمتص بلا انفجار | ✅ PASS (73/73) |
| type-clean: صفر أخطاء جديدة | ✅ PASS (0 new tsc errors) |
| `smoke-pipeline-full` PASS (لا انحدار) | ✅ PASS (EPUB+PDF+DOCX+DONE) |
| تفعيل الدفعات في `simplifyClaimsForChapter` | ✅ (SIMPLIFIER_BATCH_SIZE=4) |
| كتم `persistCost` على bookId اصطناعي | ✅ (P2003 silent swallow) |
| التزام + رفع للمستودعين | ✅ (commits below) |
| تقرير جاهز لمصادقة الشريك | ✅ (هذا الملف) |

**T0a مكتمل في انتظار مصادقة الشريك.** بعد المصادقة: T0b (بوابة G1 — صوت) بأمر الشريك.

---

## الجسور للمستقبل (للجلسة القادمة بعد مصادقة الشريك)

- الدفعات في `simplifyClaimsForChapter` جاهزة لقياس حي على خادم الإنتاج (القياس المتوقع: ~4× خفض زمن تبسيط الفصل الواحد).
- `normalizeDistortionType` قابل لإعادة الاستخدام في أي agent آخر يرجع distortion type (مثلاً لو ظهر distortion في مراجعة الفصول لاحقاً).
- الـ "stub أو كتم" pattern في persistCost قابل للتعميم على CostEntry FK الأخرى (مثلاً `agentId` لو أُضيف لاحقاً) — نفس القالب: P2003 silent, غيره log.
