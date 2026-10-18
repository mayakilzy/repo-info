# Package upload guide

## Destination
Upload this ZIP content beneath `https://github.com/mayakilzy/repo-info/tree/main/AgentCraft-MANARA`. ZIP root is already `AgentCraft-MANARA/`; preserve its relative structure and merge cautiously with existing `AgentCraft-MANARA.md`. Do not overwrite that file automatically.

## No code in this archive
All documents (`.md`, examples `.yaml/.json`) are blueprints and missions. GLM will create actual code in `https://github.com/mayakilzy/AgentCraft-MANARA` based on `START-HERE.md` and global standards.

## Security before invoking agents
Both repos currently appear public; `START-HERE/GeneralGH.zip` is described as token-containing. **Immediately rotate/revoke any real credential there and remove all exposed copies/history as appropriate**. Use secrets manager or approved private credential injection. Do not use, forward, store or log tokens from a public ZIP.

## Verification / first message to GLM
`Read repo-info/AgentCraft-MANARA/START-HERE.md and the whole foundation package, read the approved START-HERE global standards, verify both repository heads, and perform ONLY G00. Do not skip missing standards or pretend empty code repo contains an application. Report real commits, tests, blockers and security risks. Do not use public ZIP files as credentials.`

## Version constraints
Foundation v1.0 is design-only; AADS v1.2 is referred to but its ZIP was not readable in this authoring environment. The implementer must inspect its **actual contents** before finalizing the build stack; discrepancies require owner escalation. This package introduces no credentials and commits no code to GitHub.
