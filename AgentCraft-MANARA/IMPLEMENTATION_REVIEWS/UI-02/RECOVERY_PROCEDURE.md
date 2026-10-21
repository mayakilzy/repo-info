# MANARA UI-02 — Safe Dual-Repository Recovery Procedure

**Mission ID:** `MANARA-UI02-DUAL-REPO-RECOVERY-01`
**Prepared by:** GLM (development sandbox, no push access)
**Validated by:** Pre-validated on temp branches in this sandbox (see §4)
**For execution by:** Codex (or any environment with push access to both `mayakilzy/AgentCraft-MANARA` and `mayakilzy/repo-info`)

---

## 1. Objective

Apply two pending deliverables to the canonical GitHub repositories, using a SAFE workflow that:

- Does NOT use `git reset --hard` (could destroy uncommitted work)
- Does NOT use `git push --force` (could overwrite newer commits)
- Creates temporary branches from latest `origin/main` (so the worker always starts from current upstream)
- Validates patches via `git am` (will fail loudly on conflict; never silently merges)
- Runs tests on the patched code before publishing
- Uses Pull Request workflow for traceable review (not direct push to main)

---

## 2. Pre-validated Facts (this sandbox)

| Check | Result |
|---|---|
| `AgentCraft-MANARA` origin/main HEAD | `c6a7edbfee50c41c734ebcef9afe11bf66e31ad2` |
| Code patch base commit | `c6a7edb` ✓ (matches origin/main) |
| Code patch applies cleanly via `git am` | ✅ Validated on temp branch `recovery-test` |
| Backend regression on patched code | ✅ 414 passed, 5 skipped (no regressions) |
| Frontend typecheck on patched code | ✅ clean |
| Frontend vitest on patched code | ✅ 23/23 pass |
| Frontend build on patched code | ✅ 275KB JS / 80KB gz |
| `repo-info` origin/main HEAD | `1f3c07098a697e65b812f3ea34d904e2743f31e5` |
| Doc patch base commit | `1f3c070` ✓ (matches origin/main) |
| Doc patch applies cleanly via `git am` | ✅ Validated on temp branch `recovery-test-doc` (6 whitespace warnings, no conflicts) |
| Patch secrets scan | ✅ No secrets, no sensitive paths (only false-positive: `import.meta.env.VITE_API_BASE` which is a Vite env var reference, not a secret) |
| Doc patch size | 14 files, ~973 KB total (no duplicate approved-design assets) |

**Both patches are pre-validated as applicable.** If Codex's `git fetch` reveals newer upstream commits, the `git am` may still apply cleanly or may require `git am --3way` for minor conflicts.

---

## 3. Required Inputs

The recovery package contains:

```
MANARA-UI-02-LUCIDE-RECOVERY-01-delivery.zip
└── UI-02/
    ├── REPORT.md                                       # mission report
    ├── visual_comparison.md                            # VLM comparison
    ├── journey_results.json                            # Playwright 14/14
    ├── screenshots/                                    # 8 PNGs
    │   ├── 01_home_en_desktop.png
    │   ├── 02_home_after_compose_en_desktop.png
    │   ├── 03_workspace_en_desktop.png
    │   ├── 04_memory_en_desktop.png
    │   ├── 05_memory_ar_desktop.png
    │   ├── 06_memory_en_mobile.png
    │   ├── 07_mobile_nav_drawer.png
    │   └── 08_workspace_full_en_desktop.png
    └── diagnostics/
        ├── MANARA-UI-02-LUCIDE-RECOVERY-01.patch       # ← CODE PATCH (Repo A)
        ├── repo_info_commit.patch                      # ← DOC PATCH (Repo B)
        ├── code_repo_push.txt                          # evidence: prior push failed
        ├── repo_info_push.txt                          # evidence: prior push failed
        ├── backend_uvicorn.log                         # diagnostics
        └── vite_dev.log                                # diagnostics
```

---

## 4. Repository A — Application Code Recovery

**Repository:** `mayakilzy/AgentCraft-MANARA`
**Patch:** `diagnostics/MANARA-UI-02-LUCIDE-RECOVERY-01.patch`
**Expected commits after apply:**
- `MANARA-BACKEND-SQLITE-WAL-FIX-01: make WAL sidecar probe test idempotent`
- `MANARA-UI-02-LUCIDE-RECOVERY-01: unblock Investigation Workspace + Memory Explorer`

### Step-by-step procedure

