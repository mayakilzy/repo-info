# 📜 BookForge — Legacy Arc Report (v1.0.0)

> **مرسوم الشريك تأ-إرث**: "كل رقم يُستخرج من الملفات — ممنوع أي رقم من الذاكرة. كل ادعاء في README الخارجي يحمل رابط دليله في repo-info."

---

## بطاقة الهوية

| البند | القيمة |
|---|---|
| **الاسم** | BookForge — مصنع الكتب الإلكترونية المؤتمت |
| **الإصدار** | v1.0.0-bookforge-studio |
| **تاريخ الإطلاق** | 2026-09-30 |
| **المستودع الكودي** | mayakilzy/BookForge |
| **مستودع التقارير** | mayakilzy/repo-info |
| **اللغة الأساسية** | العربية (MSA) + English (reference) |
| **الترخيص** | MIT (الكود) + GPL-2.0 (Mishkal sidecar معزول) + Apache-2.0 (Habibi-MSA، مؤجل) |
| **النموذج اللغوي** | GLM-4-plus (zai mode) + z-ai-web-dev-sdk |
| **محرك الصوت** | Piper (ar_JO-kareem-medium, MIT) + sherpa-onnx (Apache-2.0) |
| **محرك الرسوم** | Mermaid (MIT) + Graphviz + cairosvg |
| **قاعدة البيانات** | SQLite (Prisma ORM) |
| **الإطار** | Next.js 16 + TypeScript + Tailwind CSS 4 |

---

## الخط الزمني P0→P16

