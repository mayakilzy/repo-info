# STR Integrations Core — v1 Contract & Security

## Mission

Build the **integration framework in v1**, not merely a directory UI. Real integrations with independent AgentCraft apps, Academy, member tools, n8n, Make, Airtable, Google Drive and others are **future separate work**, subject to review and user authorization. Connector launch must not grant access to proprietary code or broad keys.

## Architecture units (logical; same modular monolith)

1. **Provider Registry:** provider ID, owner, base origin, trust status, version and supported capability descriptors.
2. **Capabilities:** capability code, input/output schema, required permission scopes, risk classification and execution mode.
3. **Connections:** actor/org/project connection, token secret reference, active/revoked state, scopes and consent history.
4. **Connector Interface:** versioned methods to validate config, submit jobs, check status, normalize results, revoke.
5. **Dispatcher/Outbox Worker:** durable delivery, idempotence, backoff under safe configuration, cancellation/expiry.
6. **Webhook Receiver:** authenticate, dedupe, validate event schema, reconcile status, audit.
7. **Execution Ledger:** job state, origin, subject, requested capability, timestamps, result/evidence refs, failure category.
8. **Policy:** user/project/steward approval before accessing tools; enforcement independent from UI.

## API proposal (paths and schemas to be finalized in G01 ADR)

- `GET /api/v1/integrations/providers` — accessible, approved and permitted providers.
- `GET /api/v1/integrations/providers/{id}/capabilities` — declared capability contracts.
- `POST /api/v1/integrations/connections` — initiate consent/connection; no secret in response.
- `GET /api/v1/integrations/connections` — only actor's authorized connections.
- `DELETE /api/v1/integrations/connections/{id}` — revoke and prevent new jobs.
- `POST /api/v1/integrations/jobs` — submit scoped, idempotent capability job.
- `GET /api/v1/integrations/jobs/{id}` — authorized status/result summary.
- `POST /api/v1/integrations/webhooks/{providerId}` — signed provider event, not authenticated by user session.
- `GET /api/v1/admin/integrations/audit` — narrowly authorized audit information.

Sample request:

```json
{
  "connectionId": "conn_example",
  "capability": "application.test",
  "subject": {"kind":"project","id":"project_example"},
  "idempotencyKey":"unique-per-request-key",
  "payload":{"repositoryRef":"pre-authorized-repository-reference"}
}
```

Response `202 Accepted` with `jobId` and status `queued` is **not** evidence the operation succeeded. Final statuses: `succeeded | failed | cancelled`; status updates authenticated and transitions validated.

## Auth and safeguards

- Provider and user connections are different concepts; capability permissions bound to project/membership/grants.
- OAuth2/OIDC authorization code + PKCE for providers supporting it; provider API keys only where suitable with minimal scopes and encrypted server-side storage.
- Per-provider endpoint allowlist; DNS/IP resolution guards for SSRF; deny link-local/private/loopback/metadata targets; redirect and DNS rebinding protections.
- Webhook HMAC signature with timestamp and replay window where provider supports; alternatively provider-specific authenticated fetch confirmation. Reject unsigned untrusted events.
- Outbox job dispatch idempotent; inbound event dedup by `(providerId,eventId)`; retries do not double-charge or duplicate side effects when provider offers an idempotency mechanism.
- Provider registration through review/approval, not user-supplied executable scripts in STR runtime.
- Audits scoped and scrubbed; rotate/revoke secrets, timeouts and circuit behavior, resource grants enforced and revocation effective.
- External services must never access project artifacts other than exact approved references.

## Mock Connector acceptance

Mock connector MUST run through **the same registry, auth, connection, job dispatcher and event flow** as real adapters; test success, failure, expiry, cancelled, event replay, wrong signature, cross-project access and revoked connection. Demonstrates extension point without representing an actual third-party integration.

## Integration definition sample

See `contracts/provider-example.json` (illustrative only). G07 must publish machine-validated input/output schemas, API reference and integration provider onboarding guide.