```bash
# 1. Clone fresh + verify upstream is reachable
cd /tmp
git clone https://github.com/mayakilzy/AgentCraft-MANARA.git manara-code-recovery
cd manara-code-recovery
git fetch origin --prune --tags
git rev-parse origin/main    # RECORD THIS SHA — should be c6a7edb or newer

# 2. Sanity check: confirm the 2 commits are NOT already on origin/main
#    (if they are, this recovery is a no-op)
git log --oneline origin/main | head -5
# Expected: c6a7edb should be at HEAD. If ce53460 or d930431 already appear, SKIP.

# 3. Create a temporary recovery branch from origin/main
#    (do NOT work on main directly; do NOT use reset --hard)
git checkout -b recovery/ui-02-lucide origin/main

# 4. Apply the code patch
git am --signoff < /path/to/diagnostics/MANARA-UI-02-LUCIDE-RECOVERY-01.patch
# Expected output:
#   Applying: MANARA-BACKEND-SQLITE-WAL-FIX-01: make WAL sidecar probe test idempotent
#   Applying: MANARA-UI-02-LUCIDE-RECOVERY-01: unblock Investigation Workspace + Memory Explorer

# 5. If `git am` fails with conflict:
#    - Inspect: git status
#    - For trivial conflicts (whitespace, line endings): git am --skip OR fix + git am --continue
#    - For real conflicts: STOP and report to owner. Do NOT force-resolve.

# 6. Run backend regression on the patched code
cd backend
# (set up venv per repo README if not already)
python -m pytest --tb=short
# Expected: 414 passed, 5 skipped, 0 failed (≤8 minutes)

# 7. Run frontend quality gates
cd ../frontend
npm ci
npm run typecheck        # expected: clean
npx vitest run           # expected: 23/23 pass
npm run build            # expected: builds successfully

# 8. Push the recovery branch (NOT main) and open a PR
cd ..
git push -u origin recovery/ui-02-lucide
# Then open a PR via GitHub UI or:
# gh pr create --base main --head recovery/ui-02-lucide \
#   --title "MANARA-UI-02-LUCIDE-RECOVERY-01: dependency recovery + UI-02 unblock" \
#   --body "See repo-info/IMPLEMENTATION_REVIEWS/UI-02/REPORT.md for full review evidence."

# 9. After PR review + approval, merge via GitHub UI (squash or merge commit per repo convention).
#    DO NOT push directly to main. DO NOT force-push.
```

### If origin/main has moved past c6a7edb

If `git rev-parse origin/main` shows a SHA newer than `c6a7edb`:

```bash
# Try applying on top of the new HEAD first
git checkout -b recovery/ui-02-lucide origin/main
git am --signoff < /path/to/MANARA-UI-02-LUCIDE-RECOVERY-01.patch
# If clean → proceed with tests
# If conflict → try 3-way merge:
git am --abort
git am --3way --signoff < /path/to/MANARA-UI-02-LUCIDE-RECOVERY-01.patch
# If still conflicts → STOP, report conflict to owner, do NOT force-resolve
```

---

## 5. Repository B — Documentation Recovery

**Repository:** `mayakilzy/repo-info`
**Patch:** `diagnostics/repo_info_commit.patch`
**Target folder:** `AgentCraft-MANARA/IMPLEMENTATION_REVIEWS/UI-02/`

### Step-by-step procedure

```bash
# 1. Clone fresh
cd /tmp
git clone https://github.com/mayakilzy/repo-info.git manara-doc-recovery
cd manara-doc-recovery
git fetch origin --prune --tags
git rev-parse origin/main    # RECORD THIS SHA — should be 1f3c070 or newer

# 2. SECURITY REVIEW (repo-info may be public — verify no secrets)
#    The patch was pre-scanned in the development sandbox:
#    - No GitHub PATs, AWS keys, private keys, passwords
#    - The only "sensitive path" hit was `import.meta.env.VITE_API_BASE`
#      (a Vite env-var reference, not a secret)
#    Re-scan anyway before publishing:
git format-patch -1 HEAD --stdout > /tmp/last-apply-check.patch  # if applying via am
# OR scan the patch file directly:
grep -iE "gh[pousr]_|github_pat_|sk-[A-Za-z0-9]|AKIA|BEGIN.*PRIVATE KEY|password[:=]|secret[:=]" \
    /path/to/diagnostics/repo_info_commit.patch
# Expected: no matches (or only false-positives like the env var reference)

# 3. Sanity check: confirm the UI-02 folder does NOT already exist
ls AgentCraft-MANARA/IMPLEMENTATION_REVIEWS/UI-02/ 2>/dev/null
# Expected: "No such file or directory". If it exists, STOP — coordinate with owner.

# 4. Create a temporary recovery branch
git checkout -b recovery/ui-02-review origin/main

# 5. Apply the doc patch
git am --signoff < /path/to/diagnostics/repo_info_commit.patch
# Expected:
#   warning: 6 lines add whitespace errors.   (harmless — comes from the embedded code patch)
#   Applying: MANARA-UI-02-LUCIDE-RECOVERY-01: implementation review

# 6. Verify the tree structure
find AgentCraft-Manara/IMPLEMENTATION_REVIEWS/UI-02 -type f | sort
# Expected: 14 files (REPORT.md, visual_comparison.md, journey_results.json,
#                     8 screenshots, 4 diagnostics: code patch, 2 push txts, 2 logs)
# Note: the path may be AgentCraft-MANARA (case-sensitive). Verify the actual case.

# 7. Verify total size is reasonable (should be ~973 KB)
du -sh AgentCraft-MANARA/IMPLEMENTATION_REVIEWS/UI-02/

# 8. Verify NO duplicate approved-design assets were committed
#    (approved designs live in AgentCraft-MANARA/UI_UX_DESIGN/APPROVED_VISUAL_ASSETS/)
git diff --stat origin/main..HEAD | grep -i "APPROVED_VISUAL_ASSETS"
# Expected: empty (no overlap with approved assets)

# 9. Push the recovery branch and open a PR
git push -u origin recovery/ui-02-review
# gh pr create --base main --head recovery/ui-02-review \
#   --title "MANARA-UI-02-LUCIDE-RECOVERY-01: implementation review evidence" \
#   --body "Per MANARA-DELIVERY-POLICY-01. Contains: REPORT.md, visual_comparison.md, journey_results.json (14/14 PASS), 8 verified screenshots, diagnostics. UI-02 acceptance: AWAITING OWNER VERDICT."

# 10. After PR review + approval, merge via GitHub UI. DO NOT force-push.
```

