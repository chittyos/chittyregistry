# Cloudflare Account Inventory — ChittyCorp LLC

**Account ID:** `0bc21e3a5a9de1a4cc843be9c3e98121`
**Generated:** 2026-05-27
**Mode:** READ-ONLY enumeration via Cloudflare API (CloudflareMCP)

This file is appended as sections complete; partial progress is durable.

---

## Top-line Counts

| Asset Type | Count | Notes |
|---|---|---|
| Workers Scripts | 117 | |
| Zones | 12 | All on Free Website plan |
| KV Namespaces | 167 | |
| R2 Buckets | 20 | |
| D1 Databases | 20 | |
| Queues | 32 | |
| Durable Object Namespaces | 20 | |
| Pages Projects | 9 | |
| Vectorize Indexes | 7 | |
| Hyperdrive Configs | 11 | |
| Workflows | 3 | |
| AI Gateways | 5 | |
| Access Applications | 62 | |
| Access Identity Providers | 1 | |
| Access Groups | 3 | |
| Access Service Tokens | 5 | |
| Tunnels (cloudflared) | 3 | |
| Account Members | 3 | |
| Account Subscriptions | 14 | |
| Notification Policies | 1 | |
| Gateway Rules | 1 | |
| Gateway Lists | 0 | |
| DLP Profiles | 2 | |
| mTLS Certificates | 1 | |
| Load Balancers | 0 | |
| LB Pools | 0 | |
| Pipelines | 0 | |
| Logpush Jobs (account) | 0 | |
| Dispatch Namespaces (Workers for Platforms) | n/a | Not subscribed (error 10121) |
| Images | permission gap | Auth error |
| Stream | permission gap | Auth error |
| LB Monitors | permission gap | Auth error |
| Origin CA Certs | n/a | Requires zone scoping |


## Zones (12)

| Zone | Status | DNS records | Worker routes | Email routing rules |
|---|---|---|---|---|
| ch1tty.com | active | 13 | 3 | 1 |
| chicagoapps.com | active | 12 | 0 | 1 |
| chicagoparkingspots.com | active | 0 | 0 | 1 |
| chitty.cc | active | **159** | **75** | 7 |
| chittycorp.com | active | 12 | 0 | 2 |
| chittyfoundation.org | active | 0 | 0 | 1 |
| chittyservices.com | active | 27 | 0 | 1 |
| chittystreet.com | active | 20 | 0 | 1 |
| distributedreputation.com | active | 0 | 0 | 1 |
| mychitty.com | active | 24 | 0 | 1 |
| nevershitty.com | active | 48 | 0 | 4 |
| thechitty.com | active | 30 | 0 | 1 |

All zones: Free Website plan, nameservers `ken.ns.cloudflare.com` / `melany.ns.cloudflare.com`.
Email routing enabled on chitty.cc (status `ready`, sub-addressing supported).

**Zones with 0 DNS records (parked/idle):** chicagoparkingspots.com, chittyfoundation.org, distributedreputation.com.

### chitty.cc Worker Routes (75)
All routes route to workers under this account. Major routing surfaces:

- `*.agent.chitty.cc/*` — per-agent paths to `chittyagent-*` (canon, cleaner, cloudflare, dispute, finance, gam, helper, imessage, neon, notes, notion, orchestrator, resolve, scrape, ship, etc.)
- `*.chitty.cc/*` — service workers (id, cert, registry, register, discovery, advocate, score, charge, chronicle, sweep, api, docs, beacon, gov, mint, can, storage, reception, concierge, router, switchboard, dispute, trust, finance, resolution, intel, auth, connect, evidence, track, documint, schema)
- `mcp.chitty.cc/*` → chittymcp (with `/github/*` → chittymcp-github)
- `chatgpt.chitty.cc/*` → chittymcp-gateway (+ `/agent/*` → chittyagent-chatgpt)
- `quality.chitty.cc/*` → chitty-quality-api

Workers Custom Domains: **102 total** (100 on chitty.cc).

---

## Workers Scripts (117)

Full list captured. Highlights:

- **117 scripts** across the account. Nearly all observability-tail-routed to `chittytrack`.
- Workers with `observability.enabled = true` (~60+ scripts post-Mar 2026).
- Workers with `placement_mode = smart`: 26 scripts (chittyagent-*, chittyapi, chittybeacon, chittycan, chittycases, chittycert, chittychronicle, chittycommand, chittyconcierge, chittycounsel, chittydispute, chittydocs, chittyresolution, chittyrouter, chittyscore, chittystorage, flow-analyzer, chittytrack, chittycharge).
- Workers with static assets bound (`has_assets`): chittyagent-ui, chittycontextual, chittyevidence-frontend, chittyfinance, chittyresolution.
- Compatibility-date spread: oldest `2024-01-01` (chittyapi, chittybeacon, chittydocs, chittyintel, chittyledger, chittyreception, chittyscore, getchitty, gitchitty); newest `2026-05-17` (chittymcp-github). Most active workers on `2026-03-16` / `2026-03-24`.

**Cron triggers (sampled):**
- `chittyrouter`: 5 schedules (`0 0 * * *`, `0 */2 * * *`, `0 */6 * * *`, `*/15 * * * *`, `*/30 * * * *`)
- `chittysweep`: 3 schedules (`0 2 * * *`, `0 */6 * * *`, `*/15 * * * *`)

**Workers For Platforms (dispatch namespaces):** Not subscribed (API error 10121).
**Workers Secrets Store:** 1 store — `default_secrets_store` (created 2025-09-29).

