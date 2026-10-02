# Voxa Studio — Architecture Specification
## Build-Ready Engineering Baseline

**Canonical project name:** Voxa Studio  
**Working expansion:** Knowledge, Narrative & Voice Studio  
**Document role:** Authoritative engineering contract  
**Target implementation:** Local-first desktop application  
**Primary platform:** Windows 10/11 x64  
**Architecture status:** FROZEN BASELINE for initial implementation  
**Implementation authority:** This specification overrides implementation convenience. Any deviation requires an explicit ADR and a demonstrated defect/contradiction in this specification.

---

# 0. Canonical Product Definition

Voxa Studio is a local-first knowledge-to-narrative application.

It accepts heterogeneous source material — documents, books, software-project specifications, notes, and recorded speech — and converts that material into a persistent, traceable Knowledge Model. The user can then generate multiple independent outputs from the same understanding without re-analyzing the source from scratch.

Canonical product principle:

> **Many Sources → One Understanding → Many Stories → Many Formats → Many Languages → Many Performances**

The application is not merely:
- a TTS frontend;
- an audiobook generator;
- a transcription utility;
- a summarizer;
- a book writer;
- a project documentation generator.

It is a compact local application that combines:

1. **Knowledge Intelligence** — ingest, normalize, understand, structure, trace, update.
2. **Narrative Intelligence** — select, organize, adapt, write, rewrite, localize.
3. **Speech Intelligence** — speech-to-text, VAD, optional diarization, timestamps.
4. **Voice Intelligence** — narration direction, TTS, voice profiles, audio assembly.
5. **Output Production** — audio, written documents, booklets, structured exports.

The application must remain compact. It MUST NOT evolve into a distributed agent platform.

---

# 1. Non-Negotiable Architectural Principles

## 1.1 Local-first
All project state, source files, transcripts, generated scripts, audio chunks, manifests, caches, and exports are stored locally by default.

Cloud AI providers may be used only through explicit provider adapters selected/configured by the user.

## 1.2 One application, not a distributed system
Initial architecture MUST use:
- one desktop application;
- one local SQLite database;
- local filesystem storage;
- in-process application services;
- controlled subprocesses only where external engines require them.

Initial architecture MUST NOT require:
- microservices;
- Kubernetes;
- Docker orchestration;
- Redis;
- Celery;
- NATS/Kafka/RabbitMQ;
- distributed databases;
- service discovery;
- A2A;
- agent swarms;
- vector database;
- cloud accounts;
- SaaS billing;
- multi-tenant infrastructure.

## 1.3 Understand once, branch later
A source is ingested and converted into a reusable Knowledge Model once.

Outputs branch from the Knowledge Model:

```text
Sources
  ↓
Canonical Source Records
  ↓
Knowledge Model
  ├── Recipe A → Narrative A → Audio A
  ├── Recipe B → Narrative B → Document B
  ├── Recipe C → Narrative C → Audio C
  └── Recipe D → Narrative D → Booklet D
```

Repeated outputs MUST NOT require full source re-analysis unless:
- source content changed;
- extraction version changed;
- knowledge schema changed;
- user explicitly requests rebuild.

## 1.4 Evidence before prose
Generated factual claims must be traceable to source evidence whenever the selected recipe requires factual/source-locked writing.

The system must distinguish:
- SOURCE_FACT;
- USER_NOTE;
- USER_CORRECTION;
- MODEL_INFERENCE;
- CREATIVE_ADDITION.

## 1.5 Voice Profile ≠ Voice Direction
These are separate concepts.

**Voice Profile** answers: who/what voice speaks?
- engine;
- model;
- voice;
- language;
- cloning reference;
- default speed;
- supported controls.

**Voice Direction** answers: how should this segment be performed?
- tone;
- pace;
- energy;
- emotion;
- emphasis;
- pauses;
- pronunciation hints;
- whispering/softness where supported;
- audience/performance intent.

The Narration Director creates semantic performance instructions. Engine adapters translate only supported directions into engine-specific controls.

## 1.6 Capability-driven UI
The UI MUST NOT expose controls that an active engine cannot implement.

Each engine/model has a Capability Manifest. The sidebar derives controls from:
- current task;
- selected output recipe;
- selected engine/model;
- engine/model capability manifest.

Unsupported controls are hidden or explicitly marked unavailable. They are never silently ignored.

## 1.7 Incremental regeneration
When a user adds a note, correction, memory, source, or changed setting:
- determine affected Knowledge Nodes;
- determine affected Outputs;
- invalidate only affected derived artifacts;
- regenerate only affected text/audio segments where possible.

Do not regenerate an entire audiobook because one paragraph changed.

## 1.8 Preserve originals
Original uploaded files and original recordings are immutable application evidence.

Derived artifacts may be replaced by versioned successors, but original source evidence is never silently overwritten.

## 1.9 No silent invention
In strict modes, absence of evidence must remain absence of evidence.

When confidence is insufficient, the application should:
- mark uncertainty;
- request clarification;
- create a knowledge gap;
- preserve conflicting memories.

It MUST NOT fabricate missing facts.

## 1.10 Every phase must produce a working application
No phase may create a large speculative framework without executable user value and tests.

---

# 2. Primary Use Cases

## 2.1 Book → Audiobook
Input:
- TXT;
- Markdown;
- DOCX;
- text PDF;
- later scanned PDF via optional OCR adapter.

Outputs:
- full audiobook;
- chapter audio;
- selected sections;
- MP3/WAV/M4B;
- metadata and chapters.

