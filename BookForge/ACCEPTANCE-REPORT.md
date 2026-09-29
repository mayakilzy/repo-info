# BookForge — تقرير الاستلام (Acceptance Report)

> **مصدر البيانات:** الكود الفعلي في المستودع فقط. ما لا يُعرف بدقة مُعلَّم بـ "غير متحقق منه".

---

## 1. مخطط Prisma الفعلي كما نُفِّذ

من `prisma/schema.prisma` (9 نماذج حرفياً من §4 + إضافات `@relation`):

```prisma
model Book {
  id          String   @id @default(cuid())
  slug        String   @unique
  brief       Json
  state       String
  createdAt   DateTime @default(now())
  outline     Outline[]
  chapter     Chapter[]
  source      Source[]
  imageAsset  ImageAssetT[]
  haltPoint   HaltPoint[]
  costEntry   CostEntry[]
  pipelineRun PipelineRun[]
}

model Outline {
  id       String  @id @default(cuid())
  bookId   String
  data     Json
  approved Boolean @default(false)
  book     Book    @relation(...)
}

model Chapter {
  id              String   @id @default(cuid())
  bookId          String
  index           Int
  slug            String
  spec            Json
  draftJson       Json?
  reviewJson      Json?
  status          String   @default("spec")
  wordCount       Int      @default(0)
  runningSummary  String?
  book            Book     @relation(...)
}

model Source {
  id           String   @id               // NOT cuid — explicit caller-supplied
  bookId       String
  url          String
  title        String
  excerpt      String
  chapterTags  Json
  retrievedAt  DateTime
  book         Book     @relation(...)
}

model ImageAssetT {
  id            String   @id              // caller-supplied
  bookId        String
  role          String
  prompt        String
  negativePrompt String
  width         Int
  height        Int
  seed          Int
  filePath      String?
  status        String   @default("requested")
  placementJson Json?
  caption       String?
  book          Book     @relation(...)
  imageJobs     ImageJob[]
}

model HaltPoint {
  id          String    @id @default(cuid())
  bookId      String
  stage       String
  payloadJson Json
  status      String    @default("waiting")
  feedbackJson Json?
  createdAt   DateTime  @default(now())
  resolvedAt  DateTime?
  book        Book      @relation(...)
}

model CostEntry {
  id           String   @id @default(cuid())
  bookId       String
  agent        String
  kind         String
  inputTokens Int
  outputTokens Int
  costUSD      Float
  book         Book     @relation(...)
}

model ImageJob {
  id       String @id @default(cuid())
  imageId  String
  status   String @default("pending")
  attempts Int    @default(0)
  imageAsset ImageAssetT @relation(...)
}

model PipelineRun {
  id        String   @id @default(cuid())
  bookId    String
  state     String
  note      String?
  enteredAt DateTime @default(now())
  book      Book     @relation(...)
}
```

**انحراف عن §4:** إضافة علاقات `@relation` (لم تكن في النص الحرفي للوثيقة). السبب: تفعيل `include()` و nested reads في Prisma client. لا توجد أعمدة إضافية أو محذوفة.

---

## 2. شجرة مجلدات src/book-forge/ + app/

### `src/book-forge/` (ملفات رئيسية فقط)
```
contracts/   brief.ts, outline.ts, draft.ts, review.ts, source.ts, image.ts, halt.ts, postprocessor.ts
config/      llm.ts, costs.ts, paths.ts, server-tools.ts, strings.ts, postprocessors.ts
agents/      metas.ts, chapter.ts, research.ts, supervisor.ts, visual.ts
agents/prompts/  architect.md, research.md, visual.md, supervisor.md, publisher.md
tools/       types.ts, index.ts, ping.ts, create-book-outline.ts,
             search-web.ts, read-page.ts, store-source.ts, fetch-chapter-sources.ts,
             generate-image.ts, write-section.ts, review-chapter.ts
lib/         glm-client.ts, webmcp-exec-log.ts, image-queue.ts
lib/pipeline/      state-machine.ts, orchestrator.ts, running-summary.ts
lib/providers/     llm/zai-sdk.ts
                   search/{provider,searxng,tavily,mock,index}.ts
                   page/{provider,jina,mock,index}.ts
                   image/{provider,sdcpp,mock,index}.ts
                   drive/index.ts
lib/bm25/          index.ts
lib/validators/    outline-validator.ts, review-checks.ts
lib/export/        manuscript.ts, pandoc.ts, cover.ts, bibliography.ts
components/  BriefForm.tsx, OutlineReview.tsx, ChapterApprovalCard.tsx,
             FinalApprovalCard.tsx, CostPanel.tsx, SourcesPanel.tsx, PipelineStatus.tsx
server/      (models/ — gitignored; empty stub for SD-Turbo weights)
```

### `src/app/` (BookForge-related)
```
app/book-forge/page.tsx                              # unified UI (single route)
app/api/tools/[name]/route.ts                       # Server Bridge dynamic route
app/api/book-forge/books/route.ts                   # POST create book
app/api/book-forge/books/[id]/route.ts              # GET full book state
app/api/book-forge/outline/route.ts                 # POST run Architect
app/api/book-forge/research/route.ts                 # POST run Research Agent
app/api/book-forge/cover/route.ts                   # POST run Visual Agent + compose cover
app/api/book-forge/author/route.ts                  # POST author one chapter
app/api/book-forge/publish/route.ts                 # POST assemble + export + Drive
app/api/book-forge/halt/outline/route.ts            # POST approve/revise outline
app/api/book-forge/halt/chapter/route.ts             # POST approve/revise/abort chapter
app/api/book-forge/halt/final/route.ts               # POST final approve/abort
```