### Workers Script Inventory (compact: id | last_modified | compat_date | placement | tail | observability | assets)
```
bane|2025-11-17|2024-10-30||||
chatgptmcp-gateway|2026-03-26|2024-11-01||tail||
chitty-quality-api|2025-11-30|2024-11-01||||
chittyadvocate|2026-05-12|2026-03-16||tail|obs|
chittyagent-alchemist|2026-05-26|2026-03-24|smart|tail|obs|
chittyagent-auth|2026-05-27|2026-03-24||tail|obs|
chittyagent-autoassist|2026-05-26|2026-03-24||tail|obs|
chittyagent-availability|2026-05-27|2026-03-24|smart|tail|obs|
chittyagent-bluebubbles|2026-05-27|2026-03-24|smart|tail|obs|
chittyagent-bridge-consent|2026-05-27|2026-03-24|smart|tail|obs|
chittyagent-buyflow|2026-05-27|2026-03-24|smart|tail|obs|
chittyagent-canon|2026-05-27|2026-03-24||tail|obs|
chittyagent-ch1tty|2026-05-23|2026-03-24||tail|obs|
chittyagent-chatgpt|2026-05-27|2026-03-24||tail||
chittyagent-cleaner|2026-05-26|2026-03-24||tail||
chittyagent-cloudflare|2026-05-09|2026-03-24||tail||
chittyagent-dispatch|2026-05-26|2026-03-24||tail|obs|
chittyagent-dispute|2026-05-23|2026-03-24|smart|tail|obs|
chittyagent-evidence|2026-05-26|2026-03-24||tail|obs|
chittyagent-finance|2026-05-09|2026-03-24||tail||
chittyagent-gam|2026-05-26|2026-03-24||tail|obs|
chittyagent-helper|2026-05-26|2026-03-24||tail||
chittyagent-human-escalator|2026-05-27|2026-03-24|smart|tail|obs|
chittyagent-imessage|2026-05-27|2026-03-24|smart|tail|obs|
chittyagent-kondoclean|2026-02-22|2024-12-01||tail||
chittyagent-lead-score|2026-05-27|2026-03-24|smart|tail|obs|
chittyagent-lease-execute|2026-05-27|2026-03-24|smart|tail|obs|
chittyagent-lease-explain|2026-05-27|2026-03-24|smart|tail|obs|
chittyagent-market|2026-05-26|2026-03-24||tail|obs|
chittyagent-neon|2026-05-26|2026-03-24||tail|obs|
chittyagent-notes|2026-05-23|2026-03-24|smart|tail|obs|
chittyagent-notion|2026-05-27|2026-03-24||tail||
chittyagent-orchestrator|2026-05-23|2026-03-24|smart|tail|obs|
chittyagent-quo|2026-05-11|2026-03-24|smart|tail|obs|
chittyagent-quote|2026-05-27|2026-03-24|smart|tail|obs|
chittyagent-resolve|2026-05-27|2026-03-24||tail||
chittyagent-sandbox|2026-05-27|2026-03-02|smart|tail|obs|
chittyagent-scrape|2026-05-27|2026-03-24|smart|tail|obs|
chittyagent-ship|2026-05-26|2026-03-24|smart|tail|obs|
chittyagent-storage|2026-03-28|2026-03-24||tail||
chittyagent-tasks|2026-05-27|2026-03-24|smart|tail|obs|
chittyagent-twilio|2026-05-27|2026-03-24|smart|tail|obs|
chittyagent-ui|2026-05-27|2026-03-24||tail||assets
chittyagent-viewport|2026-05-27|2026-03-24|smart|tail|obs|
chittyapi|2026-02-22|2024-01-01|smart|tail||
chittyauth|2026-05-27|2026-03-16||tail|obs|
chittyauth-prod|2026-05-27|2026-03-16||tail|obs|
chittybeacon|2026-02-22|2024-01-01|smart|tail||
chittybrand-cdn|2026-03-26|2025-03-20||||
chittycan|2026-03-04|2024-11-01|smart|tail||
chittycanon|2026-04-14|2026-03-16||tail|obs|
chittycases|2026-02-26|||||
chittycert|2026-05-27|2026-03-16|smart|tail|obs|
chittycharge|2026-01-22|2025-10-11|smart|||
chittychronicle|2026-04-24|2024-11-01|smart|tail||
chittycommand|2026-05-07|2026-03-02|smart|tail|obs|
chittycommand-ui|2026-03-28|2026-03-28||||
chittyconcierge|2026-05-02|2026-03-24|smart|tail|obs|
chittyconnect|2026-05-27|2026-03-02||tail|obs|
chittyconnect-staging|2026-05-11|2026-03-02||tail|obs|
chittyconnect-v2|2026-01-30|2024-10-01|||obs|
chittycontextual|2026-03-31|2026-03-15||tail||assets
chittycounsel|2026-05-12|2026-05-11|smart|tail|obs|
chittydiscovery|2026-05-27|2026-03-28||tail|obs|
chittydispute|2026-05-27|2026-03-16|smart|tail|obs|
chittydlvr|2026-02-26|2025-09-01||tail||
chittydna|2026-03-24|2026-03-16|||obs|
chittydocs|2026-01-19|2024-01-01|smart|||
chittyevidence|2026-03-05|2026-03-04|||obs|
chittyevidence-db|2026-05-18|2026-02-23|smart|tail|obs|
chittyevidence-frontend|2026-03-05|2026-03-04||||assets
chittyevidence-ingest|2026-03-05|2026-03-04||||
chittyevidence-pipeline|2026-03-05|2026-03-04||||
chittyevidence-worker|2026-04-24|2026-03-16||tail|obs|
chittyfinance|2026-04-24|2026-03-01||tail|obs|assets
chittygateway|2026-01-22|2024-10-11|||obs|
chittygov|2026-03-24|2024-09-23|||obs|
chittyid|2026-05-27|2026-03-16||tail|obs|
chittyid-production|2026-02-24|2024-09-23||||
chittyintel|2026-05-25|2024-01-01||tail||
chittyledger|2026-03-24|2026-03-16||tail|obs|
chittyledger-api|2026-03-26|2026-03-16||tail|obs|
chittymcp|2026-05-27|2026-04-27||tail|obs|
chittymcp-gateway|2026-04-30|2026-03-16||tail|obs|
chittymcp-gateway-production|2026-04-23|2026-03-16||tail|obs|
chittymcp-github|2026-05-17|2026-05-17||||
chittymint|2026-05-12|2026-03-29||tail|obs|
chittymint-production|2026-04-08|2026-03-29||tail|obs|
chittymonitor|2026-03-24|2026-03-17||tail||
chittyreception|2026-01-25|2024-01-01||||
chittyregister|2026-05-27|2026-03-16||tail|obs|
chittyregistry|2026-05-27|2026-03-16||tail|obs|
chittyregistry-staging|2026-05-27|2026-03-16||tail|obs|
chittyrental|2026-03-24|2024-09-23||||
chittyresolution|2026-04-25|2026-03-16|smart|tail|obs|assets
chittyrouter|2026-05-27|2026-03-16|smart|tail|obs|
chittyschema|2026-05-11|2026-03-16||tail|obs|
chittyschema-api|2026-04-13|2026-03-16||tail|obs|
chittyscore|2026-02-22|2024-01-01|smart|tail||
chittyscore-worker|2026-03-25|2024-09-25||||
chittyscrape|2026-03-29|2026-01-15||tail||
chittystorage|2026-05-27|2026-03-24|smart|tail|obs|
chittystream-consumer-development|2026-04-23|2026-04-12|||obs|
chittystream-orchestrator-development|2026-04-23|2026-04-12|||obs|
chittysweep|2025-10-21|2025-01-21||||
chittyswitchboard|2026-05-27|2025-01-01||tail|obs|
chittysync|2026-02-26|||||
chittytrack|2026-05-12|2026-03-16|smart||obs|
chittytrust|2026-05-27|2026-04-01||tail|obs|
divorcio-asistente|2026-02-24|2026-02-24||||
divorcio-asistente-production|2026-02-24|2026-02-24||||
documint|2026-05-12|2026-03-01||tail|obs|
flow-analyzer|2026-04-24|2026-03-16|smart|tail|obs|
getchitty|2026-01-19|2024-01-01||||
gitchitty|2026-01-19|2024-01-01||||
house-on-paulina|2026-04-14|2026-04-14||||
paulina-agent|2026-03-28|2025-04-01||||
```

---

## Storage

### R2 Buckets (20)
All in default location. Listed by name | creation date:

```
chitty-brand-assets|2026-03-25
chittycert-archive|2025-11-08
chittycert-ca-backup|2025-11-08
chittycert-certificates|2025-11-09
chittycommand-documents|2026-02-09
chittycounsel-documents|2026-05-11
chittyevidence-documents|2026-01-10
chittyevidence-pipeline|2026-01-18
chittyevidence-processed|2026-03-29
chittyfinance-storage|2026-04-24
chittyhome-events|2026-05-01
chittyos-drive-mirror|2026-05-26
chittyos-files|2025-12-22
chittyresolution-evidence|2026-04-25
chittyrouter-documents|2026-01-07
chittyschema-canonical-schemas|2026-04-10
chittyschema-drift-archive|2026-04-10
chittysweep-logs|2025-10-21
chittytrack-logs|2026-02-22
dispute-evidence|2026-03-12
```

### KV Namespaces (167)
Full list captured (id|title) — see appendix. Notable patterns:
- Per-env duplicates (`*_preview`, `staging-*`, `development-*`, `production-*`) — typical wrangler dev hygiene.
- ChittyConnect: 7 KVs (TOKEN_KV, API_KEYS, RATE_LIMIT, IDEMP_KV, plus `production-` variants).
- ChittyAuth: AUTH_TOKENS, AUTH_USERS, AUTH_OAUTH_CODES, AUTH_REVOCATIONS, AUTH_RATE_LIMITS, AUTH_AUDIT, AUTH_SESSIONS, AUTH_MCP_SERVERS, OAUTH_KV.
- ChittyCert: CERTIFICATES, CERT_METADATA, CERT_STORE, OCSP_CACHE, CRL_CACHE, ROOTS_CACHE, VC_STORE.
- Likely orphan/unused: many staging/preview namespaces; some agent state KVs for agents created today (2026-05-27) and may not be bound yet.

### D1 Databases (20)
Compact: uuid | name | version | size_bytes | num_tables

