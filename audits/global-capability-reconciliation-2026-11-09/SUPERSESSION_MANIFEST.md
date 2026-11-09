# Supersession Manifest — Global Capability Reconciliation

**Date:** 2026-11-09  
**Parent:** chittyos/chittyregistry#235  
**Rule:** preserve historical source; remove obsolete material from active authority paths.

| Artifact | Previous role | Disposition | Replacement / owner | Evidence | Action |
|---|---|---|---|---|---|
| Library: `ANIMAS: Plugins, Skills, Apps, Configs, CustomGPT/ANIMAS_PROJECT_BOOTSTRAP.md` | Working capability packaging/projection bootstrap | SUPERSEDED / historical | ChittyMarket canonical projection control plane | ANIMAS file states noncanonical discovery-first status; ChittyMarket CHARTER v1.1.1 explicitly owns skill/plugin/app projection lifecycle | **Executed:** moved intact to `.../SUPERSEDED/ANIMAS_PROJECT_BOOTSTRAP.md` |
| `chittyos/chittyledger` | Same-name ChittyLedger repo with placeholder Canon URI | SUPERSEDE/QUARANTINE candidate | `chittyfoundation/chittyledger` | Live Cloudflare `chittyledger` build commit resolves to Foundation repo; Foundation has substantive charter | HOLD consumer scan before archive/rename |
| `chittyapps/chittysync` | Older same-name ChittySync repo | SUPERSEDE/RETIRE candidate | `chittyos/chittysync` | Live `chittysync` Worker build lineage resolves to ChittyOS repo | HOLD consumer scan |
| `chittyfoundation/chittyfractal-fabric` | DRAFT same-name capability repo | KEEP HISTORICAL / SUPERSEDED candidate | `chittyapps/chittyfractal-fabric` active implementation candidate | Foundation repo is archived; Apps repo active | Verify Registry/Canon before final disposition |
| legacy MCP Builder incumbent | Active MCP-specific builder | CONTROLLED SUPERSESSION IN PROGRESS | generalized `chittyagent-builder` | chittyentity PR #759 containment + draft PR #761 successor; production incumbent still required | Do not cut over outside governed Builder plan |

No repository, deployment, or historical source is deleted by this manifest.
