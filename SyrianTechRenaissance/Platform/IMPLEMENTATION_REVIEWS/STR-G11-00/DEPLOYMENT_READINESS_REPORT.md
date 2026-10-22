# STR-G11-00 — Deployment Readiness Report

> **Mission:** STR-G11-00
> **Code repo fix commit SHA:** `e8386fa`
> **Test execution date:** 2026-10-22

---

## 1. Executive Summary

Deployment readiness was reviewed against the G10-04A deployment
blueprint and the existing G10-03 staging validation CI. **No new
deployment defects were found.** The G11-00 fix (DEFECT 1 + DEFECT 2)
is a service-layer code change that does NOT affect deployment
configuration.

The classification below uses the categories mandated by the G11-00
mission: `STATIC REVIEW`, `SIMULATED`, `RUNTIME VERIFIED`, and
`NOT TESTED`.

---

## 2. Deployment Configuration Review

### 2.1 Dockerfile (multi-stage: dev / build / prod)

| Aspect | Status | Evidence |
|--------|--------|----------|
| Base image (`oven/bun:1.3`) | STATIC REVIEW | G10-01 confirmed |
| `bun.lock` copied to prod stage | RUNTIME VERIFIED | G10-01 root-cause fix; CI #21 confirms |
| Standalone Next.js output (`node server.js`) | RUNTIME VERIFIED | G10-02 integration CI B1 |
| Worker source + tsconfig + package.json + bun.lock copied | RUNTIME VERIFIED | G10-02 integration CI C1-C2 |
| `bun install --production --frozen-lockfile` in prod stage | RUNTIME VERIFIED | G10-02 CI + Docker Production Build CI |
| Healthcheck (node-based, not curl) | RUNTIME VERIFIED | G10-03 staging validation CI A3 |
| No dev dependencies in prod image | RUNTIME VERIFIED | G10-03 staging validation CI A1 (curl absent) |

### 2.2 docker-compose.staging.yml

| Aspect | Status | Evidence |
|--------|--------|----------|
| PostgreSQL 17-alpine | RUNTIME VERIFIED | G10-02 integration CI C1 |
| `migrate` one-shot service | RUNTIME VERIFIED | G10-03 staging validation CI C2 |
| App depends on migrate completing successfully | RUNTIME VERIFIED | G10-03 staging validation CI C3 |
| App healthcheck (node-based) reaches `healthy` | RUNTIME VERIFIED | G10-03 staging validation CI C4 |
| Readiness endpoint returns 200 | RUNTIME VERIFIED | G10-03 staging validation CI C5 |
| Worker starts and enters polling loop | RUNTIME VERIFIED | G10-03 staging validation CI C6 |
| Failed migration blocks dependent startup | RUNTIME VERIFIED | G10-03 staging validation CI C7 |
| App port bound to 127.0.0.1 only (not 0.0.0.0) | RUNTIME VERIFIED | G10-03 staging validation CI B1 |
| Postgres NOT exposed to host | RUNTIME VERIFIED | G10-03 staging validation CI B2 |
| `--env-file .env.staging` required (compose interpolation) | RUNTIME VERIFIED | G10-03-FIX-01 found + fixed this |
| `restart: always` on postgres/app/worker | STATIC REVIEW | docker-compose.staging.yml |

### 2.3 docker-compose.integration.yml (for CI / local reproduction)

| Aspect | Status | Evidence |
|--------|--------|----------|
| Disposable PostgreSQL + migrate + seed + app + worker | RUNTIME VERIFIED | G10-02 integration CI runs against this |
| Tests B1-B5 (health/readiness/outage/recovery) | RUNTIME VERIFIED | G10-02 integration CI |
| Tests C1-C4 (worker startup/job/SIGTERM/restart) | RUNTIME VERIFIED | G10-02 integration CI |

### 2.4 Prisma migrations

| Aspect | Status | Evidence |
|--------|--------|----------|
| 11 forward-only migrations | RUNTIME VERIFIED | Applied during G11-00 test setup |
| `migration_lock.toml` (provider=postgresql) | STATIC REVIEW | prisma/migrations/migration_lock.toml |
| `prisma migrate deploy` is idempotent | RUNTIME VERIFIED | G10-02 CI + G10-03 staging validation CI C2 + G11-00 test setup |
| Migration ordering enforced (migrate before app/worker) | RUNTIME VERIFIED | G10-03 staging validation CI C3 + C7 |

### 2.5 Environment configuration