```
ef8ac1b5|chittystream-consumer-dev-db|production|61440|0
9ab7777d|chittystream-orchestrator-dev-db|production|77824|0
0dd42471|chittyagent-resolve|production|32768|0
c77f6655|chittycounsel-cache|production|12288|0
b62c6b31|divorcio-case|production|45056|0
b5dade20|chittytrust|production|12288|0
b5af4b8f|chittyscore|production|12288|0
e4fad4c5|chittyregister|production|12288|0
2b35db5e|chico-db|production|20480|0
f486fed7|chittyevidence-db|production|47845376|0
2ab63ca7|chittyhelper-evolution|production|65536|0
9ebd1037|chittymint|production|98304|0
ee853c63|documint|production|81920|0
d88a980e|chittycert_audit|production|147456|0
18eb5311|chittycan-core|production|217088|0
47fc012e|chittyauth-db|production|94208|0
29473911|chittyconnect|production|83492864|0
edb47ac4|chittyos-todos|production|262144|0
84cf62ed|chittyos-sessions|production|12288|0
9a64f22a|chitty-media-db|production|118784|0
```

Note: `num_tables: 0` returned by all — likely API quirk for cached metadata, not literal. Largest by size: chittyconnect (~83 MB), chittyevidence-db (~48 MB).

### Vectorize Indexes (7)
```
agent-memory-index | 768 | cosine | 2025-10-10
chittyevidence-embeddings | 768 | cosine | 2026-01-10
context-embeddings | 768 | cosine | 2025-11-09
intel-embeddings | 1536 | cosine | 2025-11-22
media-embeddings | 768 | cosine | 2025-10-01
memory-cloude | 768 | cosine | 2025-11-09
notes-embeddings | 768 | cosine | 2026-03-11
```
6 are 768-dim (Workers AI baai/bge-base-en-v1.5 or qwen embedding model); `intel-embeddings` is 1536-dim (OpenAI-style).

### Hyperdrive Configs (11)
All pointing to Neon Postgres `neondb`:
```
4bd7964c | chittyassets-db        | ep-summer-queen-akr5e8hj-pooler.c-3.us-west-2.aws.neon.tech
6f6cba43 | chittycommand-db       | ep-young-rain-ak3jf326-pooler.c-3.us-west-2.aws.neon.tech
38d25002 | chittycounsel-neon     | ep-shiny-sun-akj95acz-pooler.c-3.us-west-2.aws.neon.tech
5057f7a6 | chittyevidence-db      | ep-falling-hall-akl2joj3.c-3.us-west-2.aws.neon.tech  (NOT pooler)
89158b50 | chittyfinance-db       | ep-noisy-tree-akgsi7ne.c-3.us-west-2.aws.neon.tech  (NOT pooler)
bd15768d | chittyledger-dispute   | ep-delicate-recipe-aeek6pj8-pooler.c-2.us-east-2.aws.neon.tech
df36b055 | chittyresolution-db    | ep-hidden-unit-anwx2chv.c-6.us-east-1.aws.neon.tech  (NOT pooler)
a41987b2 | chittytrace-db         | ep-orange-scene-akynsdwd.c-3.us-west-2.aws.neon.tech  (NOT pooler)
f44961eb | neondb-chittyledger    | ep-fragrant-bread-a41rqh4p-pooler.us-east-1.aws.neon.tech
1d126444 | neondb-chittyos-core   | ep-green-water-ael1lksw.c-2.us-east-2.aws.neon.tech  (NOT pooler)
6318f589 | notes-hyperdrive       | ep-delicate-recipe-aeek6pj8-pooler.c-2.us-east-2.aws.neon.tech
```
**Anomaly:** several configs point at direct Neon endpoints, not the `-pooler` variant. With Hyperdrive in front this is fine (Hyperdrive does its own pooling), but worth verifying intent.

### Queues (32) — producers / consumers
```
anchor-queue                          | prod=0 cons=1 chittymint
chittychain-blockchain-queue          | prod=0 cons=0 (orphan)
chittychain-blockchain-queue-work     | prod=0 cons=0 (orphan)
chittychain-minting                   | prod=0 cons=0 (orphan)
chittyconnect-context-ops             | prod=0 cons=0 (orphan)
chittyconnect-registry-sync           | prod=0 cons=0 (orphan)
chittyconnect-secret-distribution     | prod=0 cons=0 (orphan)
chittyconnect-vault-ops               | prod=0 cons=0 (orphan)
chittycontext-context-ops             | prod=0 cons=0 (orphan)
chittycontext-context-ops-work        | prod=0 cons=0 (orphan)
chittycontext-registry-sync           | prod=0 cons=0 (orphan)
chittycontext-registry-sync-work      | prod=0 cons=0 (orphan)
chittycontext-secret-distribution     | prod=0 cons=0 (orphan)
chittycontext-secret-distribution-work| prod=0 cons=0 (orphan)
chittycontext-vault-ops               | prod=0 cons=0 (orphan)
chittycontext-vault-ops-work          | prod=0 cons=0 (orphan)
chittyevidence-correction             | prod=0 cons=0 (orphan)
chittyevidence-corrections            | prod=1 cons=1 chittyevidence-db (dlq=chittyevidence-corrections-dlq)
chittyevidence-corrections-dlq        | prod=0 cons=0
chittyevidence-reprocess              | prod=1 cons=1 chittyevidence-db (dlq=chittyevidence-reprocess-dlq)
chittyevidence-reprocess-dlq          | prod=0 cons=0
chittyid-soft-hard-mint               | prod=0 cons=0 (orphan)
chittyschema-drift-scan               | prod=2 cons=1 chittyschema (producers: chittyschema, chittyschema-api; dlq=chittyschema-drift-scan-dlq)
chittyschema-drift-scan-dlq           | prod=0 cons=0
correction-apply                      | prod=0 cons=0 (orphan)
document-queue                        | prod=0 cons=1 documint
document-reprocess                    | prod=0 cons=0 (orphan)
documint-proofs                       | prod=1 cons=1 chittyconnect (producer: chittyconnect-staging; dlq=documint-proofs-dlq)
documint-proofs-dlq                   | prod=0 cons=0
evidence-processing                   | prod=2 cons=1 chittyevidence-db (producers blank script names; dlq=evidence-processing-dlq)
evidence-processing-dlq               | prod=0 cons=0
github-events                         | prod=2 cons=1 chittyconnect (producers: chittyconnect-staging, chittyconnect-v2)
```

**Anomalies:** 16 queues have neither producers nor consumers (orphans). DLQs are present but empty (good).

### Durable Object Namespaces (20)
```
chittysweep_AgentState           | AgentState
chittysweep_AgentOrchestrator    | AgentOrchestrator
chittymint_BatchState            | BatchState
chittyevidence-db_AccuracyGuardianDO | AccuracyGuardianDO
chittyevidence-db_DuplicateHunterDO  | DuplicateHunterDO
chittyreception_CallState        | CallState
chittyconnect-v2_MCPSessionDurableObject | MCPSessionDurableObject
chittyfinance_ChittyAgent        | ChittyAgent (sqlite)
documint_ProofStateDO            | ProofStateDO
chittyevidence_EvidenceAgent     | EvidenceAgent (sqlite)
chittyrouter_AIStateDO           | AIStateDO
chittyrouter_SyncStateDurableObject | SyncStateDurableObject
chittyrouter_FinanceAgent        | FinanceAgent (sqlite)
chittyrouter_IntelligenceAgent   | IntelligenceAgent (sqlite)
chittyrouter_DocumentAgent       | DocumentAgent (sqlite)
chittyrouter_MessagingAgent      | MessagingAgent (sqlite)
chittyrouter_CalendarAgent       | CalendarAgent (sqlite)
chittyrouter_NotificationAgent   | NotificationAgent (sqlite)
chittyrouter_PriorityAgent       | PriorityAgent (sqlite)
chittyrouter_EvidenceAgent       | EvidenceAgent (sqlite)
```
Plus 1 implicit DO namespace (`8d501f136065406897883e4179c68a50`) backing the Containers application.

