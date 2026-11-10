# Global Capability Reconciliation — Observed-State Checkpoint

**Date:** 2026-11-09  
**Work key:** chittyregistry#235  
**Status:** ACTIVE / PARTIAL / SOURCE-GOVERNED  
**Mutation posture:** read-only inventory + reversible documentation only; destructive/auth/production mutations remain approval-gated.

## Governing doctrine

- One canonical capability, many controlled projections, no unmanaged clones.
- Proposed Unified Architecture / TVR τ remains proposed/conditional, not automatically Canon.
- Constitutional invariant: **Experience != Evidence != Reputation != Authority**.
- Legal/evidence and finance records remain outside generic cleanup.

## Surface coverage

| Surface | Status | Notes |
|---|---|---|
| ChittyRegistry repo/governance | OBSERVED | CHARTER/CHITTY/AGENTS + audits + open PR/issues |
| GitHub — chittyos | OBSERVED | 64 repos; 6 archived |
| GitHub — chittyfoundation | OBSERVED | 25 repos; 2 archived |
| GitHub — chittyapps | OBSERVED | 54 repos; 2 archived |
| GitHub — chicagoapps | OBSERVED | 11 repos; 0 archived |
| GitHub — furnished-condos | OBSERVED | 24 repos; 1 archived |
| Cloudflare — ChittyCorp | OBSERVED | 116 Workers; 52 named chittyagent-* |
| Cloudflare — ChittyFoundation | OBSERVED | 1 Worker (chittycanon) |
| Ch1tty gateway connector | DEGRADED | advertised gateway_status currently returns tool-not-found |
| Google Workspace GAM connector | OBSERVED | admin action catalog available; no mutation performed |
| Drive / Dropbox / ChatGPT-native / local-machine complete inventory | PARTIAL / NOT YET RECONCILED | continue recursively |
| Legal/evidence corpus | ROUTED OUT | legal-only boundary |
| Finance data | ROUTED OUT | finance boundary |

## P0/P1 findings

### F-GLOBAL-001 — Registry self-metadata is internally inconsistent

- `CHARTER.md`: Tier 2 Core Infrastructure.
- `AGENTS.md`: `tier: 9`, `service_chittyid: TBD-pending-canonical-mint`, explicit stub.
- `CHITTY.md`: minimal and does not carry the identity/architecture contract required by current compliance rules.

**Disposition:** HOLD / reconcile through ChittyRegister + ChittyCanon; do not guess a ChittyID.

### F-GLOBAL-002 — Pentad/identity stub drift is ecosystem-wide

Default-branch code search finds `TBD-pending-canonical-mint` in multiple core repositories, including ChittyMCP, ChittyBeacon, ChittyConnect, ChittyStorage, ChittyMonitor, ChittyAPI, ChittyRegistry, ChittyRouter, ChittyDispute, ChittySync, ChittyScore, ChittyLedger, ChittyServ and others.

Existing registry integrity audit (2026-08-18) already proves:
- 29 seeded Registry KV records bypassed ChittyRegister.
- 13 already had ChittyRegister identities in Neon.
- 16 were absent at that audit point.
- `chittyid`, `chittycert`, and `chittygov` were specifically identified as genuinely absent then.
- Direct KV seed bypass is historical/operator-originated, not an intrusion.

**Disposition:** MERGE into existing registry-integrity remediation; do not mint identities from repo metadata.

### F-GLOBAL-003 — MCP host ownership is contradictory in active docs

Observed:
- ChittyMCP CHARTER: universal aggregator for `mcp.chitty.cc`; CF gateway described as registry of record.
- ChittyConnect README: claims ChittyConnect owns the “dumb aggregate MCP semantics” for `mcp.chitty.cc`.
- Ch1tty CHARTER: slim/OAuth smart gateway; separate from canonical persistent-memory ownership.
- Live Cloudflare also contains `chittymcp-gateway`, `chittygateway`, `chittyrouter`, `chittyconnect`, `ch1tty`, and `chittyagent-ch1tty`.

**Disposition:** HOLD / MCP gateway reconciliation required. No route or deployment changes until source-of-truth ownership is resolved and Inspector/client proof exists.

### F-GLOBAL-004 — ChittyGateway canonical metadata is structurally suspect

`chittyos/chittygateway/CHARTER.md` currently declares canonical URI:
`chittycanon://core/services/canon`

That collides semantically with Canon rather than identifying ChittyGateway.

**Disposition:** QUARANTINE metadata claim pending Canon/Registry verification.

### F-GLOBAL-005 — ChittyRouter active docs contain architecture drift