## 2.2 Book → Intelligent Narrative
Possible recipes:
- general summary;
- quick understanding;
- key ideas;
- facts;
- practical lessons;
- academic explanation;
- historical perspective;
- human stories;
- explain-it-to-me;
- original + explanation + key points.

The pipeline is:

```text
BOOK
→ UNDERSTANDING
→ CONTENT MAP
→ SELECT
→ ORGANIZE
→ WRITE TARGET NARRATIVE
→ OPTIONAL LOCALIZATION
→ OPTIONAL VOICE DIRECTION
→ OPTIONAL TTS
```

Never implement:
`chunk → summarize independently → concatenate`.

## 2.3 Software Project → Multi-Audience Presentation
A project specification such as AgentForge can generate multiple independent narratives from one understanding:
- general audience;
- technical audience;
- company/executive audience;
- portfolio showcase;
- product introduction;
- startup/pitch style;
- demo narration;
- custom audience.

## 2.4 Software Project → Product Booklet
Generate a structured written booklet with configurable:
- audience;
- tone;
- language;
- depth;
- target length;
- selected sections.

Candidate sections:
- introduction;
- problem;
- product idea;
- importance;
- target users;
- how it works;
- key features;
- getting started;
- use cases;
- examples;
- differentiators;
- architecture overview;
- future development;
- vision;
- FAQ.

The booklet is generated directly from the Knowledge Model, not by expanding an audio script.

## 2.5 Spoken Memories → Living Memoir
User records memories naturally, including dialectal Arabic.

Pipeline:

```text
Recording
→ VAD / segmentation
→ STT
→ transcript cleanup
→ memory extraction
→ people / places / events / dates
→ evidence-linked Knowledge Model
→ timeline / gaps / conflicts
→ chapter planning
→ memoir writing
→ optional TTS review
```

The user does not need to speak formal Arabic.

## 2.6 Contextual Voice Annotation
While listening to generated memoir/project audio, the user can:
- pause;
- record “Add Memory”;
- record “Correct”;
- mark important.

The annotation stores:
- parent project;
- playback output;
- playback timestamp;
- nearest narrative segment;
- original recording;
- transcript;
- semantic intent;
- evidence links.

The system proposes where the new information belongs and requests confirmation before factual merge when needed.

## 2.7 Living Project Knowledge
A developer may add a voice note after a project booklet/presentation exists.

Example:
“Add Developer Note” → STT → Knowledge Model update → impact analysis → list affected outputs → selective regeneration.

---

# 3. Explicitly Deferred Features

The architecture must allow future addition, but initial build MUST NOT fully implement:

- AI Interviewer;
- Story Gap guided interview dialogue;
- Author DNA automatic style learning;
- Audience Simulator;
- Documentary multi-voice production;
- ambient sound generation;
- photo/video storytelling;
- Ask-the-Source conversational UI;
- semantic vector search;
- cloud synchronization;
- collaboration;
- mobile app;
- web SaaS;
- automatic social-media publishing;
- full OCR workflow;
- autonomous agent system.

Data structures may reserve extension points. Do not build speculative subsystems.

---

# 4. Technology Baseline

## 4.1 Language
Python 3.12+.

## 4.2 Desktop UI
PySide6 / Qt.

Rationale:
- single-language application stack;
- native desktop file/audio interaction;
- no local web server required;
- fewer moving pieces than Electron + backend;
- suitable for Windows;
- supports dynamic sidebar controls.

## 4.3 Persistence
SQLite using SQLAlchemy 2.x.

SQLite requirements:
- WAL mode;
- foreign keys enabled;
- explicit transactions;
- schema migrations using Alembic;
- no ORM auto-create in production startup after migration framework exists.

## 4.4 Data validation
Pydantic v2 for:
- configuration;
- adapter contracts;
- capability manifests;
- recipe schemas;
- structured AI responses;
- job payloads.

## 4.5 Audio processing
FFmpeg/ffprobe as external runtime dependency behind `AudioProcessor`.

Do not scatter direct FFmpeg calls across the codebase.

## 4.6 Speech-to-text baseline
Primary adapter:
- `faster-whisper`.

Optional/future adapters:
- whisper.cpp;
- sherpa-onnx ASR.

Required abstraction:
`STTEngine`.

## 4.7 TTS baseline
The core must not depend on a single engine.

Initial adapters should prioritize:
1. SILMA Arabic TTS v1 for Arabic/English experimentation where environment supports it.
2. Piper-compatible local TTS for lightweight/CPU fallback where suitable models are installed.
3. A generic external-command adapter for controlled integration testing.

Optional/future:
- F5-TTS;
- Fish Speech;
- Kokoro;
- sherpa-onnx TTS;
- other local engines.

Model licenses MUST be tracked separately from engine-code licenses.

## 4.8 VAD / speech utilities
Preferred capability sources:
- faster-whisper integrated VAD where sufficient;
- sherpa-onnx / Silero VAD where dedicated VAD is needed.

Speaker diarization is optional and adapter-based.

## 4.9 Document parsing
Use direct deterministic parsers:
- `.txt`: Python text I/O;
- `.md`: text/Markdown parser;
- `.docx`: python-docx;
- `.pdf`: pypdf for text PDFs.

OCR is an optional adapter and not a hard dependency for first stable release.

## 4.10 LLM provider
Define `LLMProvider`.

Required baseline providers:
- OpenAI-compatible HTTP provider;
- optional local Ollama-compatible provider if installed.

The application core MUST NOT import a vendor SDK outside the provider adapter package.

All AI transformations requiring structured output must validate against Pydantic schemas.

## 4.11 Packaging
Use a reproducible Python environment and Windows packaging plan.