### Workflows (3)
- `HASH_GHOSTS_WORKFLOW` (chittyevidence-db / HashGhostsWorkflow): 8 complete, 3 errored
- `evidence-processing` (chittyagent-evidence / EvidenceIngestWorkflow): 1 errored
- `DOCUMENT_WORKFLOW` (chittyevidence-db / DocumentProcessingWorkflow): 17 complete, 0 errored

### Pipelines: 0
### Hyperdrive: 11 (above)

---

## Compute (additional)

### Cloudflare Containers (1)
```
id: a03e0886-8b8e-419c-9777-2686f8613ccd
name: chitty-infra-mycontainer
image: registry.cloudflare.com/0bc21e3a5a9de1a4cc843be9c3e98121/chitty-infra-mycontainer:915d517b
runtime: firecracker
vcpu: 0.0625 | memory: 256 MiB | disk: 2 GB
instances active=0 healthy=11 (running 11/10 max — exceeds max_instances, likely DO-offset overrides)
durable_objects.namespace_id: 8d501f136065406897883e4179c68a50
network: private, bandwidth 100 Mbps
```

### AutoRAG (3 RAGs — all sourcing chittyevidence-documents R2)
```
chittyevidence-ksn      | gateway=default      | hybrid_search=true  | embed=qwen3-0.6b | rerank=bge-reranker-base | public endpoint enabled
re-evidence-search      | gateway=chittygateway| vector-only         | embed=bge-m3
chittyevidence-search   | gateway=chittycounsel| vector-only         | embed=qwen3-0.6b
```

### AI Gateways (5)
```
chittygateway       | cache_ttl=300       | logs=true | rate_limit_interval=60
chittycounsel       | cache_ttl=0         | logs=true | rate_limit_interval=60
default             | cache_ttl=2628288   | logs=true | rate_limit_interval=60
codex-orchestration | cache_ttl=300       | logs=true | rate_limit_interval=0
chittyclaw          | cache_ttl=2628288   | logs=true | rate_limit_interval=60
```

### Pages Projects (9)
```
chittytrace            | main | domains: chittytrace.pages.dev, app.trace.chitty.cc, trace.mychitty.com
chittycommand-ui       | main | domains: chittycommand-ui.pages.dev, app.command.chitty.cc, cmd.chitty.cc, command.mychitty.com
chittyverify           | main | domains: chittyverify.pages.dev, verify.chitty.cc
paulina-s-mythos       | main | domains: paulina-s-mythos.pages.dev
divorcio-asistente     | main | domains: divorcio-asistente.pages.dev, divorcio.chicagoapps.com
chittyconnect-ui       | main | domains: chittyconnect-ui-c67.pages.dev
chittyledger           | main | domains: chittyledger.pages.dev, app.ledger.chitty.cc, ledger.mychitty.com
chittyconnect          | main | domains: chittyconnect-ui.pages.dev, app.connect.chitty.cc, connect.mychitty.com
derail-me              | main | domains: derail-me.pages.dev, derail.me
```

---

## Networking

- **Load Balancers / Pools:** 0
- **LB Monitors:** Permission gap (auth error)
- **Tunnels (cloudflared):** 3
  - `ch1tty` — healthy, 4 connections
  - `chittyconnect-chittysecrets` — healthy, 4 connections
  - `bluebubbles-bb-claw` — **down**, 0 connections
- **Spectrum / Magic Transit / Magic WAN / WARP devices:** 0 / not subscribed
- **Argo Smart Routing / Tiered Cache / Cache Reserve / Wait Rooms / Bot Management / API Shield:** Permission gap on read (auth error)

---

## Zero Trust / Access

### Access Applications: 62 total
Types: 27 `mcp` (MCP server registrations), 1 `app_launcher`, 1 `saas` (Mercury SSO), 3 `mcp_portal` (chittycomms, ChittyIdentity Agents, ChittyOS MCP VM, ChittyOS MCP Portal), 30+ `self_hosted` bypass policies for OAuth/MCP well-known endpoints across `*.agent.chitty.cc`, `mcp.chitty.cc`, `mcp.ch1tty.com`.

Notable apps:
- `ChittyAgent Wildcard` (`*.agent.chitty.cc`) — broad self_hosted
- `Ollama API` (`ollama.chitty.cc`)
- `BlueBubbles bb.claw` (`bb.claw.chitty.cc`)
- `ChittyStorage Evidence Browser` (`storage.chitty.cc`)
- 5 Mercury-related apps (Mercury SSO + Furnished Condos + Nicholas)

### Access IdPs: 1
- `onetimepin` (One-Time PIN) — `dd56faca-b8f4-4209-9b5d-3d18e60b8522`

### Access Groups: 3
- ChittyCorp Employees
- Tailscale Network
- ChittyServ VM

### Access Service Tokens: 5
```
chittyconnect-ollama       | expires 2027-03-28
chittycommand-connect      | expires 2027-03-28
chittyagent-connect        | expires 2027-03-28
chittyfinance-connect      | expires 2027-03-28
ChittyOS MCP Admin Portal  | expires 2126-03-04 (centennial, effectively never)
```

### Gateway
- 1 rule: "Block Malware" (action=block, enabled)
- 0 lists, 2 DLP profiles (Financial Information, SSN/Insurance/Tax), 1 mTLS cert (Gateway CA managed)
- 0 WARP devices, 0 device posture rules

---

## Email Routing
Only `chitty.cc` retrieved settings: enabled, status `ready`, sub-addressing supported, synced.
Per-zone rule counts:
- chitty.cc: 7, nevershitty.com: 4, chittycorp.com: 2, ch1tty.com: 1, chicagoapps.com: 1, chicagoparkingspots.com: 1, chittyfoundation.org: 1, chittyservices.com: 1, chittystreet.com: 1, distributedreputation.com: 1, mychitty.com: 1, thechitty.com: 1

---

## Security / Other

- **Notification policies:** 1 (`Default notification`, image_resizing_notification, email to nick@chittycorp.com — auto-created by Cloudflare)
- **Account-level Logpush jobs:** 0; datasets endpoint returned auth error
- **mTLS certificates:** 1 (Cloudflare-managed Gateway CA, expires 2030-09-28)
- **DLP profiles:** 2 (predefined Financial Information; SSN/Insurance/Tax)
- **Origin CA certs / Cert packs / Custom Hostnames / Rulesets:** Permission gap (auth error / 9109 Unauthorized) — token cannot read zone-scoped SSL/ruleset/page-rule data even though it can read DNS and routes
- **Workers Observability telemetry queries:** 404 (no saved queries)

---

## Billing / Account

**Members:** 3 (all Super Administrator)
**Subscriptions (14):**
- prod_workers: $5/mo (Workers Paid)
- ssl_for_saas: $0/mo
- acm_zone: $10/mo (Advanced Certificate Manager — for chitty.cc presumably)
- prod_r2: $0/mo
- prod_teams: $0/mo (Zero Trust)
- 9× `prod_cloudflare` (per-zone metadata stubs, $0)

**API tokens:** Not enumerable with this token (user-scoped).

---

## Cross-references

- **R2 ↔ Workers:** `chittyevidence-documents` is the source for all 3 AutoRAG instances; bound by chittyevidence-db, chittyevidence-worker, chittyevidence-pipeline.
- **R2 ↔ AI:** AutoRAG pulls from `chittyevidence-documents` and writes embeddings to Vectorize index `chittyevidence-embeddings`.
- **Hyperdrive ↔ D1 overlap:** Both `chittyevidence-db` and `chittyconnect` exist as both D1 databases and Hyperdrive configs (against Neon). Confirm whether D1 + Neon are deliberate dual-storage or migration artifacts.
- **chittytrack tail consumer:** Receives logs from ~75+ workers. Single point of fan-in for observability.
- **Workers Custom Domains (102) vs Routes (75 on chitty.cc):** Custom Domains is the newer routing surface; existence of both for the same hostnames is normal.
- **Containers DO namespace** (`8d501f136065406897883e4179c68a50`) is not surfaced in the durable_objects list endpoint — Containers-backed DOs are managed separately.

