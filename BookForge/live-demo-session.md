# 🎬 BookForge — Live Demo Session

**التاريخ:** 2026-09-30
**الإصدار:** v1.0.0-bookforge-studio
**الوضع:** FORGE_MODE=zai (GLM-4-plus حقيقي) + GLM_THROTTLE_MS=20000

## تجهيز البيئة (مكتمل)

| البند | الحالة | الدليل |
|---|---|---|
| Dev server (zai mode) | ✅ جاهز | outline call: 48.3s, mode=live |
| Studio page | ✅ HTTP 200 | /book-forge/studio |
| GLM_THROTTLE_MS | ✅ 20000 | (D35 — صفر 429) |
| Arabic Piper voice | ⏳ يُنزّل بالخلفية | (للإنتاج الصوتي لاحقاً — غير مطلوب لإنشاء الكتاب) |
| Arabic normalizer | ✅ يحاول البدء (fallback جاهز) | يعيد النص كما هو إن لم يبدأ |
| pandoc/weasyprint/ffmpeg | ✅ مثبتة | (متحقق منها في RT Gauntlet) |
| DB نظيف | ✅ | bunx prisma db push |
| #19 fix (pandoc validation) | ✅ مُطبّق | (sanitizeManuscript + validateOutput) |
| D39 fix (409 on double-approve) | ✅ مُطبّق | (halt/outline route) |
| #17 fix (zai-sdk max_tokens) | ✅ مُطبّق | (outline: 44-48s, not 500 error) |

## التحقق الحي قبل تسليم الرابط

- POST /api/book-forge/books: ✅ (bookId created)
- POST /api/book-forge/outline: ✅ (48.3s, mode=live, JSON valid)
- GET /book-forge/studio: ✅ (HTTP 200)

## الرابط

الواجهة الحوارية: `/book-forge/studio`
واجهة القراءة التفاعلية: `/book-forge/interactive`

## سجل الأزمنة (يُحدّث أثناء تجربة المالك)

| المرحلة | الزمن (من اللوجات) | ملاحظات |
|---|---|---|
| (بانتظار بدء المالك) | — | — |

## ملاحظات الاستخدام البشري (#20+)

| # | الملاحظة | المصدر |
|---|---|---|
| (يُرقّم عند ظهور ملاحظات من المالك) | — | — |
