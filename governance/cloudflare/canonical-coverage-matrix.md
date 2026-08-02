---
title: Canonical Coverage Matrix — Cloudflare/MCP governance vocabulary
status: draft
canonical: false
work_key: chittyregistry-cloudflare-governance
tracking: chittyos/chittyregistry#163 · Linear CFDXN-125
verified_at: 2026-08-02
---

# Canonical Coverage Matrix

## Binding rule

Exactly one authority owns each lifecycle responsibility. The Access inventory is evidence and a test corpus, not an ontology-authoring surface.

## Verified authority model

| Responsibility | Authority |
|---|---|
| Ontology terms and relationships | ChittyCanon |
| Concrete shapes and validators | ChittySchema |
| Admission and lifecycle mutation | ChittyRegister |
| Enumeration and projection | ChittyRegistry |
| Runtime MCP projection/reconciliation | MCP portals and gateways |
| Deployed infrastructure state | Cloudflare |

## Evidence verified from ChittyCanon

ChittyCanon main contains:

- `ontology_terms`, with governed categories including `core_type`, `characterization`, `aspect`, `relationship`, `action`, `process`, `state`, and `quality`;
- the lifecycle `proposed → simulated → provisional → proven → canonical`;
- `term_observations` with generic semantic/usage/context drift signals;
- `divergence_registry`, which records intentional divergence from external standards and is **not** an operational infrastructure-finding taxonomy;
- a canonical requirement that provisional terms be referenced by ID rather than hard-coded strings.

Repository searches found no existing canonical entries for the proposed exact terms such as `mcp_server` or the authorization concept `trust_domain`. Absence from repository text is evidence that the terms are not declared in the checked-in Canon corpus, but live database contents must still be queried before submission.

## Decision matrix

| Proposed area | Existing canonical coverage | Decision |
|---|---|---|
| ChittyRegister catalog records and service bindings | Existing in `@chittyos/schema` main | **Reuse**; no new record layer |
| Registry projection envelope and source provenance | Legitimate ChittyRegistry projection concern | **Reuse**, referencing upstream shapes |
| Ontology lifecycle and term categories | Existing in ChittyCanon | **Reuse** |
| Generic semantic/usage/context drift observations | Existing in ChittyCanon | **Reuse/extend**, do not fork |
| External-standard divergence | Existing `divergence_registry` | **Do not misuse** for runtime drift |
| MCP classes (`mcp_server`, `mcp_portal`, `mcp_gateway`, etc.) | No checked-in exact terms found | **Propose to Canon** only after live-term query and necessity test |
| Ownership/management dimension values | No checked-in exact terms found | **Propose or map to existing terms** after live-term query |
| Access audience classes | No checked-in exact terms found | **Propose** only for values required by the 10-app corpus |
| Authorization trust domains (`legal`, `finance`, `business_ops`, `platform`, `managed_mcp`) | No checked-in authorization-domain taxonomy found; distinct from trust scoring | **Propose**, preserving Legal/Business separation |
| Relationship types (`protects`, `routes_to`, etc.) | Canon supports relationship category, not these checked-in terms | **Propose individually**; reference term IDs after provisional admission |
| Runtime drift findings (`authority_collision`, `unjustified_bypass`, etc.) | Canon has generic drift signals, not this checked-in taxonomy | **Map to generic observations first**; propose only irreducible terms |
| Lifecycle/disposition/posture enums | Partial upstream coverage | **Reuse/extend upstream**; registry must not define parallel enums |

## Merge gate

1. Query live ChittyCanon `ontology_terms` before asserting any proposed term is absent.
2. Map every Phase-0 enum/value to an existing Canon term ID, an existing Schema type, or a formally submitted Canon proposal.
3. Do not merge hard-coded provisional ontology strings into production schemas.
4. Reduce the provisional schemas to references and projection mechanics wherever upstream coverage exists.
5. Use the 10 Access applications to prove necessity, differentiation, and boundary cases for any proposed term.
6. No portal, gateway, or aggregator may become a registration or catalog authority.

## Immediate blockers

- Live ChittyCanon term query remains required.
- `schema.chitty.cc` authority collision remains unresolved.
- ChittySchema mutation endpoints that overlap ChittyRegister require disposition.
- Registration/control entrypoints require an estate-wide authority classification.