---

## 3. قائمة API routes الفعلية

| المسار | المدخل | المخرج | المسؤولية |
|---|---|---|---|
| `POST /api/tools/[name]` | `{ args: object }` (URL=<tool>) | `{ ok, data \| error, ms }` | Server Bridge: whitelist check → dispatch إلى tool handler → log JSONL |
| `POST /api/book-forge/books` | `{ brief: BookBrief }` | `{ ok, bookId, slug }` | إنشاء Book (IDLE → BRIEF_RECEIVED) |
| `GET /api/book-forge/books/[id]` | — | `{ ok, book, outline, halt, sources, chapters, images, cost }` | جلب الحالة الكاملة للواجهة |
| `POST /api/book-forge/outline` | `{ bookId }` | `{ ok, mode }` | تشغيل Architect (BRIEF_RECEIVED → OUTLINE_DRAFTING → HALT_OUTLINE_APPROVAL) |
| `POST /api/book-forge/halt/outline` | `{ bookId, action: 'approve'\|'revise', feedback? }` | `{ ok, next }` | اعتماد/تعديل الفهرس (RESEARCH_RUNNING أو OUTLINE_DRAFTING) |
| `POST /api/book-forge/research` | `{ bookId }` | `{ ok, chapterReports, bibliography, providerIds }` | تشغيل Research Agent لكل فصل + تصدير bibliography (RESEARCH_RUNNING → COVER_GENERATING) |
| `POST /api/book-forge/cover` | `{ bookId }` | `{ ok, enqueuedIds, cover, imageStatus }` | تشغيل Visual Agent + enqueue + drain + composeCover (COVER_GENERATING → AUTHORING) |
| `POST /api/book-forge/author` | `{ bookId, chapterIndex? }` | `{ ok, chapterIndex, verdict, wordCount, revisionRounds }` | كتابة فصل + review + halt (AUTHORING → HALT_CHAPTER_APPROVAL) |
| `POST /api/book-forge/halt/chapter` | `{ bookId, action: 'approve'\|'revise'\|'abort', chapterIndex? }` | `{ ok, next \| aborted }` | حل halt فصل (AUTHORING أو ASSEMBLY) |
| `POST /api/book-forge/publish` | `{ bookId }` | `{ ok, manuscript, exports:{epub,pdf,docx}, drive }` | تجميع manuscript + تصدير 3 صيغ + رفع Drive (ASSEMBLY → EXPORTING → HALT_FINAL_APPROVAL) |
| `POST /api/book-forge/halt/final` | `{ bookId, action: 'approve'\|'abort' }` | `{ ok, next }` | اعتماد نهائي (DRIVE_UPLOADING → DONE) أو abort |

---

## 4. أين يعيش orchestrator + state machine

- **`state-machine.ts`** و **`orchestrator.ts`** في `src/book-forge/lib/pipeline/` — أي **على الخادم** (Next.js Route Handlers تعمل server-side).
- **الحالة تُحفظ في قاعدة البيانات** عبر حقلين:
  1. `Book.state` (String) — الحالة الحالية للكتاب
  2. `PipelineRun` (جدول منفصل) — سجل كامل بكل انتقال حالة مع `enteredAt` و `note`
- **آلية الاستئناف:** `transition(bookId, to, note?)` يفعل التالي داخل `$transaction`:
  1. `assertTransition(from, to)` — التحقق من legality حسب خريطة TRANSITIONS
  2. `tx.book.update({ state: to })`
  3. `tx.pipelineRun.create({ bookId, state: to, note })`
- عند إعادة تشغيل الخادم، الـ route handlers يقرؤون `Book.state` من DB لتحديد ما يعرض أو يُنفَّذ. **لا حالة في الذاكرة بمكان** — كل استئناف يعتمد على DB.
- الـ HaltPoint يُحفظ كصف منفصل (`stage`, `payloadJson`, `status: 'waiting'`) بحيث يمكن لإعادة التشغيل العثور عليه عبر `db.haltPoint.findFirst({ where: { bookId, status: 'waiting' } })`.

**تأكد فعلي:** في الاختبار الـ Live (P6-T2)، قُتل الخادم في منتصف الفصل الثاني ثم أُعيد تشغيله؛ الحالة بقيت `AUTHORING` (تم التحقق عبر `GET /api/book-forge/books/[id]`). **مُتحقَّق منه.**

---

## 5. آلية HaltPoint المنفذة

- **الحفظ:** عند بلوغ نقطة توقف، الـ route المعنيّ يُنشئ صف `HaltPoint` عبر `db.haltPoint.create({ data: { bookId, stage: 'outline'|'chapter'|'final', payloadJson, status: 'waiting' } })` ثم يحدّث `Book.state` إلى `HALT_*` وينشئ `PipelineRun` جديد بنفس الحالة.
- **العرض:** الـ UI في `src/app/book-forge/page.tsx` يفحص الحالة:
  - `HALT_OUTLINE_APPROVAL` → يعرض `<OutlineReview>` (يقرأ `halt.payloadJson.outline`)
  - `HALT_CHAPTER_APPROVAL` → يعرض `<ChapterApprovalCard>` (يقرأ `chapter.draftJson` + `chapter.reviewJson`)
  - `HALT_FINAL_APPROVAL` → يعرض `<FinalApprovalCard>` (يقرأ `halt.payloadJson.{manuscript,exports,drive}`)
