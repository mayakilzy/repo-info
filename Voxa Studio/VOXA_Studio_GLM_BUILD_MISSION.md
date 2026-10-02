# Voxa Studio — GLM BUILD MISSION
## Full Implementation Mission and Execution Protocol

**Mission type:** End-to-end repository implementation  
**Executor:** GLM development agent  
**Engineering authority:** `VOXA_Studio_Architecture_Specification.md`  
**Mission authority:** This file defines HOW the implementation is executed.  
**Goal:** Build, test, harden, and package Voxa Studio without architecture drift.

---

# 1. Mission Statement

You are the principal implementation engineer for Voxa Studio.

You are not being asked to:
- brainstorm the product;
- redesign the architecture;
- propose an alternative stack;
- create a prototype;
- build only a demo;
- ask the user to make decisions already frozen in the specification.

You are being asked to implement the attached architecture as a coherent, tested, local-first desktop application.

The architecture specification defines WHAT the system is and its mandatory boundaries.

This mission defines HOW you must execute the build.

---

# 2. Required Reading Before Code

Before substantive code changes:

1. Read `VOXA_Studio_Architecture_Specification.md` completely.
2. Read this mission completely.
3. Inspect the current repository, if any.
4. Inspect available machine/runtime capabilities.
5. Identify existing files that can be reused.
6. Produce Phase 0 baseline.
7. Only then begin implementation.

Do not skim only headings.

Do not begin by generating a large folder tree.

---

# 3. Authority Hierarchy

When instructions appear to conflict, use:

1. Explicit user instruction in the current execution session.
2. `VOXA_Studio_Architecture_Specification.md`.
3. This GLM Build Mission.
4. Existing accepted ADRs.
5. Existing tested code behavior that does not conflict with 1–4.
6. Conventional engineering judgment.

Never let a library's preferred architecture override the product architecture.

---

# 4. Autonomy

You are authorized to make ordinary implementation decisions including:
- internal function names;
- local class composition;
- small dependency choices;
- SQL query shape;
- test fixture organization;
- error-message wording;
- UI widget composition;
- refactoring required to pass a phase gate.

You are NOT authorized to independently:
- introduce microservices;
- replace SQLite;
- replace PySide6 with a web stack;
- introduce Redis/Celery/message brokers;
- introduce an agent framework;
- add a vector database;
- remove evidence traceability;
- collapse Voice Profile and Voice Direction;
- remove Capability Manifests;
- remove versioning;
- change the phase order without cause;
- add large deferred features;
- silently change licenses/engine assumptions;
- weaken tests to obtain PASS.

---

# 5. Core Execution Loop

For every phase:

```text
READ PHASE
→ INSPECT EXISTING STATE
→ DEFINE SMALLEST IMPLEMENTATION PLAN
→ IMPLEMENT
→ ADD/UPDATE TESTS
→ RUN TARGETED TESTS
→ RUN RELEVANT REGRESSION TESTS
→ VERIFY ACCEPTANCE GATE
→ CLEAN DEAD/PLACEHOLDER CODE
→ CHECK REPOSITORY SIZE/COMPLEXITY
→ CHECKPOINT REPORT
→ COMMIT
→ NEXT PHASE
```

Never mark a phase PASS because “most” requirements work.

---

# 6. Stop Conditions

Stop and report BLOCKED only for a real blocker such as:
- missing required system dependency that cannot be installed safely;
- architecture contradiction;
- corrupted repository;
- missing source/model artifact required by the current mandatory gate;
- hardware impossibility for a mandatory real-engine acceptance test;
- license condition preventing required use.

Do NOT stop for:
- naming choices;
- minor UI layout choices;
- conventional implementation details;
- a package version that can be resolved normally;
- an optional engine being unavailable.

When a real engine is unavailable, use the mandatory dummy adapter for contract/integration testing and clearly report what real-engine acceptance remains.

---

# 7. No Question Inflation

Do not ask questions whose answer is already in the specification.

Do not ask:
- “Should I use SQLite?”
- “Should this be microservices?”
- “Which UI framework?”
- “Should I add Redis?”
- “Should I create a vector DB?”
- “Should I use agents?”
- “Should I regenerate the whole audiobook?”

