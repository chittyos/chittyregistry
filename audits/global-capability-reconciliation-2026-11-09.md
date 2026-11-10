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

### F-GLOBAL-020 — Cloudflare AI Audit reference omits a live Content-Signal field

Current API reference documents `ai-input`, `ai-train`, and `search`. Direct live `robots.txt` inspection for both `chitty.cc` and `ch1tty.com` confirms Cloudflare Managed Content documents **four** signal concepts — `search`, `ai-input`, `ai-train`, and `use` — and currently emits:

`Content-Signal: search=yes,ai-train=no,use=reference`

Therefore `use: reference` is a real zone policy directive, not an AI Audit parser artifact.

**Disposition:** RESOLVED as provider-documentation drift. ChittyOS consumers must parse Content-Signal extensibly rather than hard-code only the API-reference field set. Absence of `ai-input` means no permission/restriction is expressed through that specific signal; do not infer yes/no.

### F-GLOBAL-021 — no ChittyOS code currently consumes AI Audit or the new Cloudflare AI discovery/ToMarkdown APIs

Repository search across ChittyOS, ChittyFoundation, and ChittyApps found no current references to:
- `ai-audit/robots`
- `/ai/tomarkdown`
- `/ai/models/search`
- `/ai/models/schema`

**Disposition:** new provider capability candidates only. Reuse existing canonical ingestion/provider-adapter/governance owners if adopted; do not create standalone ChittyAI-Audit or ChittyToMarkdown services by default.


## Recursive checkpoint 6 — Cloudflare AI estate projection map

### AI Gateway live inventory

Observed gateways in ChittyCorp account:
- `central`
- `chittycounsel`
- `default`
- `finance`

Observed activity metadata:
- `central`: 560 logs; latest observed 2026-11-08.
- `chittycounsel`: 98,997 logs; latest observed 2026-08-18.
- `default`: 9 logs; latest observed 2026-08-09.
- `finance`: 33 logs; latest observed 2026-09-18.

No request/response bodies were inspected.

Source documentation and `agent-core/src/ai-gateway.ts` identify `central` as the canonical general model-routing gateway. Domain gateways remain provider-side projections; activity count alone does not authorize retirement.

### F-GLOBAL-022 — live ChittyAgent UI advertised a retired AI Gateway

`chittyagents/ui/wrangler.jsonc` declared `AI_GATEWAY=chittygateway`, and production `https://agent.chitty.cc/health` returned `gateway:"chittygateway"`.

The live account no longer contains a `chittygateway` AI Gateway. Current canonical general router is `central`.

**Safe source correction opened:** chittyos/chittyentity#947
- source var -> `central`
- deterministic binding seed mirror -> `central`
- no model-execution-path change; fixes active metadata/config drift.

### AI Search live inventory

Namespaces:
- `default` — 0 instances
- `finance` — 1 enabled instance; gateway `finance`; Qwen3 embedding; engine v3; hybrid search + cache enabled
- `memory` — 0 instances
- `legal` — 1 enabled instance; gateway `chittycounsel`; Qwen3 embedding; engine v3; hybrid search + cache enabled

The `memory` namespace description declares one authorized instance per Canon Synthetic Person. ChittyConnect MemoryCloude code implements lazy `namespace.get()/create({id})` provisioning on the first authorized persist.

**Interpretation:** zero memory instances is not an architecture contradiction by itself. It means no per-P AI Search instance presently exists. Combined with the existing canonical-memory write outage, this is a direct readiness/canary condition under the existing MemoryCloude work item, not a reason to invent a replacement store.

### Cloudflare AI provider catalog

Read-only API currently returns:
- 73 Workers AI models in model search.
- model schema API exists for machine-readable input/output contracts.
- ToMarkdown supports 28 observed formats including PDF, common images, HTML/XML, spreadsheets, DOCX/ODT, PPTX and OpenDocument presentations.

**ChittyOS disposition:**
- Model search/schema = provider capability metadata for runtime adapters/resolvers. Do not copy it into a competing canonical model registry.
- ToMarkdown = provider transform utility. Output is derivative material and must retain source/provenance linkage; it does not replace ChittyStorage, ChittyDNA, legal evidence extraction rules, or native artifact tooling.


## Recursive checkpoint 7 — duplicate `itcan.llc` Cloudflare zone

Full ChittyCorp-visible zone inventory currently contains 71 zones and one duplicate zone name: `itcan.llc`.

### Authoritative active zone

- zone id: `1c87458cb3493b53fabcbd4fa9e45ae0`
- account: **Digital Dossier** (`84f0f32886f1d6196380fe6cbe9656a8`)
- status: active
- created: 2024-12-03
- activated: 2024-12-04
- authoritative Cloudflare nameservers: `addilyn.ns.cloudflare.com`, `quincy.ns.cloudflare.com`
- registrar observed: Spaceship
- 22 DNS records
- account-scoped Worker custom domains:
  - `itcan.llc` -> `itcanbe-llc-site`
  - `www.itcan.llc` -> `itcanbe-llc-site`
- Worker `itcanbe-llc-site` exists in Digital Dossier; no Workers Builds history was returned for it and no GitHub source reference was found in the sampled global code search.

### Pending ChittyCorp zone