- **الاستئناف:** الـ route المناسب (`/api/book-forge/halt/{outline,chapter,final}`) يستلم `action: 'approve'|'revise'|'abort'`:
  - `approve` → `tx.haltPoint.update({ status: 'approved', resolvedAt: new Date() })` + `transition(bookId, NEXT_STATE)`
  - `revise` → `tx.haltPoint.update({ status: 'revisions', feedbackJson: { feedback }, resolvedAt })` + `transition(bookId, PREV_DRAFTING_STATE)` لإعادة التوليد مع feedback (سقف جولة واحدة لـ outline/chapter — §7)
  - `abort` → `tx.haltPoint.update({ status: 'revisions', feedbackJson: { action: 'abort' }, resolvedAt })` + `Book.state = 'DONE'` مع note "aborted"
- **ضمان عدم النداء LLM أثناء الانتظار:** الـ route لا يستدعي `ask()`/`askJSON()` أثناء `waiting`. الـ approve/revises تُطلق العمليات التالية بشكل صريح.

---

## 6. الأدوات المسجلة فعلياً في WebMCP + آلية server bridge

### قائمة `SERVER_TOOLS` (في `config/server-tools.ts`):
| # | الاسم | usedBy |
|---|---|---|
| 1 | `ping` | system |
| 2 | `create-book-outline` | Architect |
| 3 | `search-web` | Research |
| 4 | `read-page` | Research |
| 5 | `store-source` | Research |
| 6 | `fetch-chapter-sources` | Chapter |
| 7 | `export-bibliography` | Research |
| 8 | `generate-image` | Visual |
| 9 | `compose-cover` | Visual |
| 10 | `write-section` | Chapter |
| 11 | `review-chapter` | Supervisor |
| 12 | `export-epub` | Publisher |
| 13 | `export-pdf` | Publisher |
| 14 | `export-docx` | Publisher |
| 15 | `upload-to-drive` | Publisher |

**المُسجَّل فعلياً في `tools/index.ts` (بـ handler):** `ping, create-book-outline, search-web, read-page, store-source, fetch-chapter-sources, generate-image, write-section, review-chapter` (9 من 15). الباقي (compose-cover, export-epub, export-pdf, export-docx, upload-to-drive, export-bibliography) مُدرج في whitelist **لكنه بدون handler** — تُستدعى مباشرة من route handlers (`/api/book-forge/{cover,publish,research}`) كاستدعاءات دالة، لا عبر Server Bridge.

### آلية Server Bridge (`src/app/api/tools/[name]/route.ts`):
1. POST فقط (`dynamic = 'force-dynamic'`)
2. يقرأ `<name>` من URL + `{ args }` من body
3. `isServerTool(name)` → إن false: 400 + log entry (status=not-whitelisted)
4. `findTool(name)` → إن undefined: 501 + log entry
5. `await spec.handler(args, ctx)` داخل try/catch
6. النجاح → `{ ok: true, data, ms }` + log entry (ok=true)
7. الفشل → `{ ok: false, error }` (500) + log entry (ok=false, error=msg)
8. كل نداء يُسجَّل في `logs/webmcp-exec.jsonl` (append-only)

### من يستدعي ماذا وأين:
- **الوكلاء (Architect/Research/Visual/Supervisor/Chapter Sub-Agent)** تعيش في `src/book-forge/agents/*.ts` وتُستدعى من `app/api/book-forge/*/route.ts` (server-side) كاستدعاءات دالة مباشرة. الـ agents تستدعي tools (search-web, read-page, store-source, fetch-chapter-sources, generate-image, write-section, review-chapter) كاستدعاءات دالة أيضاً — ليست عبر fetch HTTP.
- **Server Bridge** (`/api/tools/[name]`) هو بديل للـ Swarm Engine's WebMCP — يسمح للـ client (mock Swarm browser lib) أو سكربتات الاختبار بالاستدعاء عبر HTTP. تُستخدم فعلياً فقط في اختبارات smoke (ping, fetch-chapter-sources).

**انحراف عن §2.1:** spec يصف Server Bridge Pattern كمسار `Agent tool_call → WebMCP bridge (browser) → fetch('/api/tools/<name>')`. التطبيق الفعلي يستدعي الـ tools كاستدعاءات دالة مباشرة من الـ agents (نفس العملية server-side)، وServer Bridge يخدم فقط كآلية اختبار/inspector. السبب: لا مكتبة `@swarm/webmcp-react` متاحة؛ الـ abstraction المُصمَّمة تسمح بالتبديل لاحقاً دون تعديل الـ agents.

---

## 7. GLM client: توقيع ask، آلية retry، كيف تُكتب CostEntry

