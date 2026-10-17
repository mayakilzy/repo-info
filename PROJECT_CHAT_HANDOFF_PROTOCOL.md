# Universal Project Chat Handoff Protocol

> **Reusable instructions for moving any software project from a long ChatGPT/AI-agent conversation to a fresh one without losing continuity.**  
> **Scope:** Personal repositories and applications owned or explicitly authorized by the project owner.  
> **Use:** Keep this file in the public `repo-info` repository; use it as a common procedure for every project.  
> **Language:** Write the resulting project-specific handoff in the language of the current project conversation unless the owner specifies otherwise.

---

## 0. Operating Modes — Read This First

This document has **two distinct modes**. Determine the mode from the owner's request; do not run both automatically.

| Mode | Invoked in | Expected action |
| --- | --- | --- |
| **A — PREPARE_HANDOFF** | The **current / outgoing conversation**, when the owner requests a handoff because the context is getting long | Investigate the actual project state and produce a **project-specific, standalone handoff document** for the next conversation. Do not start new development work. |
| **B — RESUME_FROM_HANDOFF** | The **new / incoming conversation**, when the owner supplies this protocol's URL and the outgoing handoff | Read the handoff and linked authoritative sources; verify the current project state; summarize readiness and **wait for the next task**. Do not start development or change repositories until instructed. |

**If the owner shares only this generic protocol URL in a new conversation but has not provided a project-specific handoff or an unambiguous location for one, request that handoff or its exact link.** This generic protocol cannot magically reconstruct the prior conversation or identify an unknown project.

**The project-specific handoff is mandatory.** This generic file defines *how to prepare and resume*; it is not a substitute for the unique project's facts.

---

## 1. Shared Principles

1. **Continuity, not a restart:** Do not redesign a project, repeat approved milestones, or reopen settled decisions without new evidence or the owner's request.
2. **Repository evidence is authoritative for code state:** Prefer actual repository contents, branches, tags, commits, CI results, tests, migrations, release notes, and recorded artifacts over recollections or unverified chat summaries. A conversation may explain decisions; it does not prove that a change was committed.
3. **Be precise about status:** Distinguish `DONE / VERIFIED / APPROVED`, `IMPLEMENTED / NOT VERIFIED`, `IN PROGRESS`, `BLOCKED`, `PLANNED`, and `DEFERRED`. Do not describe a simulated result, a skipped test, an unrun browser test, or a draft as production-ready.
4. **Preserve the owner's direction:** Capture the project's vision, constraints, design decisions, engineering preferences, security requirements, implementation approach, responsible agents, and definition of done.
5. **Never fabricate missing context:** Mark unknown information `UNKNOWN — needs confirmation` and give the quickest way to verify it.
6. **No premature execution:** Preparing or reading a handoff does not authorize new feature work, deployments, secrets rotation, pushing commits, destructive cleanup, or any release.
7. **Security and privacy remain mandatory:** The owner may control the repositories and authorize working with credentials. This does **not** authorize publishing or repeating a secret in a public repository, task, commit, log, screenshot, or handoff.
8. **Recoverability:** Explain the exact point where the next conversation should continue, with relevant dependencies, reproducible commands, and known blockers—without assuming a particular local workspace persists between conversations.

---

# MODE A — PREPARE_HANDOFF

## 2. Instructions for the Outgoing Conversation

When the owner asks to move to a new conversation, perform the following in order.

### A1. Identify the project and authoritative sources

Collect the project identity from the conversation and verify it where tools permit:

- Official project name, one-paragraph mission, intended users, main problems solved, and long-term vision.
- Every relevant repository: **name, full URL, purpose, owner/organization, visibility if known, main branch, working branch, latest verified commit SHA, relevant stable tag/release**.
- Related repositories, shared toolkits, documentation folders, issue trackers, design references, API specifications, and any project-specific mission or execution pack.
- Existing local or server environments and deployment topology, but **not** server credentials or sensitive addresses unless required and approved.
- Implementation roles (e.g., the planning/reviewing assistant, implementation agent, testing agent, human reviewer) and their boundaries.