### If origin/main has moved past 1f3c070

Same procedure as Repo A: try `git am` first, then `git am --3way`, then STOP if conflicts persist.

---

## 6. Post-Recovery Verification

After both PRs are merged, the owner (or ChatGPT as design supervisor) should:

1. Visit `https://github.com/mayakilzy/repo-info/tree/main/AgentCraft-MANARA/IMPLEMENTATION_REVIEWS/UI-02`
2. Open `REPORT.md` — review mission summary, push status, test results
3. Open `visual_comparison.md` — review VLM side-by-side findings
4. Open `screenshots/03_workspace_en_desktop.png` — verify Workspace matches approved reference
5. Open `screenshots/04_memory_en_desktop.png` — verify Memory Explorer matches approved reference
6. Open `journey_results.json` — verify 14/14 Playwright assertions
7. Issue UI-02 verdict: **ACCEPTED** or **NEEDS REVISION**

If NEEDS REVISION: open a new GLM mission with specific revision requests.
If ACCEPTED: authorize next stage (UI-03).

---

## 7. Failure Modes & Mitigations

| Failure | Mitigation |
|---|---|
| `git am` conflict on Repo A | Try `--3way`. If still conflicts, STOP and report which file/lines conflict. Do NOT force-resolve. |
| `git am` conflict on Repo B | Same. The doc patch is mostly new files; conflicts unlikely unless `IMPLEMENTATION_REVIEWS/UI-02/` already exists. |
| Backend tests fail after patch | STOP. Report which tests fail. The pre-validation showed 414/414 pass, so any failure suggests upstream changes. |
| Frontend build fails | STOP. Pre-validation showed clean build, so failure suggests upstream changes. |
| Push denied (permissions) | Confirm the worker has `Contents: write` permission on both repos. Use PR workflow, not direct push. |
| Secrets found in re-scan | STOP. Quarantine the patch. Report to owner immediately. |

---

## 8. What NOT to Do

- ❌ `git reset --hard origin/main` (could destroy uncommitted local work)
- ❌ `git push --force` (could overwrite newer upstream commits)
- ❌ Direct push to `main` (use PR workflow for traceability)
- ❌ Apply patches without first running `git fetch` to confirm upstream state
- ❌ Apply patches without re-scanning for secrets (especially for the public repo-info)
- ❌ Skip tests "because they passed in dev sandbox" (upstream may have changed)
- ❌ Mark UI-02 as accepted — that's the owner's call, not the recovery worker's

---

## 9. Final Report (to be filled by recovery worker)

After successful recovery, the worker reports:

```
Repository A (AgentCraft-MANARA):
  - origin/main BEFORE: <SHA>
  - PR URL: <url>
  - Merged commit SHA: <SHA>
  - origin/main AFTER: <SHA>
  - Backend tests: <X passed, Y skipped, Z failed>
  - Frontend tests: <X passed>
  - Build: <success/failure>

Repository B (repo-info):
  - origin/main BEFORE: <SHA>
  - PR URL: <url>
  - Merged commit SHA: <SHA>
  - origin/main AFTER: <SHA>
  - Files published: <count>
  - Total size: <KB>
  - Secrets re-scan: <clean/suspicious>

UI-02 acceptance: STILL AWAITING OWNER VERDICT
(per MANARA-DELIVERY-POLICY-01 §3, passing tests != visual approval)
```

---

**End of Safe Recovery Procedure.**
