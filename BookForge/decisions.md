# BookForge — Decisions Log

> Single source of truth for all partner-verified decisions (D1–D24, G-gates, G9, etc.).
> Each entry: decision + measured evidence + date + reference.

---

## D1 — LLM Provider (Production Mode)
- **Decision**: `zai` mode (z-ai-web-dev-sdk, GLM-4-plus, no external API key)
- **Evidence**: G13 closure run completed to DONE on 2026-09-29 via zai. `live-openai` mode not tested.
- **Per protocol**: "إن أكمل الاثنان ⇒ القرار للمالك" — only one completed, zai wins by default.
- **Date**: 2026-09-29
- **Reference**: G13-CLOSURE-STATUS.md (commit `c748fea`)

---

## D2 — Temperatures
- **Decision**: 0.2 (structure/review/JSON) + 0.7 (creative narrative) — confirmed in `config/llm.ts`
- **Evidence**: Used in all live calls during G13 closure; Architect (0.2) + Chapter author (0.7) both succeeded.
- **Date**: 2026-09-29

---

## D3 — Context Limits
- **Decision**: 24K input / 8K output tokens per call (initial values, update from official spec)
- **Evidence**: Longest prompt measured = 3.5K chars (~875 tokens at 4 chars/token) — well below 24K limit.
- **Date**: 2026-09-29

---

## D9/D11/D12 — BM25 / Prisma+SQLite / pandoc+WeasyPrint
- **Decision**: All confirmed as implemented (BM25 via minisearch, Prisma+SQLite, pandoc+WeasyPrint for EPUB/PDF/DOCX).
- **Evidence**: G13 closure produced EPUB 14KB + PDF 53KB + DOCX 12KB.
- **Date**: 2026-09-29

---

## D14 — BookBrief Chapter Floor
- **Decision**: Floor relaxed from spec's 6 → 3 (deviation #2–4) for live test cost control; recommended default remains 10.
- **Evidence**: G13 closure run with 3 chapters cost $0.0402; full 10-chapter book estimated $0.05–0.15.
- **Date**: 2026-09-29

---

## D19 — Academic Lane (paper-search-mcp sidecar)
- **Decision**: Build paper-search-mcp as Python sidecar (original repo run as-is via uv/Docker), NOT a bun project. EXCLUDE shadow-library connector + CI gate.
- **Evidence**: Per Amendment ت7-a: "sidecar هو المستودع الأصلي Python يُشغَّل كما هو".
- **Date**: 2026-09-29
- **Reference**: ROUND-B-AMENDMENT.md §ت7

---