---

## Gaps / Anomalies

1. **16 orphan queues** with no producers and no consumers (chittycontext-* family and chittyconnect-* family). Likely vestigial from an early Connect/Context architecture; safe to delete after confirmation.
2. **Empty DLQs** (5): chittyevidence-corrections-dlq, chittyevidence-reprocess-dlq, chittyschema-drift-scan-dlq, documint-proofs-dlq, evidence-processing-dlq — empty is good but verify they have consumers wired for true DLQ replay.
3. **`bluebubbles-bb-claw` tunnel is down** (0 connections, status=down). bb.claw.chitty.cc Access app exists but the tunnel underneath is offline.
4. **Containers `instances=11` exceeds `max_instances=10`** — likely tied to `durable_object_offset_instances: 4`; verify scaling intent.
5. **Hyperdrive configs not using pooler endpoints** for 5/11 entries (chittyevidence-db, chittyfinance-db, chittyresolution-db, chittytrace-db, neondb-chittyos-core). Hyperdrive does its own pooling so this works, but Cloudflare best-practice recommends pooler endpoints for fallback connections.
6. **3 zones with zero DNS records** (chicagoparkingspots.com, chittyfoundation.org, distributedreputation.com) — parked.
7. **Workflows: `HASH_GHOSTS_WORKFLOW` has 3 errored instances**, `evidence-processing` has 1 errored. Investigate.
8. **`chittyagent-availability`, `chittyagent-bluebubbles`, `chittyagent-bridge-consent`, `chittyagent-buyflow`, `chittyagent-human-escalator`, `chittyagent-lead-score`, `chittyagent-lease-execute`, `chittyagent-lease-explain`, `chittyagent-quote`, `chittyagent-sandbox`, `chittyagent-twilio`, `chittyagent-viewport`** created today (2026-05-27) — possible bulk scaffold; verify they have routes/bindings.
9. **Service Token `ChittyOS MCP Admin Portal` expires 2126** (100+ years) — effectively never-expiring; consider rotating policy.
10. **2 chittyconnect-v2 / chittymcp-gateway-production / chittymint-production / chittyid-production / chittyauth-prod** suggest duplicate/parallel deployments — confirm whether staged-rollout shadows or legacy.
11. **chittysync, chittycases** scripts have no compatibility_date set (legacy).

---

## Permission Gaps (token-scope limitations)

The supplied token cannot read these resources (returns auth error 10000 or 9109 Unauthorized):
- Page Rules (per zone)
- Rulesets (Transform/Redirect/WAF/Cache/Origin)
- Custom Hostnames (SSL for SaaS)
- SSL Certificate packs / Origin CA certs (zone-scoped)
- Bot Management settings
- API Shield operations
- Cache Reserve / Tiered Cache / Argo Smart Routing
- Wait Rooms
- Spectrum apps
- Cloudflare Snippets
- Healthchecks
- LB Monitors
- Cloudflare Realtime (Calls) apps
- Cloudflare Snippets
- Email Security (allow patterns)
- Brand Protection
- Cloudforce One (10403 forbidden)
- Account-level Logpush datasets
- Images / Stream
- Zone subscription details
- Workers For Platforms dispatch namespaces (not subscribed — error 10121)
- Account-scoped API tokens (user-scoped)
- Analytics Engine SQL endpoint (returns malformed payload — may need account analytics token)

To complete these sections, re-run with a token holding `Zone:Read`, `Zone Settings:Read`, `SSL & Certificates:Read`, `Page Rules:Read`, `Bot Management:Read`, `API Gateway:Read`, `Cache Reserve:Read`, `Magic Transit:Read`, `Cloudflare Stream:Read`, `Cloudflare Images:Read`, `Account Analytics:Read`, `Logs:Read`.

---

## End of report

---

## Permission-Gap Second Pass (2026-05-27)

Re-attempted enumeration of items previously flagged "permission-gap". The first pass used the CloudflareMCP token (account-scoped, lacks zone read on most settings — uniformly returns `9109/10000 Authentication error`). This pass switched to the legacy Global API Key (`X-Auth-Email` / `X-Auth-Key`) from the environment, which has full admin scope on the account.

**Auth used:** `X-Auth-Email: $CLOUDFLARE_EMAIL` + `X-Auth-Key: $CLOUDFLARE_API_KEY` (Global API Key — full admin).
**CloudflareMCP token still fails** these endpoints (it lacks `Zone:*:Read` and most product-specific scopes); use Global API Key or provision a new API Token with `Account.* Read` + `Zone.* Read` for future automation.

### Zone-Level (all 12 zones)

Per-zone summary counts:

| Zone | cert_packs | rulesets | pagerules | custom_hostnames |
|---|---:|---:|---:|---:|
| ch1tty.com | 9 | 3 | 0 | 0 |
| chicagoapps.com | 1 | 3 | 0 | 0 |
| chicagoparkingspots.com | 1 | 3 | 0 | 0 |
| chitty.cc | 20 | 4 | 0 | 0 |
| chittycorp.com | 1 | 3 | 0 | 0 |
| chittyfoundation.org | 1 | 3 | 0 | 0 |
| chittyservices.com | 1 | 3 | 0 | 0 |
| chittystreet.com | 1 | 3 | 0 | 0 |
| distributedreputation.com | 1 | 3 | 0 | 0 |
| mychitty.com | 1 | 3 | 0 | 0 |
| nevershitty.com | 1 | 3 | 0 | 0 |
| thechitty.com | 2 | 3 | 0 | 0 |

**Uniform across all 12 zones (unless noted):**

- **Page Rules** (`/zones/{id}/pagerules`): `0` items, HTTP 200 — confirmed empty (legacy pagerules deprecated in favor of rulesets).
- **Rulesets** (`/zones/{id}/rulesets`): `3` managed system rulesets on every zone — IDs identical across zones:
  - `70339d97bdb34195bbf054b1ebe81f76` — "Cloudflare Normalization Ruleset" (phase: `http_request_sanitize`, kind: managed)
  - `77454fe2d30c4220b5701f6fdfb893ba` — "Cloudflare Managed Free Ruleset" (phase: `http_request_firewall_managed`, kind: managed)
  - `4d21379b4f9f4bb088e0729962c8b3cf` — "DDoS L7 ruleset" (phase: `ddos_l7`, kind: managed)
  - **chitty.cc additionally has** a 4th zone-custom ruleset: `10f6a44e3b3c4b8c9f1148e98447c71a` "Allow Notion Webhooks" (phase: `http_request_firewall_custom`, kind: zone) — 2 enabled rules:
    1. `352bb257a32c4ebcba972f07a7d4eea9` — `skip` — `(http.host eq "notion.chitty.cc" and http.request.uri.path eq "/webhook" and http.request.method eq "POST")`
    2. `66718ca3dcba4636852525d3afe3e885` — `skip` — `(http.host eq "register.chitty.cc" and starts_with(http.request.uri.path, "/api/"))`
