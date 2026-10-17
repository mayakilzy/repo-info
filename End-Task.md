# UNIVERSAL SECURITY CLEANUP & SAFE SESSION CLOSURE
## مهمة عامة لإغلاق جلسة التطوير بأمان — AgentCraft

**Mode:** SECURITY CLEANUP ONLY  
**Scope:** Current development session  
**Application:** AgentCraft WealthForge  
**Protected release:** `rc-1.0.1`  
**Priority:** Security and preservation  
**No feature development. No deployment.**

### Objective

Development of the current application has been declared complete by the owner.

Perform a careful, minimal security cleanup of temporary sensitive information and safely close the current development session.

**The application, its source code, databases, deployment configuration, Git history and validated release artifacts must remain intact.**

### 1. Stop Development

Do not implement new features, fixes, refactoring or improvements.

Do not modify the approved application or reopen completed development tasks.

### 2. Inspect Session-Specific Sensitive Artifacts

Identify sensitive materials created or temporarily copied during this development session, including:

- GitHub Personal Access Tokens (PAT).
- API keys and temporary authentication tokens.
- Temporary SSH credentials.
- Temporary secret files.
- Credentials accidentally copied into temporary scripts.
- Sensitive information in temporary logs or generated artifacts.

Never print or reveal credential values.

### 3. Perform Safe Cleanup

Remove only confirmed, unnecessary, session-generated temporary copies of secrets.

Do not delete credentials that belong to other applications, shared services or ongoing sessions.

Do not modify operational `.env` files or remove secrets required for later deployment.

If ownership or continued use is uncertain, **leave the item untouched and report it to the owner**.

### 4. Inspect Git Security

Perform read-only checks of the current working tree, tracked files and relevant pending changes.

Verify that no credentials or temporary secret files are unintentionally staged for commit.

If a possible exposure is detected, report the affected file or location without displaying its secret content.

Do not rewrite Git history, delete commits, modify tags, force-push or perform any Git Push.

Preserve `rc-1.0.1` exactly.

### 5. Close Temporary Session Resources

Stop only temporary processes and development servers positively identified as belonging exclusively to this session.

Do not stop shared services, databases, Docker containers or infrastructure used by other applications or sessions.

Do not remove Docker volumes, persistent storage, repositories or working databases.

### 6. Preserve Project Integrity

The following must remain unchanged:

- Application source code.
- Prisma schemas and migrations.
- PostgreSQL and SQLite databases.
- Docker configuration and volumes.
- Operational environment files.
- Git commits, branches and release tags.
- Deployment documentation.
- Development reports and evidence.
- All persistent project artifacts.

Do not perform bulk deletion or workspace resets.

### 7. Credential Revocation

Do not revoke, regenerate or disable shared credentials automatically.

If a temporary credential remains active, report that the owner may need to revoke it through the issuing provider.

If actual exposure is detected, report it clearly as a security issue requiring owner action.

### 8. Final Verification

Confirm that:

- No confirmed unnecessary temporary secret copies remain.
- No project files were unintentionally modified.
- No persistent services or databases were damaged.
- No shared application resources were stopped.
- The Git repository and release tag remain intact.
- Any unresolved credential risks are documented.

Do not claim that conversation history or provider-side logs have been deleted.

### 9. Final Closure Report

Provide a concise final report containing:

- Application and session.
- Cleanup actions performed.
- Sensitive artifacts identified (paths/types only, never secret values).
- Items deliberately preserved.
- Remaining risks requiring owner action.
- Git status.
- Confirmation that the approved release remains intact.
- Final session status: `SAFE_TO_CLOSE` or `OWNER_ACTION_REQUIRED`.

**Do not create commits, push changes, deploy, modify application functionality, or begin another task.**

After reporting, **STOP all development activity and close the session safely.**