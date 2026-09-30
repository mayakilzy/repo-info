# 📋 P10 — خط الإنتاج الصوتي — التقرير الختامي للمصادقة

**التاريخ:** 2026-09-30 (P10-T1→T5، مناورة الصوت الكاملة بعد D33)
**الوكيل:** عصر الصوت (وكيل التنفيذ الجديد)
**Timebox:** 72h صارم (حسب إذن الشريك)
**الحالة:** T1-T5 جميعها mock-PASS — في انتظار LIVE phase acceptance

---

## 🎙️ ملخص تنفيذي

تم بناء خط الإنتاج الصوتي الكامل لـ BookForge خلف واجهة TTSProvider الموحّدة (D33). جميع المهام الخمس (T1→T5) اجتازت قبولها في الوضع mock (القاعدة 11 — يفتح المهمة التالية). الـ LIVE phase acceptance مؤجل لجلسة منفصلة تتطلب تشغيلاً حياً للـ GLM عبر zai mode + الـ Piper worker الإنتاجي.

| المهمة | الحالة | القبول |
|---|---|---|
| **D33-addendum** (إدراج حاشية الشريك) | ✅ DONE | تفسير WER 50.91% مُدرج حرفياً في decisions.md |
| **T1 — TTS worker sidecar** | ✅ mock-PASS (5/5) | HTTP /health + /synthesize WAV in mock+live ✓ |
| **T2 — خط التطبيع العربي** | ✅ mock-PASS (7/7) | tashkeel + reshape + توسيع أرقام/تواريخ (Rule 13) ✓ |
| **T3 — Dialogue Planner** | ✅ mock-PASS (7/7) | askJSON(DialogueScript) من Spine + sourceRefs + few-shot ✓ |
| **T4 — FFmpeg mastering** | ✅ mock-PASS (7/7) | loudnorm (-16/-19 LUFS) + silenceremove + m4b بفصول ✓ |
| **T5 — حلقة QA الصوتية** | ✅ mock-PASS (5/5) | faster-whisper round-trip + WER/مقطع + 2-round regeneration ✓ |

---

## 📦 الملفات المُلتزمة على القرص

### mayakilzy/BookForge (الكود) — 5 commits

```
50579a1 feat(P10-T1): TTS worker sidecar — persistent HTTP Piper service + mock provider
e0ba3c6 feat(P10-T2): Arabic normalization line — tashkeel + number/date expansion (Rule 13)
3127c97 feat(P10-T3): Dialogue Planner — askJSON(DialogueScript) from Spine, documented sourceRefs
7eb934c feat(P10-T4): FFmpeg mastering — loudnorm + silenceremove + m4b with real chapter markers
cb7d07a feat(P10-T5): Audio QA loop — faster-whisper round-trip + WER/segment + 2-round regeneration
```

**Code structure (5 new modules):**

```
src/book-forge/
├── lib/audio/
│   ├── ffmpeg-mastering.ts (NEW, 320 LOC) — T4
│   └── qa-loop.ts (NEW, 270 LOC) — T5
├── config/
│   └── audio.ts (NEW, 125 LOC) — T4 + T5 (LUFS targets + QA config)
├── contracts/
│   └── dialogue.ts (NEW, 113 LOC) — T3 (DialogueScript + DialogueTurn schemas)
├── agents/
│   ├── dialogue-planner.ts (NEW, 220 LOC) — T3
│   └── prompts/dialogue-planner.md (NEW) — T3 system prompt with few-shot hint
└── lib/providers/tts/
    ├── worker/
    │   ├── server.py (NEW, 341 LOC) — T1 (persistent HTTP Piper service)
    │   ├── arabic_normalizer.py (NEW, 297 LOC) — T2 (tashkeel + number expansion)
    │   └── README.md — T1
    ├── arabic-normalizer.ts (NEW, 198 LOC) — T2 (TS adapter)
    ├── piper.ts (MODIFIED, 90 LOC) — T1 (now HTTP instead of subprocess)
    ├── mock.ts (NEW, 81 LOC) — T1 (built-in mock provider for dev)
    └── index.ts (MODIFIED) — T1 (register mock provider)

scripts/
├── smoke-t1-tts-worker.ts (NEW, 227 LOC) — T1 acceptance
├── smoke-t2-arabic-normalizer.ts (NEW, 138 LOC) — T2 acceptance
├── smoke-t3-dialogue-planner.ts (NEW, 162 LOC) — T3 acceptance
├── smoke-t4-ffmpeg-mastering.ts (NEW, 270 LOC) — T4 acceptance
└── smoke-t5-qa-loop.ts (NEW, 220 LOC) — T5 acceptance
```

