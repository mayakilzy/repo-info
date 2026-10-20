# G10-01 — Runtime & Deployment Foundation

**Status:** PROPOSED — AWAITING MASTER APPROVAL
**Date:** 2026-10-20
**Proposer:** GLM (for MASTER & ChatGPT decision)
**Mission:** G10 — Deployment and Operational Handoff
**Branch (proposed):** `feat/g10-runtime-foundation`

---

## Purpose

First execution task of G10 Track 1. Fixes the two critical "tea machine"
discoveries: the outbox worker placeholder and the staging deployment
foundation. No external credentials needed — this task can start
immediately upon MASTER authorization.

---

## Scope

### In scope (6 items):

1. **Wire real outbox worker** — replace `keepalive.ts` placeholder with
   `runWorkerLoop` from `src/modules/integrations/outbox-worker.ts` in
   docker-compose.yml worker command.

2. **Staging environment template** — create `.env.staging.example` with
   all env vars documented, no secrets. Separates staging from dev.

3. **Health/readiness probe** — add DB ping to `/api/v1/health` so it
   reports `database: "ok"` or `database: "unavailable"` instead of
   `"not_checked"`.

4. **Docker build verification** — verify `docker build` (prod target)
   produces a working standalone image. Test `node server.js` starts.

5. **Worker start/stop test** — test that the worker starts, processes
   a queued job, and shuts down gracefully (SIGTERM).

6. **Initial operations documentation** — document the startup/shutdown
   commands, env vars, and health check usage.

### Out of scope (explicitly excluded):

- ❌ S3/object storage wiring (separate task — needs credentials)
- ❌ Email SMTP library (separate task — needs credentials)
- ❌ Google OAuth configuration (needs credentials)
- ❌ TLS/domain configuration (needs staging domain)
- ❌ Backup/restore runbook (separate task)
- ❌ Any UI changes
- ❌ Any new features

---

## Work Items (detailed)

### 1. Wire outbox worker entry point

**Current state:**
```yaml
# docker-compose.yml worker service
command: bun run src/worker/keepalive.ts
```

**`runWorkerLoop` exists at** `src/modules/integrations/outbox-worker.ts:220`
and has a `require.main === module` guard (line 236) — it can be run
directly.

**Change:**
- Update `docker-compose.yml` worker command to:
  `command: bun run src/modules/integrations/outbox-worker.ts`
- Update comment to reflect G10 (remove G01 placeholder note)
- Optionally: update `src/worker/keepalive.ts` to import and call
  `runWorkerLoop` (so the old entry point also works) OR delete it
  (cleaner — but may break existing developer workflows)

**Verification:**
- `docker compose up worker` → worker starts, logs "outbox.worker.start"
- Submit a test job → worker processes it (status: queued → succeeded)
- `docker compose stop worker` → worker shuts down gracefully

### 2. Staging environment template

**Current state:** Only `.env.example` (dev) exists.

**Create:** `.env.staging.example` with:
- `NODE_ENV=production`
- `DATABASE_URL=` (placeholder, no secret)
- `DATABASE_SHADOW_URL=` (placeholder)
- `AUTH_SECRET=` (comment: "generate with openssl rand -base64 32")
- `GOOGLE_CLIENT_ID=` / `GOOGLE_CLIENT_SECRET=` (comment: "configure when ready")
- `LOG_LEVEL=info` / `LOG_FORMAT=json`
- `S3_*` (comment: "configure when storage is wired")
- All other vars from `.env.example` with staging-appropriate defaults

**Also create:** `docker-compose.staging.yml` override that:
- Uses `target: prod` (not `dev`)
- Does NOT mount source volumes (uses built image)
- Sets `NODE_ENV=production`
- Configures `restart: always` (not `unless-stopped`)

### 3. Health/readiness probe

**Current state:** `src/app/api/v1/health/route.ts` returns:
```json
{ "checks": { "database": "not_checked" } }
```

**Change:** Add a DB ping:
```typescript
checks: {
  database: await pingDatabase(), // "ok" | "unavailable"
}
```

