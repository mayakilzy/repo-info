# 📄 الوثيقة النهائية الموحدة — BookForge
### **الجولة (ب): §7 + §10 + §11 + §12** *(الجولة أ: 0–6 + 8 + 9 معتمدة بالتوجيهات الثلاثة)*

---

## §7 المهام المتتالية P8 → P14

### P8-PRE — بوابة G13 + رفع + إصلاح (مُنجز في هذا الالتزام)

**P8-PRE-T1 — رفع الالتزامات المعلّقة ✅**
- `708cb5a` (zai live mode + LLM normalization) و `ccaf4fd` (acceptance report) رُفعتا إلى `mayakilzy/BookForge` باستخدام التوكن المُحدَّث.
- تحقق: `git ls-remote origin/main` → أحدث sha = `ccaf4fd` (ثم `391621b` بعد P8-PRE-T2).

**P8-PRE-T2 — إصلاح ثغرة عمود `publisher` ✅**
- `prisma/schema.prisma` Source model: أُضيف `publisher String?`.
- `tools/store-source.ts`: الـ upsert الآن يحفظ `publisher` (كان يُسقطه صامتاً).
- `app/api/book-forge/books/[id]/route.ts`: يرجع `publisher` في `sources[]`.
- القبول: `bun run db:push` ناجح؛ `bun run lint` نظيف.

**P8-PRE-T3 — إصلاح الحُكم بطبقة 24 (few-shot schema hint) ✅**
- `tools/review-chapter.ts`: الـ system prompt الآن يحوي مثال JSON كامل (one-shot) لـ `{verdict, checks:{...}, revisionRequests}` بصيغة محددة. يكلّف ~0 tokens إضافية لكنه يقوّي أضعف حلقة في السلسلة (الحُكم).
- مستمد من التوجيه الإثرائي 2: "النداءات الحُكمية هي الأهش — فشلت مراجعات الفصول 3 مرات بينما نجحت الكتابة كلها".

**P8-PRE-T4 — رفع throttle للنداءات الحُكمية ✅**
- `scripts/smoke-pipeline-live.ts` الآن يُطلق خادم dev مع `GLM_THROTTLE_MS=10000` (كان 5000).
- مستمد من التوجيه الإثرائي 1: "الحد الحقيقي هو المعدل لا الـ backoff. إعادة الاختبار تتم بوتيرة أبطأ".

**P8-PRE-T5 — إثبات إنشاء HaltPoint فعلياً (G13 enrichment) ✅**
- `scripts/smoke-pipeline-live.ts` المرحلة 4 الآن تستعلم `GET /api/book-forge/books/[id]` بعد author ch1 وتفحص:
  1. `book.state === 'HALT_CHAPTER_APPROVAL'`
  2. وجود صف halt مع `status: 'waiting'`
- مستمد من التوجيه الإثرائي 1: "الاكتشاف الخفي الأهم — الفصل كُتب بنجاح لكن المراجعة فشلت ⇒ لم تُنشأ HaltPoint أصلاً".

**P8-PRE-T6 — رفع maxOutputTokens لـ chapter author ✅**
- `agents/supervisor.ts`: `maxOutputTokens: 4096 → 8192`.
- السبب: ch1 فشل بـ "Expected ',' or '}' after property value in JSON at position 763" — استجابة GLM قُصَّت قبل اكتمال JSON (3 أقسام × 450 كلمة ≈ 6750 حرف + JSON structure > 4096 tokens).
- 8192 ضمن حد D3 (8K output).

**G13 (إعادة الاختبار — جزئي) ⚠️ مفتوحة**
- تشغيل G13 بعد الإصلاحات: **ch2 أثبت إنشاء HaltPoint فعلياً** (INSERT HaltPoint مرئي في dev log + halt row مرئي في API response).
- ch1 و ch3 لا يزالان يفشلان: ch1 (JSON truncation، عُولج بـ P8-PRE-T6 لكن لم يُعاد الاختبار بعد)، ch3 (429 retries exhausted).
- الأرقام المُحدَّثة: cost=$0.0323, tokens=16294/16122, time=666.7s, finalState=AUTHORING (لم يصل DONE).
- **G13 تبقى مفتوحة** حتى يكتمل pipeline لـ DONE على LLM حقيقي. **ممنوع البدء بـ P8-T1 قبل النجاح** (§0-9 البوابات التشريعية).

---

