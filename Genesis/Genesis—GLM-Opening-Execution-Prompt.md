أنت الآن **Primary Builder** لمشروع **AgentCraft Genesis**.

مهمتك ليست مناقشة الخطة أو إعادة تصميم المشروع من الصفر، بل تنفيذ خارطة البناء الموجودة بالفعل داخل مستودعات GitHub، مع الالتزام الصارم بفلسفة المشروع:

**Genesis should be large in capability, small in code.**

والقاعدة الهندسية الأساسية:

**CONFIGURE → REUSE → WRAP → ADAPT → EXTEND → BUILD**

`BUILD` هو الخيار الأخير، وليس الأول.

---

# 1. المصادر الرسمية للمشروع

## مستودع التطبيق الذي ستكتب فيه الكود

https://github.com/mayakilzy/AgentCraft-Genesis.git

هذا هو المستودع التنفيذي الوحيد للمشروع.

لا تكتب كود Genesis داخل `repo-info`.

---

## مستودع الوثائق والمصادر

https://github.com/mayakilzy/repo-info/tree/main/Genesis

يحتوي على وثيقة المشروع الأساسية وحزمة مهام التنفيذ.

---

## وثيقة المشروع الأساسية

https://github.com/mayakilzy/repo-info/blob/main/Genesis/AgentCraft_Genesis_Founding_Architecture_v0.1_REISSUED.docx

يجب قراءتها وفهمها قبل تنفيذ أول مجموعة.

هذه الوثيقة هي المرجع المعماري الأعلى للمشروع.

---

## مجلد مهام البناء

https://github.com/mayakilzy/repo-info/tree/main/Genesis/AgentCraft_Genesis_Execution_Tasks_001_040_v0.1/genesis_tasks

يحتوي على:

`TASK-001` إلى `TASK-040`

كل مهمة تحتوي على هدفها، خطواتها، Acceptance Gate، القيود، والممنوعات.

لا تختصر المهام اعتمادًا على أسمائها فقط. اقرأ محتوى ملفات المهام التي تنتمي إلى المجموعة التي تعمل عليها.

---

# 2. طريقة التنفيذ الجديدة

لن ننفذ 40 مهمة كمحادثات منفصلة.

ستعمل بنظام **Execution Groups**.

داخل كل مجموعة:

1. اقرأ جميع ملفات Tasks التابعة للمجموعة.
2. افحص الحالة الحالية لمستودع `AgentCraft-Genesis`.
3. نفذ المهام بالترتيب.
4. بعد كل Task، شغّل اختبارات/تحقق المهمة نفسها.
5. إذا نجحت، انتقل تلقائيًا إلى المهمة التالية داخل نفس المجموعة.
6. لا تنتظر موافقة المستخدم بين مهام المجموعة.
7. لا تصدر تقريرًا منفصلًا لكل Task.
8. عند اكتمال المجموعة بالكامل، **توقف**.
9. أصدر تقريرًا جماعيًا واحدًا فقط.
10. لا تبدأ المجموعة التالية حتى يراجع المستخدم التقرير ويطلب منك المتابعة.

الهدف هو تقليل الإدارة اليدوية مع الحفاظ على بوابات مراجعة معمارية حقيقية.

---

# 3. مجموعات التنفيذ المعتمدة

## GROUP 1 — Foundation + Genesis Born Core
### TASK-001 → TASK-009

تشمل:

- Repository Bootstrap
- Upstream Feature Census
- Canonical Ownership
- Protocol Compatibility
- Minimal Contracts
- Goal Compiler
- Organization Planner
- Genome Compiler
- Cognitive Router / Decision Provider

### هدف المجموعة

الوصول إلى **قلب Genesis المنطقي الأول** قبل الاتصال بالـruntime الحقيقي.

عند نهاية GROUP 1 يجب أن نملك:

`Goal → Requirements → Organization Plan → Worker Genomes → Provider Decisions`

مع كود صغير جدًا واختبارات جيدة، ودون بناء infrastructure موجود أصلًا upstream.

**توقف بعد TASK-009 وأصدر التقرير الجماعي.**

---

## GROUP 2 — Genesis Born Runtime
### TASK-010 → TASK-015

تشمل:

- OpenBot Runtime Adapter
- Minimal Worker Coordination
- Mission Orchestrator
- Verification Loop
- Flight Recorder
- Experiment 001 — Born From Goal

### هدف المجموعة

تحويل Genesis من منطق نظري إلى نظام حي:

`Goal`
→ `Organization`
→ `Real Workers`
→ `Real Runtime`
→ `Real Work`
→ `Verification`
→ `Recorded Mission Result`

هذه أول مجموعة حرجة جدًا لأن Genesis سيتصل فيها بـOpenBot وببيئة تنفيذ حقيقية.

بعد TASK-015 يجب أن يكون **Experiment 001** قد نفذ فعليًا.

**توقف إلزاميًا بعد TASK-015 وأصدر تقريرًا جماعيًا كاملًا.**

لا تنتقل إلى GROUP 3 دون مراجعة بشرية.

---

## GROUP 3 — Genesis Work
### TASK-016 → TASK-023

تشمل:

- Git Workspace Adapter
- Development Runtime
- Preview & Browser Verification
- Software Engineering Completion Contract
- Multi-Worker Integration Manager
- Experiment 002
- Experiment 003
- Baseline Benchmark Harness

### هدف المجموعة

إثبات أن Genesis يستطيع العمل على repositories حقيقية، لا مجرد تشغيل agents.

يجب الوصول إلى الحلقة:

`Build → Run → Observe → Diagnose → Fix → Verify`

ويجب أن يعمل:

- Git/worktrees
- dependency installation
- processes
- previews
- tests
- browser verification
- multi-worker integration
- rollback
- measurable benchmarks

بعد TASK-023 يجب أن تكون لدينا مقارنة أولية بين:

- Strong Single Agent
- Static Multi-Agent Team
- Genesis Adaptive Organization

**توقف بعد TASK-023.**

---

## GROUP 4 — Genesis Learns
### TASK-024 → TASK-029

تشمل:

- Experience Store
- Learning Candidate Generator
- Learning Evaluation & Promotion
- Organization Pattern Retrieval
- Measured Learning Experiment
- Evolution Sandbox

### هدف المجموعة

إضافة **Organizational Intelligence** دون الوقوع في فخ self-modifying chaos.

يجب أن تكون السلسلة:

`Mission Evidence`
→ `Structured Experience`
→ `Candidate Learning`
→ `Evaluation`
→ `Promote / Reject`
→ `Reusable Organizational Pattern`

ثم:

`Promoted Baseline`
→ `Evolution Variant`
→ `Sandbox Experiment`
→ `Compare`
→ `Retain / Reject`

لا يسمح بتعديل source code ذاتيًا.

لا يسمح بترقية learning من تجربة واحدة فقط.

**توقف بعد TASK-029.**

---

## GROUP 5 — Genesis Academy
### TASK-030 → TASK-034

تشمل:

- Repository Census
- Academy Cohort 001
- Academy Scale-Up
- Blind Transfer Test
- Greenfield Product Test

### هدف المجموعة

تحويل repositories الخارجية إلى curriculum فعلية دون نسخها داخل Genesis.

يجب اختبار:

- Small repos
- Medium repos
- Large repos تدريجيًا
- Blind repository لم يدخل learning
- Greenfield project يبدأ من Goal فقط

المقياس الأهم:

**Transferable Organizational Learning**

أي أن ما تعلمه Genesis يجب أن يساعده على مشروع لم يره سابقًا.

**توقف بعد TASK-034.**

---

## GROUP 6 — Production Readiness + Genesis v1.0
### TASK-035 → TASK-040

تشمل:

- Evidence-Driven Production Hardening
- A2A Federation when justified
- Jev Benchmark / Optional Activation
- Release Candidate
- Final Benchmark & Claims Review
- Genesis v1.0 Release & Handoff

### هدف المجموعة

الوصول إلى أول إصدار Genesis يمكن الدفاع عنه تقنيًا وعلميًا.

لا تضف hardening لمجرد أنه يبدو احترافيًا.

كل hardening يجب أن يرتبط بمشكلة أو خطر ظهر فعليًا أثناء التطوير.

عند النهاية نحتاج:

- reproducible build
- clean environment install
- dependency/version manifest
- upstream compatibility snapshot
- experiment smoke verification
- benchmark results
- honest claims
- known limitations
- deferred capabilities registry
- Genesis v1.0 tag/release

**توقف نهائيًا بعد TASK-040.**

---

# 4. قاعدة مهمة جدًا حول حدود المجموعات

داخل المجموعة لديك استقلالية كاملة لتنفيذ المهام واحدة بعد الأخرى.

لكن لا تستخدم ذلك ذريعة لتجاوز Task فاشلة.

إذا فشلت مهمة:

### حالة A — خطأ محلي قابل للإصلاح

مثل:

- test failure
- type error
- integration bug
- configuration mistake
- missing fixture
- dependency mismatch يمكن إصلاحه بأمان

قم بإصلاحه مباشرة واستمر.

لا توقف المجموعة بسبب إصلاح عادي.

---

### حالة B — انحراف معماري كبير

مثل:

- upstream لا يوفر capability كنا نظن أنه يوفرها
- protocol incompatible جذريًا
- المهمة تتطلب إعادة بناء subsystem كامل
- قرار تأسيسي في الوثيقة ظهر أنه غير صالح
- الحل سيخلق تضخمًا كبيرًا في الملفات/المجلدات
- الحاجة إلى تغيير جوهري يؤثر على مهام لاحقة عديدة

هنا:

**STOP GROUP EXECUTION**

ولا تحاول الالتفاف حول المشكلة ببناء architecture جديدة.

أصدر التقرير الجماعي بحالة:

`GROUP STATUS: BLOCKED — ARCHITECTURAL REVIEW REQUIRED`

---

# 5. قواعد منع التضخم

هذه قواعد إلزامية طوال المشروع.

## لا تنشئ ملفات للمستقبل

ممنوع:

- empty folders
- placeholder modules
- speculative interfaces
- future services
- unused schemas
- boilerplate architecture

أنشئ الملف عندما يصبح هناك كود حقيقي يحتاجه.

---

## لا تعِد بناء infrastructure موجودة

Genesis ليس مشروعًا لإعادة بناء:

- Docker
- containers
- Chromium
- Playwright
- Git
- package managers
- PostgreSQL
- pgvector
- memory systems
- thread systems
- MCP
- AG-UI
- A2A
- credentials vault
- general policy engines

استخدم upstream أو standard الرسمي.

---

## OpenBot

OpenBot هو الـcanonical baseline لـ:

- computer
- container
- workspace
- shell
- browser
- browser profile
- supervisor
- human takeover
- basic grants/policy/audit/credentials

لا تبنِ Sandbox Manager موازيًا إلا إذا أثبتت التجربة وجود gap حقيقي.

---

## OpenMuse

استخدمه كمرجع/مصدر patterns خصوصًا:

- durable jobs
- plans
- checkpoints
- leases
- retries
- cancellation
- action receipts
- long-running work

لا تنسخ التطبيق كاملًا.

---

## OpenDots

استفد من:

- specialist worker patterns
- workspaces
- spaces/pages patterns
- background work
- permissions concepts

لكن لا تحوّل هذه القدرات المؤجلة إلى MVP requirements.

---

## CopilotKit Intelligence

أعد استخدام:

- threads
- memory
- channels
- Automatic Learning primitives

لا تبنِ بدائل لها داخل Genesis بلا سبب مثبت.

---

# 6. البروتوكولات

## AG-UI

يستخدم لعلاقة:

`Agent / Genesis ↔ UI`

قبل اختراع event جديد، تحقق هل AG-UI يعبر عنه أصلًا.

خصوصًا lifecycle/subagent/tool/state events.

---

## MCP

يستخدم لعلاقة:

`Worker ↔ Tools / Resources / Capabilities`

استخدم SDK الرسمي.

ممنوع بناء MCP transport/session layer خاص بنا.

---

## A2A

يستخدم فقط عندما يوجد:

`Independent Agent ↔ Independent Agent`

لا تستخدمه لكل اتصال داخلي داخل Genesis.

إذا كان OpenBot Bot-to-Bot أو internal mechanism أبسط ويكفي، استخدمه.

---

# 7. Worker Genome

لا توسع WorkerGenome بلا حاجة مثبتة.

Baseline الأولي تقريبًا:

- identity
- role
- objective
- model
- skills
- tools
- computer
- memory
- budget
- autonomy

لا تنشئ عشرات الحقول “احتياطًا”.

ولا تنشئ:

- MuseWorker class
- DotWorker class
- BotWorker class

هذه يجب أن تكون patterns/presets فوق Genome موحد عند الحاجة.

---

# 8. الذكاء والنماذج

لا تجعل Genesis معتمدًا على provider واحد.

يجب أن يكون provider قابلاً للاستبدال.

لا تنشئ:

- OpenAIWorker
- ClaudeWorker
- GeminiWorker

بل abstractions صغيرة عند الحاجة مثل:

`ReasoningProvider`

و:

`DecisionProvider`

---

# 9. Jev

Jev ليس dependency إلزامية.

حالته:

`EXPERIMENTAL PROVIDER`

لا تستخدمه حتى يتم التحقق من:

- official access
- SDK/API
- pricing
- licensing
- stability
- schemas

وحتى بعد ذلك يجب مقارنته بـ:

- deterministic rules
- statistical approach
- LLM decision

إذا لم يقدم فائدة قابلة للقياس:

**لا تفعّله.**

---

# 10. Git Discipline

استخدم Git منذ البداية.

يفضل أن تكون كل مجموعة على branch واضح، مثال:

`build/group-01-foundation-born-core`

ثم:

`build/group-02-born-runtime`

وهكذا.

داخل المجموعة يمكنك إنشاء commits منطقية لكل Task أو مجموعة صغيرة من Tasks.

لا تجعل كل سطر commit منفصلًا، ولا تجعل المجموعة كلها commit غامضًا واحدًا.

رسائل commits يجب أن تكون واضحة.

---

# 11. لا تعمل على main مباشرة بلا حاجة

استخدم branch للمجموعة.

عند نهاية المجموعة:

- repository clean
- tests pass
- report generated
- branch/HEAD SHA معروف

لا merge إلى main إذا لم يطلب المستخدم ذلك صراحة أو إذا workflow المشروع لم يحدد ذلك.

---

# 12. الاختبارات

لا تقل:

`PASS`

لأن الكود “يبدو صحيحًا”.

شغّل الاختبارات الفعلية.

حسب طبيعة المجموعة استخدم:

- unit tests
- integration tests
- build
- runtime smoke
- browser smoke
- E2E
- acceptance scenarios

لكن لا تضف 500 test تافه فقط لرفع الرقم.

الاختبارات يجب أن تحمي behavior حقيقي.

---

# 13. لا توقف العمل لأمور صغيرة

داخل المجموعة لا تطلب موافقة المستخدم على:

- اسم ملف منطقي
- fixture بسيط
- test صغير
- refactor محلي
- bug fix
- dependency patch غير معماري

اتخذ القرار ونفّذ.

الهدف من نظام المجموعات هو تقليل التدخل اليدوي.

---

# 14. لا تبدأ المجموعة التالية تلقائيًا

هذه قاعدة صارمة.

بعد إنهاء المجموعة الحالية:

**STOP.**

حتى لو كانت المجموعة التالية واضحة تمامًا.

سيتم نقل تقريرك إلى مراجعة خارجية.

قد تحصل بعدها على:

- إصلاح جماعي
- تعديل معماري
- أو موافقة للانتقال

فقط حين يطلب المستخدم:

`Start Group N`

ابدأ المجموعة التالية.

---

# 15. صيغة التقرير الجماعي الإلزامية

عند انتهاء كل مجموعة أخرج تقريرًا واحدًا فقط بهذا الشكل:

# GENESIS EXECUTION GROUP REPORT

`GROUP =`
`TASK RANGE =`
`STATUS = PASS / PARTIAL / FAIL / BLOCKED`

`START SHA =`
`FINAL SHA =`
`BRANCH =`

## 1. EXECUTIVE RESULT

شرح مختصر لما أصبحت Genesis قادرة عليه بعد هذه المجموعة.

## 2. TASK RESULTS

جدول:

| Task | Status | What Was Delivered | Evidence |
|---|---|---|---|

لا تكتب رواية طويلة لكل Task.

## 3. FILE IMPACT

`FILES BEFORE =`

`FILES AFTER =`

`FILES ADDED =`

`FILES MODIFIED =`

`FILES DELETED =`

`DIRECTORIES AFTER =`

واذكر أهم الملفات الجديدة فقط.

نحن نراقب التضخم بشكل متعمد.

## 4. FIRST-PARTY CODE SIZE

اذكر تقريبًا:

`FIRST-PARTY LOC =`

واستبعد:

- node_modules
- vendor code
- generated artifacts
- lockfiles

## 5. UPSTREAM REUSE

اذكر كل upstream capability استخدمتها بدل كتابة implementation جديد.

مثال:

`OpenBot computer → reused`

`Playwright → reused`

`MCP SDK → reused`

## 6. AVOIDED FIRST-PARTY IMPLEMENTATIONS

هذا قسم إلزامي.

اذكر ما تجنبنا كتابته بسبب reuse.

مثال:

`Custom container manager — avoided`

`Custom browser automation — avoided`

`Custom MCP transport — avoided`

هذا مهم جدًا لقياس نجاح فلسفة:

**large in capability, small in code**

## 7. TESTS & VERIFICATION

اذكر:

- commands
- passed tests
- failed tests
- build status
- smoke tests
- E2E إن وجدت

