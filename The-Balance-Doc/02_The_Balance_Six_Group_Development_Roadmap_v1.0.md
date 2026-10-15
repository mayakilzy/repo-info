# The Balance — Six-Group Development Roadmap v1.0

**التاريخ:** 2026-10-16 · **الحالة:** خطة مجموعات معتمدة الاتجاه، المهام التفصيلية للمرحلة 00 فقط.  
**المرجع:** `01_The_Balance_Master_Blueprint_v2.0.md` و`REFERENCE/Balance_Reconciliation_Matrix_v0.3.md`.

## 1. فلسفة التنفيذ

**Progressive Mission Authoring with Global Architecture Contracts:** نحدد نطاق وتبعيات وقبول GROUP 00–05 منذ البداية، ونكتب المهام البرمجية التفصيلية للمجموعة **التالية فقط** بعد إغلاق السابقة بتقرير دليل. لا تُنشأ مهام 01–05 الآن، ولا تُنشأ مراحل 06–09 ما لم تستدعها نتائج 05. لا يُرحل عيب معروف من مجموعة مكتملة إلى «احتياط» دون تبرير وموافقة.

أي مرحلة لا تنتهي بـ`PASS` لمجرد مرور الاختبارات؛ يلزم تشغيل حالة استخدامها End-to-End، والإبلاغ الصريح عن المحاكاة ومزودي البيانات غير المدمجين، ومراجعة أمان صلاحيات المستخدم، وتثبيت SHA ودليل إعادة التنفيذ.

## 2. المخطط

```text
00 FOUNDATION: contracts + secure API + evidence + country + versioned task runtime
   │
   ├─01 STATE BUILDER: national strategy + portfolio + programs + human approval
   │     │
   ├────02 STATE OBSERVATORY: measurement + contradictions + variance + independent judgment
   │          │
   ├─────────03 TARGETED REFORM: domain experts + cross-sector alternatives + change proposals
   │               │
   ├──────────────04 STRATEGIC CONTINUITY: longitudinal memory + handover + change-impact
   │                    │
   └───────────────────05 INTEGRATION: seven-year simulation + security/science/ops acceptance
                            │
                     [06 / 07 / 08 / 09] OPTIONAL
                            │
                           V1.0
```

**تنبيه:** اعتماد الأجزاء مشروط بتتبع العقود أعلاه، لا نعتبر جميع الخطوط مستودعات منفصلة. ترتيبات التنفيذ التفصيلية مرنة وفق النتائج.

## 3. GROUP 00 — Foundation

### هدف العمل
تأسيس منصة صغيرة عاملة وآمنة من أول طلب API إلى قاعدة البيانات والمصدر وسجل الأحداث. لا يُطلب بناء Builder أو Observatory كاملين الآن، بل إثبات عقد البيانات وإمكان الاستمرار.

### نطاق المجموعة
- اكتشاف المستودع والحالة الفعلية وقرارات التقنية قبل التعديل.
- بنية مشروع بسيطة واحدة مع frontend shell وbackend API وDB + migrations، تشغيل محلي موثق.
- Government Tenant / Country Pack versioned، بلد اصطناعي + سوريا كإعداد غير محمّل بادعاءات حقيقية.
- User/Role/Policy/Auth + فصل بيانات المستأجر، trace/audit؛ لا نشر أسرار.
- Evidence & Source Registry + ادعاءات ومصادر وتواريخ وعدم يقين وبيانات مضادة.
- Contracts/validations: Strategy, Program, Indicator, Observation, Decision, Recommendation, Approval, Task, ExpertCapability, Handover.
- Task Orchestrator (persistent, resumable) + Capability Registry مع Expert adapter حقيقي بسيط أو deterministic reference (موسوم)؛ Swarm Engine audit read-only.
- API جاهز للربط، cross-contract smoke flow: إدخال دليل → استراتيجية مسودة → حدث تنفيذ → ملاحظة → توصية مسودة → إصدار/تسليم، دون الادعاء بأن المحركات قد بنيت.
- CI واختبارات الأمان والنسخ والاستعادة وملف handoff.

### مخرجات التسليم
شيفرة عملية قابلة للتركيب؛ مخطط API واستجابة موثقة؛ Migration؛ Contract fixtures؛ tests؛ screenshots/requests إن أمكن؛ Security Report؛ تقرير قبول ورمز commit؛ وثيقة استعداد المجموعة 01.

### قبول 00
Fresh setup works؛ AuthZ negative tests؛ tenant isolation؛ state/event persistence؛ evidence provenance؛ versioned strategy contract؛ workflow resume/idempotency؛ API smoke E2E؛ لا أسرار في git؛ لا ادعاءات تنفيذ فعلية ضمن mocks.

