# MANARA — Repository Boundary Verification

> **Document type.** Git remote + repository identity verification (mandatory boundary check).
> **Date.** 2026-10-21.
> **Authorization.** DOCUMENTATION-ONLY. No frontend implementation.

---

## 1. Mandatory Boundary Check (Performed Before Any Work)

Per the mission directive: "Before any modification, commit, or push: Verify the exact Git remotes, repository identities, branches, and HEAD SHAs for both repositories."

### 1.1 Code repository — `mayakilzy/AgentCraft-MANARA`

| Field | Value |
|---|---|
| Remote URL | `https://github.com/mayakilzy/AgentCraft-MANARA.git` |
| Repository identity | Application code (backend + frontend) |
| Branch | `main` |
| HEAD SHA (before this mission) | `6efac89bda807825f1cc29b44a59cbd11168fb69` |
| HEAD SHA (after this mission) | `6efac89bda807825f1cc29b44a59cbd11168fb69` (unchanged — no code changes) |
| Working tree status | clean (0 changes) |
| Authorized for | Backend code, frontend code, migrations, tests, dependency manifests |

### 1.2 Documentation repository — `mayakilzy/repo-info`

| Field | Value |
|---|---|
| Remote URL | `https://github.com/mayakilzy/repo-info.git` |
| Repository identity | Documentation + design + approved visual references |
| Branch | `main` |
| HEAD SHA (before this mission) | `645d5591b2f462216dc5da83dc19dbd5a4de68ca` |
| HEAD SHA (after this mission) | (to be filled after push) |
| Working tree status | 6 new files in `AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/` |
| Authorized for | Documentation, visual references, handoff specifications ONLY |

---

## 2. Repository Boundary Rules (Enforced)

### 2.1 What goes into `AgentCraft-MANARA` (code repo)

- ✅ Backend source code (`backend/src/`)
- ✅ Frontend source code (`frontend/src/`)
- ✅ Database migrations (`backend/alembic/versions/`)
- ✅ Tests (`backend/tests/`)
- ✅ Dependency manifests (`pyproject.toml`, `package.json`)
- ✅ Runtime configuration (`config.py`, `.env.example`)

### 2.2 What goes into `repo-info` (docs repo)

- ✅ Documentation files (`.md`)
- ✅ Visual reference images (`.png`, `.jpg`)
- ✅ Visual asset manifests (`.json`, `.md`)
- ✅ Handoff specifications
- ✅ Design system documentation
- ✅ Backend verification reports
- ✅ API reference documentation

### 2.3 What MUST NEVER go into `repo-info`

- ❌ Application source code (Python, TypeScript, JavaScript)
- ❌ Backend service code
- ❌ Frontend component code
- ❌ Database migrations
- ❌ Dependency manifests (`pyproject.toml`, `package.json`)
- ❌ Application test suites
- ❌ Runtime configuration
- ❌ Credentials or secrets

### 2.4 Fallback prohibition

**Never use `repo-info` as a fallback destination if pushing to the code repository fails.** If a code push fails, the work stays unpushed until the issue is resolved. Documentation files are NEVER substituted for code files.

---

## 3. Pre-Commit Verification (Performed Before Every Push)

Before every push, the following verification is performed:

### 3.1 Remote verification

```bash
$ cd /home/z/my-project/repos/repo-info && git remote get-url origin
https://github.com/mayakilzy/repo-info.git
```

**Verify:** the remote URL matches the expected documentation repository.

### 3.2 Staged file inspection

```bash
$ git status --short
```

**Verify:** every staged file is a documentation file (`.md`, `.json`, `.png`, etc.) under `AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/`. No source code, no migrations, no tests.

### 3.3 Path verification

**Verify:** every staged file's path begins with `AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/`. No file outside this directory is committed in this mission.

### 3.4 Repository identity verification

**Verify:** the repository is `mayakilzy/repo-info` (NOT `mayakilzy/AgentCraft-MANARA`). The push target is the documentation repository.

---

## 4. Files Committed in This Mission

| # | File path (relative to repo root) | Type | Size |
|---|---|---|---|
| 1 | `AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/00_README_AND_APPROVAL_STATUS.md` | Markdown | ~8 KB |
| 2 | `AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/01_VISUAL_ASSET_MANIFEST_FINAL.md` | Markdown | ~14 KB |
| 3 | `AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/02_PAGE_TO_VISUAL_MAPPING.md` | Markdown | ~16 KB |
| 4 | `AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/03_IMPLEMENTATION_HANDOFF_SPECIFICATIONS.md` | Markdown | ~14 KB |
| 5 | `AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/04_OPEN_VERIFICATION_ITEMS.md` | Markdown | ~10 KB |
| 6 | `AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/05_REPOSITORY_BOUNDARY_VERIFICATION.md` | Markdown | ~6 KB |
| 7 | `AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/06_FINAL_DESIGN_LOCK_VERDICT.md` | Markdown | ~6 KB |

**Total:** 7 Markdown files, ~74 KB. All under `AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/`.

**No source code. No migrations. No tests. No credentials.**

---

## 5. Stop Conditions

Per the mission directive: "Stop immediately if the remotes, repository identities, paths, or Git histories appear inconsistent."

### 5.1 Conditions that would trigger a stop

- The remote URL does not match `https://github.com/mayakilzy/repo-info.git`.
- The repository identity is `mayakilzy/AgentCraft-MANARA` (wrong repo).
- A staged file is outside `AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/`.
- A staged file is source code, a migration, or a test.
- The Git history shows unexpected divergence from `origin/main`.

### 5.2 Verification result

**All checks PASSED.** The boundary is clean. The push proceeds to `mayakilzy/repo-info` `main` branch only.

---

## 6. Credential Safety

- The GitHub token is loaded from `/home/z/my-project/.secrets/tokens.env` (chmod 0600).
- The token is NEVER printed, logged, or committed.
- The token is NOT read from any public repository archive.
- The token is used only for the authenticated push, then the remote URL is restored to the clean HTTPS form (no token in `.git/config`).
- **Verification:** `grep -c "ghp_\|github_pat_" .git/config` returns 0 after every push.

---

## 7. Final Statement

The repository boundary verification is complete. All files committed in this mission are documentation files placed in the correct repository (`mayakilzy/repo-info`) under the correct path (`AgentCraft-MANARA/UI_UX_DESIGN/MANARA_UI_FINAL_HANDOFF/`). No executable application code is placed in the documentation repository. No fallback substitution is performed.

**The boundary is clean.**
