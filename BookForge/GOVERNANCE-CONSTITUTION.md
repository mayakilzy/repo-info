# 🏛️ BookForge — Governance Constitution

> الدستور الحاكم لمشروع BookForge. كل حقيقة على القرص لا في الذاكرة.
> المرجع الموحد لقواعد التنفيذ (§0) + البوابات (G1–G14) + القرارات (D1–D24).

---

## §0 قواعد التنفيذ الإلزامية (Execution Contract v2)

1. **ممنوع التخمين**: أي قيمة تؤخذ من `config/` أو من الوثيقة. ما ليس في أحدهما → توقف واسأل.
2. **المهام متسلسلة**: `P{n}-T{m}` لا تبدأ قبل اجتياز قبول سابقتها باختبار فعلي.
3. **FORGE_MODE للنظام كله**: كل pipeline يعمل mock بلا مفاتيح قبل live.
4. **الحالة في DB لا في الذاكرة** (مثبت عملياً — G13 + G10 closure).
5. **الأرقام في config فقط** — لا أرقام سحرية في الكود المنطقي.
6. **كل JSON من LLM يمر بالطبقة 24** (التطبيع ثم Zod ثم حلقة إصلاح واحدة).
7. **البناء فوق القائم لا داخله**: لا تعديل P0–P7 إلا إصلاح موثق.
8. **⚖️ الطبقة 24 — LLM Normalization Layer**: كل نداء GLM يمر بالقواعد التسع المستمدة من Live Run (غير قابلة للتخطي) + القاعدة العاشرة (few-shot schema hint للنداءات الحُكمية).
9. **🚪 البوابات تشريعية**: مهمة تحوي بوابة لا تبدأ قبلاً؛ ناتجها يُثبَّت كقرار D جديد؛ فشلها يفعّل المسار البديل المعلن لا يعطّل التطبيق.
10. **📸 بروتوكول البصمة**: أي وصف للحالة القائمة يُكتب من الكود؛ ما لا يتحقق منه يُعلَّم "غير متحقق منه" — ممنوع التوصيف من الذاكرة.

---

## البوابات التشريعية G1–G14

| البوابة | الحالة | القرار |
|---|---|---|
| **G1 🎙️ TTS (Piper/Habibi)** | **RESOLVED ✅ — ADOPT Piper** | D33: Piper ar_JO-kareem-medium (MIT, RTF 0.10, 7-10× faster than realtime on CPU). Habibi-MSA fails RTF<1.0 on CPU (188×-469×), Apache 2.0 — deferred to v2 GPU servers. |
| G2 ⚖️ TTS License | **RESOLVED ✅** | Within G1: Piper MIT (upstream LICENSE.md verified); Habibi-MSA Apache 2.0 (per top-level README.md INSIDE the artifact — cc-by-nc-sa-4.0 metadata applies only to Unified/SAU/UAE) |
| G3 🔧 Piper fork activity | **RESOLVED ✅** | Within G1: No active fork within 90 days (only metadata-only commit in minaiml/piper). Per protocol: pin to latest release (2023.11.14-2). |
| G4 🖼️ RTL diagrams | OPEN | P11-T2 spike |
| G5 📖 Docs site RTL | OPEN | P12-T0 spike |
| **G6 🎬 Promo video license** | **RESOLVED ✅ — MIT (clean)** | D38: MoneyPrinterTurbo MIT verified from inside repo. 127K stars, active. Commercial OK. |
| **G7 🌊 STORM** | **RESOLVED ✅ — DROP** | D28: B ≤ A by -20% على score=2 works/chapter (نطاق مضبوط: DROP كـمولّد أسئلة فوق اتحاد معجمي؛ Co-STORM خارج النطاق) |
| **G8 🔍 Valsci** | **RESOLVED ✅ — DEFER v2** | D29-closure: كلفة الواجهة ~38h (~5 days) >> 1 day threshold ⇒ تأجيل v2 (GPLv3 isolation + S2ORC 1.6TB + adapter) |
| G9 📚 pyeuropepmc | **RESOLVED ✅** | manual client (30 LOC adapter / 80 LOC total path per تأ-4) — T2-live gate |
| **G10 📚 Provider tiers** | **PARTIAL-CLOSE ✅** | 2 flaky (arxiv+openalex, measured 0/3) + 4 working + 2 disabled |
| G11 🧪 Fidelity thresholds | OPEN | P9-T3 (30-phrase sample) |
| G12 📑 Slides in v1.5 | OPEN | P13 |
| **G13 🚦 Live Gate** | **CLOSED ✅** | zai mode → DONE, $0.0402, 19820/20204 tok |
| G14 🎬 shotcraft-cinematic | OPEN | P13-T5 (half-day spike) |

---

## القرارات المثبتة D1–D30

انظر `src/book-forge/config/decisions.md` — المرجع الموحد لكل القرارات.

### فهرس القرارات (محدَّث بعد P8 الإنهائية)

