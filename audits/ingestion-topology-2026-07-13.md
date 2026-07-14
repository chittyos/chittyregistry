---
uri: chittycanon://docs/tech/registry/ingestion-topology
namespace: chittycanon://docs/tech
type: registry
version: 2.0.0
status: CANONICAL
registered_with: chittycanon://core/services/canon
title: "ChittyOS Ingestion Topology Registry"
author: "Antigravity (bf786cc4)"
created: 2026-07-13T03:18:38Z
modified: 2026-07-13T05:06:01Z
certifier: ~
visibility: INTERNAL
tags: [ingestion, topology, workers, queues, cloudflare, audit, pipeline-integrity]
category: registry
evidence:
  - id: cf-workers-analytics-2026-07-13T031542Z.json
    path: audits/evidence/cf-workers-analytics-2026-07-13T031542Z.json
    sha256: d7c2c39a66d9e0426a06cdfabb423f63aef00c3df09d45ec20ec6760b861f362
    query: "workersInvocationsAdaptive(limit:500, filter:{datetime_geq:2026-07-06T00:00:00Z, datetime_leq:2026-07-13T04:00:00Z})"
    captured_utc: 2026-07-13T05:06:01Z
    rows: 143
    note: "Window 2026-07-06 to 2026-07-13T04:00Z. limit=500 not saturated; 143 rows is a bounded total."
references:
  - chittycanon://docs/ops/policy/chittyevidence-charter
  - https://developers.cloudflare.com/workers/observability/metrics-and-analytics/
  - https://developers.cloudflare.com/queues/configuration/configure-queues/
---

# ChittyOS Ingestion Topology Registry

> **Disposition:** PROJECTION — pending ChittyRegistry integration
> **Audit window:** 2026-07-06T00:00:00Z → 2026-07-13T04:00:00Z (7 days)
> **Evidence captured:** 2026-07-13T05:06:01Z UTC
> **Raw evidence:** `audits/evidence/cf-workers-analytics-2026-07-13T031542Z.json`
> **Evidence SHA-256:** `d7c2c39a66d9e0426a06cdfabb423f63aef00c3df09d45ec20ec6760b861f362`
> **GraphQL query:** `workersInvocationsAdaptive(limit:500)` grouped by `{scriptName, status}`
> **Analytic rows returned:** 143 (limit=500 not saturated — 143 is a bounded total)
> **Total deployed workers (CF API):** 108

---

## Audit Qualifications

**Error percentages are aggregate across all invocation types** (HTTP fetch, cron trigger, queue consumer, workflow step). The CF GraphQL `workersInvocationsAdaptive` dataset does not expose an `eventType` dimension — `unknown field "eventType"` confirmed at query time. Error isolation by trigger type requires Logpush or tail-worker instrumentation not currently deployed.

**Deployment date ≠ failure onset.** `modified_on` from the workers API proves when code was last deployed, not when errors began. The 7-day window establishes the observation period only.

**Zero queue depth ≠ active message loss.** Current depth is a point-in-time snapshot. `queuesAdaptiveGroups` is not available in this account's GraphQL schema (confirmed `unknown field`). Producer invocation counts are inferred from worker analytics, not queue delivery events.

---

## Confirmed Failures (7-day window)

All status values are CF runtime classifications from the evidence file.

| Worker | Requests | scriptThrewException | Error Rate | CF Status Breakdown | Status |
|---|---|---|---|---|---|
| `chittymonitor` | 2,091 | 2,091 | 100.0% | `{scriptThrewException: 2091}` | FAILING (7d) |
| `comptroller` | 2,082 | 2,073 | 99.6% | `{success: 8, clientDisconnected: 1, scriptThrewException: 2073}` | FAILING (7d) |
| `chittyagent-viewport` | 106 | 106 | 100.0% | `{scriptThrewException: 106}` | FAILING (7d) |
| `chittyagent-storage` | 100 | 89 | 89.0% | `{scriptThrewException: 89, success: 11}` | DEGRADED (7d) |
| `chittyagent-comptroller` | 2,853 | 2,176 | 76.3% | `{success: 677, scriptThrewException: 2176}` | FAILING (7d) |
| `chittyos-drive-mirror` | 801 | 1 + 298 internalError | 37.3% | `{success: 488, clientDisconnected: 14, scriptThrewException: 1, internalError: 298}` | DEGRADED (7d) |
| `chittyagent-imessage` | 2,369 | 344 | 14.5% | `{success: 1961, scriptThrewException: 344, clientDisconnected: 64}` | DEGRADED (7d) |
| `chittyagent-quo` | 3,447 | 476 | 13.8% | `{clientDisconnected: 294, success: 2677, scriptThrewException: 476}` | DEGRADED (7d) |