Preferred:
- `pyproject.toml`;
- uv or pip-compatible lock strategy;
- PyInstaller for Windows executable/distribution after functional baseline.

Packaging comes after core functionality and tests.

---

# 5. Repository Structure

The repository MUST remain compact.

Canonical target:

```text
voxa-studio/
├── README.md
├── pyproject.toml
├── alembic.ini
├── LICENSE
├── .gitignore
├── docs/
│   ├── architecture/
│   ├── adr/
│   └── testing/
├── src/voxa/
│   ├── __init__.py
│   ├── app.py
│   ├── config.py
│   ├── domain/
│   │   ├── models.py
│   │   ├── enums.py
│   │   ├── recipes.py
│   │   └── capabilities.py
│   ├── persistence/
│   │   ├── db.py
│   │   ├── orm.py
│   │   ├── repositories.py
│   │   └── migrations/
│   ├── ingest/
│   │   ├── documents.py
│   │   ├── audio.py
│   │   └── normalization.py
│   ├── knowledge/
│   │   ├── builder.py
│   │   ├── evidence.py
│   │   ├── conflicts.py
│   │   ├── impact.py
│   │   └── schemas.py
│   ├── narrative/
│   │   ├── planner.py
│   │   ├── writer.py
│   │   ├── localization.py
│   │   ├── director.py
│   │   └── prompts.py
│   ├── speech/
│   │   ├── stt.py
│   │   ├── tts.py
│   │   ├── vad.py
│   │   ├── manifests.py
│   │   └── adapters/
│   ├── audio/
│   │   ├── processor.py
│   │   ├── segmentation.py
│   │   └── assembly.py
│   ├── outputs/
│   │   ├── audio.py
│   │   ├── documents.py
│   │   └── metadata.py
│   ├── jobs/
│   │   ├── manager.py
│   │   ├── state.py
│   │   └── cache.py
│   ├── providers/
│   │   └── llm/
│   └── ui/
│       ├── main_window.py
│       ├── sidebar.py
│       ├── project_view.py
│       ├── player.py
│       └── dialogs.py
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── fixtures/
│   └── acceptance/
└── scripts/
    ├── dev_run.py
    └── verify_environment.py
```

This is a logical ceiling, not an invitation to create empty files.

Rules:
- Do not create one file per tiny class.
- Do not create directories containing one trivial file unless a real boundary requires it.
- Do not generate placeholder modules for deferred features.
- Prefer cohesive modules of meaningful size.
- New abstractions require at least two real consumers or a clear external-engine boundary.

---

# 6. Canonical Domain Model

## 6.1 Project
A persistent workspace representing one book, memoir, software project, or other source collection.

Fields:
- id;
- title;
- project_type;
- description;
- default_language;
- created_at;
- updated_at;
- knowledge_version;
- status.

`project_type` is a hint, not a separate architecture.

Allowed initial values:
- BOOK;
- SOFTWARE_PROJECT;
- MEMOIR;
- GENERIC.

## 6.2 Source
Immutable source evidence.

Fields:
- id;
- project_id;
- source_type;
- original_path;
- stored_path;
- content_hash;
- mime_type;
- language_hint;
- created_at;
- source_metadata_json;
- extraction_status.

Source types:
- DOCUMENT;
- AUDIO_RECORDING;
- USER_NOTE;
- USER_CORRECTION.

## 6.3 SourceFragment
Addressable piece of source evidence.

Examples:
- document paragraph;
- PDF page text span;
- transcript segment;
- voice annotation.

Fields:
- id;
- source_id;
- sequence;
- text;
- start_char/end_char where meaningful;
- page where meaningful;
- audio_start_ms/audio_end_ms where meaningful;
- speaker where known;
- confidence;
- content_hash.

## 6.4 KnowledgeNode
Normalized knowledge item.

Types include:
- FACT;
- EVENT;
- PERSON;
- PLACE;
- DATE;
- CONCEPT;
- FEATURE;
- PROBLEM;
- BENEFIT;
- USE_CASE;
- DECISION;
- ROADMAP_ITEM;
- QUOTE;
- THEME;
- RELATIONSHIP;
- UNCERTAINTY;
- GAP.

Fields:
- id;
- project_id;
- node_type;
- canonical_text;
- structured_data_json;
- confidence;
- status;
- created_from_version;
- updated_at.

## 6.5 EvidenceLink
Links a KnowledgeNode or generated claim to SourceFragment.

Fields:
- id;
- knowledge_node_id;
- source_fragment_id;
- evidence_role;
- confidence.

## 6.6 KnowledgeConflict
Represents incompatible evidence that must not be silently resolved.

Fields:
- id;
- project_id;
- subject_key;
- description;
- candidate_node_ids;
- resolution_status;
- resolved_value;
- resolution_source;
- resolved_at.

## 6.7 OutputRecipe
Reusable instruction set.

Fields:
- id;
- name;
- output_kind;
- audience;
- purpose;
- tone;
- depth;
- target_length;
- language;
- evidence_mode;
- selected_sections_json;
- custom_instruction;
- voice_profile_id nullable;
- narration_policy_json;
- created_at;
- updated_at.

Output kinds:
- AUDIOBOOK;
- AUDIO_PRESENTATION;
- SUMMARY;
- EXPLANATION;
- PRODUCT_BOOKLET;
- EXECUTIVE_BRIEF;
- PORTFOLIO_ARTICLE;
- MEMOIR_BOOK;
- CUSTOM_TEXT.

## 6.8 RecipeSet
A named group of OutputRecipes executable together.