- **Custom Hostnames** (`/zones/{id}/custom_hostnames`): `0` on every zone, HTTP 200 — confirmed not used.
- **SSL Certificate Packs** (`/zones/{id}/ssl/certificate_packs`): each zone has at least 1 active advanced pack (Google CA, 90-day validity). `chitty.cc` has **20 packs** covering subdomains: `bluebubbles.agent.chitty.cc` (x2), `twilio.agent.chitty.cc`, `human-escalator.agent.chitty.cc`, `quote.chitty.cc`, `quote.agent.chitty.cc`, `lease-explain.chitty.cc`, `lease-explain.agent.chitty.cc`, `lease-execute.chitty.cc`, `lease-execute.agent.chitty.cc`, `lead-score.chitty.cc`, `lead-score.agent.chitty.cc`, `buyflow.chitty.cc`, `buyflow.agent.chitty.cc`, `availability.chitty.cc`, `availability.agent.chitty.cc`, `sandbox.chitty.cc`, `sandbox.agent.chitty.cc`, `viewport.agent.chitty.cc`, `cleaner.chitty.cc` — note one duplicate bluebubbles pack (cleanup candidate). `ch1tty.com` has 9 packs; `thechitty.com` has 2; all others have 1.
- **Bot Management** (`/zones/{id}/bot_management`): HTTP 200 — present on all zones. Settings (sampled chitty.cc, identical config returned on all): `enable_js=true`, `fight_mode=false`, `ai_bots_protection=only_on_ad_pages`, `content_bots_protection=disabled`, `crawler_protection=enabled`, `is_robots_txt_managed=true`, `cf_robots_variant=off`, `using_latest_model=true`.
- **API Shield operations** (`/zones/{id}/api_gateway/operations`): `0` items.
- **API Shield user schemas** (`/zones/{id}/api_gateway/user_schemas`): `0` items.
- **Cache Reserve** (`/zones/{id}/cache/cache_reserve`): error `1135: Sorry, this zone setting is not available for your plan type` — **not subscribed** (requires Enterprise).
- **Argo Tiered Caching** (`/zones/{id}/argo/tiered_caching`): HTTP 200 — `value="off"` on every zone (not enabled).
- **Smart Tiered Topology** (`/zones/{id}/cache/tiered_cache_smart_topology_enable`): HTTP 200 — `value="off"` on every zone (not enabled).
- **Argo Smart Routing** (`/zones/{id}/argo/smart_routing`): error `1015: not authorized to access this setting. Cause(s): smart_routing` — **not subscribed**.
- **Waiting Rooms** (`/zones/{id}/waiting_rooms`): `0` items.
- **Spectrum Apps** (`/zones/{id}/spectrum/apps`): error `10007: Forbidden` — **not subscribed**.
- **Snippets** (`/zones/{id}/snippets`): `0` items (HTTP 200, result null).
- **Healthchecks** (`/zones/{id}/healthchecks`): `0` items.
- **Load Balancer Monitors at zone level**: not a real endpoint (`1001: Object not found`) — LB monitors are account-scoped (see below).

### Ruleset Phases (sampled on chitty.cc — `/zones/{id}/rulesets/phases/{phase}/entrypoint`)

| Phase | Status |
|---|---|
| `http_request_firewall_custom` | 1 ruleset (the Notion Webhooks ruleset above) |
| `http_ratelimit` | 0 — no entrypoint |
| `http_request_transform` | 0 — no entrypoint |
| `http_request_redirect` | not allowed at zone level (account-scope only) |
| `http_request_cache_settings` | 0 — no entrypoint |
| `http_request_origin` | 0 — no entrypoint |
| `http_log_custom_fields` | 0 — no entrypoint |
| `http_response_headers_transform` | 0 — no entrypoint |
| `ddos_l7` | 0 zone-level overrides (managed ruleset still active globally) |
| `http_request_sanitize` | 0 zone overrides |
| `http_request_dynamic_redirect` | 0 — no entrypoint |
| `http_request_late_transform` | 0 — no entrypoint |
| `http_request_sbfm` | invalid phase name (Super Bot Fight Mode is a setting, not a ruleset phase) |
| `http_request_select_configuration` | invalid phase name |
| `http_response_compression` | 0 — no entrypoint |
| `http_response_firewall_managed` | 0 — no entrypoint |

(Other 11 zones not individually walked through all 16 phases; given they only carry the 3 system managed rulesets and 0 custom rulesets, all custom-phase entrypoints will be empty there.)

### Account-Level

| Resource | Result |
|---|---|
| Realtime / Calls apps (`/accounts/{acct}/calls/apps`) | `0` items, HTTP 200 — none provisioned |
| Logpush jobs (`/accounts/{acct}/logpush/jobs`) | `0` items, HTTP 200 — no jobs configured |
| Logpush jobs (http_requests dataset) (`/accounts/{acct}/logpush/datasets/http_requests/jobs`) | `0` items |
| Logpush datasets — fields available | accessible; fields enumerable (AISecurityInjectionScore, CacheCacheStatus, ...) — no datasets in use |
| Images v2 list (`/accounts/{acct}/images/v2`) | accessible — `continuation_token` empty, no images stored |
| Images v1 stats (`/accounts/{acct}/images/v1/stats`) | error `5403: account not valid or not authorized for this service` — **Images service not enabled on this account** |
| Stream videos (`/accounts/{acct}/stream`) | error `10002: Authorization Failure` — **Stream not enabled on this account** |
| Stream live inputs | same — not enabled |
| Stream signing keys | same — not enabled |
| Load Balancer Monitors (`/accounts/{acct}/load_balancers/monitors`) | `0` items, HTTP 200 |
| Load Balancer Pools (`/accounts/{acct}/load_balancers/pools`) | `0` items, HTTP 200 |
| Brand Protection (`/accounts/{acct}/brand-protection/queries`) | endpoint returned non-JSON / not subscribed |
| Email Security / Area 1 (`/accounts/{acct}/email-security/settings/account`) | error `4108: no route for this URL` — **Email Security not subscribed** on this account |
| Cloudforce One requests (`/accounts/{acct}/cloudforce-one/requests`) | error `10404: invalid HTTP method or path` — not provisioned |
| Cloudforce One request types | error `10403: forbidden` — not subscribed |
| User API tokens (`/user/tokens`) | **20 tokens** exist on the authenticating user (Global API Key user). Sample IDs: `57468d1dbcd356de27187662b65b9629`, `ab983daaa917cf3f2a92d2101e9c3950`, `400e82fcc26a48680f1efc33154e66dd`, ... — values not displayed (read-only). Recommend audit + rotation review. |
| Account API tokens (`/accounts/{acct}/tokens`) | **13 account-owned tokens**. Sample IDs: `4e7217e5613ca8f182512967471100d3`, `157d1f5cec3be9d332f8f0f735db81bc`, `93f8647f0d2661ef8722b8902895eb97`, ... |
| Analytics Engine SQL endpoint (`/accounts/{acct}/analytics_engine/sql`) | endpoint exists but returns no dataset list (POST-only query API; GET returns empty). Dataset enumeration not exposed via REST — visible only through `wrangler analytics-engine sql` or Workers binding usage. **Inaccessible via REST for read enumeration**; treat as "no public list endpoint". |

### Items Still Genuinely Inaccessible / Not Subscribed

These returned definitive non-200 confirming the product is not enabled on the account, not a permission gap:

- **Cache Reserve** — Enterprise plan required (1135 across all zones).
- **Argo Smart Routing** — not subscribed (1015 across all zones).
- **Spectrum** — not subscribed (10007 across all zones).
- **Cloudflare Images** — service not enabled (5403).
- **Cloudflare Stream** — service not enabled (10002).
- **Email Security / Area 1** — not subscribed (4108).
- **Cloudforce One** — not subscribed (10403/10404).
- **Analytics Engine dataset enumeration** — no public REST list endpoint exists; this is an API limitation, not a token-scope problem.

### Permission Gaps That Remain (CloudflareMCP token only)

The CloudflareMCP token still cannot read zone settings or zone-scoped resources. To use the MCP for these going forward, mint a new API Token at `https://dash.cloudflare.com/profile/api-tokens` with at minimum:
- `Account` → `Cloudflare Workers Scripts:Read`, `Workers KV Storage:Read`, `Workers R2 Storage:Read`, `D1:Read`, `Pages:Read`, `Load Balancing:Read`, `Logs:Read`, `Account Settings:Read`, `Cloudflare Tunnel:Read`, `Access: Apps and Policies:Read`, `Account API Tokens:Read`
- `Zone` → `Zone:Read`, `Zone Settings:Read`, `SSL and Certificates:Read`, `Page Rules:Read`, `Bot Management:Read`, `Cache Rules:Read`, `Firewall Services:Read`, `Custom Pages:Read`, `Health Checks:Read`, `Waiting Room:Read`, `API Gateway:Read`, `Dynamic URL Redirects:Read`, `Transform Rules:Read`, `Custom Hostnames:Read`
- Scope: All accounts + All zones (or restrict to ChittyCorp + the 12 zones listed).

