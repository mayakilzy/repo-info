# 📎 ملحق Amendment to Round B (ت1–ت8) — إدراجات حرفية في مواضعها

> **مرجع**: يُلصق هذا الملحق مباشرة بعد `ROUND-B-FINAL-SPEC.md`. صفر إعادة كتابة للجولة (ب) — إدراجات فقط في مواضعها المعلنة.

---

## ت1 — P9 يُدرج `P9-T0` (جديد، قبل Fidelity Gate)

> **الموضع**: §7 / مرحلة P9 / **أول مهمة** (قبل T1 الحالية التي تصبح T1→T2 … إلخ).

**P9-T0 — Vale + BookForgeArabicStyle (فحص رخيص بالكود أولاً)**
- **المكوّن**: `Vale (MIT)` server-side + حزمة `BookForgeArabicStyle` (توحيد مصطلحات الـ glossary، ترقيم عربي، منع تكرار لفظي).
- **التدفّق**: كل فصل بعد الكتابة وقبل Fidelity Gate يمرّ بـ Vale — الأخطاء الرخيصة (تكرار، مصطلحات غير موحَّدة، ترقيم) تُصلَّح بالكود قبل استدعاء LLM.
- **المخرجات**: `lib/simplify/vale-runner.ts` + `assets/vale/BookForgeArabicStyle/` (قواعد YAML).
- **القبول**: فحص فصل تجريبي يُرجِع JSON نتائج `{errors:[], warnings:[], suggestions:[]}`؛ ≥3 قواعد فعّالة (تكرار، مصطلح، ترقيم).

---

## ت2 — P10 يكتمل (البودكاست يعود)

> **الموضع**: §7 / مرحلة P10 / استبدال T1 + إضافة T2–T5.

**P10-T1 (مُصحَّح) — TTS Worker**
- المخرجات: `audio/{chapter-NN}.m4b` بفصول مدمجة (ليست MP3 مجردة) — m4b يدعم الفصول والـ metadata الكامل.
- يعتمد على G1 (Piper/Habibi-MSA) الفائز.

**P10-T2 — التطبيع العربي قبل TTS**
- المكوّنات: `CAMeL Tools` (تشكيل) → `Arabic Reshaper` (ترتيب الحروف) → توسيع أرقام/تواريخ منطوقة (1→"الأول"، 2024→"ألفان وأربعة وعشرون").
- حاسمة للعربية: بدونها الأحرف تظهر متصلة بشكل خاطئ في TTS.
- المخرجات: `lib/audio/arabic-normalize.ts` يُطبَّق على كل نص قبل تمريره لـ TTS.

**P10-T3 — Dialogue Planner (البودكاست الحواري)**
- `askJSON(DialogueScript)` يولّد حواراً من الـ Spine (لا من الـ manuscript): كل جولة بـ `sourceRefs` موثَّقة.
- **A/B اختياري ≤8h**: مقارنة Podcastfy (هجين) ضد المنطق الداخلي؛ إن تفوّق Podcastfy استُخدم، وإلا استُخدم الداخلي.
- المخرجات: `lib/audio/dialogue-planner.ts` + `contracts/dialogue.ts`.
- القبول: حوار 5 دقائق من فصل تجريبي بـ ≥3 مصادر مذكورة.

**P10-T4 — ماستيرينغ FFmpeg + m4b**
- `loudnorm ebur128`: بودكاست ‎-16 LUFS / كتاب صوتي ‎-19 LUFS.
- قص صمت أطول من 0.5s.
- دمج الفصول في `m4b` واحد بفصول metadata (chapter markers).
- المخرجات: `lib/audio/master.ts`.

**P10-T5 — حلقة QA (Whisper)**
- `faster-whisper` round-trip على كل مقطع صوتي → WER (Word Error Rate) لكل مقطع.
- إعادة توليد التالف: سقف جولتين. إن استمر التلف ⇒ تثبيت النص الأصلي كـ "نص مُلازم" + علم في الـ artifact.
- القبول: WER <15% لكل فصل.

---

## ت3 — P11 يكتمل (إنفوغرافيك + خريطة + فلاش كاردز)

> **الموضع**: §7 / مرحلة P11 / إضافة T3–T5 بعد T1–T2 الحالية.