Those decisions are already made.

If a genuine unspecified detail appears, choose the smallest conventional solution compatible with the architecture and record it.

---

# 8. Repository Discipline

The project has an explicit anti-bloat requirement.

Before creating a file, ask:
- Does an existing cohesive module already own this responsibility?
- Is this file required by the current phase?
- Does this abstraction have a real consumer?
- Is this a library boundary or merely a naming preference?

Forbidden behavior:
- empty placeholder modules;
- one-class-per-file dogma;
- generated “future” packages;
- duplicate DTO/domain/UI schemas;
- factories wrapping a single implementation without external-boundary justification;
- managers calling managers calling services with no semantic boundary.

At every checkpoint report:
- total tracked files;
- files added this phase;
- directories added this phase;
- notable dependencies added;
- why each new directory was necessary.

If file growth is disproportionate to delivered functionality, refactor before PASS.

---

# 9. Git Discipline

If repository is under Git:

Before phase:
- confirm current branch;
- confirm clean/known working state;
- record HEAD.

After phase PASS:
- ensure generated caches/build artifacts are ignored;
- run tests;
- commit phase;
- record full SHA.

Commit message format:
`phase-XX: <concise outcome>`

Do not mix unrelated future work into the phase commit.

Do not rewrite user history.

---

# 10. Dependency Discipline

Every dependency must be:
- necessary now;
- actively used;
- pinned/locked reproducibly;
- compatible with Windows where required;
- license-noted if it brings models/assets.

Avoid large frameworks when Python/Qt/stdlib solves the problem.

External model packages are adapters, not architectural foundations.

---

# 11. Security and Privacy Baseline

NARRA processes private books, software specifications, memories, and voice recordings.

Therefore:
- local-first is default;
- cloud calls must be explicit;
- API keys are secrets;
- logs must not dump source documents;
- voice recordings are not uploaded without provider action;
- project export must not include secrets;
- source deletion, if implemented later, must be explicit.

Voice cloning:
- require consent confirmation;
- retain provenance;
- do not bypass consent checks in UI.

---

# 12. Phase 0 — Reconnaissance and Baseline

## Objective
Establish a verified, minimal foundation.

## Required work
- inspect repository;
- inventory files;
- inventory Python/runtime;
- check FFmpeg/ffprobe;
- check GPU availability without making GPU mandatory;
- identify Windows compatibility risks;
- create/validate `pyproject.toml`;
- establish test runner;
- establish app launch skeleton;
- establish logging;
- create ADR-0001 only if repository did not already encode architecture baseline;
- create environment verification script.

## Must NOT do
- no full domain implementation;
- no speculative engine integration;
- no giant generated tree.

## Tests
- import smoke;
- app bootstrap smoke;
- SQLite smoke;
- Qt smoke where environment permits;
- environment verifier tests.

## Gate
PASS only if a clean development install can run tests and launch the skeleton.

---

# 13. Phase 1 — Local Core and Persistence

Implement the canonical domain entities required by the architecture.

Focus:
- Project;
- Source metadata;
- recipes;
- recipe sets;
- jobs;
- storage paths;
- database/migrations;
- hashes;
- timestamps/version primitives.

Requirements:
- SQLite WAL;
- FK enforcement;
- Alembic;
- transactional repository operations;
- stable IDs;
- UTC timestamps internally.

Tests:
- create/reopen project;
- rollback;
- migration upgrade;
- hash stability;
- recipe serialization;
- invalid state rejection.

Do not add Knowledge Intelligence yet beyond required schema foundations.

---

# 14. Phase 2 — Document Ingestion

Implement deterministic parsers.

Required:
- TXT;
- Markdown;
- DOCX;
- text PDF.

Rules:
- source file immutable;
- copy/store under project-managed source storage;
- compute hash;
- extract SourceFragments;
- preserve page/section/chapter hints when available;
- encoding failures handled explicitly.

Tests:
- fixtures for each format;
- repeated import detection;
- extraction determinism;
- malformed file failure.

Do not add OCR unless needed to define a clean optional adapter boundary.