### حدود 00
لا ندعي نمذجة الدولة الحقيقية بالكامل، ولا نستورد آلياً آلاف الكتب، ولا نقدم «خطة سورية معتمدة»، ولا نبني أربع قواعد بيانات منفصلة، ولا نوصل نظم الدولة الحقيقية.

## 4. GROUP 01 — State Builder

**القيمة:** دولة ذات خط أساس وأهداف تستطيع الحصول على مسودات استراتيجية متعددة القطاعات قابلة للمراجعة والاعتماد.  
**المدخلات:** Country Pack, Evidence Cases, Indicators, Constraints, Human Goals.  
**المكونات:** State Baseline, Gap Analysis, National Strategy Composer, Institutional Design, Portfolio & Dependency Graph, Budget/Financing Estimates, Implementation Roadmap, Scenario Comparisons, Development Advisor v1, Human Approval.  
**القبول:** T1 مستقل: ملف بلد اصطناعي أو مصادر حالة موثقة → اقتراح بدائل متعددة → تبعيات وتكاليف مشروطة وملفات عدم يقين → موافقة مستخدم مخول تنشئ Strategy Version نشطة مع audit. عدم الاعتماد يتركها مسودة. لا تتسلل توصية AI إلى وضع Approved.  
**غير داخلها:** نموذج توقعات اقتصادي شامل غير متحقق أو تطبيق قطاعي كامل لكل وزارة.

## 5. GROUP 02 — State Observatory

**القيمة:** لوحة رصد مستقل تعرض الوضع، الاتجاه، الانحراف عن الأهداف، وتفسيرات الأدلة المضادة.  
**المكونات:** Data Ingestion validated; Indicator Registry + Measurements; Evidence Contradiction/Independence; Ministry/Service Views; Temporal & Attribution Labels; Early Warnings (with calibration); Public/Research/Gov permissioned views.  
**القبول:** T2: تُدخل بيانات تحقق وتحسن/تدهور مع حالة متناقضة، فتُنتج مقارنة شفافة بالخطة دون تغيير إصداراتها، مع عرض أدلة مضادة و`unknown` عند نقص البيانات. يمتنع النظام عن تفسير ارتباط سببي كحقيقة.  
**الاعتماد:** 00+01 Contracts؛ test fixture canonical.

## 6. GROUP 03 — Targeted Reform

**القيمة:** الحكومة تطلب إصلاحاً محدداً؛ يجمع Master الخبراء ويعرض خيارات تنفيذ مدعمة وتبعياتها.  
**المكونات:** Problem Scoping; Specialist Registry/Selection; Expert Task Protocol; Cross-sector reasoning; Reform Alternatives; Cost/Risk/Readiness; Independent Challenge; Strategy Change Request; Advisor v2.  
**القبول:** T3: أزمة مياه لبلدية → أهلية خبراء المياه والمالية والطاقة والقانون حسب الحاجة → بدائل مع حدود الثقة → موافقة بشرية على رفع طلب تعديل → حفظ رابط القرار بالخطة بدون تعديل صامت.  
**المخاطر:** تزييف إجماع خبراء LLM، مزاعم ROI بلا سند، ونفقات لا يستطيع النظام إقرارها.

## 7. GROUP 04 — Strategic Continuity

**القيمة:** تتغير الحكومة لكن الذاكرة الوطنية تبقى: سجل قرار كامل وتقييم آثار البدائل.  
**المكونات:** Strategy Lifecycle/Amendment; Institution and Government Transition; Versioned Knowledge Retention; Policy Change Impact; Handover Dossier; Historical Replay; Learning Capture; Advisor v3.  
**القبول:** T4: بعد سبع سنوات افتراضية من البيانات الاصطناعية، تستلم جهة مخولة حزمة تسليم تتضمن الافتراضات والأدلة والتكاليف والتزامات المشاريع، ويمكنها اقتراح تعديل أو إلغاء بإصدار جديد بينما يبقى القديم قابلاً للفحص، بلا إفشاء بيانات مستأجر آخر.  
**الحاجز:** continuity لا تصبح آلية لتعطيل سيادة الحكومة الجديدة.

## 8. GROUP 05 — Integration & Validation

**القيمة:** نظام واحد قابل للاستخدام التجريبي الحكومي المقيد مع علم وحقوق وأمان وتشغيل مناسب.  
**المكونات:** end-to-end orchestration; integration regression; seven-year simulation; external adapter authenticity review; scientific red-team; security threat review; performance/load; observability; documentation; deployment drill; backup restore; accessibility/i18n; migration and rollback.  
**القبول:** جميع T1–T7, cross-tenant isolation، failure/restart، provenance replay، live-vs-simulated inventory، مصادر مرخصة، توثيق عدم اليقين وامتناع النظام. تدقيق صلاحيات وشفافية النسخة.  
**التقرير:** PASS / PARTIAL / FAIL مع evidence. إن PASS يبدأ release review إلى V1.0؛ وإن بقايا مؤثرة، يُفعّل 06 وما يلي فقط بقرار مسبب.