- **D1**: zai mode = الإنتاج (G13 closure)
- **D2**: temperatures 0.2 / 0.7
- **D3**: context limits 24K/8K
- **D9/D11/D12**: BM25/Prisma+SQLite/pandoc+WeasyPrint
- **D14**: chapter floor 3 (D14 relaxed for live test, recommended default 10)
- **D19**: paper-search-mcp sidecar (Python، مستبعد Sci-Hub + CI gate)
- **D20**: provider tiers (5 tiers + 7 providers)
- **D20.1**: flaky تشغيلياً (retry ×2/5s → providerGaps)
- **D21**: simplification layer (Twins + Spine + Fidelity — P15)
- **D22**: Evidence model (Prisma، not Json)
- **D22.1**: retraction detection (3 طرق، title-pattern الأنجع)
- **D23**: server-side agents
- **D25**: P8-T6 mock-PASS
- **D26**: type-clean policy (DEBT CLEANED — 0 errors، كامل النظافة الآن)
- **D27**: P8-T6 LIVE closure (مُغلقة رسمياً)
- **D28**: G7 STORM — DROP (نطاق مضبوط: كمولّد أسئلة فوق اتحاد معجمي)
- **D29**: contested-topic verification (0 contested surfaced on pyramids — measured not failed)
- **D29-closure**: G8 Valsci — DEFER v2 (~38h >> 1 day)
- **D30**: contested-claims detection roadmap (Layer 1 current + Layer 2 P9-T2 n-gram + Layer 3 embeddings)

---

## المشاكل الحية (Layer 24 Registry)

انظر `download/LIVE-ISSUES-LAYER24.md` — 15 مشكلة حية مرقّمة (#1–#15)، كل واحدة مُصلَّحة ومُوثَّقة. آخرها: #14 (STORM torch install timeout — environmentally-qualified) + #15 (GLM Arabic question mark).

---

## مبدأ الحقيقة على القرص

> "كل حقيقة على القرص لا في الذاكرة"

- الكود في `mayakilzy/BookForge` — مصدر الحقيقة للتنفيذ
- التقارير في `mayakilzy/repo-info/BookForge/` — مصدر الحقيقة للقرارات والقياسات
- الخطة في `ROUND-B-FINAL-SPEC.md` + `ROUND-B-AMENDMENT.md`
- الدستور في هذا الملف (`GOVERNANCE-CONSTITUTION.md`)

---

## §0-إضافة — Amendment دستوري #1 (من مصادقات الشريك — قواعد مدفوعة الثمن)

> هذه القواعد الخمس أرَّسها الشريك في مصادقاته المتأخرة. كل واحدة وراءها حادثة فعلية. غير قابلة للتخطي.

### 1. قاعدة الإغلاق
mock-PASS يفتح المهمة التالية ولا يغلق الحالية — الإغلاق يتطلب **live-run موثقاً** متى وُجد مزوّد حي واحد على الأقل.
*(الدرس: T2 أُعلن PASS على mock قبل أن يُقاس حياً — أُصلح بـ T2-live gate)*

### 2. سلطة المعرّف
DOI مختلفة = أعمال مختلفة. title-fuzzy يُطبَّق **فقط** على الأعمال التي افتقرت لـ DOI و arXiv-id.
*(الدرس: أوراق حقيقية كادت تُحذف بصمت لأن v1/v2/v3 عناوين متشابهة)*

### 3. الأسرار
لا سر في مستودع أو قناة عامة أبداً — **device flow** أو **fine-grained PAT محدود النطاق** فقط. Secret Scanning يبطل أي PAT علني.
*(الدرس: توكن مات بالميلاد — رُفع للمستودع العام فكشفه GitHub وأبطله فوراً)*

### 4. D20.1 — flaky تشغيلياً
retry ×2/5s · فشله → `providerGaps` لا خطأ · مستبعد من عدّادات القبول · tier بيئي-مؤهل يُعاد قياسه على خادم الإنتاج.
*(الدرس: arXiv+OpenAlex رجعا 503/429 في sandbox — لا يعني أنهما معطوبان في الإنتاج)*

### 5. القفل يُختبَر
أي حماية آلية تُثبَت أولاً **بقفل زائف عمداً** قبل الاعتماد عليها.
*(الدرس: `rg -E` كان يُفسَّر كـ `--encoding` لا regex — CI gate كان يجتاز زوراً. المشكلة الحية #11)*

---

## فهرس القرارات

- **D1–D24** الأصلية: `ROUND-B-FINAL-SPEC.md §10` + `decisions.md` (البوابات المغلقة)
- **D20.1** (flaky تشغيلياً): أعلاه §0-إضافة قاعدة 4
- **D22.1** (كشف التراجع الافتراضي): `decisions.md` — 3 طرق بترتيب الموثوقية + Works بلا DOI = unknown
- إن نقص أي D من `decisions.md` أضف سطره المؤشر إلى موضعه.