- zone id: `568e1b88cf04efe9d2e0549c22b994b9`
- account: **ChittyCorp LLC** (`0bc21e3a5a9de1a4cc843be9c3e98121`)
- status: pending
- created: 2026-11-06 15:59:43Z
- new nameservers: `ken.ns.cloudflare.com`, `melany.ns.cloudflare.com`
- `original_name_servers`: `quincy.ns.cloudflare.com`, `addilyn.ns.cloudflare.com` — the current Digital Dossier authority
- 24 DNS records
- no Worker routes
- no Page Rules
- no Worker custom-domain bindings in ChittyCorp for `itcan.llc`

Audit Logs v2 confirms the ChittyCorp zone was manually created through the Cloudflare dashboard on 2026-11-06 15:59:42Z, immediately followed by DNS scan/import and a free-plan subscription.

No contemporaneous project/governance record was found that establishes an approved cross-account zone migration. Existing November 6 reconciliation context was read-only and explicitly avoided migration/deletion/creation as an inferred cleanup step.

### F-GLOBAL-023 — `itcan.llc` pending zone is an unfinished migration artifact, not an activation-ready duplicate

The pending zone's DNS scan resolved currently proxied/managed hostnames and imported Cloudflare edge A/AAAA addresses. Examples include apex/www and service hostnames. This is not equivalent to the active zone's source-of-truth DNS semantics.

The active zone also owns Worker custom-domain mappings to `itcanbe-llc-site`; the pending zone has none.

Changing registrar nameservers to the pending ChittyCorp zone in its current state would risk:
- breaking the existing Worker-served website,
- replacing source CNAME/managed records with scanned edge IP representations,
- creating Cloudflare-to-Cloudflare origin/routing ambiguity,
- changing account-level policy/certificate/AI Audit state without a governed migration receipt.

**Disposition:** QUARANTINE / HOLD as unfinished cross-account migration artifact.

Do not activate, delete, or normalize this zone by inference.

### Required migration proof before any zone move

1. Establish intended canonical Cloudflare account for IT CAN BE LLC / `itcan.llc`.
2. Export and semantically diff active DNS vs target DNS; do not trust scanner output as migration source.
3. Recreate/transfer `itcanbe-llc-site` deployment in the target account or otherwise establish equivalent target origin.
4. Recreate Worker custom domains and applicable certificates/settings in target account.
5. Validate email/DKIM/DMARC/SRV/Microsoft/Google records from source, not resolved edge IPs.
6. Verify Access/AI Audit/security/policy parity.
7. Establish rollback: registrar nameservers remain reversible to the active Digital Dossier zone until target verification passes.
8. Only then perform a nameserver cutover under explicit approval.


## Recursive checkpoint 8 — deployed-version resource truth + ChittyTrust environment drift

### Runtime-binding methodology correction

Cloudflare Worker `/settings` responses were found to under-represent environment-scoped resources for at least `chittyagent-resolve`.

Verification:
- source Wrangler declares `RESOLVE_STATE` KV, `RESOLVE_DB` D1, `RESOLVE_AGENT` DO, and service binding.
- script settings endpoint surfaced only a secret binding.
- currently deployed version `a49e3476-8a2f-44a1-bb26-801586c0336d` contains the full expected resource set.

**Audit rule correction:** deployed Worker **version resources** are the runtime binding source of truth. Do not retire a Cloudflare resource because it is absent from the script settings endpoint.

A corrected deployed-version scan of all 116 current Workers confirms:
- `chittyagent-resolve` uses D1 `0dd42471-76be-4294-af21-029b0f1225a2`.
- `chittyconnect` uses legacy `TOKEN_KV`.
- neither candidate MemoryCloude `MEMORY_KV` namespace is currently bound.

### F-GLOBAL-024 — ChittyTrust production hostname is running the development/default environment

Current source `chittyfoundation/chittytrust/wrangler.jsonc` places production resources under `env.production`, including:
- `TRUST_CACHE` KV
- Hyperdrive
- production vars
- production route
- tail/observability resources

Current production deployment:
- deployment `bf4c98d0-6c4a-4005-bb2c-9e8042b42308`
- version `5a523c0f-ebed-4858-ab13-bd6746e92f5e`
- currently deployed version bindings contain only `CHITTYLEDGER_TOKEN`.

Cloudflare Builds log for main build `ea0ff955-9414-4c09-8182-a0438fa004b6` explicitly shows:
`Executing user deploy command: npx wrangler deploy`
followed by Wrangler's warning that multiple environments exist but no target environment was specified.

Live read-only canary:
- `/health` = HTTP 200 / status ok
- `/api/v1/status` = HTTP 200 but `environment:"development"`
- `/v1/evaluate` = HTTP 500 because `TRUST_CACHE` is undefined

**Disposition:** QUARANTINE current production trust execution as deployment-nonconformant. Tracked by chittyfoundation/chittytrust#12.

Do **not** fix by immediately deploying `--env production`: restoring `TRUST_CACHE` would also restore the unauthenticated reporter-write path already blocked by DRL conformance #9/#11.

### F-GLOBAL-025 — ChittyTrust health endpoint is false-green

`/health` reports healthy while:
- production hostname identifies itself as development,
- required resource binding is absent,
- read-only evaluation throws 500.

**Disposition:** health contract must include environment/resource readiness before certification or routing can rely on it.