## 9. 06–09 — احتياطي عند الحاجة

أرقام اختيارية ليست تسلسلاً إلزامياً ولا نطاقاً معداً سلفاً. إذا ظهرت فجوة علمية أو أمنية أو تشغيلية بعد 05، تخصص مهمة تصحيحية واحدة أو أكثر، مع Owner/Scope/Evidence/Regression ثم Re-acceptance. لا يُفتح 07 قبل إغلاق 06 إذا فتح، ولا نستهلك جميع المراحل طلباً للترقيم.

## 10. V1.0 — Release Decision

يُتخذ فقط بعد evidence-backed acceptance، مراجعة المخاطر المتبقية، تأمين المفاتيح وبيئات الإنتاج، إصدار وثائق تشغيل وسجل تغيير وحزمة استعادة، تحديد صريح لنطاق الاستخدام الرسمي التجريبي. **ليس إثباتاً لنجاح تنمية وطنية خلال سبع سنوات.**

## 11. خرائط التسلسل وعقود handoff

| المنتِج | المستهلك | العقد الأدنى | ما لا يحدث تلقائياً |
|---|---|---|---|
| Foundation | All | Country, Evidence, Indicator, Event, Task, Identity, Audit | لا إثبات علمي بلا مصدر |
| Builder | Observatory | StrategyVersion, Program, Objective, KPI, Baseline | لا يصير الرصد مدافعاً عن التصميم |
| Observatory | Reform | Observation, Variance, EvidenceCase, Alert | لا يقر برنامجاً جديداً |
| Reform | Builder | Alternatives, DependencyImpact, ChangeRequest | لا يعدل الخطة تلقائياً |
| All | Continuity | ChangeEvent, DecisionReason, Approval, Outcome, Trace | لا يحذف التاريخ أو يفرض الاستمرار |
| Master | Expert | typed TaskRequest/Result, scopes, source refs, version | لا تفويض سيادي للـagent |

## 12. نموذج تقارير المهمة الفرعية

```text
MISSION_ID = ...
TARGET_GROUP = ...
BASE_COMMIT = ...
FINAL_COMMIT = ...
WORKTREE = clean / justified
DELIVERED = paths and capabilities
TEST_COMMANDS = exact commands + outputs
LIVE_EVIDENCE = real / mocked / not tested (never conflate)
SECURITY_CHECKS = authz, tenant isolation, secrets, unsafe inputs
CONTRACT_CHANGES = backward compatible? migrations?
OPEN_DEFECTS = ID/severity/reproduction
DECISION_REQUESTS = any scope/contract change
ACCEPTANCE = PASS / PARTIAL / FAIL (evidence references)
NEXT_STEP = specific mission or group gate
```

الحارس الأساسي: **لا يمكن أن يختزل التقرير إلى «كل شيء ناجح» دون traces وتسجيل الاختبارات الفعلية والفرق بين المحاكاة والإنتاج**.

## 13. مخطط ملكية المتطلبات (Coverage Matrix)

| عائلة المتطلبات | المجموعة الأساسية | المجموعات التابعة |
|---|---|---|
| Scientific Evidence & Sources | 00 | 02, 05 |
| Global Country Model | 00 | 01, 02, 03, 04 |
| Security / Tenant / Governance | 00 | all + 05 audit |
| Task runtime / Expert registry | 00 | 03, 05 |
| National Strategy & Sector Plans | 01 | 02, 03, 04 |
| Policy simulation and advisor | 01 | 03, 04, 05 |
| Monitoring / Indicator / CounterEvidence | 02 | 03, 04, 05 |
| Targeted Reform / Expert Federation | 03 | 04, 05 |
| Long-term continuity and transition | 04 | 05 |
| Government user interface | 00 shell | 01–05 richer UX |
| Scientific validation / real-world honesty | each | 05 consolidated |
| Deployment & Release | 00 dev | 05 acceptance + V1.0 |

## 14. أخطاء يجب تجنبها

- إنشاء 6 codebases لا تشترك في عقود مستقرة.
- توليد كل مهمات 01–05 قبل تحقق 00.
- تحويل مثال زراعي اصطناعي إلى بيانات حقيقية لسوريا.
- تبديل الصلاحيات الحكومية بمفاتيح يملكها خادم الـLLM.
- الانتظار حتى المجموعة 04 لإضافة IDs/version history.
- اعتبار اختبار mock للـA2A دليلاً على نجاح integration واقعي.
- الادعاء بأن 05 تثبت الأثر الاقتصادي الحقيقي بدلاً من الاختبار الهندسي والعلمي.

**نهاية خارطة المجموعات.**