---

# 15. Phase 3 — Speech Ingestion

Implement:
- audio source import;
- optional recording UI foundation;
- STTEngine protocol;
- CapabilityManifest;
- dummy STT;
- faster-whisper adapter;
- timestamps;
- VAD configuration;
- transcript SourceFragments.

Requirements:
- no UI freeze;
- long recordings supported;
- engine availability detection;
- model identity recorded;
- transcription cache.

Tests:
- adapter contract;
- dummy deterministic transcript;
- real faster-whisper smoke when environment/model available;
- interruption/error handling.

Do not make diarization mandatory.

---

# 16. Phase 4 — Knowledge Intelligence

This is a critical phase.

Implement:
- KnowledgeNode;
- EvidenceLink;
- KnowledgeConflict;
- knowledge schemas;
- builder;
- normalization;
- versioning;
- content map;
- strict evidence rules.

LLM tasks must return structured validated output.

Required behavior:
- every source-backed knowledge item can resolve to SourceFragment;
- uncertainty preserved;
- conflicts represented;
- knowledge commit is transactional;
- failed build cannot partially advance knowledge version.

Memoir fixture:
- person;
- event;
- place;
- approximate date;
- uncertainty.

Software fixture:
- problem;
- idea;
- users;
- features;
- use cases;
- differentiators;
- architecture;
- roadmap.

Gate is strict. Do not proceed with untraceable “summary blob”.

---

# 17. Phase 5 — Narrative Intelligence

Implement:
- OutputRecipe;
- planner;
- writer;
- audience adaptation;
- evidence modes;
- localization;
- Narrative/NarrativeSegment;
- versioning.

Acceptance scenario:
From one software-project Knowledge Model, generate:
1. general audience;
2. technical audience;
3. company/executive audience.

They must:
- share factual identity;
- differ in detail selection;
- differ in vocabulary/depth;
- not re-ingest source;
- retain evidence links for factual claims in strict/source-grounded mode.

Memoir:
- easy MSA output from dialect transcript;
- preserve factual constraints;
- tone selectable.

---

# 18. Phase 6 — Written Outputs

Implement written renderer/export.

Required:
- Markdown;
- DOCX;
- Product Booklet;
- Memoir Book;
- Executive Brief.

Document generation must be deterministic after narrative is finalized.

Do not mix layout generation with LLM reasoning.

Product Booklet acceptance:
- coherent title/intro;
- problem;
- product importance;
- how it works;
- features;
- use cases;
- differentiators;
- future/roadmap only if evidence exists;
- selected audience/tone respected.

---

# 19. Phase 7 — Voice Intelligence

Implement:
- TTSEngine protocol;
- dummy TTS;
- engine registry;
- model registry;
- VoiceProfile;
- VoiceDirection;
- Narration Director;
- semantic segmentation;
- TTS cache;
- at least one practical local TTS adapter.

SILMA should be integrated when runtime/hardware permits without coupling core to it.

Piper-compatible fallback may be used for lightweight local acceptance.

Critical tests:
- engine capability manifest;
- unsupported setting handling;
- cache key correctness;
- same text + changed voice direction invalidates correct chunk;
- core imports no engine-specific package.

---

# 20. Phase 8 — Audio Production

Implement centralized FFmpeg wrapper.

Required:
- chunk validation;
- WAV;
- MP3;
- normalization;
- concatenation;
- metadata;
- chapter support;
- M4B where reliable;
- final validation.

Failure:
If one segment fails, job is resumable.

Never declare final output SUCCEEDED until:
- all required chunks exist;
- final file decodes;
- expected chapter/segment coverage exists.

---

# 21. Phase 9 — Production UI and Dynamic Sidebar

Implement real user workflow.

Main UI must provide:
- project list/workspace;
- sources;
- knowledge status;
- output recipe selection;
- multi-select outputs;
- recipe editor;
- engine/model selection;
- capability-driven sidebar;
- jobs/progress;
- generated outputs;
- audio player.

Dynamic sidebar is mandatory.

Do not create separate screens for every engine.

---

# 22. Phase 10 — Living Knowledge and Voice Annotation

