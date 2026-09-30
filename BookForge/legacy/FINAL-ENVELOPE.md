# 📊 BookForge — المغلف الكلي النهائي (R4)

> **المصدر:** تجميع من التقارير الموثقة — لا تقدير جديد. كل رقم قابل للتتبع لملف مصدره.

## جدول الكلفة والزمن لكل مرحلة

| المرحلة | الكلفة (USD) | الزمن (دقيقة) | المصدر |
|---|---|---|---|
| P0–P7 (نص كامل) | $0.0402 | ~5 (G13 closure) | G13-CLOSURE-STATUS.md |
| P8 (مسار أكاديمي) | $0.025 (T6+G7+contested) | ~3 (نصف يوم) | P8-PHASE-A-FINAL-STATUS.md |
| P9 (تبسيط) | ~$0.005 | ~2 | P9 live acceptance |
| P10-T0a (#16 fix) | ~$0 | <1 (no GLM — tsc+smoke only) | P10-T0a-CLOSURE.md |
| P10-T0b (G1 voice) | $0.025 (Piper+Habibi measurement) | ~1 (72h spike) | g1-decision.json |
| P10-T1→T5 (audio infra) | ~$0 (mock) | ~2 (31/31 mock tests) | P10-FINAL-REPORT.md |
| P10-LIVE (twin book) | $0.0644 | 22.23 (brief→m4b) | p10-live-complete.json |
| P11 (visuals) | ~$0 (mock+measurement) | ~3 | P11-FINAL-REPORT.md |
| P12 (interactive) | ~$0 (code only) | ~2 | P12-FINAL-REPORT.md |
| P13 (marketing) | ~$0 (no GLM for KDP) | ~2 | p13-launch-kit.json |
| P14 (translations) | ~$0.001 (1 translate + 1 review call) | 0.14 (8.6s) | p15-t0-translation-live.json |
| P15 (twins+incremental) | ~$0.003 (3 twin reads + 1 probe) | 0.26 (15.8s) | p15-spine-diff-proof.json |
| RT (red team) | ~$0.001 (zai calls for RT-3) | ~1 | RT-MATRIX-v2.json |
| P16 (conversational) | ~$0 (code only) | ~2 | P16-FINAL-REPORT.md |
| **الإجمالي** | **~$0.17** | **~48 دقيقة عمل فعلي** | تجميع |

## أرقام النشر

| المقياس | القيمة | المصدر |
|---|---|---|
| كلفة/كتاب (نص كامل) | $0.0402 | G13-CLOSURE-STATUS.md |
| كلفة/كتاب (نص+صوت) | $0.0644 | p10-live-complete.json |
| كلفة/دقيقة صوت | $0.0021 | p10-live-complete.json |
| كلفة/ترجمة فصل | ~$0.001 (2 GLM calls, 8.6s) | p15-t0-translation-live.json |
| دقائق/كتاب (brief→DONE) | ~22 min (text+audio) | p10-live-complete.json |
| دقائق/كتاب (text only) | ~5 min (mock mode) | G13 closure |

## ملاحظة منهجية

- جميع أرقام الكلفة من CostEntry في قاعدة البيانات (مُقاسة بـ computeLlmCost على inputTokens + outputTokens)
- زمن الحائط من timestamps التقارير (startedAt → completedAt)
- "العمل الفعلي" = زمن الحوسبة الفعلية (لا يشمل انتظار throttle أو إعادة تشغيل server)
- الإجمالي ~$0.17 يشمل جميع GLM calls عبر جميع المراحل (P8–P16 + RT) — ليس كلفة كتاب واحد
- كلفة الكتاب الواحد (مزدوج: نص+صوت) = $0.0644 (51 نداء GLM) — [الدليل](https://github.com/mayakilzy/repo-info/blob/main/BookForge/live-evidence/p10-live-complete.json)