Example:
`Project Showcase Pack`:
- General Audience EN 5 min;
- Technical EN 10 min;
- Company EN 7 min;
- Product Booklet EN 20 pages;
- Arabic variants.

## 6.9 Narrative
A versioned written output derived from Knowledge Model + Recipe.

Fields:
- id;
- project_id;
- recipe_id;
- knowledge_version;
- narrative_version;
- title;
- language;
- status;
- content;
- outline_json;
- generation_metadata_json;
- created_at.

## 6.10 NarrativeSegment
Addressable unit for audio and incremental regeneration.

Fields:
- id;
- narrative_id;
- sequence;
- text;
- semantic_role;
- evidence_claims_json;
- direction_json;
- content_hash.

## 6.11 VoiceProfile
Fields:
- id;
- name;
- engine_id;
- model_id;
- voice_id;
- language;
- default_speed;
- default_pitch nullable;
- clone_reference_source_id nullable;
- settings_json.

## 6.12 CapabilityManifest
Fields:
- engine_id;
- engine_version;
- model_id;
- model_version;
- capability_type;
- supported_languages;
- supports_voice_cloning;
- supports_streaming;
- supports_speed;
- supports_pitch;
- supports_emotion;
- supports_instruction_direction;
- supports_word_timestamps;
- supports_diarization;
- supports_vad;
- supported_formats;
- min_hardware;
- code_license;
- model_license;
- commercial_use_status;
- source_url;
- notes.

Unknown values MUST be represented as unknown, never guessed.

## 6.13 AudioArtifact
Fields:
- id;
- narrative_id;
- voice_profile_id;
- output_path;
- format;
- duration_ms;
- sample_rate;
- channels;
- content_hash;
- status;
- created_at.

## 6.14 AudioSegmentArtifact
Maps NarrativeSegment → generated audio chunk.

This is the unit of cache and incremental regeneration.

## 6.15 VoiceAnnotation
Fields:
- id;
- project_id;
- target_output_id nullable;
- target_segment_id nullable;
- playback_position_ms nullable;
- source_id;
- annotation_kind;
- transcript;
- merge_status;
- created_at.

Kinds:
- ADD_INFORMATION;
- CORRECTION;
- IMPORTANT;
- COMMENT.

## 6.16 Job
Persistent job record.

States:
- QUEUED;
- RUNNING;
- PAUSED;
- SUCCEEDED;
- FAILED;
- CANCELLED;
- PARTIAL.

A job stores:
- phase;
- progress;
- resumable checkpoint;
- error;
- retry count;
- affected artifact ids.

---

# 7. Knowledge Model Contract

The Knowledge Model is the product core.

It is NOT:
- raw chunks;
- a vector store;
- a single summary;
- an LLM conversation history.

It is a persistent structured representation with evidence.

## 7.1 Build stages

```text
Extracted SourceFragments
→ Source Classification
→ Candidate Knowledge Extraction
→ Entity/Concept Normalization
→ Evidence Linking
→ Conflict Detection
→ Gap Detection
→ Project Content Map
→ Knowledge Version Commit
```

## 7.2 Knowledge versioning
Every successful knowledge update increments `project.knowledge_version`.

Derived artifacts record the knowledge version used to create them.

## 7.3 Merge policy
New evidence may:
- support an existing node;
- enrich an existing node;
- create a new node;
- conflict with an existing node;
- correct a node after explicit user resolution.

LLM output alone may not silently replace source-backed facts.

## 7.4 Memoir-specific truth policy
For memoirs:
- preserve exact original recording;
- preserve transcript;
- preserve uncertainty;
- preserve contradictory recollections;
- never infer a precise date from vague recollection unless explicitly labeled inference;
- allow the user to resolve conflicts.

## 7.5 Project-specific knowledge
For software projects, extraction should recognize:
- product vision;
- problem;
- target users;
- differentiators;
- features;
- workflows;
- use cases;
- architecture;
- technical decisions;
- integrations;
- limitations;
- roadmap;
- risks;
- deployment;
- business/value statements.

---

# 8. Narrative Intelligence

## 8.1 Narrative Planner
Input:
- Knowledge Model;
- OutputRecipe.

Output:
- structured outline;
- selected KnowledgeNode ids;
- ordering;
- inclusion/exclusion rationale;
- target segment sizes;
- evidence policy.

## 8.2 Writer
The writer operates from the approved plan and selected evidence.

It must not independently re-read arbitrary project files.

## 8.3 Evidence modes

### STRICT_SOURCE
No factual claim without evidence.
No creative additions.

### SOURCE_GROUNDED
May improve transitions, metaphors, explanation, and structure.
Factual content remains source-backed.

### LITERARY_ADAPTATION
Allows broader stylistic adaptation.
Core factual events remain source-backed.
Any invented connective detail must be marked internally as creative.

## 8.4 Audience adaptation
Audience is a first-class recipe dimension.

Examples:
- GENERAL;
- TECHNICAL;
- EXECUTIVE;
- RECRUITER;
- CUSTOMER;
- EDUCATIONAL;
- PERSONAL/FAMILY;
- CUSTOM.

The same Knowledge Model can yield materially different narratives.

## 8.5 Language adaptation
Do not literal-translate a completed English script by default.

Preferred:
`Knowledge + Narrative Plan → target-language narrative`.

This allows culturally and linguistically natural Arabic/English/etc.

## 8.6 Memoir writing
Memoir output supports:
- easy Modern Standard Arabic;
- literary Arabic;
- simple conversational literary style;
- serious;
- warm;
- humorous;
- tragic;
- documentary;
- custom.

The chosen style must never authorize factual invention unless the recipe explicitly selects literary adaptation.