**P11-T3 — إنفوغرافيك موثق المصدر**
- شرط: من `claims.hasNumbers === true` **حصراً** (لا يُولَّد إنفوغرافيك من ادعاءات بلا أرقام).
- المسار: `askJSON(InfographicSpec)` من الـ claim + البيان → `Vega-Lite` JSON → `resvg-js` → PNG.
- العربية RTL شرط G4 — labels تُمرّ عبر Arabic Reshaper قبل التصدير.
- المخرجات: `lib/visualize/infographic.ts` + `books/{slug}/infographics/`.

**P11-T4 — خريطة مفاهيم Graphviz**
- من `spine.concepts.relatedTo` (علاقات "يتفرع من" / "يعتمد على" / "يقابل").
- Graphviz dot → PNG (الأحرف العربية تُمرّ عبر Arabic Reshaper).
- المخرجات: `lib/visualize/concept-map.ts`.

**P11-T5 — فلاش كاردز genanki**
- `genanki (MIT)` بقوالب RTL (نموذج Arabic Front + Arabic Back).
- **FSRS** بيانات جدولة جانبية (algorithmopt-scheduled review): تُكتَب في حقل `data` إضافي داخل الـ `.apkg` لتطبيقات FSRS-aware.
- المخرجات: `books/{slug}/flashcards.apkg` + `lib/visualize/flashcards.ts`.
- القبول: 30 بطاقة من فصل تجريبي بـ RTL صحيح.

---

## ت4 — P12 يتوسع لمسارين (12A docs + 12B interactive-book)

> **الموضع**: §7 / مرحلة P12 / إعادة هيكلة لمسارين متوازيين.

**P12-A — Docs Site** (موجود كما هو)
- `docs-site/` مستقل + نشر GitHub Pages.
- G5 (Docusaurus/Starlight RTL) تُحسم هنا.

**P12-B — Interactive Book** (جديد)
- **MDX export** من الـ Spine (لا من الـ manuscript): كل قسم MDX مستقل بـ frontmatter يحوي sourceRefs.
- **Quiz** من `spine.questions` (اختيار من متعدد + سحب وإفلات).
- **Grounded Reading**: tooltips المصدر مع `stance` (supports/contradicts) — يمرر الماوس فوق ادعاء فيظهر المصدر والرأي.
- **Dual-Register** (D21): القارئ يبدّل بين `plainForm` ↔ `technicalForm` في الغطاء — لا حذف.
- **معاينة EPUB مضمنة** عبر `foliate-js (MIT)`. **تحذير صريح**: ممنوع الخلط مع `foliate desktop` (GPL-3.0 — غير متوافق مع رخصتنا).
- المخرجات: `apps/interactive-book/` (Next.js sub-app أو مسار منفصل).

---

## ت5 — مرحلة جديدة P15 — Twins & Incremental

> **الموضع**: §7 / مرحلة جديدة بعد P14 (تستهلك كل ما قبلها).

**P15-T1 — توائم قارئ ×3 + Comprehension Probe**
- 3 Sub-Agents من `audience` يقرؤون الفصل المبسَّط.
- كل توأم يجيب `Comprehension Probe` (أسئلة من `spine.questions` المرتبطة بالـ keyPoints).
- خطأ فيما تتيحه المعلومة الأصلية = فشل تبسيط → جولة إصلاح (≤2 جولات لكل توأم).
- `TwinReport` per chapter: `{persona, verdict, failedQuestions, reportJson}`.
- المخرجات: `agents/twin.ts` + `contracts/persona.ts`.

**P15-T2 — إعادة بناء تزايدية**
- `spine-diff`: مقارنة SpineSnapshot v(n) مع v(n-1) → قائمة الأقسام المتأثرة.
- جدول `Artifact`: كل export (epub/pdf/docx/audio/interactive) مُسجَّل بـ `{kind, chapterIndex, status, costUSD, outputs, manifest}`.
- تعديل فصل واحد ⇒ يُعاد توليد آثاره فقط (هذا الفصل + الـ TOC + الـ spine الكامل) — لا يعاد تصدير الكتاب كاملاً.
- **القبول T2**: تعديل قسم في فصل 3 من كتاب 6 فصول ⇒ يُعاد توليد الفصل 3 + الـ TOC فقط، بقية الفصول `cached` بلا تغيير.

---

## ت6 — G14 تُدرج في P13 (اعتمادك منفذ P13-T5)

> **الموضع**: §7 / مرحلة P13 / إضافة T5 (جديد).