Implement:
- Add Memory Here;
- Correct Here;
- Mark Important;
- VoiceAnnotation;
- STT annotation;
- semantic merge proposal;
- conflict detection;
- impact analysis;
- stale output indicators;
- selective regeneration.

Acceptance:
1. play memoir;
2. pause on segment;
3. add new voice memory;
4. transcribe;
5. merge;
6. knowledge version increments;
7. only affected narrative/audio marked stale;
8. regenerate affected segment;
9. original recording and old narrative remain accessible.

Also test same mechanism with a software-project developer note.

---

# 23. Phase 11 — Recipe Sets and Multi-Output Production

Implement:
- recipe set editor;
- multi-select generation;
- shared prerequisites;
- dependency graph inside one process;
- progress by output.

Acceptance:
One software project produces:
- general audio;
- technical audio;
- company audio;
- product booklet.

Knowledge extraction runs once.

---

# 24. Phase 12 — Hardening and Release

Required:
- Windows packaging;
- fresh-machine instructions;
- environment diagnostics;
- missing-engine UX;
- model registry/license display;
- consent UX;
- crash/restart recovery;
- test suite;
- documentation;
- performance pass;
- repository cleanup.

Do not optimize prematurely before correctness.

Final gate:
All architecture Definition-of-Done items must be checked one by one.

---

# 25. LLM Provider Rules

All LLM calls go through `LLMProvider`.

No direct vendor call in:
- knowledge;
- narrative;
- UI;
- speech;
- output modules.

Provider must expose:
- text generation;
- structured generation;
- model metadata;
- timeout;
- retry policy;
- cancellation where practical.

Structured calls:
- validate;
- bounded repair retry;
- fail explicitly.

Prompts must be versioned.

---

# 26. Engine Adapter Rules

For every speech engine:

1. Detect availability.
2. Report manifest.
3. Validate request against capabilities.
4. Execute.
5. Return applied settings.
6. Return warnings.
7. Never pretend unsupported controls worked.
8. Never leak engine exceptions directly to UI.
9. Preserve diagnostic details in logs.

Adapters must be replaceable without domain changes.

---

# 27. License Registry Rules

Never infer a model license from the engine code license.

Store separately:
- code_license;
- model_license;
- commercial_use_status;
- personal_use_status;
- source URL;
- notes.

If unknown:
- set UNKNOWN;
- warn;
- do not invent.

The application is currently intended for personal use, but architecture must preserve accurate license metadata for future decisions.

---

# 28. Testing Rules

Never remove or weaken a failing test solely to pass a gate.

A bug fix requires:
- reproduce;
- regression test;
- fix;
- targeted test;
- relevant suite.

Minimum categories:
- unit;
- adapter contract;
- integration;
- acceptance;
- recovery.

Use deterministic dummy adapters to keep core tests fast.

Real model tests may be marked environment-dependent, but at least one real local speech path must be manually/automatically verified before final release.

---

# 29. UI Responsiveness Rules

Long work never runs on Qt UI thread.

Use a controlled worker/executor strategy.

UI must:
- display progress;
- permit cancel where safe;
- survive job failure;
- show actionable errors;
- reopen completed outputs.

Avoid unnecessary reactive frameworks inside Qt.

---

# 30. Data Integrity Rules

Use transactions for:
- knowledge version commits;
- conflict resolution;
- output state transitions;
- annotation merge;
- job finalization.

Never:
- mark success before durable artifact write;
- overwrite original source;
- delete old narrative version during regeneration;
- update knowledge version before evidence links persist.

---

# 31. Incremental Regeneration Rules

When a knowledge update occurs:

1. determine changed nodes;
2. locate narratives whose plans selected those nodes;
3. mark those narratives stale;
4. identify affected segments;
5. regenerate text if required;
6. invalidate TTS only for changed segment hashes;
7. reassemble final container if required;
8. preserve unchanged chunk cache.

Do not implement “regenerate everything” as the default shortcut.

---

# 32. Performance and Resource Discipline

The application may run on modest local hardware.

Therefore:
- stream/chunk long audio;
- do not hold entire decoded audiobook in RAM;
- release model resources when switching heavy engines if needed;
- make GPU optional;
- allow CPU fallback where engine supports it;
- expose model/hardware compatibility.