---

# 9. Narration Director

The Narration Director is separate from the Writer and TTS engine.

Input:
- NarrativeSegment;
- audience;
- narrative role;
- selected tone;
- language;
- engine capabilities.

Output `VoiceDirection`:
- tone;
- pace;
- energy;
- emotion;
- emphasis spans;
- pause hints;
- pronunciation hints;
- optional engine-neutral instruction text.

The TTS adapter maps `VoiceDirection` to supported engine controls.

If the engine lacks a capability:
- omit it;
- do not emulate by corrupting text;
- do not silently claim it was applied.

This design is inspired by modern steerable TTS systems in which delivery instructions are distinct from the text being spoken.

---

# 10. Speech-to-Text Contract

`STTEngine` interface:

```python
class STTEngine(Protocol):
    def manifest(self) -> CapabilityManifest: ...
    def transcribe(self, request: STTRequest) -> STTResult: ...
```

`STTRequest` includes:
- audio path;
- language hint;
- timestamps requested;
- VAD preference;
- diarization preference;
- model selection.

`STTResult` includes:
- detected language;
- full text;
- segments;
- word timestamps when supported;
- speaker labels when supported;
- confidence/quality metadata;
- engine/model identity.

The initial implementation must support long recordings through chunk-safe processing.

---

# 11. Text-to-Speech Contract

`TTSEngine` interface:

```python
class TTSEngine(Protocol):
    def manifest(self) -> CapabilityManifest: ...
    def synthesize(self, request: TTSRequest) -> TTSResult: ...
```

`TTSRequest`:
- text;
- language;
- voice profile;
- voice direction;
- output format;
- sample rate preference;
- deterministic/cache metadata.

`TTSResult`:
- output path;
- duration;
- engine/model;
- applied controls;
- ignored unsupported controls;
- warnings.

The adapter MUST report which requested controls were actually applied.

---

# 12. Semantic Audio Segmentation

Never pass a full book to a TTS engine.

Segmentation order:
1. chapter/section boundary;
2. paragraph;
3. sentence;
4. engine-specific safe length.

Segments should preserve:
- semantic coherence;
- punctuation;
- abbreviations;
- quotations;
- language-specific sentence behavior.

Audio cache key MUST include:
- normalized text hash;
- engine id/version;
- model id/version;
- voice profile settings;
- effective voice direction;
- audio format parameters.

---

# 13. Audio Assembly

`AudioProcessor` owns:
- loudness normalization;
- silence trimming policy;
- fades where required;
- concatenation;
- format conversion;
- chapter markers;
- metadata;
- final validation.

No TTS adapter performs final-book assembly.

Supported target formats:
- WAV;
- MP3;
- M4B when tooling permits reliable chapter metadata.

For long-form output:
- retain intermediate chunks until final verification succeeds;
- allow resume;
- validate duration and decodability.

---

# 14. Jobs, Resume, and Failure Recovery

Long operations must be persistent jobs.

Examples:
- extract document;
- transcribe recording;
- build knowledge;
- generate recipe set;
- synthesize narrative;
- assemble audiobook.

## 14.1 Checkpoints
A job checkpoints after meaningful durable boundaries.

## 14.2 Resume
On restart:
- RUNNING jobs become recoverable interrupted jobs;
- verify existing artifacts by hash/path;
- continue from last valid checkpoint.

## 14.3 Failure isolation
Failure generating segment 37 must not discard segments 1–36.

## 14.4 Cancellation
Cancellation must:
- stop future work;
- preserve valid completed artifacts;
- mark job CANCELLED;
- not corrupt project state.

---

# 15. Cache

Cache is content-addressed.

Initial cache categories:
- source extraction;
- STT result;
- knowledge extraction result;
- narrative plan;
- narrative segment;
- TTS segment.

Never cache solely by filename.

Cache invalidation must use:
- input hashes;
- schema/prompt version;
- model/provider identity;
- recipe settings;
- engine settings.

---

# 16. Dynamic Sidebar

The right/left sidebar is a capability and context surface.

It is generated from:

```text
Current Project Type
+ Current Action
+ Selected Output Kind
+ Selected Recipe
+ Selected Engine/Model
+ Capability Manifest
```

Examples:

## For TTS
May show:
- engine;
- model;
- voice;
- clone voice;
- language;
- speed;
- pitch;
- emotion;
- style;
- streaming preview;
- pronunciation;
- output format.

Only supported controls are active.

## For STT
May show:
- model;
- language hint;
- VAD;
- word timestamps;
- diarization;
- noise/speech enhancement if supported.

## For Narrative
May show:
- audience;
- purpose;
- tone;
- length;
- depth;
- evidence mode;
- language;
- selected sections;
- custom instructions.

## For Memoir
May additionally show:
- first-person/third-person;
- easy MSA/literary;
- strict memory;
- chronology preference;
- preserve humor;
- creative freedom.

The sidebar is not hard-coded per engine.

---

# 17. Playback and Contextual Annotation

The audio player must know:
- current AudioArtifact;
- current AudioSegmentArtifact;
- linked NarrativeSegment;
- playback position.

“Add Memory Here” workflow:

```text
Pause playback
→ capture current segment/time
→ record annotation
→ save immutable audio source
→ transcribe
→ classify annotation
→ propose knowledge merge
→ user confirms if needed
→ commit knowledge version
→ impact analysis
→ mark affected outputs stale
→ offer selective regeneration
```

Correction workflow must prioritize user correction but preserve previous evidence and history.

---

# 18. Impact Analysis

When Knowledge Model changes, compute affected outputs using:
- evidence links;
- selected knowledge nodes stored in narrative plans;
- recipe dependencies.