**Implementation:** Try `db.$queryRaw\`SELECT 1\`` with a 2s timeout.
If it succeeds → `"ok"`. If it throws → `"unavailable"`.
The endpoint still returns 200 (process is alive; DB may be starting).

**Note:** This does NOT change the sandbox behavior — if no DB is
configured, the ping fails gracefully → `"unavailable"`, endpoint
still 200. This is the ADR-05 design.

### 4. Docker build verification

**Verify:**
```bash
docker build --target prod -t str-platform:test .
docker run --rm -e NODE_ENV=production -p 3001:3000 str-platform:test
curl http://localhost:3001/api/v1/health
# Expected: 200 with JSON body
```

**Also verify:** The prod image does NOT include dev dependencies
(no `bun install` dev deps in prod stage).

### 5. Worker start/stop test

**Test script** (not a unit test — a manual/scripted verification):
1. Start postgres + worker via `docker compose up -d postgres worker`
2. Submit a test job via API or DB insert
3. Verify worker processes it (poll job status)
4. Send SIGTERM to worker container
5. Verify worker logs "graceful shutdown" or exits cleanly
6. Verify no orphaned jobs (jobs in "running" state after shutdown
   should be recovered on next start — tested in G09 Phase B)

### 6. Initial operations documentation

**Create:** `docs/operations/startup.md` with:
- How to start the full stack (docker compose)
- How to start just the worker
- How to check health (`curl /api/v1/health`)
- How to stop gracefully
- Environment variable reference (link to `.env.staging.example`)
- Common troubleshooting (DB not ready, worker not processing)

---

## Dependencies

| Dependency | Status |
|-----------|--------|
| G09 merged to main | ✅ `a8ae4ed` |
| `runWorkerLoop` implemented | ✅ G07 |
| Dockerfile prod target | ✅ G01 |
| docker-compose.yml | ✅ G01 (needs worker command update) |
| External credentials | ❌ NOT needed for this task |

**This task has NO external dependencies.** It can start immediately.

---

## Acceptance Criteria

1. ✅ `docker compose up worker` starts the real outbox worker (not keepalive)
2. ✅ Worker processes a queued job end-to-end on staging/dev
3. ✅ Worker shuts down gracefully on SIGTERM
4. ✅ `.env.staging.example` exists with all env vars documented
5. ✅ `docker-compose.staging.yml` exists with prod target
6. ✅ `/api/v1/health` reports database status (ok/unavailable)
7. ✅ `docker build --target prod` produces a working image
8. ✅ `docs/operations/startup.md` exists with startup/stop/health commands
9. ✅ CI green on the branch
10. ✅ No production deployment

---

## Estimated Effort

| Item | Effort |
|------|--------|
| Wire outbox worker | 30 min |
| Staging env template | 1 hour |
| Health DB ping | 1 hour |
| Docker build verification | 1 hour |
| Worker start/stop test | 1 hour |
| Operations documentation | 2 hours |
| **Total** | **~6.5 hours** |

---

## Branch + Commit Strategy

- Branch: `feat/g10-runtime-foundation`
- Base: `main` (`a8ae4ed`)
- Commits: 1 per work item (6 commits)
- No merge to main until MASTER authorizes

---

## Risks

| Risk | Mitigation |
|------|-----------|
| Worker crashes on startup (missing env) | Test locally with docker compose before CI |
| Health DB ping times out in sandbox | Keep 2s timeout; return "unavailable" not 500 |
| Prod image missing Prisma client | Verify `prisma generate` in build stage (already in Dockerfile) |
| keepalive.ts deletion breaks workflows | Keep file but add deprecation note; update docker-compose to use real worker |

---

## Not Authorized

- ❌ Merge to main
- ❌ Production deployment
- ❌ S3/email/OAuth wiring (separate tasks)
- ❌ G10 Phase 2 or 3 (needs prerequisites)
- ❌ Track 2 (Pre-Launch Closure)

**This task is the "wiring the tea machine to electricity" step.**
It does not add new features — it connects existing, tested code to
the runtime entry points it was designed for.
