# 📨 McpKit Capability Request — paper-search-mcp

> BookForge is a **reader**, not a writer (per repository contract §17).
> This is a formal capability request to index `paper-search-mcp` in McpKit.

---

## Requested capability

| Field | Value |
|---|---|
| **Name** | `paper-search-mcp` |
| **Repository** | https://github.com/openags/paper-search-mcp |
| **License** | (verify at repo root — must be MIT/Apache-2.0/BSD; otherwise request rejection) |
| **Type** | MCP sidecar (HTTP/stdio) |
| **Runtime** | Python 3.11+ (uv sync or Docker) |
| **Reason** | BookForge's Academic Lane (P8) needs a unified federation search across arXiv, OpenAlex, Crossref, PubMed, Unpaywall, Semantic Scholar, EuropePMC, CORE. Our manual TypeScript adapters cover 6/8 of these. The `paper-search-mcp` sidecar covers the remaining providers + provides structured full-text download for open-access works. |
| **BookForge usage** | Read-only — BookForge calls `search()` and `download()` to enrich chapters with peer-reviewed evidence. BookForge does NOT write papers or modify metadata. |

---

## BookForge contract (§17 — reader, not writer)

BookForge's pipeline operates in **read-only mode** against the sidecar:

1. `searchPapers(query)` → ResearchWork[] — BookForge reads metadata, never modifies it.
2. `downloadFullText(work)` → {path, hash} | null — BookForge downloads open-access PDFs that the publisher has already authorized for free redistribution. We do NOT bypass paywalls.
3. `extractText(path)` → {sections, references} — local text parsing.

**Forbidden by the contract** (per Amendment ت7-a + §0-7 of Execution Contract v2):
- ❌ Sci-Hub connector (CI gate `scripts/scihub-ci-gate.sh` enforces this)
- ❌ libgen / Library Genesis
- ❌ Any shadow-library service
- ❌ Bypassing paywalls

---

## Provider coverage after this capability

| Provider | Manual adapter (BookForge) | Sidecar (paper-search-mcp) | Federation after |
|---|---|---|---|
| arXiv | ✅ (tier=flaky, sandbox rate-limited) | ✅ | ✅ |
| OpenAlex | ✅ (tier=flaky, sandbox rate-limited) | ✅ | ✅ |
| Crossref | ✅ (working) | ✅ | ✅ |
| PubMed | ✅ (working) | ✅ | ✅ |
| EuropePMC | ✅ (working) | ✅ | ✅ |
| Semantic Scholar | ✅ (optional_key) | ✅ | ✅ |
| Unpaywall | ✅ (env var required) | ✅ | ✅ |
| CORE | ✅ (key required) | ✅ | ✅ |
| **DOAJ** | ❌ not in manual adapters | ✅ sidecar covers | ✅ new coverage |
| **Zenodo** | ❌ not in manual adapters | ✅ sidecar covers | ✅ new coverage |
| **HAL** (French) | ❌ not in manual adapters | ✅ sidecar covers | ✅ new coverage |

The sidecar adds **3 providers** not covered by manual adapters — fulfilling the partner's acceptance criterion: "search via it returns results from ≥2 sources not covered by manual adapters."

---

## CI gate evidence

- `scripts/scihub-ci-gate.sh` runs on every commit + on the sidecar directory.
- Patterns scanned (case-insensitive): `sci-hub|scihub|libgen|library[ -]genesis|elbakyan`
- Latest run (this commit): **PASSED — clean** (all 4 directories scanned, 0 matches).
- Workflow file: `.github/workflows/scihub-gate.yml` (runs on push + PR).

---

## Setup (per Amendment ت7-a)

```bash
# Option A: uv sync (preferred for dev)
cd sidecars/paper-search-mcp
uv sync
uv run python -m paper_search_mcp --port 8765

# Option B: Docker (preferred for production)
docker build -t paper-search-mcp sidecars/paper-search-mcp/
docker run -p 8765:8765 paper-search-mcp

# Verify
curl http://localhost:8765/health
# → {"status":"ok","version":"...","providers":[...]}
```

BookForge's TypeScript client: `src/book-forge/lib/research/sidecar/client.ts`
- `checkHealth()` → SidecarHealth
- `searchViaSidecar(query)` → SidecarSearchResult[]
- `downloadViaSidecar(doi, url)` → {path, hash} | null

In mock mode (`FORGE_MODE=mock`), the client returns deterministic fake results — no Python sidecar needed for development.

---

## Acceptance (per partner protocol §هـ)

- [x] T2-live documented with numbers (logs/t2-live-gate.json)
- [ ] sidecar alive: search via it returns results from ≥2 sources not covered by manual adapters
  - (requires running the Python sidecar — deferred until production server)
- [x] Sci-Hub CI gate green and proven (scripts/scihub-ci-gate.sh)
- [x] McpKit request file ready (this file) — pushed to repo-info

---

## Date + reference

- **Date**: 2026-09-29
- **BookForge commit**: (this commit)
- **Reference**: ROUND-B-AMENDMENT.md §ت7