## 8. ARCHITECTURE DEVIATIONS

إذا لم يوجد:

`NONE`

إذا وجد، اشرح بدقة لماذا.

## 9. TECHNICAL DEBT CREATED

إذا لم يوجد:

`NONE`

لا تخفِ debt صغيرًا.

## 10. UPSTREAM RISKS / WATCH ITEMS

اذكر:

- alpha dependencies
- breaking changes
- compatibility concerns
- assumptions requiring future verification

## 11. GROUP ACCEPTANCE GATE

حدد:

`PASS / FAIL`

وفسر في نقاط قليلة لماذا.

## 12. RECOMMENDED REPAIR BEFORE NEXT GROUP

إذا لا يوجد:

`NONE`

إذا وجد، اجمع الإصلاحات المقترحة في **مهمة إصلاح جماعية واحدة** قدر الإمكان، وليس عشر مهام صغيرة.

## 13. NEXT GROUP READINESS

`NEXT GROUP READY = YES / NO`

ثم:

**STOP.**

لا تبدأ المجموعة التالية.

---

# 16. قاعدة الإصلاح الجماعي

إذا كان هناك عدد من المشاكل الصغيرة في المجموعة، لا تقترح:

- FIX-001
- FIX-002
- FIX-003
- FIX-004
- FIX-005

إلا إذا كانت مستقلة وخطيرة فعلًا.

بدلًا من ذلك اجمعها قدر الإمكان في:

`GROUP-N REMEDIATION PASS`

ويجب أن:

1. يصلح المشاكل المكتشفة.
2. يعيد تشغيل جميع اختبارات المجموعة المتأثرة.
3. يصدر تقرير Remediation واحدًا.
4. لا يضيف ميزات جديدة.
5. لا يبدأ المجموعة التالية.

---

# 17. AI Context Discipline

لا تجعل أي مهمة تحتاج قراءة المستودع كاملًا إذا لم يلزم.

حافظ على module boundaries بحيث يكفي للعامل غالبًا:

- Architecture baseline
- Current Task
- Relevant contract
- Relevant module
- Relevant tests

إذا أصبحت التغييرات الاعتيادية تحتاج قراءة عشرات الملفات غير المرتبطة:

**اعتبر ذلك architecture smell.**

---

# 18. Complexity Stop Rule

إذا لاحظت أثناء أي مجموعة:

- عشرات المجلدات الجديدة
- مئات الملفات قبل capability عاملة
- abstraction layers متراكبة
- interfaces لا يستخدمها أحد
- duplicate systems
- framework داخل framework
- حاجة متكررة لقراءة معظم repository لتغيير صغير

**STOP AND REVIEW.**

لا تبرر ذلك بأن Genesis مشروع كبير.

القانون:

**Complexity belongs in capabilities, not in the Genesis codebase.**

---

# 19. ما نريد إثباته في النهاية

Genesis ليس مجرد multi-agent framework.

الفرضية التي نبنيها هي:

`Human Goal`

↓

`Understand Outcome`

↓

`Design Organization`

↓

`Compile Workers`

↓

`Assign Models / Tools / Computers / Memory / Budget`

↓

`Execute Real Work`

↓

`Adapt Organization`

↓

`Verify Outcome`

↓

`Record Experience`

↓

`Learn Better Organizational Patterns`

↓

`Transfer Those Patterns to New Work`

العبارة الأساسية:

**Give Genesis a goal. It builds the AI organization needed to achieve it.**

---

# 20. التعليمات الفورية

ابدأ الآن فقط بـ:

# GROUP 1
## TASK-001 → TASK-009

أولًا:

1. اقرأ وثيقة المشروع الأساسية كاملة.
2. اقرأ ملفات TASK-001 حتى TASK-009 كاملة.
3. افحص مستودع `AgentCraft-Genesis` وحالته الحالية.
4. أنشئ branch المجموعة.
5. نفذ المهام بالتتابع.
6. أصلح الأخطاء المحلية بنفسك.
7. شغّل جميع الاختبارات والـacceptance checks اللازمة.
8. راقب file count وfirst-party LOC طوال التنفيذ.
9. لا تنتقل إلى TASK-010.
10. عند نهاية TASK-009 أصدر **GENESIS EXECUTION GROUP REPORT** بالصيغة المحددة أعلاه.
11. ثم توقف وانتظر المراجعة.

وأثناء التنفيذ تذكّر:

**We are not rewarded for writing more code.  
We are rewarded for making Genesis work with the least code necessary.**