- Certified CHARTER describes an AI-powered inbound/email/webhook routing platform.
- README still describes an “Ultimate Worker,” “handles all 73 domains,” and a migration/consolidation architecture.

**Disposition:** README is a likely active-context contamination source; reconcile against certified CHARTER and live deployment before editing.

### F-GLOBAL-006 — Cross-org repository-name collisions are material

Observed same-name repositories:

| Name | Repositories |
|---|---|
| chittychronicle | chittyos/chittychronicle; chittyfoundation/chittychronicle |
| chittyconcierge | chittyos/chittyconcierge; chittyapps/chittyconcierge |
| chittyfractal-fabric | chittyfoundation/chittyfractal-fabric; chittyapps/chittyfractal-fabric |
| chittyharvest | chittyfoundation/chittyharvest; furnished-condos/chittyharvest |
| chittyintel | chittyos/chittyintel; chittyapps/chittyintel |
| chittyledger | chittyos/chittyledger; chittyfoundation/chittyledger |
| chittyscore | chittyos/chittyscore; chittyfoundation/chittyscore |
| chittyscrape | chittyos/chittyscrape; chittyapps/chittyscrape |
| chittysync | chittyos/chittysync; chittyapps/chittysync |
| chittytrace | chittyapps/chittytrace; chicagoapps/chittytrace |
| demo-repository | multiple orgs |

Same-name is not proof of duplication. Each pair requires capability-owner and projection analysis.

**Disposition:** HOLD until per-pair source review.

### F-GLOBAL-007 — Live Cloudflare surface is substantially larger than canonical repo inventory alone implies

ChittyCorp account currently exposes 116 Workers, including:
- 52 `chittyagent-*` Workers.
- multiple gateway-like surfaces: `ch1tty`, `chittyagent-ch1tty`, `chittyagent-mcp-builder`, `chittyconnect`, `chittygateway`, `chittymcp`, `chittymcp-gateway`, `chittymcp-github`, `chittyrouter`.
- generic/non-Chitty names such as `bane`, `comptroller`, `daily-comms-triage`, `daily-comms-triage-realtime`, `different-things-learning`, `flow-hash-check`, and `paulina-agent`.

**Disposition:** PROJECT / HOLD classification required per Worker. Running status does not establish canonical ownership.

### F-GLOBAL-008 — Ch1tty connector projection is stale/degraded

Connected `gateway_status` invocation returned MCP error `Tool gateway_status not found`.

**Disposition:** PROJECT / degraded. Verify live gateway/connector contract before treating the connected surface as authoritative.

## Existing specialized substreams

Do not duplicate:

- chittyregistry#163 — Cloudflare governance: MCP, Access, route/domain, trust-domain reconciliation.
- chittyregistry#228 — legal workflow capability registry/runtime reconciliation.
- chittyfoundation/chittytrust#9 — DRL conformance HOLD.
- historical registry integrity audit — `audits/registry-record-integrity-2026-08-18.md`.

## Immediate recursive queue

1. Reconcile Registry / Register / Canon identity and Pentad metadata.
2. Reconcile MCP/gateway ownership and live route topology.
3. Classify same-name cross-org repositories by canonical job-to-be-done.
4. Reconcile `chittyagent-*` Workers against canonical agent definitions / Fabric projections.
5. Audit active-context files (`CLAUDE.md`, `AGENTS.md`, README architecture claims, skill/plugin projections) for superseded instructions.
6. Inventory local/remote machine hooks, worktrees, memories and scheduled loops.
7. Inventory ChatGPT-native projects/apps/skills/plugins where connected.
8. Inventory Drive/Dropbox documentation mirrors and isolate historical/proposed material.
9. Build supersession/quarantine/migration manifests.
10. Perform safe reversible cleanup, verify, and record receipts.

## Completion status

**NOT COMPLETE.**

This file is an observed-state checkpoint, not a canonical taxonomy or certification.


## Recursive checkpoint 2 — live registration/catalog comparison

Observed from `register.chitty.cc/api/v1/compliance/{service}` via authorized VM:

| Service | ChittyRegister ID | Register status | Certificate observation |
|---|---|---|---|
| chittyregistry | `did:chitty:REG-XEAR7G` | active | `CERT-MOCK-*`, mock signature |
| chittymcp | `did:chitty:REG-XEARK0` | active | `CERT-MOCK-*`, mock signature |
| chittyconnect | `03-1-USA-1023-T-2602-0-41` | active | non-mock certificate record |
| ch1tty | `did:chitty:REG-XEAL4T` | active | `CERT-MOCK-*`, mock signature |
| chittygateway | `did:chitty:REG-XEASLS` | active | `CERT-MOCK-*`, mock signature |
| chittyrouter | `did:chitty:REG-XE642M` | active | `CERT-MOCK-*`, mock signature |