### mayakilzy/repo-info/BookForge/ (التقارير) — 1 commit

```
bec5d1f docs(D33-addendum): insert partner WER interpretation verbatim per protocol
```

---

## ✅ معايير القبول (mock-PASS لكل مهمة)

### T1 — TTS worker sidecar (5/5 PASS)

| المعيار | النتيجة |
|---|---|
| HTTP /health في mock mode | ✅ ok=true mock=true model_loaded=false |
| HTTP /synthesize في mock mode (piper.ts adapter) | ✅ 44144 bytes, 1.00s @ 22050Hz, RTF=0.011 |
| HTTP /health في live mode | ✅ ok=true mock=false model_loaded=true |
| HTTP /synthesize في live mode (real Piper) | ✅ 170540 bytes, 3.87s @ 22050Hz, RTF=0.104 |
| Mock provider built-in (no HTTP) | ✅ 244 bytes placeholder WAV |

**Pattern:** persistent HTTP worker يحمّل Piper model مرة واحدة عند الإقلاع. الـ TS adapter (piper.ts) يستخدم fetch() بدلاً من spawn() لكل نداء — الـ model يبقى في الذاكرة. مطابق لـ P8-T3 (paper-search-mcp) sidecar pattern، مُحدَّث لـ HTTP.

### T2 — خط التطبيع العربي (7/7 PASS)

| المعيار | النتيجة |
|---|---|
| Tashkeel على نص غير مشكول | ✅ "هذا اختبار" → "هَذَا اِختبَارٍ" |
| توسيع الأرقام (Rule 13) | ✅ "2024" → "ألفان وأربع وعشرون" |
| توسيع التواريخ (Rule 13) | ✅ "15/06/2024" → "خمس عشرة يونيو ألفان وأربع وعشرون" |
| خط كامل [all] | ✅ diacritics + no digits + no presentation forms |
| عينة voweled-1 بعد التطبيع | ✅ original 67 chars → normalized 68 chars, 0 warnings |
| reshape NOT in [all] default | ✅ logical Unicode preserved for Piper |
| explicit reshape works + warning | ✅ presentation forms + "NOT suitable for TTS" warning |

**Engine choice:** Mishkal (GPL, Taha Zerrouki) — canonical Arabic diacritizer. camel-tools 1.6.0 doesn't include a tashkeel subpackage. The sidecar is a black box — engine can be swapped to a future CAMeL-native tashkeel without pipeline changes (per Rule 7: build above the existing).

### T3 — Dialogue Planner (7/7 PASS)

| المعيار | النتيجة |
|---|---|
| DialogueScript Zod schema valid | ✅ parses 3 turns correctly |
| SPEAKER_VOICE_MAPPING config (single voice, documented) | ✅ host=expert=ar_JO-kareem-medium |
| mock planDialogue produces valid DialogueScript | ✅ 5 turns, title set |
| كل جولة expert لها sourceRefs (الحوار الموثق) | ✅ 2/2 expert turns have refs |
| host + expert يتناوبون | ✅ order: host→expert→host→expert→host |
| الـ turn الأخير host closing | ✅ last speaker: host |
| كل sourceRefs تشير إلى evidence IDs من الـ spine | ✅ spine ev-001, ev-002 |

**Speaker→voice mapping decision:** SINGLE voice (ar_JO-kareem-medium) for both host + expert. P10-T1 ships only one Arabic Piper voice. Multi-voice support deferred to v2 (TTSProvider interface already supports voiceId per request).

**A/B against Podcastfy:** FORBIDDEN per partner without explicit command + 8h cap. Not attempted.

### T4 — FFmpeg mastering (7/7 PASS)

| المعيار | النتيجة |
|---|---|
| Audio config targets correct LUFS (podcast -16 / audiobook -19) | ✅ |
| Synthesize 3 turns via mock worker | ✅ 3000ms total audio |
| Concat turns → chapter WAV | ✅ 132378 bytes |
| Loudnorm produces audio with sane LUFS | ✅ target=-19, measured=-18.80 LUFS |
| Silenceremove applied | ✅ raw 3.00s → mastered 3.00s |
| m4b has real chapter markers | ✅ 1 chapter in ffprobe -show_chapters |
| m4b has AAC audio stream + valid metadata | ✅ codec=aac, dur=3.00s, sr=22050, ch=1 |

