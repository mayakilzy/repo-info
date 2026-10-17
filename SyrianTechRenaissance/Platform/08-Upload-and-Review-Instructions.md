# Upload and Review Instructions

## For the founder

The ZIP contains this exact tree nested under `SyrianTechRenaissance/Platform/`. Upload **all files** inside this tree to `mayakilzy/repo-info` at the same path, preserving UTF-8 and subdirectories. Do **not** upload this documentation pack to the code repository. `Platform.md` exists as a zero-byte placeholder; optionally replace its contents with a link to `README.md` after upload.

Suggested `Platform.md` content:

```markdown
# STR Platform — Documentation Hub
See [README](./README.md) for product specification, architecture, integration policy, missions G01–G10 and handoff.
```

If using the GitHub web interface, upload multiple files keeping relative paths or use `git clone`/copy/commit with the documentation repo. Confirm the resulting branch `main` contains this `README.md` and `missions/` folder before assigning GLM.

## For GLM

1. Read complete documentation pack and check current repo state. Do not start building arbitrary modules.
2. Execute **G01** first, report stack feasibility and architecture decisions requiring approval.
3. Work mission by mission; each mission requires tests and real browser evidence.
4. Commit code only in the separate platform repo; place reports in docs repo if permitted.
5. Never rewrite settled approved decisions without asking.

## GitHub write access fix

At package creation, connector can read `mayakilzy/repo-info` but reported `push:false` and a create_file attempt returned **403 Resource not accessible by integration**. To enable direct chat writing later, review connected GitHub app permissions and repository selection: grant **Contents: read and write** on `mayakilzy/repo-info` to the integration/account, reconnect/re-authorize if required, and confirm organization policies do not deny it. It may not be possible to elevate connector permission within the chat. Test again with a harmless new file in *docs repo only*. If read-only continues, manual upload remains reliable.