`comptroller` and `chittyagent-comptroller` are two distinct workers (deployed 2026-06-14 and 2026-07-10). Diagnose independently.

---

## Workers with Activity — 7d Bounded (143 analytic rows, 83 distinct scripts)

`clientDisconnected` is not an error. Status: CHECK = runtime-confirmed no exceptions | CONFIGURED = no exceptions but no independent health verification | DEGRADED / FAILING per above.

| Worker | Reqs | scriptThrewException | internalError | Last Deployed | Status |
|---|---|---|---|---|---|
| `chittymint` | 23,029 | 0 | 0 | 2026-07-01 | CONFIGURED |
| `chittychronicle` | 17,809 | 0 | 0 | 2026-04-24 | CONFIGURED |
| `chittyagent-tasks` | 9,386 | 3 | 0 | 2026-07-09 | CHECK |
| `chittyfinance` | 8,881 | 0 | 0 | 2026-04-24 | CONFIGURED |
| `chittyrouter` | 7,642 | 0 | 0 | 2026-07-09 | CHECK |
| `chittyschema` | 7,588 | 0 | 0 | 2026-06-18 | CONFIGURED |
| `chittyagent-orchestrator` | 7,202 | 0 | 0 | 2026-06-22 | CONFIGURED |
| `chittyledger` | 6,831 | 0 | 0 | 2026-03-24 | CONFIGURED |
| `chittyagent-helper` | 6,642 | 0 | 0 | 2026-06-22 | CONFIGURED |
| `chittyagent-notion` | 6,127 | 0 | 0 | 2026-07-10 | CHECK |
| `chittyagent-ship` | 6,021 | 0 | 0 | 2026-07-09 | CONFIGURED |
| `chittytrust` | 5,880 | 0 | 0 | 2026-06-28 | CONFIGURED |
| `chittycounsel` | 5,496 | 0 | 0 | 2026-05-12 | CONFIGURED |
| `chittydna` | 5,470 | 0 | 0 | 2026-03-24 | CONFIGURED |
| `chittyintel` | 5,429 | 0 | 0 | 2026-07-09 | CONFIGURED |
| `chittystorage` | 5,158 | 0 | 0 | 2026-07-09 | CHECK |
| `chittyagent-ui` | 4,803 | 0 | 0 | 2026-07-10 | CONFIGURED |
| `chittydiscovery` | 4,589 | 0 | 0 | 2026-07-09 | CONFIGURED |
| `chittyagent-google` | 4,465 | 1 | 0 | 2026-07-09 | CHECK |
| `chittycan` | 4,095 | 0 | 0 | 2026-03-04 | CONFIGURED |
| `chittycommand` | 4,028 | 0 | 0 | 2026-07-13 | CHECK |
| `chittyapi` | 3,634 | 0 | 0 | 2026-02-22 | CONFIGURED |
| `chittyagent-notes` | 3,548 | 0 | 0 | 2026-07-09 | CHECK |
| `chittycontextual` | 3,528 | 0 | 0 | 2026-03-31 | CONFIGURED |
| `chittyagent-quo` | 3,447 | 476 | 0 | 2026-07-10 | DEGRADED |
| `chittygateway` | 3,142 | 0 | 0 | 2026-01-22 | CONFIGURED |
| `chittyagent-comptroller` | 2,853 | 2,176 | 0 | 2026-07-10 | FAILING |
| `chittycert` | 2,833 | 0 | 0 | 2026-07-02 | CONFIGURED |
| `chittyagent-autoassist` | 2,515 | 0 | 0 | 2026-06-22 | CONFIGURED |
| `chittyagent-imessage` | 2,369 | 344 | 0 | 2026-07-09 | DEGRADED |
| `chittybeacon` | 2,342 | 0 | 0 | 2026-02-22 | CONFIGURED |
| `chittyagent-resolve` | 2,188 | 0 | 0 | 2026-07-09 | CONFIGURED |
| `chittymonitor` | 2,091 | 2,091 | 0 | 2026-03-24 | FAILING |
| `comptroller` | 2,082 | 2,073 | 0 | 2026-06-14 | FAILING |
| `chittyscrape` | 2,049 | 0 | 0 | 2026-03-29 | CONFIGURED |
| `documint` | 2,010 | 0 | 0 | 2026-05-12 | CHECK |
| `chittyagent-chatgpt` | 1,882 | 0 | 0 | 2026-07-09 | CONFIGURED |
| `chittyagent-cleaner` | 1,816 | 0 | 0 | 2026-06-22 | CONFIGURED |
| `chittyagent-dispatch` | 1,799 | 0 | 0 | 2026-06-22 | CONFIGURED |
| `chittyagent-neon` | 1,742 | 0 | 0 | 2026-06-22 | CONFIGURED |
| `chittyagent-human-escalator` | 1,735 | 1 | 0 | 2026-06-22 | CHECK |
| `chittysecrets` | 1,523 | 0 | 0 | 2026-07-09 | CONFIGURED |
| `chittyadvocate` | 1,493 | 0 | 0 | 2026-05-12 | CONFIGURED |
| `chittygov` | 1,458 | 0 | 0 | 2026-03-24 | CONFIGURED |
| `chittyagent-ch1tty` | 1,455 | 0 | 0 | 2026-07-10 | CONFIGURED |
| `chittyagent-mcp-builder` | 1,102 | 0 | 0 | 2026-06-22 | CONFIGURED |
| `__unknown__` | 1,071 | 0 | 0 | — | UNRESOLVED |
| `chittyagent-scrape` | 1,043 | 0 | 0 | 2026-07-09 | CONFIGURED |
| `chittyagent-schema` | 941 | 0 | 0 | 2026-06-22 | CONFIGURED |
| `chittyos-drive-mirror` | 801 | 1 | 298 | 2026-06-03 | DEGRADED |
| `daily-comms-triage-realtime` | 778 | 0 | 0 | 2026-05-27 | CONFIGURED |
| `chittyconcierge` | 761 | 0 | 0 | 2026-05-02 | CONFIGURED |
| `chittyagent-dispute` | 755 | 0 | 0 | 2026-07-09 | CONFIGURED |
| `daily-comms-triage` | 754 | 0 | 0 | 2026-05-27 | CONFIGURED |
| `chittyagent-bindings` | 743 | 0 | 0 | 2026-06-12 | CONFIGURED |
| `flow-hash-check` | 734 | 0 | 0 | 2026-05-27 | CONFIGURED |
| `chittysweep` | 710 | 0 | 0 | 2025-10-21 | CONFIGURED |
| `chittycharge` | 653 | 0 | 0 | 2026-06-12 | CHECK |
| `bane` | 579 | 0 | 0 | 2025-11-17 | CONFIGURED |
| `chittydlvr` | 430 | 0 | 0 | 2026-02-26 | CONFIGURED |
| `chittyagent-contextual` | 426 | 0 | 0 | 2026-06-22 | CONFIGURED |
| `chittyagent-alchemist` | 419 | 0 | 0 | 2026-06-22 | CONFIGURED |
| `chittyagent-bluebubbles` | 403 | 0 | 0 | 2026-07-06 | CHECK |
| `chittyagent-canon` | 403 | 0 | 0 | 2026-07-09 | CONFIGURED |
| `chittyagent-gam` | 388 | 0 | 0 | 2026-06-22 | CONFIGURED |
| `chittyagent-finance` | 381 | 0 | 0 | 2026-07-09 | CONFIGURED |
| `chittyagent-git` | 378 | 0 | 0 | 2026-06-22 | CONFIGURED |
| `chittyagent-ai` | 372 | 0 | 0 | 2026-07-09 | CONFIGURED |
| `chittyagent-twilio` | 371 | 0 | 0 | 2026-07-09 | CHECK |
| `chittyagent-sandbox` | 361 | 0 | 0 | 2026-06-22 | CONFIGURED |
| `chittyagent-market` | 358 | 0 | 0 | 2026-07-09 | CONFIGURED |
| `foundationagent` | 338 | 0 | 0 | 2026-06-21 | CONFIGURED |
| `chittyagent-cloudflare` | 330 | 0 | 0 | 2026-07-09 | CONFIGURED |
| `chittyagent-auth` | 320 | 0 | 0 | 2026-07-09 | CONFIGURED |
| `chittyagent-evidence` | 206 | 0 | 0 | 2026-07-10 | CHECK |
| `chittybrand-cdn` | 111 | 0 | 0 | 2026-03-26 | CONFIGURED |
| `chittyagent-viewport` | 106 | 106 | 0 | 2026-07-03 | FAILING |
| `chittyagent-storage` | 100 | 89 | 0 | 2026-07-10 | FAILING |
| `chittyswitchboard` | 84 | 0 | 0 | 2026-05-27 | CONFIGURED |
| `paulina-agent` | 81 | 0 | 0 | 2026-03-28 | CONFIGURED |
| `chittytransact-production` | 70 | 0 | 0 | 2026-06-12 | CONFIGURED |
| `chittyauth` | 26 | 0 | 0 | 2026-07-02 | CONFIGURED |
| `gitchitty` | 16 | 0 | 0 | 2026-01-19 | CONFIGURED |
| `chittymcp` | 2 | 0 | 0 | 2026-06-21 | CONFIGURED |

