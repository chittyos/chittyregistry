# Migration Queue — Global Capability Reconciliation

**Date:** 2026-11-09  
**Parent:** chittyos/chittyregistry#235

## P0 — authority / active-context safety

| Work | Class | Mutation gate |
|---|---|---|
| Reconcile ChittyRegister identity/certificate records with Registry catalog | identity/certification | approval required for registry/cert writes; #236 |
| Resolve MCP host/gateway ownership and route topology | routing/auth | approval required for routes/Access/OAuth; #163 |
| Reconcile duplicate ChatGPT skill projections against ChittyMarket canonical definitions | active-context | exact installed targets + rollback/reinstall before retire/uninstall; Market #240 |
| Preserve DRL eligibility ≠ authority hold | governance | ChittyTrust #9 / ChittyEntity #942; no production authority change |

## P1 — context and runtime drift

| Work | Class | Mutation gate |
|---|---|---|
| Normalize ChittyAgent definition → provider projection inventory | agent projections | source docs safe; Worker rename/delete/deploy approval-gated; ChittyEntity #944 |
| Reconcile placeholder Pentad frontmatter across core repos | metadata | update only after canonical IDs are proven |
| Supersede active-context docs that conflict with certified charters | docs | reversible PR/document archive |
| Reconcile ChittyHD cron paths / mounted-volume migration | machine automation | verify replacements; schedule removal requires explicit destructive approval |

## P2 — duplicate footprint

| Work | Class | Mutation gate |
|---|---|---|
| Resolve same-name cross-org repos | repo hygiene | no deletion/archive until consumer/unmerged-work scan |
| Reconcile duplicate local Git origins | machine/repo hygiene | preserve modified/untracked work |
| Reconcile Drive architecture drafts and TY-VY-RY versions | doc lifecycle | multi-account write target must be explicit |
| Reconcile ANIMAS draft projection ZIPs with ChittyMarket projection history | historical projection | archive only; preserve provenance |

## P3 — hygiene / observability

| Work | Class | Mutation gate |
|---|---|---|
| Extend fleet drift to compare hooks/cron/active instruction surfaces | local-only observability | read-only/local safe |
| Repair stale Ch1tty connector `gateway_status` projection | connector projection | no gateway mutation without #163 proof |
| Repair Dropbox search connector schema/link wrapper | connector projection | plugin/tool owner |
| Classify generic non-Chitty Worker names against canonical capabilities | runtime inventory | no retire/delete until owner mapping |

## Executed safe mutations

1. Moved Library `ANIMAS_PROJECT_BOOTSTRAP.md` intact into its `SUPERSEDED` subfolder after source-backed owner comparison with ChittyMarket.
2. Created this governance artifact set and the parent audit checkpoint branch.
3. Opened tracking issues only where an existing canonical owner/substream did not already cover the defect.

No production authorization, route, identity, secret, evidence, finance, repository deletion, or service deletion has been performed.