The top-level compliance records returned `entity_type: null`; certificate envelopes reported `entity_type: A`. This requires contract interpretation before any metadata normalization.

Observed from live `registry.chitty.cc/api/v1/tools` (50 records total):
- `chittygateway` exists only as a 2026-05-27 seed-shaped record with no `chitty_id`, no `entity_type`, object-shaped relative endpoints, and no certificate.
- `chittyregistry` exists with `chitty_id: did:chitty:foundation:chittyregistry`, `entity_type: T`, and a self-anchored certificate reference.
- `chittymcp`, `chittyconnect`, `ch1tty`, and `chittyrouter` were absent from this `/api/v1/tools` query.

### F-GLOBAL-009 — Register/Registry identity divergence

The registration authority and discoverable registry are not projecting the same service identities for the gateway spine.

Example:
- ChittyRegister: `chittyregistry = did:chitty:REG-XEAR7G`
- ChittyRegistry catalog: `chittyregistry = did:chitty:foundation:chittyregistry`

**Disposition:** HOLD. Reconcile authoritative identity lineage before updating repo frontmatter or Registry KV. Do not mint replacement identities.

### F-GLOBAL-010 — Active mock compliance certificates

Five sampled active ChittyRegister records returned `CERT-MOCK-*` certificate IDs and `mock-signature-*` signatures.

**Disposition:** QUARANTINE as certification evidence. An `active` registration containing mock certificate material must not be treated as proof of production certification.

### F-GLOBAL-011 — Gateway catalog incompleteness

The primary Registry tools catalog does not contain four sampled active Register services (`chittymcp`, `chittyconnect`, `ch1tty`, `chittyrouter`).

**Disposition:** HOLD / reconcile via Register -> Registry projection. Absence from one catalog is not proof the service is unregistered.


## Recursive checkpoint 3 — cross-org duplicate-name tracing

### Runtime-backed ownership evidence

Cloudflare Workers Builds commit provenance was compared against candidate GitHub repositories:

| Capability | Live Worker | Build commit provenance | Current classification |
|---|---|---|---|
| chittyledger | `chittyledger` | commit `be39cd29...` exists in `chittyfoundation/chittyledger`, not `chittyos/chittyledger` | Foundation repo = observed runtime source; ChittyOS repo = quarantine/supersede candidate |
| chittychronicle | `chittychronicle` | commit `e6099bc7...` exists in `chittyos/chittychronicle`, not Foundation repo | ChittyOS repo = observed runtime source; Foundation repo = proposed/docs/historical candidate pending reconciliation |
| chittysync | `chittysync` | commit `965b2810...` exists in `chittyos/chittysync`, not `chittyapps/chittysync` | ChittyOS repo = observed runtime source; Apps repo = supersede/retire candidate |

### F-GLOBAL-012 — Placeholder CHARTERs can misidentify runtime owners

`chittyos/chittyledger`, `chittyos/chittychronicle`, `chittyos/chittyscore`, `chittyos/chittyconcierge`, and `chittyos/chittyintel` expose generic placeholder CHARTERs using `chittycanon://core/services/canon`. This pattern is not reliable evidence of ownership.

**Disposition:** QUARANTINE placeholder metadata claims; use runtime/build + Register/Canon evidence.

### F-GLOBAL-013 — ChittyLedger duplicate has a runtime-backed owner

- `chittyfoundation/chittyledger` contains the substantive ChittyLedger charter and matches the deployed Worker build commit lineage.
- `chittyos/chittyledger` currently presents a placeholder charter with Canon's URI.

**Provisional disposition:** KEEP Foundation implementation; SUPERSEDE/QUARANTINE ChittyOS duplicate after final consumer/reference scan. No repo deletion.

### F-GLOBAL-014 — ChittyChronicle ownership is the reverse of its documentation quality

- `chittyfoundation/chittychronicle` contains a detailed DRAFT charter.
- The deployed `chittychronicle` Worker build lineage matches `chittyos/chittychronicle`.
- Therefore the more complete Foundation document is not proof it owns the live implementation.

**Disposition:** HOLD. Reconcile Foundation DRAFT as proposal/mirror versus ChittyOS runtime owner before any merge/retire action.

### F-GLOBAL-015 — ChittySync Apps duplicate is likely stale

