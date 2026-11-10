# Quarantine Manifest — Global Capability Reconciliation

**Date:** 2026-11-09  
**Parent:** chittyos/chittyregistry#235

| Artifact / claim | Reason quarantined | Risk if reused | Required decision / owner |
|---|---|---|---|
| `chittyregistry/AGENTS.md` identity/tier frontmatter | `service_chittyid=TBD-pending-canonical-mint`; tier 9 conflicts with Tier 2 CHARTER | false canonical identity/tier propagated to agents | ChittyRegister + Canon identity reconciliation (#236) |
| `CERT-MOCK-*` active ChittyRegister certificates | sampled active services return mock cert IDs/signatures | mock bootstrap artifact mistaken for certification proof | ChittyRegister/ChittyCertify contract review (#236) |
| `chittygateway/CHARTER.md` canonical URI `chittycanon://core/services/canon` | points to Canon rather than gateway identity | wrong service ownership/registration | Canon + Registry verification |
| generic placeholder CHARTERs using `chittycanon://core/services/canon` | repeated across same-name/core repos | documentation quality mistaken for canonical ownership | per-capability runtime/Register reconciliation |
| ChittyRouter README “Ultimate Worker / all domains” architecture | conflicts with certified inbound-routing CHARTER and current estate | obsolete consolidation doctrine contaminates new work | router owner review |
| duplicate live ChatGPT skills with identical trigger names but divergent instructions | runtime chooses among non-identical behaviors | nondeterministic governance and active-context contamination | ChittyMarket #240 |
| standalone `capability-governor` projection | materially diverges from current ChittyMarket canonical definition | older governance behavior can override Market projection | ChittyMarket #240 |
| `nb-development-defaults` same-name router/canonical copies | three non-identical behaviors share one trigger name | router/canonical role collision | ChittyMarket #240 |
| Dropbox live-search result state | connector schema rejects required `link_id` | “no results” could be falsely inferred | connector/plugin repair; use Library mirror only as observed projection |
| Ch1tty `gateway_status` connected projection | advertised tool returns “tool not found” | stale connector treated as live gateway truth | MCP gateway reconciliation (#163) |

Quarantine means “do not use as active authority,” not “delete.”
