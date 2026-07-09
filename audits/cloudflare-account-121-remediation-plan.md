# Cloudflare Account 121 — Prioritized Remediation Plan

**Account:** `0bc21e3a5a9de1a4cc843be9c3e98121` (ChittyCorp LLC)
**Source audit:** `audits/cloudflare-account-121-full-inventory-2026-05-27.md` (864 lines, 3 passes)
**Generated:** 2026-05-27
**Mutation policy:** All mutations route through `ch1tty → ChittyConnect` per the system-wide sensitive-intent contract. Direct `wrangler` / CF API calls in apply-mode are forbidden.

---

## P0 — Security hardening (TLS / HSTS / HTTPS)

**Scope:** all 12 zones. Current state is below baseline on every zone.

| Setting | Current | Desired | Affected zones |
|---|---|---|---|
| `min_tls_version` | `1.0` | `1.2` | all 12 |
| `strict_transport_security.enabled` | `false` | `true` (max_age 31536000, include_subdomains, preload on core) | all 12 (preload limited to 3 core) |
| `always_use_https` | `on` for 3 zones | `on` everywhere | 9 zones gap (chicagoapps, chicagoparkingspots, chittycorp, chittyfoundation, chittyservices, chittystreet, distributedreputation, mychitty, thechitty) |
| `automatic_https_rewrites` | unknown | `on` | verify on all 12 |
| `ssl` | unknown | `strict` (or `full_strict`) | verify on all 12 |

**Artifacts:**
- `audits/cloudflare-zone-hardening-manifest.json` — declarative per-tier policy (core / active / parked)
- `scripts/apply-zone-hardening.sh` — dry-run-default, broker-required-for-apply

**Rollout order:** parked (3 zones, zero traffic) → active (6 zones, DNS but no worker routes) → core (3 zones: chitty.cc, ch1tty.com, nevershitty.com). Apply HSTS preload only after each core zone is confirmed HTTPS-only.

**Caveat:** HSTS preload is effectively one-way (months to remove). Do not enable preload on a tier without verifying every subdomain serves HTTPS.

---

## P1 — Route/domain conflicts (production routing ambiguity)

| Host | Wildcard route → worker | Custom domain → worker | Effect |
|---|---|---|---|
| `score.chitty.cc/*` | `chittyscore-worker` | `chittyscore` | Wildcard wins; custom-domain binding is dead |
| `dispute.chitty.cc/*` | `chittydispute` | `chittyagent-dispute` | Wildcard wins; custom-domain binding is dead |

**Action:** decide canonical worker per host. Delete the loser via broker. Verify with a `curl -sS https://{host}/health` round-trip after.

---

## P2 — Infrastructure cleanup (orphan workers)

**Batch 1 — Safe-to-delete (17 workers):** see `scripts/cleanup-batch1-orphans.sh`. Confirmed zero inbound bindings, no crons, no queue consumers. Includes `chittyschema-api` (added after Pass 1 investigation confirmed `chittyschema` is the primary drift-scan producer).

**Batch 2 — Pair-delete (2):** `chittystream-consumer-development`, `chittystream-orchestrator-development` (mutually bound, no external consumers).

**Batch 3 — KEEP, register as internal-only (5):** `chittyevidence`, `chittyagent-evidence`, `chittyagent-twilio`, `chittyagent-bridge-consent`, `chittyagent-human-escalator`. These are service-binding-only (no public hostname) but actively consumed by `chittymcp` / `chittyconnect-staging`. Add to chittyregistry as internal-only.

**Batch 4 — Investigate (3):**
- `chittyconnect-v2` — stale (Jan 2026 deploy) but still firing `0 * * * *` cron + producing to `github-events`. Verify `chittyconnect-staging` covers same role before retiring.
- `chittyevidence-worker` — recent deploy, 5h cron, no inbound. Confirm with owner whether `chittyevidence-db` (queue-driven) supersedes this batch loop.
- `chittycanon` — 862 successful invocations / 7d, zero errors. External traffic on `chittycanon.chitty.workers.dev`. Identify caller via `chittytrack` logs before retiring.

**Batch 5 — DO NOT DELETE:** `chittyconnect-staging` (sole producer of `documint-proofs`, recent deploy, secrets rotation push).

---

## P3 — Other anomalies (preserve from inventory)

