# Initial Source/Connector Discovery Candidates (Not Approved)


> **MANARA Foundation v1.0 · 2026-10-18 · Design specification, not implemented software.**
> Canonical source: `https://github.com/mayakilzy/repo-info/tree/main/AgentCraft-MANARA`.
> Code only: `https://github.com/mayakilzy/AgentCraft-MANARA`.
> General standards: `https://github.com/mayakilzy/repo-info/tree/main/START-HERE`.

## Important
**These are research candidates, not existing tested MANARA engines, guaranteed access, legal approvals, or live services.** Implementer must verify current API docs, license, rate limits, jurisdiction and sample results.

| Sector | Candidate data sources | What to investigate |
|---|---|---|
| Academic | OpenAlex, Crossref, arXiv, Semantic Scholar | Literature metadata, dated claims, cited works |
| Bio/health | PubMed, ClinicalTrials.gov, public regulators | Trials, study design, approval (not patient-specific advice) |
| Technology | GitHub, public Hugging Face metadata | Activity signals, model releases, code licensing |
| Patents | EPO OPS, Google Patents Public Datasets | Filing dates, assignees, patent families and access terms |
| Economy | World Bank, FRED, UN Comtrade | Economic series, trade definitions, revision history |
| Energy/EV | IEA public reports/data, US EIA | Batteries, electricity, manufacturing and cost datasets (some licensed) |
| Agriculture | FAOSTAT, NASA POWER, Copernicus public datasets | Crop, climate and regional measurements |
| Geo events | GDELT, ACLED where licensed | Events and source corroboration; no causal overclaims |
| Waste/recycling | OECD, Eurostat, UNEP, national statistical agencies | Waste streams, materials, processing rates and measurement definitions |
| Media | YouTube metadata/transcripts only where permitted | Extract claims as investigation leads, NOT proof |

## First approved bootstrapped candidates
Pick **one** accessible scholarly source and **one** demonstrably different official dataset for first real thin slice. Do not preemptively implement whole catalog; specialized engines are created based on task coverage. Confirm licenses and terms before reusing data commercially.