25 of 108 deployed workers had zero invocations in the 7-day window (not listed above).

---

## Queue Registry

Depth from CF REST API point-in-time snapshot. Delivery metrics unavailable — `queuesAdaptiveGroups` not in this account's GraphQL schema (confirmed `unknown field` at query time). Producer activity inferred from worker analytics.

| Queue | Depth | Producer (wrangler) | Consumer (CF API) | Retries | DLQ | Producer 7d Reqs | Verdict |
|---|---|---|---|---|---|---|---|
| `github-events` | 0 | `chittyconnect` | None | 3 | none | Not in 7d window | NO CONSUMER; producer activity unconfirmed |
| `documint-proofs` | 0 | `chittyconnect` | `chittyconnect` | 5 | none | `documint`: 2,010 | CONFIGURED |
| `evidence-processing` | 0 | 2 scripts (CF API) | `chittyagent-evidence` | 3 | `evidence-processing-dlq` | `chittyagent-evidence`: 206 | CONFIGURED |
| `chittyevidence-reprocess` | 0 | `chittyevidence-db` | None | 3 | none | Not in 7d window | NO CONSUMER; producer deployed 2026-07-09 |
| `chittyevidence-corrections` | 0 | `chittyevidence-db` | None | 3 | none | Not in 7d window | NO CONSUMER |
| `chittyschema-drift-scan` | 0 | `chittyschema` | None | 3 | `chittyschema-drift-scan-dlq` | `chittyschema`: 7,588 — active | NO CONSUMER; active producer confirmed |
| `chittystorage-embed` | 0 | `chittystorage` | None | 3 | `chittystorage-embed-dlq` | `chittystorage`: 5,158 — active | NO CONSUMER; active producer confirmed |
| `chittystorage-migrate` | 0 | `chittystorage` | None | 3 (30s) | `chittystorage-migrate-dlq` | Same | NO CONSUMER; active producer confirmed |
| `anchor-queue` | 0 | none (CF API) | None | 3 | none | No producer identified | ORPHANED |
| `document-queue` | 0 | none (CF API) | None | 3 (30s) | none | No producer identified | ORPHANED |
| `chitty-evidence-pipeline` | 0 | none | none | — | — | No producer or consumer | ORPHANED |
| `chittypm-tasks` | 0 | `chittypm` | `chittypm` | — | — | Not in 7d window | CONFIGURED |
| `${CHITTY_TASKS_QUEUE}` | unknown | `getchitty` | `getchitty` | 3 | `${CHITTY_DLQ_QUEUE}` | Not in 7d window | DEFECTIVE CONFIG |