Use accessible source files and APIs for verification. If a repository is private or cannot be accessed, record the limitation and what the new session will need to connect.

### A2. Reconstruct the project's development history

Build an accurate concise timeline capturing:

- What was agreed initially; important architecture, data, UX/UI, security, and product decisions.
- Completed groups/phases/missions with **actual evidence**, exact baseline/final SHAs if available, test results, CI/Recovery links, approved deliverables.
- Fix rounds, regressions and resolved defects; explicitly note any findings that must not be reintroduced.
- Current implementation and last accepted milestone; distinguish “agent reported PASS” from “independently verified PASS.”
- Work currently in progress, remaining tasks, backlog, deferred items, unresolved blockers, and dependency order.
- Known limitations: stubbed vs live services, test gaps, performance, evidence quality, tenant isolation, browser readiness, deployment constraints, and any accepted technical debt.
- Design assets, sample data, demos, migration state, and acceptance criteria that the next session must preserve.

Do not pad the document with a complete transcript. Capture the **decisions and facts necessary to continue**.

### A3. Specify the resumption checkpoint

Include a precise **RESUME CHECKPOINT**, such as:

```text
PROJECT_NAME = <project name>
REPOSITORY = <owner/repo URL>
DEFAULT_BRANCH = <branch>
LAST_VERIFIED_CODE_SHA = <full commit SHA or UNKNOWN>
LAST_VERIFIED_DOCUMENTATION_SHA = <full commit SHA or N/A>
LAST_APPROVED_MISSION = <ID/status>
CURRENT_MISSION = <ID/status or NONE>
NEXT_PLANNED_MISSION = <ID/title or TBD>
CI_VERIFIED = <link + result + matching SHA or NOT VERIFIED>
RECOVERY_VERIFIED = <link + result + matching SHA or NOT VERIFIED>
WORKTREE_STATUS = <clean/dirty/unknown; verified when?>
ENVIRONMENT = <development/staging/production status>
NEXT_ACTION = WAIT_FOR_OWNER_INSTRUCTIONS
```

If there are several repositories, make a checkpoint **for each repository**. Mark the source and verification date of critical facts. Never assume the outgoing model's filesystem or authentication session will persist.

### A4. Produce one standalone, project-specific handoff

Use this structure, adapting depth to project complexity:

1. **Executive project overview** — mission, intended users, vision, product scope.
2. **Repositories and authoritative resources** — each repository's role and verified branch/SHA; documentation and relevant links.
3. **Architecture and technology** — application/services, components, databases, infrastructure, environments, and critical API contracts.
4. **Product and UX requirements** — approved experiences, design system, languages, accessibility, essential screenshots or asset references.
5. **Engineering principles and constraints** — reuse policies, preferred implementation agents, forbidden shortcuts, licensing/security rules, test methodology.
6. **Decisions already frozen** — what not to change without consent.
7. **Work accomplished** — phase-by-phase acceptance history, evidence and artifacts.
8. **Present condition** — verified state, current defects, open risks and known limitations.
9. **Future roadmap** — remaining phases/missions in order, dependencies, proposed next action (not authorization to act).
10. **Secrets/access handoff (metadata only)** — required credential *names and scopes*, where they are administered, how to provision them securely (Section 4); **no values**.
11. **Resumption checkpoint** — machine-readable key/value block, as in A3.
12. **Instructions to the next conversation** — verification checklist, handoff acceptance, stop boundary.
13. **Appendix** — glossary, critical links, commands, evidence index, and unresolved questions.

Prepare the document so a fresh assistant who has never seen this conversation can understand the project and continue with minimal questions. For large projects, keep a concise executive summary followed by technical appendices. Optionally attach or create a downloadable Markdown file named `PROJECT_<NAME>_HANDOFF_<YYYY-MM-DD>.md` when file creation is supported.

### A5. Outgoing conversation deliverables

Provide:

- The **complete project-specific handoff** as text and/or a downloadable Markdown artifact.
- A compact copy/paste **new-chat starter** (see Section 6).
- A short list of anything still needed from the owner (only if genuinely missing).