### التوقيع الفعلي (من `src/book-forge/lib/glm-client.ts`):
```ts
export interface ChatMessage { role: 'system'|'user'|'assistant'|'tool'; content: string; }
export interface AskOptions {
  temperature?: number;
  maxOutputTokens?: number;
  agent?: string;       // for CostEntry.agent
  kind?: string;        // for CostEntry.kind
  bookId?: string;      // REQUIRED for CostEntry to be written
  _repairIteration?: number;  // internal
}
export interface AskResult { content: string; usage: { inputTokens: number; outputTokens: number }; }
export async function ask(messages, opts?): Promise<AskResult>;
export async function askJSON<T>(schema: ZodType<T>, messages, opts?): Promise<T & { _usage }>;
```

### 3 أوضاع (في `config/llm.ts`):
- `mock` → `callMockGLM` — deterministic stub
- `live` → `callLiveGLM` — HTTP fetch إلى `${GLM_BASE_URL}/chat/completions` مع `Bearer ${GLM_API_KEY}`
- `zai` → `callZaiSdkGLM` — `z-ai-web-dev-sdk` (GLM-4-plus، بدون مفتاح API خارجي)؛ يُحوّل `role:'system'` إلى `'assistant'` لأن SDK لا يقبل system

### آلية retry:
1. `withRetry(fn)` يلفّ النداء بـ `maxAttempts = 5` (مرفوع من 3)
2. على الفشل: `backoff = initialBackoffMs × backoffMultiplier^(attempt-1)` محصور بـ `maxBackoffMs`
3. **الكشف عن 429:** `isRateLimited(err)` يفحص رسالة الخطأ؛ للـ 429 يستخدم `base=15_000ms` و `cap=60_000ms` بدلاً من 500ms/8s
4. بعد نفاد المحاولات: `throw new LlmCallError('GLM call exhausted retries', lastErr)`

### Throttle (وُضع لتخفيف rate limit):
- قبل كل نداء GLM (غير mock): `await throttle()` يضمن ≥ `GLM_THROTTLE_MS` (افتراضي 5000ms) بين النداءات المتتابعة

### حلقة إصلاح JSON (`askJSON`):
- على فشل `JSON.parse` أو `schema.safeParse`: نداء إصلاح واحد (maxLoops=1) مع `repairMessages` تضيف رسالة الخطأ + تعليمات "Return a JSON object that strictly satisfies the contract"
- على الفشل الثاني: `throw new SchemaValidationError(issues, raw)`

### كتابة CostEntry:
```ts
async function persistCost({ bookId, agent, kind, inputTokens, outputTokens }) {
  if (!bookId) return;  // smoke tests may omit
  try {
    await db.costEntry.create({ data: { bookId, agent, kind, inputTokens, outputTokens,
      costUSD: computeLlmCost(inputTokens, outputTokens) } });
  } catch (err) { console.error(...); /* MUST NOT break pipeline */ }
}
```
- `computeLlmCost(in, out)` من `config/costs.ts`: `in/1000 × inputPer1K + out/1000 × outputPer1K + fixedPerCall`
- القيم الحالية في costs.ts: `glm.inputPer1K = 0.0005`, `outputPer1K = 0.0015`, `fixedPerCall = 0`
- تُستدعى بعد كل `ask()` وكل `askJSON()` ناجحة

### الإصلاحات المُضافة للـ live mode:
- regex لتجريد ```json fences يسمح بـ whitespace سابق (`/^\s*```(?:json)?/`)
- `z.preprocess` على حقول enum (person, citationStyle) لتطبيع "third person" → "third"
- `normalizeOutlineShape()` في `create-book-outline.ts` يحوّل الـ shape المبسّط الذي يرجعه GLM إلى BookOutline كامل

---

## 8. سجل الانحرافات المبررة

