# 📋 P8 — المرحلة-أ (Academic Lane الأساسية) — التقرير النهائي للحالة

**التاريخ:** 2026-09-29 (محدَّث بعد P8-T6 live-PASS)
**آخر التزام شجرة ما قبل T6:** `90ab74e` على `mayakilzy/BookForge`
**آخر التزام T6 mock-PASS:** `6af9c28` (commit قبل هذا التقرير)
**الالتزام الحالي:** T6-live (هذا الالتزام) — يُغلق T6 رسمياً بعد قياس حي

---

## قائمة القبول — P8 مرحلة-أ (T1a..T6-live + البوابات)

| المهمة | الحالة | الدليل |
|---|---|---|
| **P8-T1a** Provider Readiness Matrix | ✅ **مكتمل** — Matrix بنيوي نهائي (D20 بنيوياً) | 5 tiers (open/polite/optional_key/required_key/**flaky**) + 8 مزودين + ProvidersStatus UI |
| **P8-T1b** Academic Gateway | ✅ **مكتمل (mock)** — stubان موثقان (dedup بالعنوان فقط + download نص وهمي) مُستكملان في T2 | `lib/research/gateway.ts` + smoke-p8-t1b PASS (36 works / 6 فصول) |
| **P8-T2** Federation + dedup + G9 + G10 | ✅ **مكتمل** — T2-live gate CLOSED بالأرقام | 30 raw → 21 unique (30% dedup rate)، 3/4 مزودين أحياء، G9 RESOLVED (manual client)، G10 PARTIAL-CLOSE (arxiv+openalex → flaky بقياس 0/3) |
| **P8-T3** paper-search-mcp sidecar | ✅ **CLOSED (بيئي-مؤهل per D20.1)** — MCP handshake عبر SDK مؤجل لخادم الإنتاج (موثق) | uv sync نجح + sidecar يعمل (uvicorn on 8765) + Sci-Hub CI gate PASSED (bug مُصلَّح: rg -E→-e) + McpKit request جاهز |
| **P8-T4** Retraction watcher | ✅ **مكتمل** — 5/5 DOIs متراجعة مُكتشفة، 0/20 false-positives | `lib/research/retraction-watcher.ts` + smoke-p8-t4 PASS |
| **P8-T5** Contracts + Migrations | ✅ **مكتمل** — `model Work` + `model Evidence` + `Source.workId` (Prisma، ليس Json) | `contracts/research.ts` + `prisma/schema.prisma` + `db:push` نجح |
| **P8-T6** Academic Lane في pipeline (mock-PASS) | ✅ **mock-PASS** — فتح live-gate | `smoke-p8-t6.ts` PASS (36 works / 6 فصول، 0 retracted، 1 contested) |
| **P8-T6-live** Academic Lane على خط حي | ✅ **LIVE-PASS — T6 مُغلقة رسمياً** | `scripts/t6-live-gate.json`: 3 فصول × ≥3 works/fصل من 3 مزودين أحياء (crossref/pubmed/europepmc) + 23 evidence مستخرجة بـ GLM (zai mode) + 0 retracted حقيقية + 0 contested (مُقاس لا مفترى) + FreshnessReport بتواريخ حقيقية + $0.0055 / 200s |

### البوابات

| البوابة | الحالة |
|---|---|
| G9 (pyeuropepmc vs manual) | ✅ RESOLVED — manual client (30 LOC) بقياس |
| G10 (Provider tiers) | ✅ PARTIAL-CLOSE — 2 flaky موثقين بقياس 0/3، 4 working، 2 disabled بـ degradation rule |
| G13 (Live Gate) | ✅ CLOSED — zai mode → DONE ($0.0402، 19820/20204 tok، PDF Arabic verified: 774 chars / 0 tofu) |
| G7 (STORM A/B) | OPEN — قابل للتنفيذ (P8-T7) |
| G8 (Valsci opt-in) | OPEN — قابل للتنفيذ (P8-T8) |

### مشاكل حية مكتشفة في هذه الجلسة

| # | المشكلة | الحالة |
|---|---|---|
| 10 | GLM يرجع `{chapters:[...]}` مباشرة (شكل ثالث) | ✅ مُصلَّح (normalizeOutlineShape موسَّع) |
| 11 | CI gate كان يجتاز زوراً (rg -E → --encoding) | ✅ مُصلَّح (rg -e + تنظيف شامل) — درس حاكمي: القفل يُختبَر بقفلٍ زائف قبل الاعتماد عليه |
| 12 | commit `1f3092d` ادَّعى استعادة `books/route.ts` لكن `git show --stat` يُظهر `| 0` bytes (ملف لم يُلتزم فعلياً) | ✅ مُصلَّح في T6 onboarding (إعادة كتابة الملفين بكامل محتواهما + إصلاح .gitignore bare `books/` → `/books/`) — درس حاكمي: التزام يدَّعي إضافة/استعادة يجب التحقق منه بـ `git show --stat <commit> -- <path>` |
| 13 | GLM في استخراج Evidence يرجع حقولاً مفقودة (claim/excerpt undefined، evidenceType/confidence ناقصة) — رابع شكل مختلف | ✅ مُصلَّح (Layer 24 rule #9: few-shot schema hint في الـ system prompt — مثل مراجعة الفصل في P8-PRE-T3) |

---

## الفحص النهائي

| الفحص | النتيجة |
|---|---|
| `git status` نظيف | ✅ (فقط ملفات محدّثة موثقة) |
| `smoke-pipeline-full.ts` من الشجرة الملتزمة | ✅ PASS (6 فصول، EPUB 14KB + PDF 53KB + DOCX 12KB، DONE) |
| `smoke-p8-t6.ts` (T6 mock acceptance) | ✅ PASS (36 works، 0 retracted stored، 1 contestedClaim injected + visible) |
| `scripts/t6-live-gate.ts` (T6-live acceptance) | ✅ **PASS** (3 فصول، 24 works حقيقية من 3 مزودين، 23 evidence، 0 retracted حقيقية، 0 contested مُقاس، $0.0055 / 200s) |
| `scihub-ci-gate.sh` آخر تشغيل | ✅ PASSED (0 matches عبر 4 مجلدات) |
| `tsc --noEmit` (أخطاء T6/T6-live الجديدة) | ✅ 0 أخطاء جديدة (62 قبل ← 61 بعد T6 — أصلح خطأً سابقاً بإضافة `contestedClaims: []`) |
| `.gitignore audit` (تأ-2) | ✅ مُدقَّق: 18 hit نظري، 0 ضرر فعلي — قرار الشريك معلَّق بين re-anchor vs rule-based mitigation |

---

## المستودعان

### mayakilzy/BookForge (الكود)
```
ea52b86 feat(P8-T3+T4): sidecar cleanup + retraction watcher + Python gate results
2501625 feat(P8-T3): paper-search-mcp sidecar client + Sci-Hub CI gate + McpKit request
a1d88d4 feat(P8-T2): federation dedup + real download + G9 decision + G10 closure
a4e5b07 feat(P8-T1b): academic research gateway + smoke test PASS
e56bd5a feat(P8-T1a/T5): Provider Readiness Matrix + G10 RESOLVED + D20 final
c748fea feat: G13 CLOSED — DONE achieved on real GLM via zai mode
```

### mayakilzy/repo-info/BookForge/ (التقارير العامة)
كل ملف HTTP 200:
- ACCEPTANCE-REPORT.md (37,378 بايت)
- LIVE-RUN-REPORT.md (7,838 بايت)
- live-run-report.json (1,269 بايت)
- ROUND-B-FINAL-SPEC.md (21,957 بايت)
- ROUND-B-AMENDMENT.md (11,571 بايت)
- G13-CLOSURE-STATUS.md (4,761 بايت)
- LIVE-ISSUES-LAYER24.md (محدّث بـ issue #11)
- t2-live-gate.json (1,410 بايت)
- MCPKIT-CAPABILITY-REQUEST.md (محدّث)
- decisions.md (محدّث بـ D22.1)
- GOVERNANCE-CONSTITUTION.md (جديد)
- **P8-PHASE-A-FINAL-STATUS.md** (هذا الملف)

---

## ما لا يُلمس (يفتح في الجلسة الجديدة)

- ~~**P8-T6**: ACADEMIC_SWEEP ∥ WEB_SWEEP + contestedClaims في ChapterSpec~~ — ✅ **mock-PASS + LIVE-PASS في هذه الجلسة**. T6 مُغلقة رسمياً (per Rule 11: PASS على قياس حي كامل، لا جزئي).
- **P8-T7 = G7**: STORM A/B مقيس — **قابل للتنفيذ الآن** بأمر الشريك (per تأ-3: G7/G8 بعد T6-live)
- **P8-T8 = G8**: Valsci opt-in — قابل للتنفيذ بعد G7

تُفتح بأمرها الافتتاحي في الجلسة الجديدة.

---

## رسالة وداع للسجل (محدَّثة بعد T6-live)

أُغلقت الجلسة المُؤسِّسة: v1.0 كاملة + G13 مغلقة + P8 مرحلة-أ (الأكاديمية الأساسية) مكتملة ومرفوعة، **بما فيها P8-T6 mock+live** — كل الحقيقة على القرص لا في الذاكرة.

القياسات الحية النهائية لـ T6 (`scripts/t6-live-gate.json`):
- 3 فصول × ≥3 works/fصل من 3 مزودين أحياء (crossref/pubmed/europepmc)
- 23 evidence مُستخرجة بـ GLM (zai mode، 9 نداءات، 4074 in / 2334 out tokens، $0.0055)
- 0 retracted حقيقية (24 DOIs تم فحصها عبر Crossref relation field)
- 0 contested claims (مُقاس، لا مفترى — معظم الأدلة stance=supports/qualifies)
- FreshnessReport لكل فصل بتواريخ حقيقية: 12mo (5-5-3)، 36mo (1-1-1)، historical (3-3-2)
- زمن التنفيذ: 200 ثانية (تقريباً 3.3 دقائق)

المشاكل الحية المكتشفة في الجلسة (4 جديدة، كلها مُصلَّحة):
- #12: .gitignore bare `books/` صمتاً أسقط API routes (T6 onboarding fix)
- #13: GLM استخراج Evidence رجع حقولاً مفقودة (Layer 24 rule #9 fix: few-shot hint)