Do not download large models silently.

---

# 33. Error Taxonomy

Create meaningful error categories:
- ConfigurationError;
- SourceExtractionError;
- EngineUnavailableError;
- ModelUnavailableError;
- TranscriptionError;
- KnowledgeBuildError;
- EvidenceValidationError;
- NarrativeGenerationError;
- TTSGenerationError;
- AudioAssemblyError;
- ExportError;
- JobCancelled;
- LicenseMetadataWarning.

UI maps these to user-readable messages.

---

# 34. Checkpoint Report — Mandatory

After every phase output:

```text
VOXA STUDIO PHASE CHECKPOINT

Phase:
Status: PASS | FAIL | BLOCKED
Start HEAD:
End HEAD:

Scope implemented:
User-visible result:

Files added:
Files modified:
Files removed:
Total tracked files:
Total tracked directories:

Dependencies added/removed:

Tests added:
Tests executed:
Test results:

Acceptance criteria:
- [x]/[ ] ...

Architecture invariants checked:
- [x]/[ ] ...

Known limitations:
Environment-dependent validations:
Architecture deviations:
ADRs created:
Repository cleanliness:
Disk impact:

Commit:
Next phase:
```

If status is FAIL/BLOCKED, do not continue automatically into dependent implementation.

---

# 35. Communication Style During Build

Report meaningful findings, not every command.

Immediately surface:
- architecture contradiction;
- security issue;
- license issue;
- data-loss risk;
- unexpectedly huge dependency;
- file-count explosion;
- failing acceptance invariant.

Do not interrupt for trivial choices.

---

# 36. Anti-Overengineering Audit

At the end of every phase, answer:

1. Did we add a service/process that could be a function/module?
2. Did we add a database that is not SQLite?
3. Did we add a queue/broker?
4. Did we add a vector DB?
5. Did we add an agent framework?
6. Did we create files for future features?
7. Did we duplicate a domain schema?
8. Did we add a dependency used in only one trivial place?
9. Did tracked file count grow disproportionately?
10. Can any new abstraction be deleted without losing functionality?

If yes, simplify before PASS unless the architecture explicitly requires it.

---

# 37. Final Acceptance Scenarios

## Scenario A — Book
- import book;
- extract structure;
- generate smart summary;
- generate audiobook;
- resume after simulated failure.

## Scenario B — Project
- import project spec;
- build one Knowledge Model;
- generate three audience audio scripts;
- generate product booklet;
- verify shared evidence;
- add developer voice note;
- update affected outputs.

## Scenario C — Memoir
- import/record dialect speech;
- transcribe;
- build memory knowledge;
- write easy-MSA memoir chapter;
- synthesize review audio;
- add memory at playback position;
- detect/resolve a contradiction;
- selectively regenerate.

## Scenario D — Capability UI
- switch TTS engine;
- sidebar changes to real capabilities;
- unsupported control disappears/is disabled;
- manifest/license visible.

## Scenario E — Recovery
- interrupt long TTS;
- restart;
- resume;
- preserve completed chunks;
- final audio validates.

All scenarios must pass before release candidate.

---

# 38. Completion Standard

Do not report “project complete” until:
- every phase is PASS;
- final acceptance scenarios pass;
- repository is clean;
- Windows package is verified;
- architecture invariants are audited;
- known optional engine limitations are documented;
- no critical TODO is hidden in code.

A successful implementation is not measured by lines of code.

It is measured by:
- correctness;
- traceability;
- recoverability;
- usefulness;
- compactness;
- replaceable engines;
- faithful source understanding;
- high-quality outputs.

---

# 39. Start Command

Begin now with:

**Phase 0 — Reconnaissance and Baseline**

First read the entire architecture specification and this mission.

Then inspect the repository and environment.

Do not generate the complete application tree before Phase 0 findings justify it.

Do not begin Phase 1 until Phase 0 gate is PASS.

Your implementation loop is:

> **Read → Inspect → Implement → Test → Verify → Simplify → Checkpoint → Commit → Continue**