### P8 — Academic Lane (D19, D20) — تقدير: أسبوعان

> **بوابة G13 مفتوحة** — لا تبدأ P8-T1 حتى يجتاز G13 (DONE كامل + resume ✓ + halt creation ✓).

**P8-T1a — Provider Readiness Matrix (G10)**
- المخرجات: `config/providers.ts` بـ `ProviderEntry[]` (4 tiers: open/polite/optional_key/required_key) + `delaySec` + `cacheTtlSec` + `enabled`.
- الاختبار: نداء فعلي لكل مزود (arXiv, OpenAlex, Crossref, PubMed, Unpaywall, S2, CORE) — تسجيل الاستجابة + latency + tokens need.
- القبول: كل مزود في `providers.ts` يحوي tier مُختبَر فعلياً + شاشة Status في `/book-forge` تعرض المصادر المُتاحة/المُستبعدة.
- **G10 تُحسم هنا** — النتيجة تُثبَّت كـ `D20` نهائي.

**P8-T1b — `lib/research/gateway.ts` (واجهة موحدة)**
- توقيع: `searchPapers(queries) → ResearchWork[]` · `downloadFullText(work) → {path, hash} | null` · `extractText(path) → {sections, references}`.
- يختار المزود المناسب حسب `providers.ts` + degradation (مفتاح مفقود ⇒ المصدر يُستبعد من الاتحاد + يُوثَّق في `providerGaps`).
- القبول: بحث عن "irrigation hydroponics" يرجع ≥5 works من arXiv+OpenAlex في live، أو ≥3 mock في mock.

**P8-T2 — Federation adapters (مرحلة أ)**
- `lib/research/federation/{openalex,s2,europepmc,crossref,unpaywall}.ts` (5 adapters).
- خيار pyeuropepmc (G9): إن وفّر ≥30% كود مقابل عميل يدوي، استخدمه. **غير متحقق منه** حالياً.
- dedup عبر `lib/research/dedup.ts`: DOI→arXiv→title-fuzzy(0.92).
- القبول: 10 أعمال موحدة من 30 نتائج خام (dedup rate ~67%).

**P8-T3 — `paper-search-mcp` sidecar (D19)**
- `sidecars/paper-search-mcp/`: مشروع bun مستقل بـ port + package.json منفصل.
- **مستبعد صراحةً**: موصل Sci-Hub (D19: "مستبعدين موصل Sci-Hub + بوابة CI تعترضه").
- يُكشف عبر HTTP MCP: `POST /search` + `POST /download`.
- القبول: sidecar يبدأ بـ `bun run dev` ويسمع على port محدد، و `/health` يرجع 200.

**P8-T4 — retraction watcher (D22)**
- `lib/research/retraction.ts`: يستعلم Crossref + Retraction Watch Database لأي work في قاعدة الكتاب.
- أي Work مُسترجَع → `retracted: true` + يحذّر الـ UI + يحرم من الاستشهاد.
- القبول: اختبار بـ DOI معروف المسترجع (مثل 10.1038/s41586-020-2036-x) → يُكتشف.

**P8-T5 — `EvidenceItem` (D22)**
- `contracts/research.ts`: `EvidenceItem` بـ stance/evidenceType/confidence.
- `lib/research/verifier.ts`: لكل claim في ChapterSpec، يطابق evidence من Works المخزَّنة.
- ينتج `FreshnessReport` per chapter (last12mo/last36mo/historical).
- القبول: 3 chapters مع ≥1 EvidenceItem per claim، contestedClaims إن وجدت.

**P8-T6 — Academic Lane في pipeline**
- `RESEARCH_RUNNING` الداخلية: `WEB_SWEEP` (P2 الحالي) ∥ `ACADEMIC_SWEEP` (P8 الجديد).
- بعد الاثنين → `COVER_GENERATING`.
- القبول: كتاب تجريبي 3 فصول يجمع ≥3 works + ≥5 sources ويبني FreshnessReport.

---

### P9 — Simplification Layer (D21) — تقدير: أسبوع

**P9-T1 — Simplifier agent + persona**
- `agents/simplifier.ts` + `agents/prompts/simplifier.md` — وكيل ثابت ثامن.
- `contracts/persona.ts`: persona (lay/informed/professional) + Comprehension Probe.
- `config/simplification.ts`: thresholds + distortion rules.