**Stop after preparing the handoff.** Do not execute the next mission, push any file, or change the repository unless the owner separately instructs you to do so.

---

## 3. Continuity and Verification Rules for the New Conversation

The new session must:

1. Read **this protocol** and the **project-specific handoff** in full, or read the relevant full sections if retrieval is paged.
2. Identify the intended project unambiguously and list its repositories.
3. Verify repository access, default branch, latest commit SHA, current working branch, tags, important files and mission pack as available.
4. Compare the repository's latest verified state to the handoff checkpoint. If Git has advanced, inspect the new commits and identify whether they are authorized changes. Never silently roll back or overwrite them.
5. Verify the latest available CI, test and recovery evidence against the **same** commit SHA where possible; do not claim results for a newer commit that has not been tested.
6. Confirm the accepted architecture, frozen decisions, requirements, open risks and remaining mission plan.
7. Check required access **without asking for or printing secret values**; report only `available / missing / inaccessible / not verified`.
8. Produce a brief **RESUMPTION READINESS REPORT** summarizing the checkpoint, any discrepancy, blockers, and the exact next intended mission.
9. **Wait for the owner's next instruction.** Do not start that mission, edit code, create new branches, run deployment commands, install new integrations, or rotate credentials merely from reading this file.

If the owner explicitly asks the new session only to “read the task and get ready,” the response should be a readiness confirmation, **not a new mission prompt or an implementation run**.

---

# ACCESS & SECRET MANAGEMENT — ALL PROJECTS

## 4. Credential Handoff Protocol (Without Exposing Secrets)

The project owner explicitly authorizes work on their own repositories and may have issued a **project-specific GitHub token / repository credential** for an approved development agent. Treat that authorization as scoped access, never as permission to disclose the credential.

### 4.1 Inventory metadata, never values

In the handoff, record only:

| Field | Safe example |
| --- | --- |
| Credential alias | `PROJECT_GITHUB_TOKEN` |
| Purpose | Read/write to a named private project repository when necessary |
| Required access | Only repositories and permissions required by the current mission |
| Owner-managed source | GitHub credential settings, connected GitHub app, approved secret manager, or secure environment provisioning |
| Storage method | Credential manager / managed secret / ignored local environment file |
| Rotation / revocation owner | Project owner |
| Availability | `AVAILABLE`, `NOT VERIFIED`, or `MISSING` |

**Never include** real tokens, password values, private keys, recovery codes, authorization headers, session cookies, secrets in URLs, or full environment files in a handoff, a public `repo-info` file, chat transcript, issue, screenshot, log, or commit.

### 4.2 Preferred secure access sequence

1. **Prefer an authorized GitHub integration or credential manager** already connected to the incoming environment. Verify repository access by a non-secret operation; do not expose access tokens.
2. If a credential is required but unavailable, tell the owner exactly which *permission and repository scope* are needed. The owner must provision it using a trusted secret-management channel supported by the actual environment.
3. For Git command-line sessions, prefer GitHub CLI (`gh auth login`) or the OS Git Credential Manager / SSH agent, using the environment's official authentication flow. Do not embed tokens in clone URLs, commands visible in logs, or Git remote URLs.
4. For applications that need environment variables, store placeholders in committed `.env.example` and put **actual values only** in an ignored local environment file (e.g., `.env.local`), or in managed deployment/CI secrets. An example template is:

   ```dotenv
   # Example only — NO real secret values in this document
   PROJECT_GITHUB_TOKEN=<PROVISIONED_SECURELY_OUTSIDE_GIT>
   ```