## D20 — Provider Readiness Matrix (G10 — partial-close)
- **Decision**: 5 tiers (open/polite/optional_key/required_key/**flaky**). After G10 closure protocol (3 probes × 60s after 10min wait):
  - **arXiv**: `open → flaky` (measured 0/3 success, HTTP 503 all)
  - **OpenAlex**: `polite → flaky` (measured 0/3 success, HTTP 429 all)
  - Crossref, PubMed, Semantic Scholar, EuropePMC: remain at original tiers (verified working)
  - Unpaywall, CORE: correctly disabled by degradation rule (env vars not set)
- **Evidence**: G10 closure protocol results in LIVE-ISSUES-LAYER24.md.
- **Date**: 2026-09-29

---

## D21 — Simplification Layer (Twins + Spine + Fidelity)
- **Decision**: Per Amendment ت5 — new phase P15 (Twins ×3 + Comprehension Probe + spine-diff + incremental rebuild).
- **Date**: 2026-09-29
- **Reference**: ROUND-B-AMENDMENT.md §ت5

---

## D22 — Evidence Model
- **Decision**: `EvidenceItem` with dual-form (technicalForm/plainForm/fidelity) — stored as Prisma `model Evidence` (NOT Json free per ت7-c).
- **Evidence**: `prisma/schema.prisma` model Evidence + `contracts/research.ts` Zod schema.
- **Date**: 2026-09-29

---

## D22.1 — Retraction Detection Defaults (P8-T4)
- **Decision**: كشف التراجع الافتراضي بثلاث طرق بالترتيب:
  1. Crossref `relation` field (`has-update` entries) — الغالب فارغ في الواقع
  2. Crossmark assertions (publisher-asserted) — نادر في REST API
  3. Title-pattern ("Retraction" في العنوان) — **الأنجع عملياً** [قياس محل افتراض أولي]
- **Works بلا DOI (preprints)**: `retracted: unknown` — لا يُعلَّم متراجعاً ولا يفشل
- **Evidence**: scripts/smoke-p8-t4.ts — 5/5 retraction-notice DOIs مُكتشفة، 0/20 false-positives على عينة سليمة
- **Date**: 2026-09-29
- **Reference**: commit `ea52b86`

---

## D23 — Architecture (Server-side Agents)
- **Decision**: Agents are server-side functions; Server Bridge (`/api/tools/*`) = testing/inspector only; 6 tools without handlers called directly from route handlers.
- **Per ت8 (Layer 4 A2A honesty)**: "مبسط — حلقة revise عبر prompts" (documented reality outranks claimed fullness).
- **Date**: 2026-09-29

---

## G7 — STORM A/B (P8-T7, not yet resolved)
- **Status**: OPEN. Decision pending measurement: "أدلة/فصل عبر أسئلة STORM > expansion داخلي؟ تعادل ⇒ إسقاط".
- **Date**: TBD

---

## G8 — Valsci opt-in (P8-T8, not yet resolved)
- **Status**: OPEN. Decision pending measurement: "كلفة واجهة > يوم ⇒ تأجيل v2".
- **Date**: TBD

---

## G9 — pyeuropepmc vs Manual Client (RESOLVED in P8-T2)
- **Decision**: **manual client (TypeScript)** — EuropePMC REST adapter built as part of `lib/research/federation/adapters.ts`.
- **LOC accounting (تأ-4 unified phrasing)**:
  - **Adapter class**: ~30 LOC (EuropePmcAdapter in adapters.ts — single class with `probe()` + `search()` methods)
  - **Total path LOC**: ~80 (adapter 30 + URL/UA construction + response normalization + retry/fallback wrapper + tier-aware gating)
  - pyeuropepmc alternative: Python sidecar + IPC + TypeScript bridge = ≥150 LOC integration — exceeds savings
- **Evidence**:
  - Manual client uses native fetch to `https://www.ebi.ac.uk/europepmc/webservices/rest/search` — no extra runtime, no extra deps.
  - pyeuropepmc would require: Python sidecar + IPC + TypeScript bridge — integration cost exceeds savings.
- **T2-live gate result (2026-09-29)**: europepmc adapter returned **7505 results** in **3846ms** — fully functional.
- **Date**: 2026-09-29
- **Reference**: commit `a1d88d4` (P8-T2)

---

## G10 — Provider Tier Verification (partial-close in P8-T2)
- **Status**: PARTIAL-CLOSE.
  - ✅ Matrix structure final (5 tiers + 7 providers + envVar/delaySec/cacheTtlSec).
  - ✅ 3/7 providers verified working (Crossref, PubMed, EuropePMC) in T2-live gate.
  - ⚠️ arXiv + OpenAlex tier-reassigned to `flaky` with measured evidence (0/3 success in closure protocol).
  - ⏸️ Full close requires production server (sandbox IP rate-limited).
- **Per partner protocol §ب**: "إعادة تعيين tier موثقة (مثلاً arXiv: open→flaky)" — both decisions legitimate, NOT premature closure.
- **Date**: 2026-09-29

---

## G11 — Fidelity Thresholds (P9-T3, not yet resolved)
- **Status**: OPEN. Decision pending measurement: "عينة 30 عبارة: دقة/إزعاج/خيانة".
- **Date**: TBD

---

## G13 — Live Gate (CLOSED ✅)
- **Decision**: zai mode completes to DONE. All 5 constitutional conditions met on 2026-09-29.
- **Evidence**: G13-CLOSURE-STATUS.md (commit `c748fea`).
- **Date**: 2026-09-29

---

## D25 — P8-T6 Academic Lane Pipeline Integration (mock-PASS — pending live)
- **Decision**: `ACADEMIC_SWEEP ∥ WEB_SWEEP` runs inside `RESEARCH_RUNNING` via `Promise.all`. After both complete:
  - Works + Evidence persisted per `contracts/research.ts` (Prisma models, not Json free per ت7-ج).
  - `retraction-watcher` invoked **before** storage via `searchPapersWithRetractionCheck` (D22.1: title-pattern الأنجع عملياً).
  - `contestedClaims` detected (Evidence with stance=supports + stance=contradicts on same normalized claim) and injected into `ChapterSpec.contestedClaims` (new Zod field, default []).
  - `FreshnessReport` built per chapter with contestedCount.
  - `ChapterApprovalCard` displays contestedClaims with two documented viewpoints (green = supports, red = contradicts).
- **Acceptance (per ROUND-B-FINAL-SPEC §7 P8-T6)**: كتاب تجريبي 3 فصول — ≥3 works محكّمة/فصل + FreshnessReport لكل فصل + صفر retracted stored + contestedClaims مرئية في ChapterApprovalCard.
- **Mock-PASS evidence (2026-09-29)**: `bun run scripts/smoke-p8-t6.ts` PASS
  - 6 chapters (Architect produced 6 from chapterCountHint=3; D14 floor=3 still met)
  - 36 works total (6/chapter — well above ≥3 floor)
  - 0 retracted works stored (required ✓)
  - 1 contestedClaim detected and injected into outline.chapters[1].contestedClaims (mock evidence stance rotation produced exactly one supports+contradicts pair)
  - FreshnessReport per chapter: totalSources, last12mo, last36mo, historical, contestedClaims, retractedFound, providerGaps
- **Pre-existing T6 onboarding fix**: Live Issue #12 — restored `src/app/api/book-forge/books/route.ts` + `src/app/api/book-forge/books/[id]/route.ts` (commit `1f3092d` claimed restoration but committed 0-byte files; smoke-pipeline-full.ts 404'd without them).
- **Status**: mock-PASS opens G7 (next per work order). T6 itself does NOT close until a live run produces the same metrics on real providers (per constitution rule #1 "mock-PASS يفتح المهمة التالية ولا يغلق الحالية").
- **Date**: 2026-09-29
- **Reference**: this commit + scripts/smoke-p8-t6.ts

---

## D26 — type-clean vs lint-clean (تأ-1, partner amendment)
- **Decision**: "type-clean" تعني **صفر أخطاء tsc جديدة** من تغييراتنا — وليس صفر أخطاء مطلقة. lint-clean ≠ type-clean.
  - **مكتسب**: كل تغيير T6 (commit `6af9c28`) لا يُضيف أخطاء tsc جديدة. قِس بـ `tsc --noEmit` قبل/بعد — 62 قبل ← 61 بعد (T6 أصلح خطأً سابقاً بإضافة `contestedClaims: []` للمولّد الوهمي).
  - **الديون القائمة (61 خطأ)**: موثقة بالفئات، التنظيف الدائم مؤجل لقرار الشريك. توزيعها التقريبي:
    - `tools/[name]/route.ts` (3 أخطاء) — TypeCasts في tool descriptor marshalling (سابقة لـ T6)
    - `lib/bm25/index.ts` (2) — minisearch v7 options type mismatch (سابقة)
    - `lib/glm-client.ts` (5) — generic T inference في askJSON (سابقة، تؤثر pattern فقط)
    - `lib/image-queue.ts` (2) — `JsonNull` vs `DbNull` في Prisma (سابقة)
    - `tools/create-book-outline.ts` (1) — `string[]` vs `string` في `askOutlineFromLLM` arg (سابقة)
    - باقي الأخطاء (≈48) — تشتت صغير في types عبر الأدوات والـ contracts (سابقة)
- **Future rule (تأ-1 + Layer 24 rule #11 candidate)**: أي مهمة جديدة يجب أن تُقيس `tsc --noEmit` قبل/بعد وتوثّق العدد. الزيادة = دَيْن جديد يُرقَّن. النقصان = إصلاح يُحسب للمهمة.
- **Date**: 2026-09-29
- **Reference**: تقرير T6 على إثر `tsc --noEmit` post-6af9c28

---

## D27 — P8-T6 LIVE Closure (تأ-3, partner amendment — T6 مُغلقة رسمياً)
- **Decision**: P8-T6 **مُغلقة رسمياً** بعد قياس حي كامل على FORGE_MODE=zai + GLM_THROTTLE_MS=20000 + 3 مزودين أحياء (crossref, pubmed, europepmc).
- **Live evidence (`scripts/t6-live-gate.json` timestamp 2026-09-29T15:18:22Z)**:
  - **Works**: 24 works حقيقية موزَّعة على 3 فصول (9/9/6) من 3 مزودين أحياء (crossref+pubmed+europepmc في كل فصل، ما عدا europepmc فصل 3 أعاد 503 عابر — موثَّق في providerGaps)
  - **Retraction watcher**: 24 DOIs حقيقية تم فحصها عبر Crossref relation field → 0 retracted found (مُقاس، لا مفترى)
  - **Evidence extraction**: 23 evidence مستخرجة بـ GLM (zai mode) — 9 نداءات، 4074 in / 2334 out tokens، $0.0055
  - **Contested claims**: 0 (مُقاس — معظم الأدلة stance=supports/qualifies، لم تتطابق أي زوج supports+contradicts على نفس الـ normalized claim)
  - **FreshnessReport per chapter (real dates)**:
    - ch1: 12mo=5, 36mo=1, historical=3, retracted=0
    - ch2: 12mo=5, 36mo=1, historical=3, retracted=0
    - ch3: 12mo=3, 36mo=1, historical=2, retracted=0
  - **Execution time**: 200 ثانية (~3.3 دقائق)
- **Live Issue #13 discovered + fixed during this run**: GLM في استخراج Evidence رجع حقولاً مفقودة في الـ run الأول (claim/excerpt undefined). أُصلِح بـ Layer 24 rule #9 (few-shot schema hint في system prompt). بعد الإصلاح: 9/9 نداءات ناجحة، 23 evidence مستخرجة.
- **Acceptance gate (per partner message)**: all 5 criteria met ✓
  1. ≥3 works محكّمة حقيقية/فصل من ≥2 مزودين أحياء ✓ (9/9/6 works، 3 مزودين)
  2. retraction-watcher على DOIs حقيقية — موثق ما وُجد (0) وما لم يوجد (24 DOIs checked) ✓
  3. contestedClaims الحقيقية: 0 موثق — صفر أنبل من دراما مفتراة ✓
  4. FreshnessReport بتواريخ حقيقية لكل فصل ✓
  5. CostEntry لكل نداء GLM + إجمالي التكلفة/الزمن في evidence JSON ✓
- **Per Rule 11**: PASS على قياس حي كامل، لا جزئي. T6 مُغلقة.
- **What's unlocked**: G7 (STORM A/B) — قابل للتنفيذ الآن بأمر الشريك. ثم G8 (Valsci) بعد G7.
- **Date**: 2026-09-29
- **Reference**: `scripts/t6-live-gate.json` + `logs/t6-live-gate.log`

---

## G14 — shotcraft-cinematic opt-in (P13-T5, not yet resolved)
- **Status**: OPEN. Half-day spike: repo license + Remotion license match + CPU 60s 1080×1920 test.
- **Date**: TBD

---

## Live Issue #10 (Layer 24)
- **Issue**: GLM returns `{chapters: [...]}` directly (without `outline` key) — third distinct shape.
- **Fix**: `normalizeOutlineShape` extended to accept `r.outline` OR `r.chapters`.
- **Date**: 2026-09-29 (G13 closure run)
- **Reference**: LIVE-ISSUES-LAYER24.md

---

## Live Issue #12 (Layer 24) — T6 onboarding
- **Issue**: Commit `1f3092d` claimed to restore `books/route.ts` + `books/[id]/route.ts` but committed 0-byte files only. Smoke-pipeline-full.ts 404'd on POST /api/book-forge/books in fresh clone.
- **Fix**: Re-wrote both files with full POST/GET handlers in this T6 onboarding commit. Smoke-pipeline-full.ts now PASSES on fresh clone.
- **Governance lesson**: A commit message that claims to add/restore a file MUST be verified post-commit by checking `git show --stat <commit> -- <path>` shows non-zero LOC delta. This is now Layer 24 rule #10.
- **Date**: 2026-09-29
- **Reference**: LIVE-ISSUES-LAYER24.md