| # | الموضع | الانحراف | السبب |
|---|---|---|---|
| 1 | `prisma/schema.prisma` | إضافة `@relation` directives + حقل imageJobs عكسي في ImageAssetT | تفعيل `include()` للقراءات المتداخلة في Prisma client؛ بدونها لا يمكن جلب chapters/sources/images مع book في query واحد |
| 2 | `BookBriefSchema.chapterCountHint.min(6)` → `.min(3)` | خفض الحد الأدنى للفصول من 6 إلى 3 | ضبط التكلفة لاختبار الـ Live (P6-T2) — طلب صريح من المستخدم: "كتاب من 3 فصول فقط" |
| 3 | `BookOutlineSchema.chapters.min(6)` → `.min(3)` | مواكبة الانحراف #2 | لازم لتمرير validator عند outline بـ 3 فصول |
| 4 | `outline-validator.ts CHAPTER_COUNT_RANGE.min` → `3` | مواكبة الانحراف #2 | لازم لتمرير validator |
| 5 | `StyleGuideSchema.person` + `citationStyle` | إضافة `z.preprocess` للتطبيع | GLM-4-plus يرجع "third person" و "footnote style"؛ الـ enum strict يرفض |
| 6 | `CheckSchema.pass/notes` | إضافة `.default(false)` / `.default('')` | GLM يُغفل أحياناً حقول `pass`/`notes` في review checks |
| 7 | `DraftSchema.sourceRefs` | `z.preprocess((v) => String(v), ...)` | GLM يرجع أحياناً `[1, 2]` (numbers) بدلاً من `["src-1"]` |
| 8 | `QueriesSchema` | `z.union([object, array.transform(...)])` | GLM يرجع أحياناً array مباشرة بدلاً من `{queries: array}` |
| 9 | `ChapterDraft.runningSummaryContribution.max` | 500 → 1000 | GLM يكتب contributions تتجاوز 500 حرفاً |
| 10 | `LLM_CONFIG.retry.maxAttempts` | 3 → 5 | HTTP 429 rate limit يحدث أحياناً بعد 5–6 نداءات متتابعة |
| 11 | `glm-client.ts ask/askJSON` | إضافة `throttle()` (5s افتراضياً) | تقليل احتمال 429 في الوضع live |
| 12 | `glm-client.ts withRetry` | إضافة `isRateLimited()` + backoff أطول (15s/60s) للـ 429 | معالجة 429 بشكل أكثر فاعلية من backoff العادي |
| 13 | `create-book-outline.ts askOutlineFromLLM` | إضافة `normalizeOutlineShape()` post-processor | GLM يرجع `{title, outline: [...]}` بدلاً من BookOutline الكامل؛ التطبيع يحوّل الشكل المبسّط |
| 14 | `glm-client.ts askJSON` regex لتجريد fences | السماح بـ whitespace سابق | GLM يرجع `\n```json\n{...}\n```\n` (newline قبل fence) |
| 15 | `agents/visual.ts` + `cover/route.ts` | بادئة `bookIdShort` في image asset IDs (`img-{bookIdShort}-{vb.id}`) | تفاذي تصادم الـ IDs عبر كتب متعددة على نفس المسار (`img-c1-1` يتعارض عبر الكتب) |
| 16 | `agents/research.ts` | بادئة `bookIdShort` في source IDs (`src-{bookIdShort}-c{chapter}-{seq}`) | نفس السبب؛ `Source.id` هو PK عالمي |
| 17 | `SourceRecordSchema.id` regex | `^src-c\d+-\d+$` → `^src-[a-z0-9]+-c\d+-\d+$` | مواكبة الانحراف #16 |
| 18 | `supervisor.ts liveChapterAgentLoop` | إضافة `fetchChapterSources` + تمرير `sourceIds` الحقيقية في user prompt | GLM لا يعرف الـ source IDs المتاحة؛ بدونها يختلق IDs رقمية |
| 19 | `tools/index.ts` | 9 من 15 tool لها handler فعلي؛ الـ 6 الباقية مسجّلة في whitelist فقط | الـ 6 الباقية (compose-cover, export-epub/pdf/docx, upload-to-drive, export-bibliography) تُستدعى مباشرة من route handlers كاستدعاءات دالة، لا عبر Server Bridge |
| 20 | `app/api/cover/route.ts`, `app/api/research/route.ts` | استدعاء `enqueueImage`/`storeSource`/`generateImage` كاستدعاءات دالة مباشرة من route handler | لا حاجة لجولة HTTP عبر Server Bridge في server-side calls؛ الـ Server Bridge يخدم فقط اختبارات smoke والـ client |

---

## 9. ملفات config الموجودة فعلاً + مفاتيحها + قيمها

### `config/llm.ts`
```ts
mode: 'mock' | 'live' | 'zai'                    // من process.env.FORGE_MODE
model: process.env.GLM_MODEL || 'glm-5.2'
baseURL: process.env.GLM_BASE_URL || ''
apiKey: process.env.GLM_API_KEY || ''
temperatures: { structure: 0.2, creative: 0.7 }  // D2
maxInputTokensPerCall: 24_000                    // D3 initial
maxOutputTokensPerCall: 8_000                    // D3 initial
retry: { maxAttempts: 5, initialBackoffMs: 500, backoffMultiplier: 2, maxBackoffMs: 8_000 }
jsonRepair: { maxLoops: 1 }
```

### `config/costs.ts`
```ts
glm.inputPer1K: 0.0005        // USD per 1K input tokens
glm.outputPer1K: 0.0015       // USD per 1K output tokens
glm.fixedPerCall: 0
image.perImage: 0              // local CPU, no per-image cost
```

### `config/paths.ts`
```ts
projectRoot: process.cwd()
books: process.env.BOOKS_DIR || path.join(projectRoot, 'books')
fonts: process.env.FONTS_DIR || path.join(projectRoot, 'assets', 'fonts')
models: process.env.MODELS_DIR || path.join(projectRoot, 'server', 'models')
bookFolder(slug): path.join(projectRoot, 'books', slug)
coverTemplate: path.join(projectRoot, 'assets', 'cover-template.svg')
pdfStyleAr: path.join(projectRoot, 'assets', 'pdf-style-ar.css')
pdfStyleEn: path.join(projectRoot, 'assets', 'pdf-style-en.css')
```

### `config/server-tools.ts`
15 entries — see §6.

### `config/strings.ts` (D16)
- `appTitle`, `appTagline`, `appSubtitle`, `emptyState`, `loadingDefault`, `idle`
- `pipelineStates`: 13 مفتاح بأسماء الـ states الحرفية (IDLE, BRIEF_RECEIVED, …, DONE)
- `agents`: architect/research/visual/supervisor/publisher/chapter مع emoji
- `actions`: approve, revise, escalate, abort, resume, retry, cancel, submit, save, next, back
- `errors`: schemaInvalid, jsonParseFailed, llmCallFailed, toolNotWhitelisted, unknownPipelineState, modeInvalid
- `briefForm`: title, description, audience, language, languageAr, languageEn, chapterCountHint, goals, constraints, submit
- `cost`: total, byAgent, tokensIn, tokensOut, usd