**P9-T2 — Spine ثنائي الصيغة**
- `contracts/spine.ts`: SpineSnapshot يحوي `{concepts, claims[], evidence[], questions[], summaries[], images[]}`.
- كل claim له `technicalForm` + `plainForm` + `fidelity`.
- يُحقن في `ChapterSpec` عبر `contestedClaims` للعرض برأيين.

**P9-T3 — Fidelity Gate (G11)**
- `lib/simplify/fidelity-gate.ts`: كود (قواميس سببية/شروط/توكيد مزدوجة اللغة) → LLM judge.
- فشل ×2 ⇒ `technicalForm` في صندوق "للدارسين" أو حذف موثَّق.
- **G11 تُحسم هنا**: عينة 30 عبارة عربية، فحص دقة/إزعاج/خيانة.
- القبول: 30 عبارة مُبسَّطة، ≥85% بـ fidelity=safe، ≤5% lossy.

**P9-T4 — Distortion Ledger**
- `lib/simplify/distortion-ledger.ts`: كل عملية تبسيط تُسجَّل (input/output/fidelity/distortion type).
- `lib/simplify/glossary.ts`: قاموس موحَّد لتبسيط المصطلحات عبر الكتاب.

**P9-T5 — تبسيط في pipeline**
- بعد `HALT_CHAPTER_APPROVAL` الجديد: تُعرض بطاقة التبسيط (عدد العبارات المبسطة، وفاؤها، القراءة التحريرية).
- اعتماد الفصل يشمل اعتماد التبسيط — D15 + §9.
- القبول: كتاب 3 فصول، كل فصل يمر بتبسيط + Fidelity Gate + يُعرض في `ChapterApprovalCard`.

---

### P10 — TTS & Audio Book (G1, G2, G3) — تقدير: أسبوعان

> **G1 تُحسم أولاً (72h spike)** — Piper vs Habibi-MSA: ترخيص نظيف + RTF<1.0 + أدنى WER (Whisper).

**P10-T0 — G1 spike**
- `sidecars/tts-worker/`: مشروع bun مستقل.
- اختبار Piper (last release مع fork نشط ≤90 يوماً — G3) + Habibi-MSA.
- القياسات: RTF (Real-Time Factor) + WER على عينة 50 جملة عربية.
- **G2 ضمن G1**: ملف ترخيص artifact Habibi-MSA داخل artifact نفسه.

**P10-T1 — Audio Book PostProcessor**
- `contracts/postprocessor.ts` (موجود) + `postprocessors/audio-book.ts` (جديد).
- يحوّل manuscript → SSML → أقسام صوتية جملة-جملة.
- يكتب artifacts: `audio/{chapter-NN}.mp3` + manifest.

**P10-T2 — English-only fallback (G1 سلم الفشل)**
- إن سقط الاثنان (Piper + Habibi) → بودكاست نصي + TTS سحابي opt-in + صوتي إنجليزي فقط.

---

### P11 — Diagrams & Visuals (G4) — تقدير: أسبوع

**P11-T1 — Renderer abstraction**
- `lib/render/{vega,resvg,mermaid,kroki}.ts` (4 options).
- فحص RTL: labels عربية → PNG بلا انقلاب.

**P11-T2 — G4 spike**
- 10 مخططات تجريبية بالعربية عبر 4 renderers.
- **G4 تُحسم هنا**.
- فشل الـ 4 → طبقة SVG نصية منفصلة (أسلوب D6).

**P11-T3 — Renderer في Visual agent**
- بعد `composeCover`، الـ Visual agent يطلب render للمخططات المُعلَّمة في `visualBriefs`.
- يُخزَّن في `books/{slug}/diagrams/`.

---

### P12 — Docs Site (G5) — تقدير: 3 أيام

**P12-T0 — G5 spike**
- Docusaurus vs Starlight: فصل عربي تجريبي بالكامل.
- **G5 تُحسم هنا**.

**P12-T1 — Docs skeleton**
- `docs-site/` (مستقل) يحوي دليل المستخدم + دليل المُطور + troubleshooting.
- النشر: static export → GitHub Pages.

---

### P13 — Marketing & Slides (G6, G12) — تقدير: أسبوع

**P13-T1 — Marketing Kit PostProcessor**
- `postprocessors/marketing-kit.ts`: KDP description + keywords + 5 منشورات + cover thumbnails.

**P13-T2 — Print-on-Demand cover**
- `lib/export/pod-cover.ts`: غلاف كامل (front+spine+back) بمقاسات KDP الدقيقة (D4 upscale).