- Deployed `chittysync` Worker build lineage matches `chittyos/chittysync`.
- ChittyOS charter is v2.0.0 PENDING and describes the current multi-system synchronization role.
- `chittyapps/chittysync` has a minimal v1.0 charter under a different domain (`chittysync.chitty.cc`).

**Provisional disposition:** KEEP/PROJECT ChittyOS runtime; SUPERSEDE/RETIRE candidate for Apps repo after consumer scan.

### F-GLOBAL-016 — Same-name does not always mean duplicate capability

`chittyos/chittyscrape` is a general stateless browser/portal scraping service. `chittyapps/chittyscrape` is a TurboTenant-specific Apify automation gateway/actor. These are overlapping names but different jobs.

**Disposition:** KEEP ChittyScrape service; PROJECT/MERGE candidate for TurboTenant actor under the canonical scrape/harvest capability after ownership review. Do not merge by repository name alone.

### F-GLOBAL-017 — ChittyTrace collision is legal/evidence-sensitive

`chittyapps/chittytrace` describes general evidence/litigation tracking; `chicagoapps/chittytrace` describes court-oriented financial forensics/exhibit generation.

**Disposition:** LEGAL-ONLY / HOLD. Route to legal capability reconciliation; no generic retirement or data migration.

### F-GLOBAL-018 — ChittyFractal Fabric has explicit archived/active split

- `chittyfoundation/chittyfractal-fabric` is archived.
- `chittyapps/chittyfractal-fabric` is active.
- Both claim similarly named DRAFT orchestration capability/domain.

**Provisional disposition:** Foundation repo = KEEP HISTORICAL / SUPERSEDED candidate; Apps repo = active implementation candidate. Verify Canon/Registry before promoting.


## Recursive checkpoint 4 — ChatGPT, Library, machine and agent projections

### ChatGPT-native
- 106 Chitty-related skill surfaces are visible in the current runtime.
- Same canonical names have non-identical instructions, including `nb-development-defaults`, `capability-governor`, `chittyos-compliance`, `chittycontext`, legal skills, and duplicate finance defaults.
- ChittyMarket owns projection lifecycle and canonical skill definitions; issue chittyos/chittymarket#240 tracks reconciliation.
- Only visible ChatGPT Space is `2024D007847`; classified **LEGAL-ONLY**, not inspected.
- Current Project files: `ChittyAgent-Fabric.txt`, `GitHub Webhooks Overview.txt`, `memory-reconciliation-2026-11-06.md`.
- Library contains separate ChittyOS/ANIMAS/Skills areas and legal/property domains. Legal/property folders are excluded from generic cleanup.

### Safe Library mutation
`ANIMAS_PROJECT_BOOTSTRAP.md` was moved intact to:
`/ANIMAS: Plugins, Skills, Apps, Configs, CustomGPT/SUPERSEDED/ANIMAS_PROJECT_BOOTSTRAP.md`

Basis:
- the document self-identifies as discovery-first/noncanonical working guidance;
- it assigns projection-management ownership to ANIMAS;
- current ChittyMarket CHARTER explicitly owns capability projection definition/package/release/drift lifecycle.

No content was deleted or rewritten.

### Machine/runtime
- chittyserv-vm: 193 Git repos discovered in scanned roots, 183 unique origins, 2 duplicate origins.
- duplicate `chittycan`: current local-src clone clean at origin/main; normal checkout is two commits behind, no unique commits observed.
- duplicate `chittyrental`: same HEAD, but both clones contain local modifications; active clone also has untracked files. **HOLD — no deletion.**
- existing local `fleet-capability-drift.sh` is read-only/local-only and compares plugins/skills/agents, but not hooks/cron/config instructions.
- chittymini-00 currently mounts `/Volumes/chitty` and `/Volumes/chitty-apfs`; historic `/Volumes/ChittyHD - Data` is absent.
- four cron entries still target missing ChittyHD paths. Classify operationally stale-at-present but **HOLD** until replacement/migration history is resolved.
- legal/evidence systemd timers on chittyserv are routed out of generic cleanup.

### Agent projection inventory
- 60 `chittyagents/*` directories vs 52 live `chittyagent-*` Cloudflare Workers.
- provider-neutral Fabric definitions (`chief`, `gov`, `dev`, `audit`, `adversary`) intentionally have no Wrangler deployment.
- Builder transition is already governed by PR #759 + draft #761; deployed incumbent remains `chittyagent-mcp-builder`.
- KnowItAll is source-only/proposed; open PR #641 explicitly blocks deployment pending live resource roundtrip.
- `command` source projects as `chittyagent-command-production`, creating naming drift rather than a second canonical agent.
- `chittyagents/session/` contains only `skills-lock.json`; retirement/relocation candidate pending consumer scan.
- chittyos/chittyentity#944 owns agent definition/runtime reconciliation.