Statuses:
- CURRENT;
- STALE;
- REGENERATION_RECOMMENDED;
- BLOCKED_BY_CONFLICT.

The system should display:
“This new developer note affects Product Booklet § Why AgentForge and Company Presentation segments 4–6.”

Do not regenerate automatically unless user enabled that behavior.

---

# 19. Output Production

## 19.1 Audio
- WAV;
- MP3;
- M4B.

## 19.2 Written
Initial written export:
- Markdown;
- DOCX;
- PDF only through a reliable document-to-PDF path.

Written export should support:
- title;
- headings;
- TOC-ready heading structure;
- metadata;
- source/evidence appendix optionally;
- generation/version metadata optionally.

## 19.3 Product Booklet
Booklet generation is a Narrative recipe + Document renderer, not a separate AI architecture.

## 19.4 Recipe Sets
User can select multiple outputs and press one command:
`Generate Selected`.

The application builds shared prerequisites once, then executes branches.

---

# 20. Model and Engine Registry

Every installed/discovered model has a registry entry.

Required metadata:
- engine;
- model;
- version;
- source;
- local path;
- languages;
- capabilities;
- hardware requirements;
- code license;
- model license;
- commercial-use status;
- personal-use status;
- checksum;
- installed/available status.

Licenses are not inferred from project popularity.

Unknown license → `UNKNOWN` and visible warning.

---

# 21. Open-Source Integration Baseline

The following are candidates/adapters, not hard-coded core dependencies.

## 21.1 faster-whisper
Role:
- primary STT adapter;
- long-form transcription;
- timestamps;
- optional VAD integration.

## 21.2 whisper.cpp
Role:
- optional lightweight/native STT path;
- CPU/local deployment alternative.

## 21.3 sherpa-onnx
Role:
- optional unified local speech capabilities;
- ASR;
- TTS;
- VAD;
- diarization;
- speaker functions;
- enhancement where appropriate.

## 21.4 SILMA Arabic TTS
Role:
- preferred Arabic/English TTS experiment/adapter;
- Arabic normalization/diacritization capabilities where exposed;
- voice cloning where user has rights/consent.

## 21.5 Piper-compatible engines/models
Role:
- lightweight CPU fallback;
- deterministic local narration.

## 21.6 F5-TTS
Role:
- optional advanced TTS adapter/research engine.
Important:
- code and pretrained model licensing must be stored separately.

## 21.7 Fish Speech
Role:
- optional personal/research advanced TTS adapter.
License metadata must prevent accidental assumption of unrestricted commercial rights.

## 21.8 Kokoro
Role:
- optional TTS adapter for supported languages/voices.

No engine is mandatory for the architecture to compile except a test/dummy engine.

---

# 22. Safety and Consent for Voice Cloning

Voice cloning requires:
- explicit user confirmation that they own the voice or have permission;
- local consent record;
- visible synthetic-audio disclosure option in exports.

Do not provide a workflow designed to clone public figures or non-consenting persons.

The application stores:
- consent flag;
- voice source provenance;
- creation timestamp.

---

# 23. LLM Prompt/Schema Discipline

Prompts are versioned assets.

Each structured AI task must define:
- purpose;
- input schema;
- output schema;
- prohibited behavior;
- evidence rules;
- uncertainty rules.

Examples:
- knowledge extraction;
- conflict analysis;
- narrative planning;
- memoir writing;
- project presentation writing;
- booklet outline;
- localization;
- narration direction.

LLM output is parsed and validated.

Invalid structured output:
- retry with bounded repair;
- otherwise fail the step explicitly.

Never continue with malformed JSON disguised as success.

---

# 24. Observability

Local observability only.

Use structured Python logging with:
- timestamp;
- job id;
- project id;
- component;
- operation;
- duration;
- engine/model;
- error class.

Do not log:
- API keys;
- full private documents by default;
- raw voice-cloning samples.

Provide a user-readable job log/export for troubleshooting.

---

# 25. Configuration and Secrets

Configuration:
- application settings in local config file;
- project settings in database;
- recipes in database.

Secrets:
- OS keyring where practical;
- environment variables allowed for development;
- never store API keys in project exports;
- never commit secrets.

---

# 26. Performance Rules

The app must remain responsive during:
- transcription;
- LLM calls;
- TTS generation;
- FFmpeg processing.

Use Qt worker/thread facilities or a controlled executor.

UI thread MUST NOT execute long model inference.

Do not introduce distributed job infrastructure.

---

# 27. Testing Strategy

## 27.1 Unit tests
Required for:
- hashing;
- segmentation;
- recipe validation;
- capability filtering;
- cache keys;
- conflict rules;
- impact analysis;
- state transitions.

## 27.2 Contract tests
Every STT/TTS/LLM adapter must pass shared adapter contract tests.

## 27.3 Integration tests
Required for:
- document → fragments;
- audio → transcript;
- fragments → knowledge;
- knowledge → narrative;
- narrative → dummy TTS chunks → assembly;
- annotation → impact analysis.

## 27.4 Acceptance fixtures
Maintain small deterministic fixtures:
- short English book excerpt;
- short Arabic text;
- short Arabic/dialect audio if licensing permits;
- compact software-project specification;
- memoir recording fixture;
- conflicting-memory fixture.

## 27.5 AgentForge-style acceptance test
A project-spec fixture must prove:
- one source understanding;
- three audience narratives;
- materially different selection/depth;
- shared factual core;
- product booklet generation;
- no repeated full source extraction.