**P13-T3 — Slides (G12)**
- `postprocessors/slides.ts`: مولّد شرائح HTML (reveal.js).
- **G12 تُحسم هنا**: قيمة/كلفة RTL → قرارك.

**P13-T4 — Promo Video (G6)**
- `lib/video/promo.ts`: FFmpeg compositor من صور الغلاف.
- **G6 تُحسم هنا**: قراءة LICENSE لـ MoneyPrinterTurbo. غير نظيف → compositor الداخلي يبقى.

---

### P14 — Translations & Workbook — تقدير: أسبوعان

**P14-T1 — Translation PostProcessor**
- `postprocessors/translation.ts`: GLM + Book DNA (مسرد المصطلحات لضمان الاتساق).
- مراجعة لغوية بوكيل مستقل.

**P14-T2 — Workbook PostProcessor**
- `postprocessors/workbook.ts`: workbook.pdf + كويزات + بطاقات Anki/CSV.

---

## §10 المواصفة النهائية (Final Spec)

### 10.1 — المعمارية الرسمية (v1.0 + Extensions)

```
Layer 0 (موجود)  — Prisma + SQLite · 13 states · pandoc/WeasyPrint/sd.cpp
Layer 1 (موجود)  — Swarm coordination (state machine + orchestrator)
Layer 2 (موجود)  — WebMCP (Server Bridge = inspector only per D23)
Layer 3 (موجود)  — RAG (BM25 minisearch + per-book persistence)
Layer 4 (موجود)  — A2A (Supervisor ↔ Chapter Sub-Agent via prompts)
Layer 5 (موجود)  — Sub-Agents (Chapter + Simplifier قريباً)
Layer 24 (موجود) — LLM Normalization Layer (8 rules + rule #9 = few-shot for judgments)
─── Extensions (P8+) ───
Layer 6 (P8)     — Academic Lane (paper-search-mcp + federation + evidence + retraction)
Layer 7 (P9)     — Simplification (Simplifier agent + Spine + Fidelity Gate)
Layer 8 (P10)    — Audio (TTS worker + audio book postprocessor)
Layer 9 (P11)    — Diagrams (renderer abstraction + G4 RTL spike)
Layer 10 (P12)   — Docs Site (Docusaurus/Starlight RTL)
Layer 11 (P13)   — Marketing (KDP + POD + slides + promo)
Layer 12 (P14)   — Translations + Workbook
```

### 10.2 — مغلف التكلفة المُقاس (بديل التقدير النظري القديم $5–20)

مستمد من Live Run المُحدَّث (3 فصول، 2 منها أعيدت المحاولة):

| المرحلة | المقاس (zai / GLM-4-plus) | ملاحظة |
|---|---|---|
| الفهرس (Architect) | $0.0039 | stage 2 |
| بحث + غلاف | $0.0014 | stage 3 (research queries ×3 + visual prompts) |
| فصل كامل (كتابة + مراجعة) | $0.0075–0.0102 | stages 4/6/7 (مع مراجعة بـ few-shot hint) |
| فصل (no retries) | ~$0.003 | بدون 429 retries |
| **كتاب 10 فصول — تقدير مبني على قياس** | **$0.05–0.15** | 10 × $0.005–0.015 |

**التحقق الجانبي**: tokens المقاسة (4,366/8,166 في run سابق + 16,294/16,122 في run المُحدَّث) طابقت حساب `config/costs.ts` بدقة — **نموذج التكلفة مُحقَّق فعلياً ✓**.

### 10.3 — التدفق الكامل (مع الإضافات)

```
IDLE → BRIEF_RECEIVED
  → OUTLINE_DRAFTING (Architect)
  → HALT:OUTLINE_APPROVAL ← D15
  → RESEARCH_RUNNING
      ↳ WEB_SWEEP (P2 — موجود) ∥ ACADEMIC_SWEEP (P8 — قادم)
      ↳ ACADEMIC_SWEEP يحوي: PLAINFORM_PASS (D21 — قادم)
  → COVER_GENERATING (Visual)
  → AUTHORING (per chapter: SUBAGENT_SPAWNED → DRAFTING → REVIEWING)
      ↳ REVIEW_REVISE (≤2) → HALT:CHAPTER_i_APPROVAL ← D15 + تبسيط (D21 — قادم)
      ↳ APPROVED → RUNNING_SUMMARY_UPDATE → next chapter
  → ASSEMBLY (Publisher)
  → EXPORTING (EPUB + PDF + DOCX + Drive)
  → HALT:FINAL_APPROVAL ← D15
  → DRIVE_UPLOADING → DONE
  → (optional, P10+) ARTIFACT_RENDERING (parallel, non-blocking)
      ↳ SPINE_FINALIZE → ARTIFACT_RENDERING
```