### `config/postprocessors.ts` (P7-T2)
```ts
POSTPROCESSORS: readonly BookPostProcessor[] = []  // v1 ships empty
```

---

## 10. سكربتات smoke القائمة: ماذا يفحص كل واحد

| السكربت | ما يفحص | ما لا يفحص |
|---|---|---|
| `scripts/smoke-llm.ts` | `ask()` يرجع content+usage في mock mode; `askJSON()` يرجع schema-conformant data في mock mode; 2 CostEntry rows تُكتب عند تمرير bookId; live mode يفحص SchemaValidationError path | لا يفحص live calls حقيقية (لا GLM_API_KEY في CI); لا يفحص throttle/retry real |
| `scripts/smoke-server-bridge.ts` | POST /api/tools/ping يرجع 200 + `{ ok:true, pong:true }`; أداة غير مسجّلة في whitelist تُرفض بـ 400; log entry يُكتب في `logs/webmcp-exec.jsonl` | لا يفحص tool handlers الثقيلة (generate-image, write-section, etc.); لا يفحص استدعاء من browser (fake browser) |
| `scripts/smoke-pipeline-architect.ts` | إنشاء book → BRIEF_RECEIVED; توليد outline → HALT_OUTLINE_APPROVAL; اعتماد → RESEARCH_RUNNING; PipelineRun rows تُكتب | لا يكمل لـ DONE; لا يفحص research/cover/author |
| `scripts/smoke-pipeline-research.ts` | outline → approve → research (40 sources في mock); bibliography files تُكتب على القرص; BM25 retrieval يرجع ≥1 source; state=COVER_GENERATING | لا يفحص author/publish; لا يفحص Jina/SearXNG/Tavily real |
| `scripts/smoke-pipeline-full.ts` | IDLE → ... → DONE كامل (6 فصول في mock); EPUB+PDF+DOCX files بحجم ≠0; manuscript.md موجود; Drive link غير فارغ; الحالة النهائية DONE | لا يفحص live; لا يفحص RTL نص في PDF بصرياً (يفحص وجود الملف فقط) |
| `scripts/smoke-pipeline-live.ts` | نفس الـ full لكن في FORGE_MODE=zai (GLM-4-plus حقيقي); resume test (إعادة تشغيل الخادم في منتصف الفصل 2); كتابة CostEntry فعلية بالـ tokens الحقيقية; تسجيل per-stage metrics (duration, tokens, cost) | لم يكمل لـ DONE في أي تشغيل (GLM rate limit + schema mismatches); لا يفحص بصرياً EPUB/PDF الناتجة من live run |
| `scripts/probe-outline.ts` | (debug) يطبع raw response من GLM لـ Architect prompt + usage | (debug tool, not assertion) |

---

## 11. بنية Source الحالية بكل حقولها

من `prisma/schema.prisma`:
```prisma
model Source {
  id           String   @id               // caller-supplied, format: src-{bookIdShort}-c{chapter}-{seq}
  bookId       String                     // FK to Book.id
  url          String                     // the source URL
  title        String                     // page title
  excerpt      String                     // ≤3000 chars (truncated in store-source)
  chapterTags  Json                       // number[] — chapters this source informs
  retrievedAt  DateTime                   // ISO from SourceRecord.retrievedAt
  book         Book     @relation(...)
}
```

من `contracts/source.ts` (Zod schema):
```ts
SourceRecordSchema = z.object({
  id: z.string().regex(/^src-[a-z0-9]+-c\d+-\d+$/),  // globally unique
  url: z.string().url(),
  title: z.string().min(1),
  publisher: z.string().optional(),
  retrievedAt: z.string().datetime(),
  excerpt: z.string().max(3000),
  chapterTags: z.array(z.number().int()),
})
```

**تنبيه:** الـ `publisher` موجود في العقد Zod لكنه **ليس عموداً في Prisma schema**. عند `store-source`، نحاول `db.source.upsert` بدون `publisher` field — إن تم تمريره من Research Agent، يُتجاهل (لا يُخزَّن). **غير متحقق منه** ما إذا كان يُخزَّن عبر آلية أخرى.

---

## 12. واجهة SearchProvider المنفذة: توقيعاتها + آلية اختيار التنفيذ

### التوقيع (من `lib/providers/search/provider.ts`):
```ts
export interface SearchResult {
  url: string; title: string; snippet: string;
  publishedAt?: string; score?: number;
}
export interface SearchQuery { query: string; chapterIndex?: number; }
export interface SearchProvider {
  readonly id: string;
  search(queries: SearchQuery[]): Promise<SearchResult[]>;
}
export function dedupeAndTopN(results: SearchResult[], n: number): SearchResult[];
```

### 3 تنفيذات:
- **`SearXNGProvider`** (live): POST إلى `${SEARXNG_BASE_URL}/search?format=json`؛ يرمي `Error` إذا كان `mode === 'mock'`
- **`TavilyProvider`** (live): POST إلى `https://api.tavily.com/search` مع `api_key`; يرمي خطأ إذا كان `mode === 'mock'`
- **`MockSearchProvider`** (mock): ينتج 3 نتائج لكل query، URL = `https://{publisher}/articles/mock-{hash}`; deterministic by hashStr(query)

