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

## D28 — G7 STORM A/B — DROP (إسقاط موثق بقياس)
- **Decision**: **DROP STORM** — B ≤ A on primary metric (score=2 relevant works/chapter).
- **A/B test evidence (`scripts/g7-storm-ab.json` timestamp 2026-09-29T16:00:58Z)**:
  - **Arm A (internal expansion, baseline)**: 5 score=2 works across 3 chapters (from 36 raw → 34 deduped)
  - **Arm B (STORM questions)**: 4 score=2 works across 3 chapters (from 86 raw → 72 deduped)
  - **Improvement**: **-20.0%** (B is WORSE than A, not better; threshold was ≥+20% for ADOPT)
  - **Per-chapter breakdown**:
    - ch1 (hydroponics basics): A=2/12, B=1/23 — STORM pulled in more raw works but fewer relevant ones
    - ch2 (soilless systems): A=1/10, B=3/28 — STORM slightly better here (+2 score=2 works)
    - ch3 (nutrient management): A=2/12, B=0/21 — STORM pulled in 21 works, NONE scored 2 (all tangential)
  - **Operational cost**: 21 LLM calls (1 persona gen + 4 persona question gens + 3 judges × 2 arms = 14 + 3 + 4). Wall time: 454s (~7.6 min). Cost: ~$0.012 (estimated).
- **Why STORM underperformed**:
  - STORM generates broad exploratory questions ("ما هو معدل استخدام المياه...") vs internal expansion's targeted queries ("hydroponics soilless culture" — direct keyword match).
  - Broad questions pull in more raw works (86 vs 36) but the works are tangential to the specific learning goal.
  - The federation (crossref/pubmed/europepmc) is keyword-based; broad natural-language questions don't translate well to keyword search.
  - STORM's value is in CONVERSATIONAL research (multi-turn dialogue with expert) — not single-shot keyword queries. Using it as a query generator misuses its strength.
- **Methodology note (transparency)**:
  - STORM Python package (`knowledge-storm`) install failed in sandbox — torch download timed out after 5 min (Live Issue #14, environmentally-qualified deferral per D20.1).
  - Test executed via TypeScript port of STORM's MIT-licensed prompts (GenPersona + AskQuestionWithPersona) — verbatim from `stanford-oval/storm` repo, files `persona_generator.py` + `knowledge_curation.py`.
  - This isolates the single variable per partner instruction: question quality. The prompts are STORM's exact prompts; only the runtime is TypeScript.
  - On production (where torch installs cleanly), the Python package would be used directly. The methodology evaluation is valid either way — same prompts, same GLM, same federation.
- **Per D28 rule (partner-defined)**:
  - B ≤ A, or tie, or surplus <20% ⇒ DROP STORM — **this case (-20%, B worse than A)**
  - ADOPT would have required ≥+20% improvement; not met.
  - DROP is documented, not silent.
- **What this means for BookForge**:
  - STORM is NOT integrated into the pipeline.
  - Internal expansion (`agents/research.ts` pattern: 2-3 queries/chapter) remains the question-generation strategy.
  - ACADEMIC_SWEEP continues to use internal expansion → federation → works.
  - No new sidecar, no Python deps, no maintenance burden.
- **Date**: 2026-09-29
- **Reference**: `scripts/g7-storm-ab.json` + `logs/g7-storm-ab.log` + `src/book-forge/lib/research/storm-questions.ts` (TypeScript port, retained for reproducibility)

---

## D29 — Contested-topic verification (pyramids construction hypotheses)
- **Decision**: contestedClaims path tested on a genuinely disputed topic — **NO contested claims surfaced** (0 detected). This is a measured result, not a failure.
- **Test evidence (`scripts/g7-contested-topic.json` timestamp 2026-09-29T16:07:09Z)**:
  - **Trial book**: "فرضيات بناء الأهرامات المصرية" — 3 chapters covering traditional ramp theory, Houdin's internal ramp theory, and alternative theories (geopolymer concrete, water shaft).
  - **Works**: 15 real works across 3 chapters (5 each)
  - **Evidences**: 26 extracted via GLM (zai mode)
  - **Stance distribution**: supports=17, contradicts=4, qualifies=5, unclear=0
  - **Contested claims detected**: **0** (no claim had both a supports AND a contradicts evidence with the same normalized text)
- **Why zero contested claims** (analysis):
  - The `detectContestedClaims` function groups evidences by normalized `claim` string. For a contested pair to surface, two evidences must share the SAME claim string but have opposing stances.
  - GLM extracted 26 different claim strings (each evidence has a unique claim). The 4 "contradicts" stances were on different claim strings than the 17 "supports" stances — they didn't pair up.
  - This is a limitation of the current detection approach: it requires GLM to extract the SAME claim from different papers with opposing stances. In practice, GLM generates unique claim phrasings per paper.
  - The contested nature of the topic IS visible in the stance distribution (4 contradicts out of 26 = 15% of evidences take a contrary position) — but the current `detectContestedClaims` doesn't aggregate by topic, only by exact claim string.
- **Implications for the system**:
  - The contested-claims feature is structurally sound (the contract, the detection logic, the UI display all work — proven in mock with 1 contested).
  - In live use, contested claims will be RARE unless the detection algorithm is enhanced to group by topic similarity (not exact claim string match).
  - **Future enhancement (deferred to P9-T2 or later)**: enhance `detectContestedClaims` to use embedding-based similarity (≥0.85) instead of exact string match. This would surface the 4 contradicts stances as contested pairs with the 17 supports stances on related claims.
  - For now: the system honestly reports 0 contested when 0 pairs match — this is more honest than fabricating disagreements.
- **Date**: 2026-09-29
- **Reference**: `scripts/g7-contested-topic.json` + `logs/g7-contested-topic.log`

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