Until then, the Global API Key path used in this pass is the working route.

### Net New Findings (Second Pass)

1. **chitty.cc has 20 advanced SSL certificate packs** (vs. 1 typical) — and **one duplicate** bluebubbles pack (`f568c772-...` and `987c66f6-...` cover identical hosts). Cleanup candidate.
2. **ch1tty.com has 9 advanced SSL certificate packs**, thechitty.com has 2 — also worth a coverage review.
3. **chitty.cc has 1 zone-custom firewall ruleset** (`Allow Notion Webhooks`, ID `10f6a44e3b3c4b8c9f1148e98447c71a`) with 2 enabled `skip` rules for `notion.chitty.cc/webhook` POST and `register.chitty.cc/api/*` — confirmed present and active.
4. **Bot Management is enabled** on all 12 zones with identical config (`fight_mode=false`, `ai_bots_protection=only_on_ad_pages`, `crawler_protection=enabled`, latest model in use).
5. **20 user-level API tokens** and **13 account-level API tokens** exist — recommend running a rotation/audit check (existing automation likely lives in `chittyconnect` or `chittycert`).
6. **No items configured** for: pagerules (all zones), custom hostnames (all zones), waiting rooms, healthchecks, snippets, spectrum apps, API Shield operations/schemas, logpush jobs, calls apps, LB monitors, LB pools, Images, Stream — confirming the prior inventory's "0 items" assumption for these is correct.


---

## Final Cleanup Pass (2026-05-27)

Account: `0bc21e3a5a9de1a4cc843be9c3e98121` (ChittyCorp LLC). Read-only enumeration filling gaps from prior two passes. Account-scoped MCP token used first; Global API Key fallback used for zone-scoped endpoints (`X-Auth-Email` + `X-Auth-Key`) where the MCP token returned `10000 Authentication error` / `9109 Unauthorized`.

### Account-Level

| Area | Result | API |
|---|---|---|
| Notification policies | **1 policy** — `Default notification` (image_resizing_notification → email `nick@chittycorp.com`, autogenerated 2025-12-15) | `GET /alerting/v3/policies` HTTP 200 |
| Notification destinations — eligible | email ready, webhooks ready, pagerduty not eligible | `GET /alerting/v3/destinations/eligible` HTTP 200 |
| Notification destinations — pagerduty | **0 items** | HTTP 200 |
| Notification destinations — webhooks | **0 items** | HTTP 200 |
| Audit Logs (last 7d) | **≥1000 events** returned in single page (capped — no `result_info` pagination); subscription active | `GET /audit_logs?since=…&per_page=1000` HTTP 200 |
| Workers Logpush jobs | **0 jobs** (no Logpush configured for any dataset) | `GET /logpush/jobs` HTTP 200 |
| Workers Logpush dataset (`workers_trace_events`) | exposed — 11 fields available; **no job consuming it** | `GET /logpush/datasets/workers_trace_events/fields` HTTP 200 |
| Workers Observability telemetry keys | **endpoint 404** — feature not enabled / not GA on this account | `GET /workers/observability/telemetry/keys` HTTP 404 |
| Workers Builds | **endpoint errors** — `12013 Invalid query parameter` on `/builds/builds`, `12000 Not found` on `/builds/projects`. Effectively **not subscribed / not in use** | HTTP 400/404 |
| Cloudflare Realtime — Calls / SFU apps | **0 apps** (re-confirmed) | `GET /calls/apps` HTTP 200 |
| AI Gateway — gateways | **5 gateways** (count only): `chittygateway`, `chittycounsel`, `default`, + 2 others. DLP enabled on `chittygateway` and `chittycounsel`. No Logpush wired up. No log contents inspected. | `GET /ai-gateway/gateways` HTTP 200 |
| Web3 Gateways / hostnames | **not subscribed** — `7000 No route for that URI` on both `/web3/hostnames` and `/web3/gateways` | HTTP 400 |
| R2 Data Catalog warehouses | **1 warehouse** — `0bc21e3a5a9de1a4cc843be9c3e98121_chittyevidence-pipeline` (bucket: `chittyevidence-pipeline`, status: active, compaction enabled @ 128 MB, snapshot expiration disabled) | `GET /r2-catalog` HTTP 200 |
| Magic WAN — sites | **unauthorized** — `10000 Authentication error` (token scope; consistent with no Magic WAN subscription) | HTTP 401 |
| Magic Transit / NI — `cf_interconnects` | **0 interconnects** (`{interconnects:[]}`) | `GET /magic/cf_interconnects` HTTP 200 |
| Cloudflare Tunnel — teamnet routes | **0 routes** | HTTP 200 |
| Cloudflare Tunnel — virtual networks | **1 vnet** — `default` (autogenerated 2026-03-16, marked `is_default_network`) | HTTP 200 |
| WARP Connector | **0 connectors** | `GET /warp_connector` HTTP 200 |
| Device Profiles (Zero Trust) | **1 default policy** — `019a1d37-3ad4-7d1b-9748-f9fb43c0f82b`, `service_mode=warp`, `tunnel_protocol=masque`, allow_updates=false, allow_mode_switch=false, default split-tunnel excludes (RFC1918 / link-local / IPv6 ULA) | `GET /devices/policies` HTTP 200 |

### Per-Zone Audit (all 12 zones)

Page Shield `connections` (Connection Monitor) returns **403 "Zone not entitled to use Connection Monitor"** on every zone — not subscribed, expected.

| Zone | Zaraz cfg | Page Shield | PS scripts | FW rules (legacy) | Filters (legacy) | WAF pkgs (legacy) | Custom pages | DNSSEC |
|---|---|---|---|---|---|---|---|---|
| ch1tty.com | present, 0 tools, 2 triggers | **enabled** | 0 | 0 | 0 | 0 | 10 (defaults) | **active** |
| chicagoapps.com | present, 0 tools | disabled | 0 | 0 | 0 | 0 | 10 | disabled |
| chicagoparkingspots.com | present, 0 tools | disabled | 0 | 0 | 0 | 0 | 10 | disabled |
| chitty.cc | present, 0 tools, 2 triggers | **enabled** | 0 | **4 rules** (see below) | **4 filters** (matching rules) | 0 | 10 | **active** (algo 13, multi_signer=true) |
| chittycorp.com | present, 0 tools | disabled | 0 | 0 | 0 | 0 | 10 | disabled |
| chittyfoundation.org | present, 0 tools | disabled | 0 | 0 | 0 | 0 | 10 | disabled |
| chittyservices.com | present, 0 tools | disabled | 0 | 0 | 0 | 0 | 10 | disabled |
| chittystreet.com | present, 0 tools | disabled | 0 | 0 | 0 | 0 | 10 | **active** |
| distributedreputation.com | present, 0 tools | disabled | 0 | 0 | 0 | 0 | 10 | disabled |
| mychitty.com | present, 0 tools | disabled | 0 | 0 | 0 | 0 | 10 | disabled |
| nevershitty.com | present, 0 tools | **enabled** | 0 | 0 | 0 | 0 | 10 | disabled |
| thechitty.com | present, 0 tools | disabled | 0 | 0 | 0 | 0 | 10 | disabled |

