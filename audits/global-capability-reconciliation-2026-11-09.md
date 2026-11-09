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