**P13-T5 — `shotcraft-cinematic` opt-in خلف G14**
- **G14 (نصف يوم spike)**: ترخيص المستودع نفسه من المصدر (غير مصرّح في README = فشل البند) + مطابقة ترخيص Remotion لفئة استخدامنا (مثبتة الاسم) + قياس CPU: ‏Short ‏60s ‏1080×1920 بـ `--concurrency=1` + `chrome-headless-shell`.
- **اجتياز G14 ⇒** "إعلان الكتاب السينمائي" (قالب Ink Press مناسب جمالياً للكتب) + دراسة `talkcraft` لمزامنة word-level مع TTS الفائز.
- **فشل G14 ⇒** FFmpeg وحده (compositor داخلي مبسط).
- **T1 يكتسب الحصاد الفوري** (بلا بوابة): مؤثرات SFX الـ149 (ترخيص Mixkit التجاري المجاني) + نسخ `ATTRIBUTION.md` حرفياً داخل كل artifact فيديو.

---

## ت7 — تصحيحات دقة في P8

> **الموضع**: §7 / مرحلة P8.

**(أ) P8-T3 تُصحَّح**: sidecar هو **المستودع الأصلي Python** يُشغَّل كما هو (uv/Docker) على منفذ محلي — **ليس "مشروع bun مستقل"**. العميل لدينا TypeScript. بناء الصورة من المصدر **مستبعدين Sci-Hub** + بوابة CI (`grep -r "scihub\|sci-hub\|libgen" .` يفشل البناء إن وُجد).

**(ب) تُضاف T7 = G7 و T8 = G8** فيزول تناقض §7↔§12:
- **P8-T7 = G7**: STORM A/B مقيس — هل أدلة/فصل عبر أسئلة STORM > expansion داخلي؟ تعادل ⇒ إسقاط.
- **P8-T8 = G8**: Valsci opt-in — كلفة واجهة > يوم ⇒ تأجيل v2.

**(ج) Migrations إلزامية**:
- **P8-T5** تتضمن `Work` + `Evidence` (§5 الجولة أ) كـ Prisma models (وليس Json حرة).
- **P9-T2** تضيف `SpineSnapshot` كـ Prisma model.
- **P15** تضيف `TwinReport` + `Artifact` كـ Prisma models.
- **ممنوع** تخزين أي من هذه Json حرة — كلها migrations رسمية بـ `prisma migrate dev`.

---

## ت8 — نزاهة تسمية في §10.1 (Layer 4 A2A)

> **الموضع**: §10.1 / Layer 4 / استبدال الوصف.

**قبل**: "Layer 4 (موجود) — A2A (Supervisor ↔ Chapter Sub-Agent via prompts)"

**بعد**: "Layer 4 (موجود) — A2A — **مبسط — حلقة revise عبر prompts** (روح §23 لمستودعنا: documented reality outranks claimed fullness)"

---

## 🚦 بروتوكول إغلاق G13 (المُلزم قبل P8-T1a)

1. **`GLM_THROTTLE_MS=20000`** (الـ 10s الحالي لم يكفِ — الحد **معدل** لا backoff).
2. **إعادة ch1** للتحقق من إصلاح الـ 8192 (التقطع #9 من Layer 24).
3. **DONE كامل** + resume ✓ + HaltPoint ✓ (مثبت لـ ch2 أصلاً — يحتاج إثبات لـ ch1+ch3 أيضاً).
4. **فحص PDF عربي بصرياً من نسخة live** (المعلَّق الوحيد المتبقي من توجيه الجولة أ).
5. **حسم نمط الإنتاج**: يفوز ما يكتمل لـ DONE؛ إن أكمل الاثنان ⇒ القرار لك (D1 نهائياً).

**ممنوع P8-T1a قبل ✓ على البنود الخمسة** (§0-9 البوابات التشريعية).

---

## الخلاصة بعد الملحق

الجولة (ب) + هذا الـ Amendment = **الوثيقة النهائية مكتملة فعلاً**:
- ✅ لا ميزة معتمدة سقطت (البودكاست، التفاعلي، التوائم، التزايدي، Vale، إنفوغرافيك، فلاش كاردز، CAMeL، foliate-js، FSRS)
- ✅ لا بنية أُعيد كتابتها (ت1–ت8 إدراجات حرفية فقط)
- ✅ تناقض §7↔§12 حُلّ (ت7-ب)
- ✅ Layer 4 A2A وصِف بصدق (ت8)
- ✅ Migrations إلزامية لكل الـ models الجديدة (ت7-ج)
- ✅ G14 مُدرجة كبوابة (ت6)
- ✅ G13 بروتوكول إغلاق 5-خطوة مُلزم

بعد نجاح G13 يُفتح P8-T1a رسمياً 🚀