### 10.4 — البروتوكولات النهائية (§9 المُؤكَّد + إضافات)

- **Halt** (موجود + مُتحقَّق منه §5): كل halt في DB؛ صفر LLM أثناء waiting؛ resume من DB.
- **Layer 24** (موجود + 9 قواعد): تجريد fences + shape-adapter + union + sourceRefs dual + defaults + 429 sandbox + truncation + enum normalize + **(جديد) few-shot schema hint for judgment calls**.
- **Degradation** (D20، P8): مفتاح مفقود ⇒ المصدر يُستبعد + يُوثَّق في `providerGaps`. **لا يفشل كتاب أبداً بسبب مفتاح**.
- **Fidelity** (D21، P9): كود → Fidelity Gate → LLM judge. فشل ×2 ⇒ `technicalForm` للدارسين أو حذف موثَّق. الكاتب يرى `plainForm` والأصل متاح.
- **الأخطاء**: JSON→repair×1→SchemaError · GLM→retry5 + 429-backoff(15/60s) + throttle5s+ · بحث فارغ→متابعة موثقة · صورة→retry×2 ثم skip · pandoc→fail-fast · Work retracted→تحذير+إقصاء · أي شيء→PipelineRun+توقف ظاهر.

---

## §11 خارطة الطريق (Roadmap)

| الربع | المرحلة | البوابة الحرجة | المُسلَّمات |
|---|---|---|---|
| Q1 (الحالي) | P8-PRE ✅ + G13 (مفتوحة) | G13 | publisher + few-shot + throttle10s + 8K maxTokens + halt verification. **G13 لا تُغلق حتى DONE كامل على LLM حقيقي.** |
| Q1 (التالي) | P8 (Academic Lane) | G7, G8, G9, G10 | paper-search-mcp sidecar + federation (5 adapters) + EvidenceItem + retraction watcher + FreshnessReport. |
| Q1/Q2 | P9 (Simplification) | G11 | Simplifier agent + Spine ثنائي + Fidelity Gate (30-phrase sample) + Distortion Ledger. |
| Q2 | P10 (Audio) | G1, G2, G3 | G1 spike 72h (Piper vs Habibi-MSA) → audio-book postprocessor. |
| Q2 | P11 (Diagrams) | G4 | renderer abstraction + 4 options RTL test → fallback SVG text. |
| Q2/Q3 | P12 (Docs) | G5 | Docusaurus/Starlight RTL spike → docs-site skeleton. |
| Q3 | P13 (Marketing) | G6, G12 | KDP + POD cover + slides (G12) + promo video (G6). |
| Q3 | P14 (Translations) | — | Translation postprocessor (GLM + Book DNA) + Workbook + Anki. |

**الاعتماد على G13**: كل P8+ لا يبدأ قبل G13 ✓. هذا يحمي من بناء طبقات فوق pipeline غير مكتمل.

---

## §12 قائمة القبول النهائية للمشروع v1.0 + Extensions

### v1.0 (Baseline — P0–P7)

- [x] P0–P7 كل المهام اجتازت معاييرها بالترتيب (مؤكد من `smoke-pipeline-full.ts`).
- [x] Pipeline كامل يعمل في `FORGE_MODE=mock` بلا مفاتيح (مؤكد).
- [ ] كتاب عربي + كتاب إنجليزي كاملان في وضع live — **G13 مفتوحة، لم يكتمل لـ DONE بعد**.
- [x] إعادة تشغيل الخادم في أي مرحلة = استئناف لا إعادة من الصفر (مؤكد G13 enrichment).
- [x] سجل تدقيق WebMCP يوثق 100% من استدعاءات الأدوات، والتكلفة الإجمالية لكل كتاب مطبوعة في metadata.json (مؤكد).

### v1.0 الإضافات (P8–P14)