5. Before saving any real secret locally, ensure the file is outside version control, covered by `.gitignore` (`.env`, `.env.*`, with narrowly defined exceptions for `.env.example`), and not included in build artifacts. Check with `git check-ignore -v .env.local` and inspect `git status` before any commit. On Unix-like systems restrict local file access (e.g., `chmod 600 .env.local`); use appropriate user-only file permissions on Windows.
6. Use the least privilege feasible (fine-grained repository-scoped credential, minimum write permissions, limited expiration) and avoid copying the token across different project workspaces unnecessarily.
7. In CI or deployment, use the platform's **secret store**, not a tracked configuration file. Never print the value for debugging; scrub logs and redact diagnostics.
8. If the current agent cannot securely receive or persist credentials, **do not request that the owner paste them into an ordinary chat message**. Ask them to connect a supported integration or provision the secret in their own trusted execution environment instead.
9. Do not claim that credentials are available merely because an earlier chat once possessed them; access does not carry over automatically between chats, agents, machines, browser sessions or sandboxes.

### 4.3 Scope and use

Credential use must remain limited to authorized actions on the owner's project repositories and services. Reading this task or the handoff **does not** grant blanket approval to push, delete, change repository visibility, deploy, rotate a token, or alter CI secrets.

### 4.4 End-of-development cleanup (owner-requested later)

The owner plans to request **credential removal at the end of development**. Until then, do not revoke or delete a working credential without instruction. At the end, when explicitly asked:

- Identify credential locations and dependencies first, without printing values.
- Remove project secrets from disposable workspaces, ignored environment files, credential-store entries or connected environments **within the agent's actual access and authority**.
- Have the owner revoke/rotate the relevant GitHub credential using GitHub's settings and remove unused CI/deployment secrets.
- Confirm no sensitive files are tracked and inspect git history / logs for exposures. If a token was ever committed or publicly exposed, **revoke/rotate it immediately**; merely deleting the current file is insufficient.
- Report what was verifiably cleaned, what remains under owner control, and what cannot be confirmed. Do not claim full erasure from inaccessible past chats, backups, logs or machines.

---

## 5. Acceptance Criteria for a Successful Handoff

The outgoing handoff is **READY** only if it can answer these questions accurately:

- What does this project do, and why is it being built?
- Which repositories and versions are authoritative?
- What exactly is completed and accepted, and what is only reported, simulated, skipped, pending or blocked?
- Which implementation choices are already frozen?
- What is the exact resumption checkpoint and next planned mission?
- How can the next session independently verify the claims?
- Which access capabilities are required, and how can the owner provision them **without publishing credentials**?
- What should the new session do immediately, and what must it **not** do until instructed?

If crucial information is unavailable, mark it as unknown. An honest partial handoff is better than a complete-looking fictional one.

---

## 6. Ready-to-Copy Messages

### 6.1 Message to send in the OUTGOING conversation

> **PREPARE_HANDOFF — Project Chat Migration**  
> Read and follow the universal handoff protocol at:  
> `https://github.com/mayakilzy/repo-info/blob/main/PROJECT_CHAT_HANDOFF_PROTOCOL.md`  
> We are moving this project to a new conversation because this chat has become too long. Prepare a complete, project-specific handoff using the real repository state and everything decided in this conversation. Include the vision, repositories, architecture, completed milestones, accepted SHAs, verified CI/tests, unresolved issues, future roadmap, exact resumption checkpoint, and access requirements **without any secret values**. Create a downloadable Markdown handoff if supported. Do not start new development work. Stop after delivering the handoff.

### 6.2 Message to send in the INCOMING conversation

> **RESUME_FROM_HANDOFF — Read & Prepare Only**  
> Read the universal protocol at:  
> `https://github.com/mayakilzy/repo-info/blob/main/PROJECT_CHAT_HANDOFF_PROTOCOL.md`  
> Then read the project-specific handoff I attach or link here: `<PROJECT_HANDOFF_LINK_OR_ATTACHMENT>`. Recover the exact approved context and resumption checkpoint; verify the repository state and accessible evidence. Check access availability without revealing or requesting secret values. Provide a concise readiness report and **wait for my next mission**. Do not develop, change repositories, deploy, or create credentials yet.

---

## 7. Version and Maintenance

**Protocol version:** 1.0  
**Applicability:** All owner-authorized software, research and infrastructure projects  
**Review rule:** If a project-specific mission pack or documented owner decision conflicts with a generic instruction here, preserve the project's authoritative facts and ask the owner to resolve any consequential conflict. Never override security safeguards.
