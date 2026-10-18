# STR Platform -- G07 Core Acceptance Correction Report

> Mission: G07 -- Integration Core Functional Vertical Slice
> Status: Correction complete -- CI green (#136) -- NOT YET MERGED
> Date: 2026-10-18
> Author: GLM
> Trigger: MASTER 'G07 -- CORE ACCEPTANCE CORRECTION' directive

## 1. Corrections

Per MASTER directive, three fundamental gaps were fixed:

### Fix 1: Webhook Fail-Closed
- Webhook route now REJECTS events with missing/invalid signatures (401)
- Uses the ACTUAL webhookSecret (not the SHA-256 hash) for HMAC verification
- Added webhookSecret field to IntegrationConnection (stores actual secret for mock/dev)
- Timestamp freshness check (5-minute window)
- Connection validation (belongs to provider + is active)
- All required headers enforced

### Fix 2: Durable Outbox + Worker State Safety
- Worker now processes OutboxEvent records (not directly IntegrationJob)
- Flow: find undelivered OutboxEvent -> claim atomically -> find job ->
  verify still queued -> claim job atomically -> execute -> write result
  CONDITIONALLY (WHERE status='running' AND claimedBy=WORKER_ID)
- Prevents overwriting cancelled/timed_out status
- Atomic submitJob: IntegrationJob + OutboxEvent in one transaction
- Recovery of abandoned jobs (60s threshold)
- Timeout checking (timed_out status)

### Fix 3: Real Browser Acceptance Journey
- Full E2E test: admin approve -> lead create connection -> submit job ->
  trigger worker (test-only /api/integrations/process-next) -> verify result ->
  revoke connection -> verify new submission rejected
- Webhook E2E: missing signature rejected, forged signature rejected
- Added test-only endpoint for triggering worker in E2E (production runs standalone)

## 2. CI #136

- SHA: 1fec672
- Both jobs: 17/17 success
- Unit tests: 225 passed + 1 skipped (complex worker flow covered by E2E)
- E2E: 30 passed + 4 flaky (G03/G05/G06 email-timing, no G07 failures)
- Run URL: https://github.com/mayakilzy/SyrianTechRenaissance-Platform/actions/runs/39105580865

## 3. Request

GLM requests MASTER review of corrected G07 + explicit merge authorization.