| المرحلة | التاريخ | المُنجز | المصدر |
|---|---|---|---|
| P0–P7 (v1.0 baseline) | 2026-09-29 | smoke-pipeline-full PASS (EPUB+PDF+DOCX) | P8-FINAL-STATUS.md |
| P8 (Academic Lane) | 2026-09-29 | T1a–T6-live + G7 DROP + G8 DEFER | P8-PHASE-A-FINAL-STATUS.md |
| P9 (Simplification) | 2026-09-29 | Spine + Simplifier + Fidelity Gate + Distortion Ledger + D30 Layer 3 | SESSION-BRIDGE.md |
| P10-T0a (#16 fix) | 2026-09-29 | z.unknown() + normalizeDistortionType() — 73/73 PASS | P10-T0a-CLOSURE.md |
| P10-T0b (G1 Voice) | 2026-09-30 | ADOPT Piper (D33) — RTF 0.10, WER 32.37% Arabic | G1-CLOSURE-STATUS.md |
| P10-T1→T5 (Audio) | 2026-09-30 | TTS worker + Arabic normalizer + Dialogue Planner + FFmpeg + QA loop — 31/31 mock-PASS | P10-FINAL-REPORT.md |
| P10-LIVE (Twin Book) | 2026-09-30 | 4 chapters, 30.29 min audio, m4b, $0.0644, 22.23 min wall | P10-LIVE-COMPLETE-REPORT.md |
| P11 (Visuals) | 2026-09-30 | T0 EN ref (WER 6.99%) + G4 Mermaid (D36) + 3 infographics + concept map + flashcards | P11-FINAL-REPORT.md |
| P12 (Interactive) | 2026-09-30 | D37 (MDX+Tailwind in Next.js) + 4 components + 5 screenshots | P12-FINAL-REPORT.md |
| P13 (Marketing) | 2026-09-30 | G6 MoneyPrinterTurbo MIT (D38) + Launch Kit + Shorts + SFX + G14 half-resolved | live-evidence/p13-*.json |
| P14 (Translations) | 2026-09-30 | Translation PostProcessor + reviewer + Workbook — glossary locked, D30 across languages | P14-FINAL-REPORT.md |
| P15 (Twins + Incremental) | 2026-09-30 | 3 Reader Twins + spine-diff (19%/14.3% efficiency) + تأ-P15 PASS | P15-FINAL-REPORT.md |
| RT (Red Team) | 2026-09-30 | 12 cruelty tests — 9 PASS + 2 FIXED (#19, D39) + 1 FAIL→D40 | live-evidence/RT-MATRIX-v2.json |
| P16 (Conversational) | 2026-09-30 | Reception Agent + Pipeline Messages + Sidebar — 370 LOC, 5 screenshots | P16-FINAL-REPORT.md |

---

## سجل القرارات D1–D40

| القرار | العنوان | المرجع |
|---|---|---|
| D1 | LLM Provider: zai mode (GLM-4-plus) | decisions.md |
| D2 | Temperatures: 0.2 / 0.7 | decisions.md |
| D3 | Context limits: 24K/8K | decisions.md |
| D9/D11/D12 | BM25 / Prisma+SQLite / pandoc+WeasyPrint | decisions.md |
| D14 | Chapter floor: 3 (recommended 10) | decisions.md |
| D19 | paper-search-mcp sidecar (Python) | decisions.md |
| D20 | Provider tiers (5 tiers + 7 providers) | decisions.md |
| D21 | Simplification layer (Twins + Spine + Fidelity) | decisions.md |
| D22 | Evidence model (Prisma, not Json) | decisions.md |
| D23 | Server-side agents | decisions.md |
| D25–D27 | P8-T6 mock/LIVE closures | decisions.md |
| D28 | G7 STORM: DROP (B ≤ A by -20%) | decisions.md |
| D29 | Contested-topic verification (0 contested — measured) | decisions.md |
| D29-closure | G8 Valsci: DEFER v2 (~38h >> 1 day) | decisions.md |
| D30 | Contested-claims roadmap (Layer 1+2+3) | decisions.md |
| D31 | Layer 2 deviation (shared n-grams, not Jaccard) | decisions.md |
| D32 | Arabic numerals/punctuation → TS layer (not Vale) | decisions.md |
| D33 | G1: ADOPT Piper (ar_JO-kareem-medium, MIT, RTF 0.10) | decisions.md |
| D33-addendum | WER 50.91% = whisper Arabic ASR limit, NOT Piper quality | decisions.md |
| D33-english-ref | EN WER 6.99% vs AR 32.37% → -25.38% = Arabic ASR gap confirmed | decisions.md |
| D34 | Mishkal GPL-2.0 isolation in HTTP sidecar | decisions.md |
| D35 | LIVE hybrid: 4 chapters + 20s throttle + resume | decisions.md |
| D36 | G4: ADOPT Mermaid (70% pass rate) | decisions.md |
| D36-addendum | resvg failure = input point measure (node-canvas strips Arabic), not engine | decisions.md |
| D37 | G5: ADOPT fallback (MDX + Tailwind RTL in Next.js) | decisions.md |
| D38 | G6: MoneyPrinterTurbo MIT verified (clean) | decisions.md |
| D38-addendum | G14: half-resolved (licenses ✓, CPU deferred to production) | decisions.md |
| D39 | RT-1: double-approve = 409 Conflict (not 500) | decisions.md |
| D40 | RT-3: outline split into 2 batches when chapterCountHint > 8 | decisions.md |

---

## سجل البوابات G1–G14

| البوابة | الحالة | القرار |
|---|---|---|
| G1 🎙️ TTS | ✅ RESOLVED — ADOPT Piper | D33 |
| G2 ⚖️ TTS License | ✅ RESOLVED — Piper MIT, Habibi Apache-2.0 | D33/D34 |
| G3 🔧 Piper fork | ✅ RESOLVED — no active fork, pin latest release | D33 |
| G4 🖼️ RTL diagrams | ✅ RESOLVED — ADOPT Mermaid (70% pass) | D36 |
| G5 📖 Docs site RTL | ✅ RESOLVED — ADOPT fallback (Next.js MDX+Tailwind) | D37 |
| G6 🎬 Promo video | ✅ RESOLVED — MoneyPrinterTurbo MIT | D38 |
| G7 🌊 STORM | ✅ RESOLVED — DROP (B ≤ A by -20%) | D28 |
| G8 🔍 Valsci | ✅ RESOLVED — DEFER v2 (~38h >> 1 day) | D29-closure |
| G9 📚 pyeuropepmc | ✅ RESOLVED — manual client | decisions.md |
| G10 📚 Provider tiers | ✅ PARTIAL-CLOSE — 2 flaky + 4 working + 2 disabled | decisions.md |
| G11 🧪 Fidelity thresholds | ✅ CLOSED | decisions.md |
| G12 📑 Slides in v1.5 | OPEN — P13 | — |
| G13 🚦 Live Gate | ✅ CLOSED — zai mode → DONE | D1 |
| G14 🎬 shotcraft | ⚠️ HALF-RESOLVED — licenses ✓, CPU deferred | D38-addendum |

---

## سجل المشاكل الحية #1–#18

| # | المشكلة | الإصلاح | المصدر |
|---|---|---|---|
| #1–#9 | أشكال GLM المختلفة (fences, shapes, arrays, enums, truncation, rate-limit, running-summary, enum-adjacent, JSON truncation) | Layer 24 rules #1–#9 | LIVE-ISSUES-LAYER24.md |
| #10 | GLM يرجع `{chapters:[...]}` مباشرة | normalizeOutlineShape موسَّع | LIVE-ISSUES-LAYER24.md |
| #11 | CI gate `rg -E` → `--encoding` | `rg -i -e` + تنظيف | LIVE-ISSUES-LAYER24.md |
| #12 | commit 0-byte files | إعادة كتابة + rule #10 | LIVE-ISSUES-LAYER24.md |
| #13 | GLM evidence fields undefined | Layer 24 #9 (few-shot schema hint) | LIVE-ISSUES-LAYER24.md |
| #14 | STORM torch install timeout | TypeScript port (environmentally-qualified) | LIVE-ISSUES-LAYER24.md |
| #15 | GLM Arabic question mark "؟" | bilingual punctuation refine | LIVE-ISSUES-LAYER24.md |
| #16 | GLM distortionType non-canonical | z.unknown() + normalizeDistortionType() — 73/73 PASS | P10-T0a-CLOSURE.md |
| #17 | zai-sdk missing max_tokens | adapter passes max_tokens+temperature → outline 44s | LIVE-ISSUES-LAYER24.md |
| #18 | z-ai-web-dev-sdk rate limit (429) | 20s throttle (D35) — 0 hits during resume | LIVE-ISSUES-LAYER24.md |
| #19 | pandoc accepts broken input | sanitizeManuscript() + validateOutput() (magic bytes) | RT-MATRIX-v2.json |

---

## المغلف الكلي

| المقياس | القيمة | المصدر |
|---|---|---|
| زمن الحائط (brief → m4b) | 22.23 min | p10-live-complete.json |
| كلفة الكتاب الكاملة | $0.0644 (51 GLM calls) | p10-live-complete.json |
| كلفة/دقيقة صوت | $0.0021/min | p10-live-complete.json |
| مدة الصوت النهائي | 30.29 min (4 chapters) | p10-live-complete.json |
| RTF (Piper) | 0.113 (9× faster than realtime) | g1-matrix-piper.json |
| WER العربي (mean) | 32.37% | p10-live-complete.json |
| WER الإنجليزي | 6.99% | english-reference-report.json |
| الفارق (Arabic ASR gap) | -25.38% | D33-english-reference |
| LUFS (m4b) | -19.10 (target -19) | p10-live-complete.json |
| spine-diff efficiency | 19% / 14.3% (mod 1 / mod 2) | p15-spine-diff-proof.json |
| Reader Twin objections | 3/3 (real feedback) | p15-spine-diff-proof.json |
| RT Gauntlet | 9 PASS + 2 FIXED + 1 FAIL→D40 | RT-MATRIX-v2.json |
| FP-zero (تسويق) | 5/5 posts passed D30 | p13-launch-kit.json |
| type-clean | 0 tsc errors | tsc --noEmit |

---

## كتالوج المنتجات

| المنتج | الصيغة | المصدر |
|---|---|---|
| نص كامل | EPUB + PDF + DOCX + manuscript.md | books/book-gdjk1nch/ |
| كتاب صوتي | m4b (30:17, 4 chapters, AAC 22050Hz) | live-measurements/audio/ |
| بودكاست | per-chapter WAVs + segments | live-measurements/audio/ |
| إنفوغرافيك | 3 PNG (cost, growth, pH) — every number has sourceId | live-measurements/infographics/ |
| خريطة مفاهيم | PNG (12 concepts, 23 edges) | live-measurements/concept-map/ |
| بطاقات تعليمية | .apkg (8 cards, RTL, FSRS) + CSV | live-measurements/flashcards/ |
| ترجمة | AR→EN (glossary locked, D30 across languages) | live-measurements/translation/ |
| Workbook | PDF (5 questions) + CSV | live-measurements/workbook/ |
| واجهة قراءة | Interactive MDX page (DualRegister + GroundedTooltip + Quiz + EPUBViewer) | src/app/book-forge/interactive/ |
| القشرة الحوارية | Studio page (ReceptionAgent + PipelineMessages + Sidebar) | src/app/book-forge/studio/ |
| Shorts | 4 Arabic + 1 English (scripts with sourceIds) | live-evidence/p13-shorts.json |
| Launch Kit | KDP description + keywords + 5 social posts | live-evidence/p13-launch-kit.json |

---

## ما لم يتحقق بصدق (Habibi-GPU، embeddings-L4، Remotion-CPU، المزامنة، >8 فصول، التزامن الحي)

| البند | الحالة | السبب |
|---|---|---|
| Habibi-MSA on GPU | مؤجل لـ v2 | RTF 188×-469× على CPU — F5-TTS architecture requires GPU |
| Embeddings Layer 4 (semantic contested-claims) | مؤجل لـ v2 | paraphrase-multilingual-MiniLM — لم يُثبّت بعد |
| Remotion CPU measurement (G14) | نصف-محسومة | licenses ✓, CPU قياس مؤجل لخادم الإنتاج |
| المزامنة الكلمية (word-level subtitle sync) | تقريبية مُعلنة | تقسيم زمني متساوٍ موثق (D35 hint) — المزامنة الدقيقة باب تحسين لاحق |
| الكتاب >8 فصول | D40 موثق | outline truncation at 14 chapters — split into 2 batches when >8 |
| التزامن الحي في الإنتاج | بيئي-مؤهل | SQLite lock under real concurrency — RT-2 environmentally-qualified |

---

## الأبواب المفتوحة (Book DNA، Multi-Edition، Market-First، SaaS، قناة §24)

| الباب | الوصف |
|---|---|
| Book DNA | مسرد المصطلحات كقاموس اتساق عبر الكتب — يُفعّل في P16 ReceptionAgent (Book DNA reuse suggestion) |
| Multi-Edition | نفس الكتاب بجمهور مختلف (lay/informed/professional) — البنية في DualFormClaim تدعمها |
| Market-First | KDP description + keywords + social posts جاهزة (P13-T1) — النشر الفعلي بأمر المالك |
| SaaS | القشرة الحوارية (P16) = واجهة SaaS — تحتاج استضافة + مصادقة مستخدم |
| قناة §24 | طبقة ضبط مخرجات النموذج — 11 قاعدة مُطبَّقة، قابلة للتوسعة لأي شكل GLM جديد |
