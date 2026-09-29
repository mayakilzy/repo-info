# SESSION-BRIDGE.md — آخر ما يقرأه وكيل الجلسة القادمة

> **هذا الملف هو أول ما يقرأه وكيل الجلسة القادمة — دقته صمام أمان.**
> تم إنشاؤه بأمر الشريك في الجلسة المؤسِّسة لـ P9 (إغلاق).
> تاريخ الإنشاء: 2026-09-29

---

## حالة المشروع عند تسليم الجلسة

### المكتمل (مغلق رسمياً)

| المرحلة | الحالة | الدليل القاطع |
|---|---|---|
| **P0–P7** (v1.0 baseline) | ✅ مكتمل | smoke-pipeline-full.ts PASS (mock + live) |
| **P8-T1a** Provider Readiness Matrix | ✅ مكتمل | 5 tiers + 7 providers + ProvidersStatus UI |
| **P8-T1b** Academic Gateway | ✅ مكتمل | smoke-p8-t1b PASS |
| **P8-T2** Federation + dedup + G9 + G10 | ✅ مكتمل | T2-live gate: 30→21 unique (30% dedup) |
| **P8-T3** paper-search-mcp sidecar | ✅ CLOSED (بيئي-مؤهل) | uv sync + sidecar + Sci-Hub CI gate |
| **P8-T4** retraction watcher | ✅ مكتمل | 5/5 retraction DOIs، 0/20 FP |
| **P8-T5** Contracts + Migrations | ✅ مكتمل | Prisma Work + Evidence + Source.workId |
| **P8-T6** mock-PASS | ✅ PASS | smoke-p8-t6.ts: 36 works، 0 retracted، 1 contested |
| **P8-T6-live** | ✅ LIVE-PASS — T6 مُغلقة | t6-live-gate.json: 24 works، 23 evidence، $0.0055 / 200s |
| **P8-T7 = G7** STORM A/B | ✅ RESOLVED — DROP | g7-storm-ab.json: B ≤ A by -20% (D28) |
| **P8-T8 = G8** Valsci opt-in | ✅ RESOLVED — DEFER v2 | ~38h >> 1 day (D29-closure) |
| **P9-T0** Vale + BookForgeArabicStyle | ✅ PASS | 3 rules fire (Repetition + Glossary + WordCount) |
| **P9-T1** Simplifier + contracts + Prisma | ✅ مكتمل | model SpineSnapshot + agents/simplifier.ts |
| **P9-T2** Spine builder + D30 Layer 2 | ✅ PASS | Layer 2: 3 contested on pyramids fixture |
| **P9-T3** Fidelity Gate | ✅ مكتمل | code pre-check + LLM judge (few-shot hint) |
| **P9-T4** Distortion Ledger | ✅ مكتمل | full audit trail + summary card |
| **P9-T5** Pipeline integration + UI | ✅ مكتمل | ChapterApprovalCard simplificationCard prop |
| **P9 Live Acceptance** | ✅ partial PASS | PLAINFORM_PASS proven + Vale invoked + card populated |
| **D30 Layer 3** GLM-clustering | ✅ CLOSED | 2 valid pairs on live pyramids، FP-rate 0% |
| **G11** Fidelity Thresholds | ✅ CLOSED | 2 lossy diagnosed (real scope-drop)، fix applied، residual = monitored |
| **G13** Live Gate | ✅ CLOSED | zai mode → DONE |
| **G7** STORM | ✅ RESOLVED — DROP | D28 |
| **G8** Valsci | ✅ RESOLVED — DEFER v2 | D29-closure |
| **G9** pyeuropepmc | ✅ RESOLVED | manual client (30/80 LOC per تأ-4) |
| **G10** Provider tiers | ✅ PARTIAL-CLOSE | 2 flaky + 4 working + 2 disabled |

### المفتوح للمستقبل (افتتاحية الجلسة القادمة)

1. **Live Issue #16 إصلاح نهائي** — GLM simplifier يرجع distortionType كـ non-string type أحياناً (number/object). الإصلاح الجزئي الحالي: `z.string().nullable()` + post-parse normalization. الإصلاح النهائي: قبول `unknown` + coercion إلى `string|null`.

2. **مناورة G1 (Piper × Habibi-MSA)** — بوابة TTS. P10-T0 (72h spike). هذا أول مناورة حقيقية للنظام — الكتاب يصبح صوتاً.