### Drive/Dropbox observations
- Google Drive search across three connected accounts shows significant ChittyOS architecture/documentation history and multiple TY-VY-RY manuscript versions in the jeanarlene-connected account.
- Drive artifacts are treated as document/history projections, not implementation authority.
- Dropbox live search connector currently fails schema validation because the wrapper rejects its own required `link_id`; Dropbox is therefore **NOT OBSERVED via live search**, not empty.
- Library mirror exposes Dropbox roots including DEVELOPMENT and AI CONFIGS & FILES, but those roots are not content-authoritative substitutes for a live Dropbox read.


## Recursive checkpoint 5 — Cloudflare AI + AI Audit surfaces

### Cloudflare AI API classification

Current Cloudflare API exposes provider-level AI capabilities including:
- model search: `GET /accounts/{account_id}/ai/models/search`
- model input/output schema discovery: `GET /accounts/{account_id}/ai/models/schema`
- file-to-Markdown transformation: `POST /accounts/{account_id}/ai/tomarkdown`
- supported Markdown format discovery: `GET /accounts/{account_id}/ai/tomarkdown/supported`

No references to these endpoints were found in sampled ChittyOS / ChittyFoundation / ChittyApps repositories.

**Disposition:** PROJECT / provider capability. These are Cloudflare runtime/provider primitives and must not become a new ChittyOS canonical identity, evidence, memory, provenance, or authority service. If adopted, expose them through the appropriate provider/runtime adapter or existing ingestion/tool surface.

### AI Audit classification

Cloudflare AI Audit currently exposes:
- `GET /zones/{zone_id}/ai-audit/robots`
- `POST /zones/{zone_id}/ai-audit/robots/bulk`

The response represents parsed robots/content-use policy such as:
- allow/disallow paths
- crawler/user-agent rules
- content-use signals
- crawl delay
- sitemaps

This is **not** model/agent behavioral auditing. It is an observed external content-use/crawler-policy surface.

**ChittyOS role:** governance/input signal only. It may inform external-content handling policy, crawler behavior, indexing/admissibility rules, or site-governance checks. It does not replace ChittyAudit, ChittyDNA, ChittyLedger, ChittyGov, or ChittyAuth.

### Live ChittyCorp observations

AI Audit returned policy data for:
- `chitty.cc`
- `ch1tty.com`

Both sampled zones currently report:
- general crawl/search allowed
- AI training disallowed
- reference/use permitted in the live Cloudflare response
- named AI crawlers such as GPTBot, ClaudeBot, Google-Extended, CCBot and others disallowed at `/`
- no sitemaps in the sampled response

AI Audit returned `not_found` for sampled:
- `chittycorp.com`
- `chittyfoundation.org`
- `itschitty.com`
- `distributedreputation.com`
- `cloudette.cc`

A 404 AI Audit result is classified as **NOT OBSERVED / no AI Audit policy result for that zone**, not as proof that the zone has no robots.txt or no AI policy.

### F-GLOBAL-019 — Cloudflare AI Audit is a policy-observation projection, not ChittyAudit

Naming collision risk: Cloudflare “AI Audit” could be mistaken for ChittyOS independent AI/agent audit. Its API is currently a robots/content-signal reader.

**Disposition:** PROJECT / external policy observer.

### F-GLOBAL-020 — live AI Audit response differs from current API reference vocabulary

Current API reference documents content signals including `ai-input`, `ai-train`, and `search`. The sampled live response for `chitty.cc` / `ch1tty.com` contains `search`, `ai-train`, and `use: reference`.

**Disposition:** HOLD provider-contract parsing. Do not hard-code one field set until direct robots/content-signal source and Cloudflare contract version are reconciled.

### F-GLOBAL-021 — no ChittyOS code currently consumes AI Audit or the new Cloudflare AI discovery/ToMarkdown APIs

Repository search across ChittyOS, ChittyFoundation, and ChittyApps found no current references to:
- `ai-audit/robots`
- `/ai/tomarkdown`
- `/ai/models/search`
- `/ai/models/schema`

**Disposition:** new provider capability candidates only. Reuse existing canonical ingestion/provider-adapter/governance owners if adopted; do not create standalone ChittyAI-Audit or ChittyToMarkdown services by default.