## 27.6 Long-form resilience
Test:
- interruption;
- resume;
- failed segment;
- missing engine;
- corrupted cached audio;
- changed recipe;
- changed source.

---

# 28. Quality Gates

A phase does not pass unless:
- code runs;
- tests pass;
- no known data corruption path;
- no architecture drift;
- user-visible workflow works for that phase;
- checkpoint report is produced.

---

# 29. Implementation Phases

## Phase 0 — Reconnaissance and Baseline
Deliver:
- repository bootstrap;
- dependency baseline;
- architecture map;
- environment verifier;
- test runner;
- ADR-0001 confirming baseline decisions;
- no speculative implementation.

Gate:
- clean install;
- app skeleton launches;
- tests run;
- repository structure remains compact.

## Phase 1 — Local Core and Persistence
Implement:
- Project;
- Source;
- OutputRecipe;
- RecipeSet;
- Job;
- SQLite/Alembic;
- filesystem layout;
- repositories;
- hashing/version primitives.

Gate:
- CRUD tests;
- migration tests;
- transaction tests;
- project reopen works.

## Phase 2 — Document Ingestion
Implement:
- TXT;
- MD;
- DOCX;
- text PDF;
- SourceFragments;
- structural extraction;
- content hashes.

Gate:
- deterministic fixture extraction;
- source immutability;
- chapter/section preservation where available.

## Phase 3 — Speech Ingestion
Implement:
- recording/import audio;
- STTEngine contract;
- faster-whisper adapter;
- dummy STT adapter for tests;
- timestamps;
- VAD support;
- transcript fragments.

Gate:
- fixture transcription pipeline;
- long audio chunk handling;
- engine unavailable failure is clean.

## Phase 4 — Knowledge Intelligence
Implement:
- KnowledgeNode;
- EvidenceLink;
- KnowledgeConflict;
- knowledge builder;
- content map;
- knowledge versioning;
- strict evidence behavior.

Gate:
- document fixture produces traceable knowledge;
- memoir fixture produces events/people/evidence;
- conflict fixture remains unresolved until explicit resolution.

## Phase 5 — Narrative Intelligence
Implement:
- recipes;
- narrative planner;
- writer;
- evidence modes;
- audience adaptation;
- target language generation;
- narrative versions;
- segments.

Gate:
- same project generates General/Technical/Company narratives;
- narratives differ appropriately;
- factual core remains evidence-backed;
- no source re-ingestion.

## Phase 6 — Written Outputs
Implement:
- Markdown export;
- DOCX export;
- Product Booklet;
- Executive Brief;
- Memoir Book;
- version metadata.

Gate:
- readable structured booklet;
- headings/sections correct;
- export traceability recorded.

## Phase 7 — Voice Intelligence
Implement:
- TTSEngine contract;
- CapabilityManifest;
- engine registry;
- dummy TTS;
- at least one practical local TTS adapter;
- VoiceProfile;
- Narration Director;
- semantic segmentation;
- audio chunk cache.

Gate:
- unsupported capabilities are not shown/applied;
- segment regeneration works;
- adapter contract tests pass.

## Phase 8 — Audio Production
Implement:
- FFmpeg wrapper;
- normalization;
- concatenation;
- MP3/WAV;
- M4B if reliable in environment;
- metadata;
- chapter markers;
- validation.

Gate:
- long multi-segment output decodes;
- resume after failure;
- final duration is plausible;
- no missing segments.

## Phase 9 — Dynamic Sidebar and Production UI
Implement:
- project workspace;
- source list;
- recipe selection;
- multi-select outputs;
- dynamic sidebar;
- jobs/progress;
- audio player;
- engine/model selector;
- capability-driven controls.

Gate:
- no unsupported control presented as functional;
- user can execute end-to-end workflows without CLI.

## Phase 10 — Living Knowledge / Voice Annotation
Implement:
- Add Memory Here;
- Correct Here;
- VoiceAnnotation;
- annotation transcription;
- merge proposal;
- conflict handling;
- impact analysis;
- stale outputs;
- selective regeneration.

Gate:
- correction at playback location updates only affected knowledge/output;
- original evidence remains;
- previous narrative version remains recoverable.

## Phase 11 — Recipe Sets and Batch Outputs
Implement:
- generate multiple selected outputs;
- shared prerequisite execution;
- Project Showcase Pack;
- Memoir Pack;
- reproducibility.

Gate:
- one source analysis produces multiple outputs without redundant extraction/knowledge rebuild.

## Phase 12 — Hardening and Release
Implement:
- packaging;
- environment diagnostics;
- model registry UX;
- license visibility;
- consent flow;
- crash recovery;
- performance checks;
- documentation.

Gate:
- fresh Windows installation test;
- full acceptance suite;
- clean repository;
- no placeholder/dead subsystems;
- release candidate tagged.

---

# 30. Phase Checkpoint Report

After every phase, GLM must report:

```text
PHASE:
STATUS: PASS | FAIL | BLOCKED

Implemented:
Changed files:
New files:
Tests added:
Tests executed:
Results:
Acceptance criteria:
Architecture deviations:
Known limitations:
Disk/runtime impact:
Next phase readiness:
Git status:
Commit SHA (if committed):
```

No PASS if any mandatory gate failed.

---

# 31. File-Count and Complexity Budget

This project explicitly rejects file-count inflation.

Rules:
1. Do not generate boilerplate directories for hypothetical future modules.
2. Do not duplicate schemas across UI/core/adapters.
3. Do not create one service per verb.
4. Do not create “manager/factory/controller/service” layers unless each has a distinct responsibility.
5. Prefer direct function/module composition over framework patterns.
6. Do not add dependency injection frameworks.
7. Do not add event buses; use explicit application events/callbacks in-process when needed.
8. Do not add a repository abstraction for every trivial table if one cohesive persistence module is sufficient.
9. Every new dependency must solve a real current problem.
10. Every new directory must be justified in the phase checkpoint.