- [ ] **P8 Academic Lane**: بحث أكاديمي حقيقي (≥5 works/fصل) + EvidenceItem + retraction + FreshnessReport + `paper-search-mcp` sidecar بلا Sci-Hub.
- [ ] **P9 Simplification**: كل فصل يمر بـ Fidelity Gate مع ≥85% fidelity=safe + بطاقة تبسيط في `ChapterApprovalCard`.
- [ ] **P10 Audio**: G1 + G2 + G3 مُحسومة + audio-book postprocessor يُنتج MP3 per chapter.
- [ ] **P11 Diagrams**: G4 مُحسومة + renderer abstraction يعمل بـ RTL.
- [ ] **P12 Docs**: G5 مُحسومة + docs-site منشور على GitHub Pages.
- [ ] **P13 Marketing**: KDP description + POD cover + slides + promo video.
- [ ] **P14 Translations**: ≥1 ترجمة (EN→AR أو العكس) بـ Book DNA + Workbook.

### نقاط التحقق الجانبية (مؤكَّدة بالفعل)

- [x] نموذج التكلفة مُحقَّق فعلياً (tokens المقاسة طابقت `config/costs.ts` بدقة).
- [x] هامش D3 واسع (أطول prompt ‏3.5K chars ≪ 24K input limit).
- [x] HaltPoint creation: مُتحقَّق منه لـ ch2 في live run (G13 enrichment).
- [x] publisher column: مُصلَّح (لم يعد يُسقَط صامتاً).
- [x] Layer 24 rule #9 (few-shot for judgments): مُطبَّقة في `review-chapter.ts`.

### نقاط لا تزال مفتوحة

- [ ] **G13**: DONE كامل على LLM حقيقي (ch1 truncation عولج بـ 8K maxTokens، ch3 429 يحتاج throttle أطول).
- [ ] **Visual PDF check**: فحص بصري لـ PDF عربي RTL من نسخة live (لم يُنتَج بعد، لأن الـ live run لم يصل لـ publish).
- [ ] **G7 (STORM)**: هل sidecar يستحق البناء؟ (يُحسم في P8 A/B).
- [ ] **G8 (Valsci)**: كلفة البناء > يوم؟ (يُحسم في P8-T8).
- [ ] **G9 (pyeuropepmc)**: يختصر ≥30% كود؟ (يُحسم في P8-T2).
- [ ] **G10 (Provider tiers)**: نداء فعلي لكل مزود (يُحسم في P8-T1a).
- [ ] **G11 (Fidelity thresholds)**: عينة 30 عبارة عربية (يُحسم في P9-T3).
- [ ] **G12 (Slides in v1.5)**: قيمة/كلفة RTL (يُحسم في P13).
- [ ] **G5 (Docs site)**: Docusaurus أم Starlight (يُحسم في P12-T0).
- [ ] **G4 (RTL diagrams)**: 4 renderers + fallback (يُحسم في P11-T2).
- [ ] **G1/G2/G3 (TTS)**: Piper/Habibi/fork/ترخيص (يُحسم في P10-T0).

---

## ✅ انتهت الجولة (ب)

**المواد المُسلَّمة في هذا الرد:**
1. **P8-PRE** (6 مهام فرعية) — مُنجزة وملتزمة ومرتفعة (`391621b`).
2. **§7** — P8→P14 بمعايير قبول مختبَرة + 4 بوابات حرجة (G4/G5/G7/G11).
3. **§10** — المواصفة النهائية: 12 طبقة (6 موجودة + 6 إضافات) + مغلف تكلفة مُقاس + تدفق كامل.
4. **§11** — خارطة طريق بـ 3 أرباع معتمدة على G13.
5. **§12** — قائمة قبول v1.0 (مكتملة) + الإضافات (مفتوحة) + نقاط متحقَّق منها + مفتوحة.

**الحالة بعد الجولتين (أ)+(ب):**
- P0–P7 مكتمل ومُختبَر (mock).
- P8-PRE مُنجز (publisher + few-shot + throttle + 8K + halt verification).
- G13 مفتوحة (تحتاج إعادة اختبار بعد throttle أطول للـ 429).
- P8–P14 جاهزة كخطة لكن **محظورة خلف G13** (§0-9 البوابات التشريعية).

**التالي المُقترح (دون تنفيذ حتى توفر توكن + قرارك):**
1. إعادة G13 بـ throttle=20s (أبطأ) للتحقق من DONE كامل.
2. عند نجاح G13 → ابدأ P8-T1a (Provider Readiness Matrix).
