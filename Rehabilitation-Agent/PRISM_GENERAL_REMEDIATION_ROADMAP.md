# PRISM — General Remediation Roadmap

## نقطة البداية
ابدأ من آخر نسخة منشورة في GitHub: `f3e02f4`.
استورد المشروع كاملاً، واقرأ `prism/STARTING_POINT.md` وما يلزم من التقارير الحالية لفهم الحالة الفعلية.

> لا تعِد بناء PRISM من الصفر، ولا تمسح ما تم إنجازه في Phases 2–7C أو Web UI.

## الهدف العام
نقل PRISM تدريجياً من:
**Beautiful Web Demo**
إلى:
**Real Human-Centered PRISM MVP**
ثم لاحقاً إلى:
**Pilot / Institutional-Ready Platform**

لا تحاول الوصول إلى كل ذلك في خطوة واحدة.

## مبادئ العمل
1. حافظ على كل ما يعمل.
2. أصلح الفجوات قبل إضافة features غير ضرورية.
3. لا تدخل في تعقيد معماري إلا عندما تفرضه حاجة حقيقية.
4. استخدم الـ APIs والـ contracts الموجودة قبل إنشاء بدائل.
5. اجعل Web UI نافذة حقيقية على PRISM Core، لا واجهة منفصلة ببيانات تجريبية.
6. Safety له أولوية خاصة عند الانتقال من demo إلى استخدام حقيقي.
7. لا تجعل AI صاحب القرار النهائي في القرارات المؤسسية عالية التأثير.
8. كل خطوة يجب أن تترك المشروع مستقراً وقابلاً للتشغيل.
9. اختبر ما يراه الإنسان في المتصفح، وليس فقط اختبارات backend.
10. إذا تعارضت الخطة مع حقيقة المستودع، اتبع الحقيقة الفعلية ووثّق القرار.

# خارطة الطريق

## المرحلة 1 — فهم الحالة الحالية
افهم المشروع الحالي كما هو.
حدد باختصار:
- ما يعمل فعلياً.
- ما هو متصل فعلياً.
- ما يزال Demo/Placeholder.
- أهم الفجوات.
- مخاطر Safety/Security التي لا يمكن تجاهلها.

لا تقم بإعادة بناء أو audit ضخم لمجرد التدقيق.

**المخرج:** حالة مختصرة + ترتيب أولويات.

## المرحلة 2 — Real PRISM Integration
اربط Web UI الحالية تدريجياً بالـ PRISM Core.

الأولوية:
- Authentication الحالية أو أبسط مسار آمن مناسب للـ MVP.
- API client.
- Companion الحقيقي.
- Conversations.
- Goals.
- Capabilities / Skills.
- Projects.
- Opportunities / Learning.
- Voice حيث يسمح التكامل الحالي.

الهدف:
> ما يراه المستخدم في المتصفح يعكس بيانات وسلوك PRISM الحقيقي، لا Demo data فقط.

لا تعِد تصميم الواجهة من الصفر إلا عند وجود سبب قوي.

## المرحلة 3 — Human Experience
حوّل PRISM من واجهة جميلة إلى تجربة إنسانية حقيقية:
- Companion personality.
- حوار طبيعي.
- سياق المحادثة.
- Memory حيث تكون آمنة ومناسبة.
- توصيات مبنية على سياق حقيقي.
- next meaningful action.
- Voice أكثر طبيعية عندما تكون البنية جاهزة.

المعيار:
> هل يشعر المستخدم أنه يتعامل مع Companion ذكي ومفيد، وليس مجموعة صفحات CRUD؟

## المرحلة 4 — Human Safety
ارفع مستوى Safety تدريجياً:
- اكتشاف إشارات الأزمة.
- self-harm / suicide / dangerous situations.
- fail-closed.
- human escalation.
- crisis response.
- safety testing.
- multilingual safety عند الحاجة.

لا تفترض أن regex وحده يكفي للاستخدام الحقيقي.
ولا تضف ML معقداً لمجرد وجوده في الخطة؛ اختر الحل المناسب للأدلة والمخاطر.