| # | Finding | Action |
|---|---|---|
| 1 | `bluebubbles-bb-claw` tunnel **down** | Restart cloudflared on host, verify auth, file ticket if persistent |
| 2 | 16 orphan queues (chittycontext-*, chittyconnect-* family) | Delete via broker after confirming no producers/consumers across all 117 scripts |
| 3 | Containers app running 11 instances vs max 10 | Scale-down or raise max; investigate the off-by-one |
| 4 | 31 workers have no tail consumer | Add `tail_consumers = ["chittytrack"]` to their wrangler.toml (observability gap) |
| 5 | 5 Hyperdrives bypass Neon pooler | Update Hyperdrive origin URLs to `-pooler.` endpoint (perf + cost) |
| 6 | 4 errored Workflow instances (HASH_GHOSTS_WORKFLOW, evidence-processing) | Drain and re-run, capture failure reason |
| 7 | Service token expires 2126 | Likely typo for 2026 — verify and rotate to a sane expiry (1–2 years) |
| 8 | 3 parked zones with 0 DNS (chicagoparkingspots.com, chittyfoundation.org, distributedreputation.com) | Decide: park indefinitely with hardening baseline, repurpose, or release |
| 9 | Registry under-population: 89 routed workers, ~4–16 in registry | Backfill chittyregistry from CF account inventory (separate stream) |
| 10 | 20 user API tokens + 13 account API tokens | Audit, identify owners, rotate stale, deprecate unused |
| 11 | 12 workers scaffolded today (2026-05-27) | Confirm intentional; promote to production routes if real, delete if scratch |
| 12 | Page Shield enabled on only 3 zones (ch1tty.com, chitty.cc, nevershitty.com) | Consider enabling on remaining core zones |
| 13 | DNSSEC active on only 4 of 12 zones | Enable on all active production zones |
| 14 | Zaraz config present on all 12 zones but 0 tools loaded | Either configure or remove |
| 15 | Workers Observability not enabled, 0 Logpush jobs | Enable observability for production workers |

---

## Acceptance criteria status

1. **Artifact completeness:** ✅
   - `audits/cloudflare-account-121-full-inventory-2026-05-27.md` (864 lines, exists)
   - `scripts/cleanup-batch1-orphans.sh` (17 workers, dry-run capable, exists)
2. **Repo diff:** Working tree was clean at goal start. New files this turn: `audits/cloudflare-zone-hardening-manifest.json`, `scripts/apply-zone-hardening.sh`, `audits/cloudflare-account-121-remediation-plan.md`. None committed.
3. **Remediation targets summarized:** ✅ (above, P0–P3)
4. **Hardening manifest + script:** ✅ dry-run default, broker required for apply, fail-closed on missing broker creds
5. **No production mutations performed:** ✅ all work was read-only enumeration + local artifact authoring

---

## Blockers

- **ChittyConnect broker endpoint and token not provided in env** (`CHITTYCONNECT_BROKER_URL`, `CHITTYCONNECT_BROKER_TOKEN`). Apply mode will fail-closed until these are configured.
- **CloudflareMCP token lacks zone-write scope** — even if we wanted to apply via the MCP path, the current scope is account-only. Mint a token with the scopes documented in the audit's "Permission Gaps" section before apply.
- **Workers script-source dump is blocked** (token error 10405). Cron handler purposes for chittyconnect-v2 / chittyevidence-worker are inferred, not verified from source. Verifying requires either a token with `Workers Scripts:Read` or `wrangler tail` during a cron fire.

---

## next_actions[]

1. `scripts/apply-zone-hardening.sh --tier parked` — dry-run, review diff for the 3 parked zones
2. Provision `CHITTYCONNECT_BROKER_URL` + `CHITTYCONNECT_BROKER_TOKEN` env via chittysecrets
3. `scripts/apply-zone-hardening.sh --apply --tier parked` — execute parked tier through broker (lowest blast radius first)
4. Verify with `curl -sI https://<zone>` that `strict-transport-security` header is present post-apply
5. Repeat for tier=active, then tier=core
6. After P0 lands: address P1 (score/dispute route conflicts) and P3#1 (bluebubbles tunnel)
7. P2 cleanups (orphan workers) and P3#2 (orphan queues) — same broker path, lower priority since they are zero-traffic
8. Separate work-stream: backfill chittyregistry from CF inventory (P3#9)