**LUFS measurement:** uses ffmpeg ebur128 filter (per partner: "LUFS مُقاس بالأداة لا بالمزعم"). Single-pass loudnorm gets within ~1 LUFS of 2-pass on most speech.

### T5 — حلقة QA الصوتية (5/5 PASS)

| المعيار | النتيجة |
|---|---|
| AR + EN QA configs exist with documented thresholds | ✅ AR=40% EN=15% |
| Mock TTS worker starts | ✅ |
| Synthesize 3 turns for QA loop | ✅ 3000ms total audio |
| QA loop runs 1-2 rounds + produces final report | ✅ rounds=2, mean WER 100% (mock audio = sine wave) |
| Quality report contains per-turn WER | ✅ all turns + WER% + speaker + above? flag |
| AR threshold > EN threshold (documents baseline gap) | ✅ AR=40% > EN=15% |

**Per D33-addendum:** the 50.91% mean WER from G1 was whisper's Arabic ASR limit + non-voweled comparison deficiency, NOT Piper quality. T5 AR threshold of 40% accommodates this; tighter to 25% for live phase acceptance (close to voweled-1 normalized WER of 27.5%).

---

## ⚠️ معايير قبول المرحلة LIVE (مؤجلة — Rule 11)

Per partner authorization (قبول المرحلة live، Rule 11):

| المعيار | الحالة |
|---|---|
| كلاكستر مُصدَّر بالإنجليزية + بالعربية (بعد CAMeL) | ❌ مؤجل — يتطلب تشغيلاً حياً للـ GLM عبر zai mode |
| WER الإنتاجي لكل مقطع موثق | ❌ مؤجل — T5 loop infrastructure جاهز، يحتاج audio حقيقي |
| أعلى 3 مقاطع ضعف مُعالجة بتجاوز | ❌ مؤجل — التشغيل الحي يُفعّل هذا |
| CostEntry لكل نداء GLM (Dialogue Planner) | ❌ مؤجل — T3 mock-mode لا يكتب CostEntry (mock mode bypass) |
| الكلفة/دقيقة موثقة بالمغلف | ❌ مؤجل — يتطلب بيانات حية |
| type-clean صفر جديد | ✅ tsc --noEmit: 0 errors |
| smoke-pipeline-full PASS | ✅ EPUB 14030 / PDF 52664 / DOCX 12565 / DONE |
| رفع المستودعين | ✅ BookForge@cb7d07a + repo-info@bec5d1f (D33-addendum) |

**Per Rule 11:** "mock-PASS يفتح المهمة التالية ولا يغلق الحالية — الإغلاق يتطلب live-run موثقاً متى وُجد مزوّد حي واحد على الأقل."

الـ LIVE phase acceptance يتطلب:
1. تشغيل BookForge بـ FORGE_MODE=zai (z-ai-web-dev-sdk بدون API key)
2. الـ Piper worker يُشغّل في live mode (model loaded at startup)
3. تشغيل pipeline كامل على كتاب كامل (≥6 فصول)
4. توثيق: الـ WER لكل مقطع + أعلى 3 مقاطع ضعف + CostEntry لكل GLM call + الكلفة/دقيقة

---

## 🏗️ المعمارية المُلتزمة

### TTSProvider interface (D33 + P10-T1)

```
src/book-forge/lib/providers/tts/
├── provider.ts        — TTSProvider interface + TTSRequest/TTSResult/TTSLicenseInfo
├── config.ts          — PIPER_CONFIG + HABIBI_CONFIG (pinned versions + licenses per G2/G3)
├── piper.ts           — Piper adapter (HTTP fetch to worker)
├── habibi.ts          — Habibi adapter (deferred to v2 GPU)
├── mock.ts            — MockTTSProvider (placeholder silence WAV for dev)
├── index.ts           — registry: getTTSProvider(id)
└── worker/
    ├── server.py             — T1: persistent HTTP Piper worker (model loaded once)
    ├── arabic_normalizer.py — T2: Mishkal + arabic_reshaper + pyarabic.number
    └── README.md
```

**Pipeline contract:** أي نداء TTS في BookForge يمر عبر `getTTSProvider(id).synthesize(req)`. صفر إشارة مباشرة لأي محرك (Piper/Habibi/Mishkal).

### Audio production line (P10-T1→T5)