| Aspect | Status | Evidence |
|--------|--------|----------|
| `.env.staging.example` template | STATIC REVIEW | .env.staging.example in repo |
| `.env.staging` is gitignored | STATIC REVIEW | .gitignore §"env files" |
| `POSTGRES_PASSWORD` required at compose-up | RUNTIME VERIFIED | G10-03-FIX-01 found + fixed the `${POSTGRES_PASSWORD:?...}` interpolation |
| Zod env validation at boot | RUNTIME VERIFIED | G10-01v tests (env validation throws on missing required vars) |
| `AUTH_SECRET` min 16 chars | STATIC REVIEW | src/lib/config.ts Zod schema |
| `INTEGRATION_ENCRYPTION_KEY` or `AUTH_SECRET` used for encryption | RUNTIME VERIFIED | G11-00 test setup (without these, g09-encryption-audit tests fail) |

### 2.6 Graceful shutdown

| Aspect | Status | Evidence |
|--------|--------|----------|
| Worker AbortSignal + cancellableSleep | RUNTIME VERIFIED | g10-01v-worker-shutdown.test.ts + G10-02 CI C3 |
| 30-second forced-exit safeguard | STATIC REVIEW | src/worker/index.ts |
| SIGTERM clean exit (exit 0) | RUNTIME VERIFIED | G10-02 CI C3 (strict: exit code 0 + 3 specific log messages) |

### 2.7 Backup and restore

| Aspect | Status | Evidence |
|--------|--------|----------|
| Backup procedure (`pg_dump`) documented | STATIC REVIEW | docs/operations/backup-restore.md §2 |
| Restore procedure documented | STATIC REVIEW | docs/operations/backup-restore.md §3 |
| Backup-and-restore round-trip test | NOT TESTED | Requires real server; deferred to G10-04B Step 10 |

### 2.8 Secret handling

| Aspect | Status | Evidence |
|--------|--------|----------|
| No secrets in Git | STATIC REVIEW | .gitignore + git ls-files confirmed |
| PAT stored at `/home/z/my-project/.secrets/gh_token` (mode 0600) | STATIC REVIEW | (GLM workspace, not pushed) |
| Webhook secrets encrypted at rest (AES-256-GCM) | RUNTIME VERIFIED | g09-encryption-audit.test.ts (13 tests) |
| `assertEncryptedInProduction` rejects plaintext in production | RUNTIME VERIFIED | g09-encryption-audit.test.ts test #9 |
| No secret leakage in audit logs | RUNTIME VERIFIED | g09-audit-integrity.test.ts |
| No secret leakage in error messages | RUNTIME VERIFIED | g09-encryption-audit.test.ts test #13 |

### 2.9 Staging / production config separation

| Aspect | Status | Evidence |
|--------|--------|----------|
| `docker-compose.yml` (dev) | STATIC REVIEW | Hot reload, source mounts |
| `docker-compose.staging.yml` (staging) | STATIC REVIEW | Prod image, no source mounts, restart: always |
| `docker-compose.integration.yml` (CI) | STATIC REVIEW | Disposable, test credentials |
| `.env.example` (dev) | STATIC REVIEW | .env.example |
| `.env.staging.example` (staging) | STATIC REVIEW | .env.staging.example |
| No production `.env.production` exists yet | STATIC REVIEW | Production deployment is G10-04B+ |

---

## 3. G11-00 Fix Impact on Deployment

The G11-00 fix (DEFECT 1 + DEFECT 2) is a **service-layer code change**
in `src/modules/proposals/service.ts`. It does NOT affect:
- Dockerfile
- docker-compose.staging.yml
- docker-compose.integration.yml
- Prisma schema or migrations
- Environment configuration
- Reverse proxy / HTTPS
- Backup / restore

The fix adds 2 DB queries per call to `createProposal`,
`isInstitutionalReviewer`, and `isQualifiedSteward`. The queries are
indexed lookups by primary key (`User.id`), so they are O(1) and do
not measurably affect performance.

---

## 4. Outstanding Deployment Blockers

These are NOT G11-00 blockers. They are staging-deployment blockers
that require MASTER input (per G10-04A blueprint Track C):

1. Server discovery output (G10-04A script not yet run on real server).
2. D1: Reverse proxy choice.
3. D2: Topology.
4. D3: Staging subdomain.
5. D10: First admin user email.

These are NOT production-launch blockers (which are listed in
`docs/operations/backup-restore.md` §12.4):

1. Test email file permissions.
2. Prevent `STR_TEST_MODE` in production.
3. Real email delivery service.
4. Distributed rate limiter.
5. Google OIDC credentials.
6. Interrupted worker recovery during mid-processing (per-adapter).

---

## 5. Conclusion

Deployment readiness is unchanged from G10-04A. The G11-00 fix is a
service-layer code change that does not affect deployment
configuration. All deployment-related aspects that were
RUNTIME VERIFIED in G10-03 staging validation CI remain valid.

**G11-00 deployment readiness: SAME AS G10-04A** (READY for staging
deployment subject to MASTER providing Track B inputs).

No new deployment defects found. No remediation needed.