## المرحلة 5 — Trust, Privacy & Institutional Readiness
بعد استقرار التجربة الأساسية:
- Authentication / Identity أكثر واقعية.
- Role boundaries.
- Privacy lifecycle.
- Memory governance.
- Multi-tenant isolation عند الحاجة.
- Audit integrity.
- Consent.
- Human review.
- Secure export/deletion.
- حماية Companion data من الاستخدام المؤسسي غير المصرح به.

المبدأ:
> الفرد ليس مجرد record في النظام.

## المرحلة 6 — Reliability & Operational Readiness
ارفع الموثوقية تدريجياً:
- graceful degradation.
- connection recovery.
- rate limiting.
- background processing حيث يلزم.
- offline/poor-connectivity support إذا كان السياق يحتاجه.
- load testing.
- monitoring.
- backup/recovery.
- deployment reproducibility.

لا تبنِ infrastructure أكبر من الحاجة.

## المرحلة 7 — Validation & Human Trial
اختبر PRISM كما سيستخدمه الإنسان:
- Individual / Companion.
- Professional.
- Administration.
- Voice.
- Conversation.
- Safety scenarios.
- failure scenarios.
- browser UX.
- permissions.
- persistence.

ثم نفّذ تجربة استخدام منظمة على بيئة آمنة ومحدودة.
لا تنتقل إلى بيئة حساسة أو مستخدمين حقيقيين عاليي المخاطر قبل اكتمال متطلبات السلامة والحوكمة المناسبة.

## المرحلة 8 — Final Assessment
في النهاية قدم تقييماً صريحاً:
- ما أصبح Production-capable.
- ما أصبح Pilot-capable.
- ما يزال Prototype.
- ما يمنع الاستخدام المؤسسي.
- المخاطر المتبقية.
- الخطوات التالية.

لا تكتفِ بـ PASS/FAIL.

# ترتيب الأولويات

```text
1. Safety / Human Risk
        ↓
2. Real UI ↔ Backend Integration
        ↓
3. Real Companion Experience
        ↓
4. Privacy / Auth / Trust
        ↓
5. Reliability
        ↓
6. Institutional Hardening
        ↓
7. Advanced Features
```

# حرية التنفيذ
هذه خارطة طريق وليست مجموعة عقود تنفيذية.

للنموذج المطوّر حرية اختيار:
- ترتيب المهام الصغيرة.
- الأدوات.
- أبسط implementation.
- متى يحتاج تغييراً صغيراً في backend.
- متى يكتفي بالـ existing API أو UI state.

لكن أي تغيير جوهري يجب تبريره في التقرير.

# قاعدة عدم الهدم

قبل أي تغيير كبير:
**هل يمكن تحقيق الهدف باستخدام الموجود؟**

إذا نعم: استخدم الموجود.
إذا لا: نفّذ أقل تغيير ممكن.
إذا أثر التغيير في جزء سابق: اختبر الجزء المتأثر قبل وبعد.

# التقارير

لا نريد عشرات التقارير الصغيرة.

بعد كل مرحلة رئيسية، قدم تقريراً مختصراً:
- ماذا أُنجز.
- ماذا أصبح حقيقياً.
- ماذا بقي.
- الاختبارات.
- المخاطر.
- هل يمكن الانتقال للمرحلة التالية.

وفي النهاية أنشئ:
`PRISM_REMEDIATION_FINAL_REPORT.md`

# النتيجة المطلوبة

لا نريد فقط:
> "All tests passed."

نريد أن نعرف:
> **هل أصبح PRISM منتجاً إنسانياً حقيقياً؟ إلى أي مستوى؟ وما الذي ينقصه بصدق؟**

تحرك تدريجياً، حافظ على ما تم بناؤه، لا تعقّد المشروع بلا داعٍ، وأعطنا في النهاية تقريراً صريحاً يمكن الاعتماد عليه لاتخاذ القرار التالي.