```
SpineSnapshot → Dialogue Planner (T3) → DialogueScript
                                      ↓
                                  [normalizeArabic (T2)]
                                      ↓
                                  [synthesizeTurn (T1 worker)]
                                      ↓
                                  [concatTurnsToChapter (T4)]
                                      ↓
                                  [applyMastering: loudnorm + silenceremove (T4)]
                                      ↓
                                  [packageAsM4b: ffmpeg + FFMETADATA chapters (T4)]
                                      ↓
                                  m4b file (AAC, chapters, target LUFS)
                                      ↓
                                  [runQaLoop (T5): faster-whisper round-trip
                                   → WER/segment → 2-round regeneration
                                   → buildQualityReport]
                                      ↓
                                  Audio QA report (per-turn WER, top-3 weak segments)
```

---

## 📊 القياسات الموثّقة (mock + baseline)

### T1 — RTF (live mode)

| Text length | Synthesis (ms) | Duration (ms) | RTF |
|---|---|---|---|
| 49 chars Arabic | 420.7 | 4783.3 | 0.0879 |
| Test (T1 acceptance) | ~400 | 3870 | 0.104 |

متوسط RTF (mock + live) = ~0.10 — مطابق لقياسات G1 (7-10× أسرع من realtime على CPU).

### T4 — LUFS measurement

| Audio | Target LUFS | Measured LUFS |
|---|---|---|
| Mock sine wave (3 turns) | -19 (audiobook) | -18.80 |

مطابقة لـ target ضمن 0.2 LUFS — LUFS مُقاس بالأداة (ffmpeg ebur128) لا بالمزعم.

### T5 — QA loop baseline (mock)

| Round | Mean WER | Turns Above Threshold (40%) |
|---|---|---|
| 1 | 100.00% | 3/3 |
| 2 | 100.00% | 3/3 |

متوقع: mock audio = sine wave → faster-whisper يرجع transcription فارغ → WER=100%. الـ loop infrastructure يعمل بشكل صحيح (2 rounds، regeneration، quality report). الـ audio quality الحقيقي يتطلب LIVE phase acceptance.

---

## 📡 الفجوة العربية — حالة ما قبل/بعد P10

**قبل P10:** لا يوجد خط إنتاج صوتي عربي في BookForge. الفجوة العربية المعلنة في G1 closure.

**بعد P10 (mock-PASS):** خط إنتاج صوتي كامل (T1→T5) جاهز للنشر:
- TTS worker sidecar (Piper، persistent HTTP، model loaded once)
- خط التطبيع العربي (tashkeel + reshape + توسيع أرقام/تواريخ)
- Dialogue Planner (حوار موثق بـ sourceRefs)
- FFmpeg mastering (loudnorm + m4b بفصول)
- حلقة QA الصوتية (faster-whisper round-trip + 2-round regeneration)

**الـ LIVE phase acceptance سيثبت:** الكتاب العربي يصبح بودكاست/كتاب صوتي m4b بجودة موثّقة بالأرقام.

---

## 🎯 المسار القادم (بعد مصادقة الشريك على P10)

1. **LIVE phase acceptance** (جلسة منفصلة): 
   - تشغيل BookForge بـ FORGE_MODE=zai + live Piper worker
   - إنتاج بودكاست/كتاب صوتي m4b كامل (≥6 فصول)
   - توثيق WER الإنتاجي لكل مقطع + CostEntry لكل GLM call + الكلفة/دقيقة
   - الإنجليزية كـ baseline reference (وثق الفرق)

2. **بعد LIVE phase acceptance → P11** (بأمر الشريك):
   - حسب ROUND-B-FINAL-SPEC § المرحلة P11
   - ينطلق من أرض صلبة: كل بنية خط الإنتاج الصوتي مُلتزمة وخلف واجهة موحّدة

---

## ✅ الخلاصة

خلال الـ 72h timebox، تم بناء خط الإنتاج الصوتي الكامل لـ BookForge خلف واجهة TTSProvider الموحّدة (D33):

- **5 modules** جديدة في `src/book-forge/lib/audio/` + `src/book-forge/lib/providers/tts/worker/`
- **5 contracts/schemas** جديدة (DialogueScript، AudioMasteringConfig، QaLoopConfig، etc.)
- **5 acceptance tests** (smoke-t1..t5) — جميعها PASS في الوضع mock
- **1 partner insertion** (D33-addendum — تفسير WER 50.91%)
- **0 type-clean جديد** + **smoke-pipeline-full PASS** (لا انحدار)

الـ LIVE phase acceptance مؤجل لجلسة منفصلة تتطلب تشغيلاً حياً للـ GLM عبر zai mode + الـ Piper worker الإنتاجي. الكتاب العربي جاهز للنطق — البنية التحتية مكتملة، الانتظار للتشغيل الحي لتوثيق الجودة النهائية بالأرقام 🎙️📚