### آلية الاختيار (factory في `lib/providers/search/index.ts`):
```ts
1. LLM_CONFIG.mode === 'mock'          → MockSearchProvider
2. TAVILY_API_KEY (env) غير فارغ       → TavilyProvider
3. SEARXNG_BASE_URL (env) غير فارغ    → SearXNGProvider
4. (fallback)                            → MockSearchProvider + warning مرة واحدة
```
الـ provider يُخزَّن في `cached` (singleton لكل process).

**ملاحظة:** في الوضع `zai` (الذي يستخدم GLM حقيقي لكنه يفتقر لـ SearXNG/Tavily)، factory تختار MockSearchProvider افتراضياً.

---

## 13. الحالات الفعلية لآلة الحالة بالأسماء الحرفية + الانتقالات

من `lib/pipeline/state-machine.ts`:
```
PIPELINE_STATES = [
  'IDLE', 'BRIEF_RECEIVED', 'OUTLINE_DRAFTING', 'HALT_OUTLINE_APPROVAL',
  'RESEARCH_RUNNING', 'COVER_GENERATING', 'AUTHORING', 'HALT_CHAPTER_APPROVAL',
  'ASSEMBLY', 'EXPORTING', 'HALT_FINAL_APPROVAL', 'DRIVE_UPLOADING', 'DONE'
]  // 13 state بالضبط
```

### الانتقالات القانونية (TRANSITIONS map):
| من | إلى (مسموح) |
|---|---|
| `IDLE` | `BRIEF_RECEIVED` |
| `BRIEF_RECEIVED` | `OUTLINE_DRAFTING` |
| `OUTLINE_DRAFTING` | `HALT_OUTLINE_APPROVAL` |
| `HALT_OUTLINE_APPROVAL` | `OUTLINE_DRAFTING`, `RESEARCH_RUNNING` |
| `RESEARCH_RUNNING` | `COVER_GENERATING`, `AUTHORING` |
| `COVER_GENERATING` | `AUTHORING` |
| `AUTHORING` | `HALT_CHAPTER_APPROVAL`, `ASSEMBLY` |
| `HALT_CHAPTER_APPROVAL` | `AUTHORING`, `ASSEMBLY` |
| `ASSEMBLY` | `EXPORTING` |
| `EXPORTING` | `HALT_FINAL_APPROVAL` |
| `HALT_FINAL_APPROVAL` | `DRIVE_UPLOADING`, `EXPORTING` |
| `DRIVE_UPLOADING` | `DONE` |
| `DONE` | (none — terminal) |

أي انتقال غير مدرج يرفضه `assertTransition()` بـ `Error: illegal pipeline transition: ${from} → ${to}`.

---

## 14. ChapterSpec كما هو معتمد في الكود (كل الحقول)

من `contracts/outline.ts`:
```ts
ChapterSpecSchema = z.object({
  index:          z.number().int().min(1),                    // 1-based
  slug:           z.string().min(1).regex(/^[a-z0-9-]+$/, 'slug must be kebab-case'),
  title:          z.string().min(1),
  learningGoal:   z.string().min(1),
  sections:       z.array(SectionSpecSchema).min(3).max(6),    // 3–6 sections per chapter
  keyTerms:       z.array(z.string()),
  visualBriefs:   z.array(VisualBriefSchema).min(2).max(4),   // 2–4 visuals
  estWords:       z.number().int().min(500).max(20000),
})

SectionSpecSchema = z.object({
  index:      z.number().int().min(1),
  title:      z.string().min(1),
  summary:    z.string().min(1),
  keyPoints:  z.array(z.string()).min(1),                       // ≥1 per section
  estWords:   z.number().int().min(50).max(2000),
})

VisualBriefSchema = z.object({
  id:         z.string().min(1),
  concept:    z.string().min(1),
  styleHint:  z.string().optional(),
})
```