Target: a maintainable application, not an architecture demonstration.

---

# 32. Invariants

The following must always hold:

1. Original sources are immutable.
2. Generated claims in strict mode are evidence-backed.
3. Conflicting memories are not silently resolved.
4. Knowledge version increments on committed semantic change.
5. Derived outputs know which knowledge version produced them.
6. A TTS segment knows exactly which text/settings produced it.
7. Unsupported engine capability is never reported as applied.
8. Failed jobs cannot mark incomplete output as complete.
9. Cancellation cannot corrupt project state.
10. API secrets never enter project exports.
11. UI thread never performs long inference.
12. One changed segment does not require full audio regeneration unless assembly format forces final reassembly.
13. Source analysis is shared across output branches.
14. Engine/model licenses are explicit metadata, not assumptions.
15. Core domain does not import engine-specific packages.

---

# 33. Canonical End-to-End Workflows

## 33.1 Book audiobook
```text
Create Project
→ Import Book
→ Extract
→ Build Knowledge/Structure
→ Select Full Audiobook Recipe
→ Generate Narrative Representation if required
→ Narration Director
→ Segment
→ TTS
→ Assemble
→ Validate
→ Export
```

## 33.2 AgentForge-style showcase
```text
Create Software Project
→ Import Specification
→ Extract
→ Build Project Knowledge
→ Select Recipe Set:
   General Audio
   Technical Audio
   Company Audio
   Product Booklet
→ Build shared plans
→ Generate independent narratives
→ Generate written booklet
→ Direct/synthesize audio narratives
→ Export Content Pack
```

## 33.3 Living memoir
```text
Create Memoir Project
→ Record/import memories
→ Transcribe
→ Build Memory Knowledge
→ Resolve critical conflicts
→ Select Memoir Recipe
→ Generate chapters
→ Generate review audio
→ Listen
→ Add Memory Here
→ Transcribe annotation
→ Merge proposal
→ Update Knowledge
→ Impact analysis
→ Regenerate affected chapter/segments
```

---

# 34. Acceptance Definition of Done

Voxa Studio baseline is complete only when all are true:

- local project can be created/reopened;
- documents can be ingested;
- speech can be transcribed through an adapter;
- knowledge is persistent and evidence-linked;
- one project can generate multiple narratives;
- written booklet generation works;
- TTS adapter architecture works;
- at least one real local TTS path works;
- long audio is segmented/assembled;
- jobs survive recoverable interruption;
- capability-driven sidebar works;
- voice annotation updates living knowledge;
- incremental regeneration works;
- model/engine license metadata is visible;
- tests cover invariants;
- Windows packaging is reproducible;
- no distributed infrastructure is required;
- no deferred feature has been prematurely implemented;
- repository remains compact and understandable.

---

# 35. External Technology Notes Verified During Architecture Freeze

These notes are evidence for adapter choices; they are not permission to couple the core to these projects.

- SILMA Arabic TTS v1 advertises Arabic/English support, instant voice cloning, Arabic diacritization/text normalization, MIT code and Apache-2.0 model weights.
- sherpa-onnx supports local STT, TTS, speaker diarization/identification/verification, language ID, VAD, enhancement and related speech functions across Windows and other platforms.
- F5-TTS code is MIT, while its published pretrained models are separately licensed CC-BY-NC; the registry must therefore track code and model licenses independently.
- Fish Speech uses a research/non-commercial license for the relevant materials and requires separate commercial licensing.
- whisper.cpp continues to provide a local native Whisper implementation and has added streaming VAD improvements.
- Modern steerable TTS APIs demonstrate the architectural value of separating text from delivery instructions; NARRA implements this generically through Narration Director + adapter capability mapping.

Reference URLs:
- https://github.com/SILMA-AI/silma-tts
- https://github.com/k2-fsa/sherpa-onnx
- https://github.com/SWivid/F5-TTS
- https://github.com/fishaudio/fish-speech
- https://github.com/ggml-org/whisper.cpp
- https://github.com/SYSTRAN/faster-whisper
- https://developers.openai.com/api/docs/guides/text-to-speech
- https://openai.com/index/introducing-our-next-generation-audio-models/

---

# 36. Canonical Implementation Command

The implementation model must treat this document as the authoritative engineering contract.

Read the entire specification before writing or modifying substantive code.

Implement Voxa Studio phase by phase in the exact order defined here.

Do not redesign the architecture.
Do not convert the application into microservices.
Do not introduce agent swarms or distributed infrastructure.
Do not create speculative files or abstractions.
Do not silently replace technology decisions.
Do not silently invent missing product requirements.

Where an implementation detail is not specified:
1. choose the smallest conventional solution consistent with the invariants;
2. document the decision in the phase checkpoint;
3. create an ADR only if the choice has long-term architectural consequences.

Where this specification contains a genuine contradiction:
1. stop the affected decision;
2. quote both conflicting requirements;
3. preserve all unaffected work;
4. propose the smallest correction;
5. do not silently choose one side.

For every phase:
1. implement the required scope;
2. add tests;
3. execute tests;
4. verify acceptance criteria;
5. produce the checkpoint report;
6. proceed only after PASS.

The objective is not maximum code.

The objective is:

> **A compact, traceable, local-first system that understands knowledge once and can reliably transform it into many stories, formats, languages, and performances.**