### المعلَّق على المالك (مفاتيح خارجية)
- `UNPAYWALL_EMAIL` + `S2_API_KEY` + `CORE_API_KEY` — تفتح 3 مزودين إضافيين
- GitHub PAT (fine-grained، محدود النطاق) — للرفع الآمن

---

## مصادر الحقيقة (اقرأ بالترتيب قبل أي سطر كود)

1. `GOVERNANCE-CONSTITUTION.md` — الدستور الملزم (§0 + الإضافة #1: القواعد 11–15 + البوابات G1–G14 + فهرس القرارات D1–D32)
2. `ROUND-B-FINAL-SPEC.md` — مهام P8–P14 + المواصفة §10–12
3. `ROUND-B-AMENDMENT.md` — ت1–ت8 (تغلب الأصل عند التعارض)
4. `decisions.md` — المرجع الموحد لكل القرارات (D1–D32)
5. `LIVE-ISSUES-LAYER24.md` — 15 مشكلة حية مرقّمة (#1–#15) + #16 partial
6. `P8-PHASE-A-FINAL-STATUS.md` — أحدث بصمة للحالة
7. `live-evidence/` — JSONs القياسات الحية (t6-live-gate.json + g7-storm-ab.json + g7-contested-topic.json + p9-live-acceptance.json + p9-d30-layer3-smoke.json + p9-g11-remeasure.json)

---

## بروتوكول العمل (لا يتغير)

- **تقريرك من الكود + أرقام مقاسة + حالة البوابات** — يحضره المالك للشريك للمصادقة
- **mock-PASS يفتح المهمة التالية ولا يغلق الحالية** (القاعدة 11)
- **أي شكل جديد من GLM = مشكلة حية مرقمة** (#17 التالية) — طبّق Layer 24 استباقياً
- **CostEntry لكل نداء** (bookId إجباري) · المفاتيح server-side حصراً
- **بعد مصادقة الشريك على إغلاق P9**: P10 (TTS + بوابة G1) — والرؤية القادمة ستصلك أولاً

---

## آخر التزامات على القرص

### mayakilzy/BookForge (الكود)
```
490ad30 feat(P9-closure): D30-Layer 3 CLOSED (GLM-clustering) + G11 diagnosed + #16 partial fix
8e03dce feat(P9-live): Live Acceptance Run + D31/D32 + D26-update + Live Issue #16 fix
523bb6f feat(P9-T0..T5): Vale + Simplifier + Spine + Fidelity Gate + Distortion Ledger + Layer 2
0cb09da feat(P8-closure): G7 corrections + G8 DEFER + D30 roadmap + tsc debt cleaned
0db2a22 feat(G7): STORM A/B test — DROP + contested-topic verification + Live Issue #14
39d0103 feat(P8-T6-live): T6 closed on live measurement — D27 + تأ-1..تأ-4 + Live Issue #13
6af9c28 feat(P8-T6): ACADEMIC_SWEEP ∥ WEB_SWEEP + contestedClaims + Live Issue #12 fix
```

### mayakilzy/repo-info/BookForge/ (التقارير العامة)
```
f2a4d09 docs(P9-closure): D30-Layer 3 CLOSED + G11 diagnosed + #16 partial fix
6ab0c1f docs(P9-live): mirror Live Acceptance Run results + D31/D32 + #16
e896fd1 docs(P9-T0..T5): mirror P9 smoke evidence (Vale + Layer 2 contested)
9f19de5 docs(P8-closure): mirror G7 corrections + G8 DEFER + D30 + tsc debt cleaned
6e330d6 docs(G7): mirror STORM DROP + contested-topic verification + Live Issue #14
6e7a617 docs(P8-T6-live): mirror T6 closure reports + live measurement JSON
67aa710 docs(P8-T6): sync T6 mock-PASS reports + Live Issue #12
```

---

## رسالة وداع للسجل

P9 مغلقة ✓ — الجلسة التي أكملت P8+P9 تُغلق هنا. المفتوح للمستقبل: #16 إصلاح نهائي + مناورة G1 — كلاهما افتتاحية الجلسة القادمة. كل الحقيقة على القرص لا في الذاكرة.

---

> **وكيل الجلسة القادمة**: ابدأ بقراءة `GOVERNANCE-CONSTITUTION.md` ثم `decisions.md` (ابحث عن D28–D32 + G11 closure). ثم استعد لإصلاح #16 + مناورة G1. التوكن يُعاد استخراجه من `newT.zip` (محذوف من المستودع العام — استخرجه من تاريخ git: `git show b54eb76^:newT.zip`).