**تنبيه:** في `lib/validators/outline-validator.ts`، `CHAPTER_COUNT_RANGE.min = 3` (مخفّض من 6 — انحراف #4). لكن `ChapterSpecSchema.sections.min = 3` و `.max = 6` متطابقان مع §3.1. `visualBriefs.min = 2` و `.max = 4` متطابقان.

---

## 15. مكونات UI الموجودة فعلاً وخصائصها (props)

من `src/book-forge/components/`:

### `BriefForm.tsx`
```tsx
interface BriefFormProps {
  bookId?: string;          // reuse existing book
  onSubmitted?: (bookId: string) => void;
}
```
حالة داخلية: `title, description, audience, language ('ar'|'en'), chapterCountHint, goals, constraints, submitting`. يستدعي POST /api/book-forge/books ثم POST /api/book-forge/outline.

### `OutlineReview.tsx`
```tsx
interface OutlineReviewProps {
  bookId: string;
  outline: BookOutline;    // the full outline (title, subtitle, promise, styleGuide, frontMatter, chapters, backMatter)
}
```
حالة: `feedback` (textarea), `busy: 'approve'|'revise'|null`. يستدعي POST /api/book-forge/halt/outline. زر `approve` يُطلق بعدها POST /api/book-forge/research + POST /api/book-forge/cover تسلسلياً (chained).

### `PipelineStatus.tsx`
```tsx
interface PipelineStatusProps {
  state: PipelineState;
  bookId?: string;
}
```
Sticky bar يعرض اسم الحالة بالعربية + 13 dot indicator (واحد لكل state). لون النقطة: amber للحالة HALT، emerald لـ DONE، primary للمست ongoing.

### `SourcesPanel.tsx`
```tsx
interface SourceRow {
  id: string; url: string; title: string; publisher?: string;
  excerpt: string; chapterTags: number[]; retrievedAt: string;
}
interface SourcesPanelProps { sources: SourceRow[]; }
```
يعرض كل مصدر مع badge لكل chapter tag. max-h-96 + overflow-y-auto.

### `ChapterApprovalCard.tsx`
```tsx
interface ChapterApprovalCardProps {
  bookId: string;
  chapterIndex: number;
  spec: ChapterSpec;
  draft: ChapterDraft;
  review: ReviewReport | null;
}
```
يعرض sections (مع spec.sections[i].title و draft.sections[i].body)، review report (6 checks مع pass/fail badges)، زر approve/revise/abort + textarea feedback. يستدعي POST /api/book-forge/halt/chapter.

### `FinalApprovalCard.tsx`
```tsx
interface FinalApprovalCardProps {
  bookId: string;
  payload: {
    manuscript: string;
    exports: { epub: { path }; pdf: { path }; docx: { path } };
    drive: { folderLink: string; fileLinks: {name, link}[] };
  };
  words: number;
  chapters: number;
}
```
يعرض manuscript path + 3 export paths + Drive links. زر approve/abort. يستدعي POST /api/book-forge/halt/final.

### `CostPanel.tsx`
```tsx
interface CostPanelProps {
  totalCost: number;
  totalIn: number;
  totalOut: number;
  byAgent: Record<string, { count: number; cost: number }>;
}
```
يعرض التكلفة الإجمالية (USD) + tokens in/out + جدول per-agent (count × cost).

---

## 16. نتيجة Live Run Report (الخطوة 2)

> **مُرفقة كملف منفصل:** `download/LIVE-RUN-REPORT.md` + `download/live-run-report.json`.

### ملخص الأرقام (best run):
- **Total cost (USD):** $0.0144
- **Total tokens (in):** 4,366
- **Total tokens (out):** 8,166
- **Total wall time:** 323.3 seconds (~5.4 min)
- **Final state:** AUTHORING (لم يكمل لـ DONE بسبب LLM-judge schema mismatch — مُصلح في نفس الالتزام، لم يُعاد اختباره بعد)

### Resume-after-restart test:
- **مُتحقَّق منه ✓** — قُتل الخادم في منتصف الفصل 2 وأُعيد تشغيله؛ الحالة بقيت `AUTHORING` (مؤكَّد عبر `GET /api/book-forge/books/[id]`).

### EPUB/PDF verification:
- **غير متحقق منه** بصرياً (لم يكتمل الـ live run لـ DONE). لكن في mock run السابق (smoke-pipeline-full.ts)، EPUB=14KB + PDF=187KB + DOCX=12KB بحجم ≠0.

### Retries + JSON schema failures:
- 429 rate-limit retries: 2 مشاهدة (15s→30s→60s backoff)
- JSON schema failures: 3 أنماط مختلفة (all patched)

### Longest prompt (D3 proxy):
- Architect outline prompt: ~2,800 chars (system + user combined, includes full schema hint)
- Chapter agent prompt: ~3,500 chars
- كلاهما أقل بكثير من حد D3 (24K input tokens ≈ 96K chars)

### قائمة المشاكل التي ظهرت لأول مرة في live فقط:
1. GLM يرجع markdown-fenced JSON مع whitespace سابق
2. GLM يرجع simplified outline shape بدلاً من BookOutline الكامل
3. GLM يرجع array بدلاً من object للـ research queries
4. GLM يرجع numeric sourceRefs بدلاً من string IDs
5. GLM يُغفل حقول pass/notes في review checks
6. GLM يطبّق rate limit (429) بعد 5–6 نداءات متتابعة
7. GLM يكتب runningSummaryContribution > 500 حرف
8. GLM يرجع enum values غير دقيقة ("third person" بدلاً من "third")

كلها مُصلَّحة في الكود (انظر §8 الانحرافات #5–#14). إعادة تشغيل الاختبار بعد الإصلاحات متوقَّع أن يصل لـ DONE.

---

## خاتمة

- **P0 → P7:** مكتمل و mocker يمرّ end-to-end.
- **Dependabot:** مُحلول (sharp 0.34.3 → 0.35.5)؛ التنبيهان مُغلقان على GitHub.
- **Live test (P6-T2):** جُزئي — Pipeline بنية تحتية مثبتة (resume test passed)، لكن GLM-4-plus أنتج 8 أنماط schema mismatch لم تظهر في mock. كلها مُصلَّحة في الكود؛ إعادة اختبار لم تكتمل بسبب rate limit.
- **PostProcessors (P8+):** لم تُبدأ حسب التعليمات.
- **GitHub push:** الالتزام `708cb5a` جاهز محلياً؛ التوكن لم يعد صالحاً (401 Bad credentials) — يحتاج توكن جديد للرفع.
