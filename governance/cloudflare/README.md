---
uri: chittycanon://docs/gov/architecture/cloudflare-governance-model
namespace: chittycanon://docs/gov
ctype: architecture
version: 0.1.0
status: DRAFT
registered_with: chittycanon://core/services/canon
title: Cloudflare Governance Model
certifier: chittycanon://core/services/chittycertify
visibility: INTERNAL
---

# Cloudflare Governance Model

## Status

Phase 0 governance artifact. This document defines intent and classification only. It does not authorize production mutation.

## Objective

Normalize Cloudflare runtime state into governed ChittyOS projections without creating a new authority or database.

```text
Git-governed intent
  -> ChittySchema validation
  -> ChittyRegister admission
  -> ChittyRegistry enumeration
  -> reconciler
  -> Cloudflare deployed state
```

## Authority boundaries

| Authority | Owns |
|---|---|
| ChittySchema | Object contracts, vocabularies, validation rules |
| ChittyRegister | Admission and lifecycle mutation |
| ChittyRegistry | Enumerated Cloudflare objects, relationships, posture, disposition |
| ChittyMCP | MCP federation and runtime reconciliation |
| Cloudflare | Deployed infrastructure state |

## Governed object classes

- access_application
- access_policy
- trust_domain
- worker
- worker_route
- worker_custom_domain
- dns_record
- access_application_attachment
- mcp_server
- mcp_portal
- service_binding
- credential_reference

## Attachment ontology

| Attachment | Meaning |
|---|---|
| managed_portal | Cloudflare-managed MCP Portal hostname |
| worker_custom_domain | Whole-hostname Worker attachment |
| worker_route | Host/path Worker route |
| access_application | Identity/policy enforcement boundary |
| service_binding | Private Worker-to-Worker execution |
| dns_only | Resolution without runtime ownership |

## Route/domain rules

1. A managed MCP Portal owns its hostname.
2. A Worker Custom Domain owns its hostname.
3. A Worker Route owns an explicit host/path pattern.
4. `agent.chitty.cc/{agent}/mcp` is the canonical direct Chitty-owned agent route pattern.
5. `ext.chitty.cc/{provider}/mcp` is reserved for Chitty-controlled projections of externally owned MCP implementations.
6. Authority hosts may expose `{collection}/{identifier?}/{transport}` where the collection is semantically necessary.
7. Compound names must not repeat semantics supplied by the parent hostname or path.
8. Aliases require an explicit canonical target and lifecycle disposition.

## MCP projection model

| Surface | Role |
|---|---|
| `mcp.chitty.cc` | Cloudflare-managed curated general portal |
| `{role}.chitty.cc` | Cloudflare-managed role/domain portal |
| `agent.chitty.cc/{agent}/mcp` | Direct deterministic Chitty-owned MCP server |
| `aggregate.chitty.cc/mcp` | Broad deterministic registry-driven federation |
| `mcp.ch1tty.com/mcp` | Intelligent selection and orchestration |
| `ext.chitty.cc/{provider}/mcp` | External provider projection |

## Access model

Access applications must state intended access before policy cleanup:

- audience
- access purpose
- human access
- machine access
- anonymous/public protocol access
- identity source
- trust domain
- session rationale
- canonical policy references
- exceptions and owner

### Default mechanism hierarchy

1. Cloudflare-managed MCP Portal/Server native authentication for managed MCP surfaces.
2. Service Bindings for internal Worker-to-Worker calls.
3. Service Auth or authority-issued credentials for external machine access.
4. Narrow Bypass only where anonymous protocol access is proven necessary.

### Trust domains

- legal
- finance
- business_ops
- platform
- managed_mcp

Estate-wide linked-application trust is prohibited as the target posture. Each relationship must identify caller, target, purpose, and allowed operations.

## Credential naming

Credential references use:

```text
{authority}_issued_{credential_type}
```

Examples: `cloudflare_issued_service_token`, `chittyauth_issued_client_secret`.

Canonical credential types should be precise: service_token, api_token, client_secret, access_token, certificate, signing_key.

## Reconciliation rules

- Read-only inventory precedes mutation.
- Every mutation requires canonical identity, owner, rollback, and verification gate.
- Cloudflare local configuration is deployed state, not architectural authority.
- Drift checks compare governed intent to live Cloudflare state.
- Legal and business storage remain distinct authorization domains.

## Current verified findings

- 9 managed MCP Portals were observed.
- 120 Workers, 97 Worker Custom Domains, 140 Worker Routes, 185 DNS records, and 85 Access applications were observed.
- 34 hostnames had multiple runtime attachment classes requiring classification.
- `schema.chitty.cc` has conflicting Worker identities and is the first authority collision to resolve.
- `dev.chitty.cc`, `cf.chitty.cc`, and `chode.chitty.cc` materially overlap.
- `portal.gws.chitty.cc` and `googz.chitty.cc` overlap and share a failing GWS upstream.

## Phase sequence

0. Establish governance contracts and canonical placement.
1. Capture read-only Cloudflare inventory.
2. Normalize identities, intended access, dependencies, and fingerprints.
3. Produce reversible migration plan.
4. Execute approved reconciler mutations.
5. Verify routes, OAuth, MCP Inspector, client calls, and audit evidence.

## Non-goals

- No new database.
- No parallel registry authority.
- No production mutation from this document.
- No automatic deletion based solely on naming or attachment duplication.