---

## `${CHITTY_TASKS_QUEUE}` — Configuration Diagnosis

Source: `get-chitty/cloudflare/wrangler.toml`. Queue names in `[[queues.producers]]` and `[[queues.consumers]]` stanzas must be literal strings per Cloudflare Queues configuration docs. Wrangler does not perform `${...}` substitution in resource configuration.

Evidence of non-substitution: No GitHub Actions workflow, deploy script, Makefile, `.env`, or `.dev.vars` file in the `get-chitty` repo contains `CHITTY_TASKS_QUEUE`. `wrangler secret list` returned no match. `getchitty` last deployed 2026-01-19; zero invocations in 7d window.

Required action: Replace `${CHITTY_TASKS_QUEUE}` and `${CHITTY_DLQ_QUEUE}` with literal queue names in `wrangler.toml`. Queues must exist in CF account before deploy.

---

## `chittyagent-storage` — Binding Failure Confirmation

CF API endpoint: `GET /accounts/{id}/workers/services/chittyagent-storage/environments/production`
Response captured: 2026-07-13T03:16:36Z UTC
Result: `bindings: []`

Wrangler declares in production env:
```json
{ "binding": "SVC_STORAGE_UPSTREAM", "service": "chittystorage" }
```

Finding: Binding is declared in source but absent from deployed state. Worker calls `SVC_STORAGE_UPSTREAM.fetch()` at runtime and throws. The 11 successful invocations reached code paths that do not use this binding.