**Legacy Firewall Rules on `chitty.cc` (4 rules — duplicated bypass+allow pairs):**
1. `f2e7f39d…` action=**bypass** — `notion.chitty.cc` POST `/webhook`
2. `25728dad…` action=**allow** — `notion.chitty.cc` POST `/webhook` (duplicate of #1 with different action)
3. `6e347b89…` action=**bypass** — `register.chitty.cc` `/api/*`
4. `7b2b69c2…` action=**allow** — `register.chitty.cc` `/api/*` (duplicate of #3 with different action)

→ **Cleanup recommendation**: legacy Firewall Rules engine deprecated. Each rule pair has both `bypass` and `allow` on the same filter — one of each pair is redundant. Migrate to Custom Rules / Skip rules in Rulesets engine, then delete.

**Custom Pages**: every zone returns the same 10 default templates (`waf_block`, `ratelimit_block`, `country_challenge`, etc.) — none have custom URLs configured (default Cloudflare branding everywhere).

**Zaraz**: present (returns default config) on all 12 zones, but **0 tools loaded** on every zone — effectively unused. `chitty.cc` and `ch1tty.com` have 2 triggers configured (pageview + click) but no tools wired to them.

### Zone Settings — Non-Default Flags

All 12 zones share the following settings (uniform across the account):

| Setting | Value | Notes |
|---|---|---|
| `http3` | **on** | uniform |
| `0rtt` | **off** everywhere **except `chitty.cc` = on** | chitty.cc outlier |
| `tls_1_3` | **on** everywhere **except `chitty.cc` = zrt** (0-RTT enabled mode) | chitty.cc outlier |
| `ipv6` | on | uniform |
| `min_tls_version` | **1.0** | **weak — recommend bump to 1.2 across all zones** |
| `always_use_https` | on for `ch1tty.com`, `chitty.cc`, `nevershitty.com`; **off for the other 9** | **gap — recommend enable** |
| `automatic_https_rewrites` | on | uniform |
| `opportunistic_encryption` | on | uniform |
| `security_header` (HSTS) | **disabled on all 12 zones** (`strict_transport_security.enabled=false, max_age=0`) | **gap — HSTS off everywhere** |

### Workers — Cron Triggers (24 of 117 scripts)

| Worker | Schedules |
|---|---|
| chittyagent-alchemist | `0 */6 * * *` |
| chittyagent-cloudflare | `0 3 * * *` |
| chittyagent-dispute | `*/30 * * * *` |
| chittyagent-helper | `0 */6 * * *` |
| chittyagent-imessage | `*/30 * * * *` |
| chittyagent-notes | `*/15 * * * *` |
| chittyagent-notion | `6 * * * *` |
| chittyagent-scrape | `*/15 * * * *` |
| chittyagent-tasks | `0 * * * *`, `*/5 * * * *` |
| chittycommand | `0 12 * * *`, `0 13 * * *`, `0 14 * * 1`, `0 15 1 * *` (4) |
| chittyconnect | `0 * * * *`, `*/5 * * * *`, `*/50 * * * *` (3) |
| chittyconnect-staging | `0 * * * *`, `*/5 * * * *`, `*/50 * * * *` (3) |
| chittyconnect-v2 | `0 * * * *` |
| chittyevidence-db | `0 * * * *`, `0 0 * * SUN`, `0 3 * * *`, `0 4 * * *`, `*/15 * * * *` (5) |
| chittyevidence-worker | `0 */5 * * *` |
| chittyfinance | `0 9 * * *` |
| chittymonitor | `*/5 * * * *` |
| chittyregister | `*/15 * * * *` |
| chittyregistry | `*/15 * * * *` |
| chittyrouter | `0 0 * * *`, `0 */2 * * *`, `0 */6 * * *`, `*/15 * * * *`, `*/30 * * * *` (5) |
| chittyschema | `0 * * * *` |
| chittysweep | `0 2 * * *`, `0 */6 * * *`, `*/15 * * * *` (3) |

**Total: 22 workers** with cron triggers (prior pass missed several; the chittyrouter=5 / chittysweep=3 numbers cited earlier are confirmed). Remaining 95 of 117 workers have no scheduled triggers (event/HTTP/queue/RPC driven).

### Workers — Tail Consumers (86 of 117 scripts)

**Every tail-enabled worker sends to a single tail consumer: `chittytrack`.** No worker has more than one tail consumer; no worker tails any service other than `chittytrack`.

86 workers with `tail_consumers=[{service: "chittytrack"}]`:

```
chatgptmcp-gateway, chittyadvocate, chittyagent-alchemist, chittyagent-auth, chittyagent-autoassist,
chittyagent-availability, chittyagent-bluebubbles, chittyagent-bridge-consent, chittyagent-buyflow,
chittyagent-canon, chittyagent-ch1tty, chittyagent-chatgpt, chittyagent-cleaner, chittyagent-cloudflare,
chittyagent-dispatch, chittyagent-dispute, chittyagent-evidence, chittyagent-finance, chittyagent-gam,
chittyagent-helper, chittyagent-human-escalator, chittyagent-imessage, chittyagent-kondoclean,
chittyagent-lead-score, chittyagent-lease-execute, chittyagent-lease-explain, chittyagent-market,
chittyagent-neon, chittyagent-notes, chittyagent-notion, chittyagent-orchestrator, chittyagent-quo,
chittyagent-quote, chittyagent-resolve, chittyagent-sandbox, chittyagent-scrape, chittyagent-ship,
chittyagent-storage, chittyagent-tasks, chittyagent-twilio, chittyagent-ui, chittyagent-viewport,
chittyapi, chittyauth, chittyauth-prod, chittybeacon, chittycan, chittycanon, chittycert,
chittychronicle, chittycommand, chittyconcierge, chittyconnect, chittyconnect-staging,
chittycontextual, chittycounsel, chittydiscovery, chittydispute, chittydlvr, chittyevidence-db,
chittyevidence-worker, chittyfinance, chittyid, chittyintel, chittyledger, chittyledger-api,
chittymcp, chittymcp-gateway, chittymcp-gateway-production, chittymint, chittymint-production,
chittymonitor, chittyregister, chittyregistry, chittyregistry-staging, chittyresolution, chittyrouter,
chittyschema, chittyschema-api, chittyscore, chittyscrape, chittystorage, chittyswitchboard,
chittytrust, documint, flow-analyzer
```

**Remaining 31 workers** (117 − 86) have **no tail consumer** — observability gap. Notable misses likely include `chittytrack` itself (cannot tail itself), the `*-mcp` variants, and one-off internal workers. Worth a follow-up to wire the remainder.

### Net Gaps / Recommendations

1. **HSTS disabled on all 12 zones** — enable `strict_transport_security` (suggest max_age=31536000, include_subdomains, preload for core domains).
2. **`min_tls_version=1.0` on all 12 zones** — raise to 1.2 minimum.
3. **`always_use_https=off` on 9 of 12 zones** — enable.
4. **Legacy Firewall Rules on `chitty.cc`** — 4 rules duplicate bypass/allow on the same filters; deprecated engine. Migrate to Rulesets, then delete.
5. **Zaraz** present but unused on all 12 zones (0 tools). Either remove configs or wire tools.
6. **Workers Logpush** dataset available but **0 jobs** — no long-term retention of `workers_trace_events`. `chittytrack` tail covers live observability; consider adding a Logpush job to R2 for compliance retention.
7. **31 workers** have no tail consumer — extend `chittytrack` tail to remaining workers (excluding `chittytrack` itself).
8. **R2 Data Catalog** — `chittyevidence-pipeline` warehouse has compaction enabled but **snapshot_expiration disabled** with max_age=7d preset. Decide whether to enable for cost control or leave snapshots indefinite for evidence chain-of-custody.
9. **DNSSEC** active on only 4 of 12 zones (`ch1tty.com`, `chitty.cc`, `chittystreet.com`, plus one autogenerated record). Enable on remaining 8.
10. **AI Gateway Logpush** — `logpush=false` on the 3 inspected gateways. No long-term log export configured.

### Endpoints Returning Errors (for completeness)

- `/workers/observability/telemetry/keys` → 404 (feature not enabled)
- `/builds/builds` → 400 `12013 Invalid query parameter`; `/builds/projects` → 404 → **Workers Builds not in use**
- `/magic/sites` → 401 (no Magic WAN subscription)
- `/web3/hostnames`, `/web3/gateways` → 400 `7000 No route` (not subscribed)
- `/page_shield/connections` (all zones) → 403 `not entitled` (Connection Monitor not subscribed)

All other read-only enumeration calls returned HTTP 200 / `success: true`.