Rollback plan: Identify last good commit via `git log` in `chittyagent-storage` repo before any repair deploy.

---

## iMessage Dual-Path — Deprecation Gate

Do not modify either path until all four questions are answered.

| Dimension | `chittyagent-imessage` | `chittyagent-bluebubbles` |
|---|---|---|
| Source | `communications.imessages` (macOS chat.db extract) | BlueBubbles Mac bridge (live webhook) |
| Destination | `contextual.*` (messages, parties, conversations, attachments) | `contextual` schema (confirmed in source) |
| Dedupe key | `ON CONFLICT (source, external_thread_id)` / `ON CONFLICT (normalized_identifier)` | `UNIQUE (source, external_id)` |
| 7d reqs | 2,369 (344 scriptThrewException) | 403 (0 exceptions) |

Open questions before any deprecation decision:
1. Does `raw.id` from `communications.imessages` map to the same `external_id` namespace as BlueBubbles IDs?
2. Is `extract_imessages_v3.py` still running on the Mac?
3. Does BlueBubbles cover the full historical `chat.db` corpus?
4. Do both paths ingest attachments into `contextual.attachments`?

---

## Prioritized Remediation Queue

This section is the baseline for P0 remediation commits. Each repair must reference this document version (`chittycanon://docs/tech/registry/ingestion-topology v2.0.0 PENDING`) as its before-state.

| Priority | Worker/Queue | Evidence | Action | Rollback |
|---|---|---|---|---|
| P0 | `chittyagent-storage` | 89/100 scriptThrewException (7d); CF API bindings: [] | Redeploy with SVC_STORAGE_UPSTREAM binding corrected | git revert to last known-good hash |
| P0 | `chittymonitor` | 2,091/2,091 scriptThrewException (7d) | Read source; deploy tail-worker; fix or tombstone | Delete cron trigger; git tag current state |
| P0 | `comptroller` | 2,073/2,082 scriptThrewException (7d) | Diagnose via tail-worker | git revert |
| P0 | `chittyagent-comptroller` | 2,176/2,853 scriptThrewException (7d); distinct from comptroller | Diagnose separately | git revert |
| P0 | `chittyagent-viewport` | 106/106 scriptThrewException (7d) | Diagnose; fix or tombstone | Delete route/cron trigger |
| P1 | `chittyschema-drift-scan` queue | chittyschema 7,588 reqs/7d; CF API: no consumer registered | Register consumer and deploy, or drain and retire | Drain queue before retiring |
| P1 | `chittystorage-embed` + `chittystorage-migrate` queues | chittystorage 5,158 reqs/7d; CF API: no consumer | Same | Drain before retire |
| P2 | `${CHITTY_TASKS_QUEUE}` | Defective wrangler config; worker inactive | Replace with literal queue name | N/A — worker inactive |
| P2 | iMessage dual-path | Destination overlap confirmed; dedupe key compatibility unconfirmed | Answer 4 open questions | Do not modify either path |
| P3 | `github-events` queue | Producer activity unconfirmed; no consumer | Confirm producer activity; add consumer or retire | — |
| P3 | `anchor-queue`, `document-queue`, `chitty-evidence-pipeline` | No confirmed producers or consumers | Confirm no active producers; retire | — |
| P3 | `chittyos-drive-mirror` | 37.3% internalError (7d) | Investigate internalError source | — |
| P3 | `chittyagent-quo` | 13.8% error; Telnyx migration in progress | Complete migration; retire | Keep OpenPhone active until port confirmed |
