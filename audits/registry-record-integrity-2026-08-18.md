# ChittyRegistry integrity findings — 2026-08-18

Source: live `GET https://registry.chitty.cc/api/v1/tools` (49 records), read 2026-08-18.
Code: `CHITTYOS/chittyregistry/src/universal-registry-worker.js`.

## Headline

**29 of 49 registry records — including every Tier 0/1 trust anchor — are
unidentified stubs from a single bulk seed. They have no ChittyID, no
entity_type, no certificate, and no resolvable host.**

The registry does not actually have valid registrations for chittyid,
chittyauth, chittycert, chittyledger, chittycan, chittygov, or chittymint.

## The two cohorts

| | seed cohort | registered cohort |
|---|---|---|
| count | 29 | 20 |
| `registered_at` | all exactly `2026-05-27T16:18:00Z` (whole minute) | `2026-05-26` → `2026-08-02`, millisecond precision |
| `chitty_id` | **absent** | present |
| `entity_type` | **absent** | `"T"` |
| `endpoints` | `{"health":"/health","status":"/api/v1/status"}` (object, relative) | `["https://x.chitty.cc/health", ...]` (array, absolute) |
| `certificate_ref` | 0 / 29 | 6 / 20 |
| health ever checked | never | yes |

No name appears in both cohorts — so these stubs are the *only* records for
those 29 services, not duplicates shadowing good ones.

Seed cohort names: bane, chittyadvocate, chittyagent-canon, chittyagent-tasks,
chittyagent-ui, chittyapi, chittyauth, chittybeacon, chittybrand-cdn, chittycan,
chittycert, chittycharge, chittychronicle, chittycommand, chittyconcierge,
chittycontextual, chittycounsel, chittydispute, chittydlvr, chittydna,
chittydocs, chittyevidence-db, chittyfinance, chittygateway, chittygov,
chittyid, chittyintel, chittyledger, chittymint.

## Why they are invisible to the health sweep — two independent causes

`runHealthSweep()` (universal-registry-worker.js:859):

```js
if (tool.entity_type !== "T") continue;          // :863  → all 29 fail here (undefined)
...
const healthUrl = pickHealthUrl(tool);
if (!healthUrl) continue;                        // :866  → would also fail; silent
```

`pickHealthUrl()` (:897) opens with `if (!Array.isArray(tool.endpoints)) return null` —
the object shape can never resolve, even if entity_type were fixed.

Both skips are bare `continue` with no log, no counter, no marker. 29 services
are silently omitted from every sweep and nothing anywhere reports the omission.

## Latent corruption

Line 878 writes `REGISTRY_STORE.put(\`tools:item:${tool.chitty_id}\`, ...)`.
For a record with no `chitty_id` that key is literally `tools:item:undefined`.
The `entity_type` filter currently prevents any of them reaching it — so all 29
would collide on a single key the moment someone "fixes" entity_type alone.
**Do not backfill entity_type without first backfilling chitty_id.**

## Misleading status signals (three, all failing toward false alarm)

1. `chittyregistry` self-records `unhealthy / HTTP 522`; direct curl to
   `https://registry.chitty.cc/health` returns **200**. Worker fetching its own
   zone — artifact, not outage.
2. `openclaw` records 403: its endpoint is `http://127.0.0.1:18789/health`, not
   reachable from a Cloudflare worker. It should be excluded from the sweep, not
   scored by it.
3. SessionStart hook reports "Task service unreachable (or auth required)";
   `tasks.chitty.cc/health` returns **200**. The hook's own message admits the
   auth branch — so this is hook-side auth, not a down service. (Weakest of the
   three; the hook did not actually claim an outage.)

## Real outages (the only ones in the set)

5 × HTTP 530 + 1 × HTTP 404 among the 20 registered records — undeployed workers
or missing routes. These are the genuine failures and they are currently buried
under 30+ false alarms.

## Verification: stored broken, not rendered broken (CONFIRMED)

- `GET /api/v1/tools` handler (:212-220) calls `getTools()` and returns the
  result verbatim — no projection, no field-picking.
- `getTools()` (:750-764) does a raw `KV.get` + `JSON.parse` per id and filters
  only by `subtype`. It never reshapes a record.
- `REGISTRY_CACHE` is used *only* for the `"stats"` key (:625, :825, :893). The
  tools list path is uncached.

=> The missing `chitty_id` / `entity_type` and the object-shaped `endpoints` are
the actual bytes in KV. Not a serializer artifact, not a stale cache.

Further: `registerTool()` (:774-787) throws `"chitty_id required"` on a missing
id and validates `entity_type` against `VALID_ENTITY_TYPES = [P,L,T,E,A]`. So
the 29 could not have entered through the registry's own POST path either. They
were written **directly to the `REGISTRY_STORE` KV namespace**, bypassing both
`chittyregister` validation and `chittyregistry`'s own write handler.

## Verification: the second catalog does not rescue them (CONFIRMED)

`GET /v0.1/servers?limit=500` is a *separate* MCP-server catalog — 16 entries in
MCP `server.schema.json` shape, names namespaced `cc.chitty/*`, `com.github/*`,
`io.modelcontextprotocol/*`. It contains chittymcp, chittyconnect, chittymac,
chittyagent-{ship,notes,gam,neon,imessage}, and third-party servers.

**Zero trust anchors appear in it** — no chittyid, chittyauth, chittycert,
chittyledger, chittycan, chittygov, chittymint.

=> There is no valid registration for those services in *either* catalog. The
headline stands.

## The F-007 self-health fix landed in dead code (CONFIRMED)

Commit `ad47925 fix(health): short-circuit self-health check (F-007)` (2026-05-27)
correctly diagnosed the 522 — "fetching https://registry.chitty.cc/health from
inside the registry Worker — Cloudflare returns 522 (loopback restriction)" —
and short-circuited it.

It applied the fix to **`src/services/HealthMonitor.ts`**.

But `wrangler.jsonc` declares `"main": "src/universal-registry-worker.js"`, and
that worker does **not import HealthMonitor** — it carries its own independent
`runHealthSweep()` (:859) with no self short-circuit.

The repo has two parallel health implementations. The fix went into the one that
is not deployed. That is why the live registry still self-reports
`unhealthy / HTTP 522` nearly three months after F-007 was closed.

This also means any other fix made to `HealthMonitor.ts` has had no production
effect. Worth auditing that file's whole history before trusting it.

## Origin narrowed: not any worker write path (CONFIRMED)

Three candidate write paths, all ruled out:

1. `registerTool()` (:774-787) — throws `"chitty_id required"` on missing id and
   validates entity_type against `[P,L,T,E,A]`. Rejects these records.
2. `POST /internal/upsert` (:244-267) — requires `record.chitty_id` (:253) and
   the `X-Chitty-Internal-Binding: chittyregister` header. Rejects these records.
   (Note: it does *not* validate entity_type and writes the body verbatim, so it
   would happily store a record with an id but no entity_type. Separate gap.)
3. `chittyregister-worker.js` — requires `endpoints` and treats it as an array
   throughout (:914, :983-987, :1448). Rejects the object shape.

=> The 29 records did not enter through any application code. They were written
straight into the `REGISTRY_STORE` KV namespace via the Cloudflare API, `wrangler
kv` CLI, or the dashboard. The vehicle is **unknown** — see the retraction below;
the one script previously suspected has since been read in full and ruled out.

## ~~Suspected origin~~ — RETRACTED 2026-08-18

The earlier draft named `scripts/registry-backfill-from-cf-inventory.sh` as the
likely vehicle. **That is ruled out**, on two independent grounds:

1. **Timing.** Commit `030f6a1` (2026-05-26 14:31 -0500) added the
   `chitty_id`-required validation and made `POST /api/v1/tools` return 400 on
   failure. The seed is stamped `2026-05-27T16:18Z` — more than a day later. Any
   `--apply` run at that point would have been rejected.
2. **Shape.** The script's manifest builder (:90-104) emits
   `{name, category, url, hostname, account_id, source, auto_registered,
   capabilities, metadata}` — no `chitty_id`, no `entity_type`, and **no
   `endpoints` field at all**. The stub records carry object-shaped `endpoints`
   and none of the script's always-set fields. Different schemas entirely.

The `source: "cloudflare-inventory-2026-05-27"` string near the seed date is a
coincidence, not evidence.

**The write vector is therefore UNKNOWN, not merely unattributed.** Something
holds direct `REGISTRY_STORE` write access outside every application path. That
is an open security question and it is the reason no data remediation should run
before it is identified — a clean re-registration can be re-corrupted by the same
vector, under real ChittyIDs and certs, raising blast radius rather than closing it.

## Correction: the registration flow is mint-inside-register

An earlier draft of step 1 below said to "mint a ChittyID each via id.chitty.cc
... obtain certificates" and *then* register. **That inverts the contract.**

Per `CHITTYFOUNDATION/chittyregister/CHARTER.md` (CERTIFIED, v2.0.0), the caller
POSTs only `{name, description, version, endpoints, schema, security, metadata}`.
**ChittyRegister mints the ChittyID and issues the certificate itself**, inside
the same call, and returns `chitty_id`, `certificate`, `chronicle_ref`,
`registry_ref`, `discovery_ref`. `chittyregister/src/lib/database.js` treats
`chitty_id` as a server-generated primary key.

A caller-side mint→cert→register sequence would be a *second bypass of the same
class* that produced the 29 stubs — just through a different door. Do not do it.

## Open questions that gate any data remediation

1. **Neon has not been queried.** ChittyRegister's system of record is the shared
   `chittyos-core` Neon DB, not registry KV. Nobody has `SELECT`ed it for these
   service names. Until that runs, "no canonical ChittyID exists" is inferred
   from absence, not established. Run it before minting anything.
2. **`entity_type: "T"` may itself be non-canonical.** Operator canon holds that
   actors with agency are Person (P), never Thing (T). The existing registered
   cohort and this audit both default services to `"T"`. Resolve with governance
   before batch-creating 29 records of a type that may need immediate correction.
3. **Do not read `chittymint/CHARTER.md:110-119` as chittymint's own ChittyID.**
   The `03-1-USA-0970-P-2603-0-54` there is a documented example `/mint` response.
   `chittyid/AGENTS.md` and `chittycert/AGENTS.md` both self-declare
   `service_chittyid: "TBD-pending-canonical-mint"`.

## Recommended remediation order

1. Re-register the 29 through `register.chitty.cc` — a bare POST of the charter
   payload, letting ChittyRegister mint and certify internally (see correction
   above). Gated on the two open questions above. Registry mutation → route via
   ChittyConnect per sensitive-intent contract (broker verified UP 2026-08-18).
2. ~~Harden `runHealthSweep`~~ — DONE, this branch.
   logged `skipped[]` bucket surfaced in the sweep result and `/api/v1/status`.
3. Guard line 878 against a falsy `chitty_id` so `tools:item:undefined` is
   impossible.
4. Exclude loopback/private hosts from the sweep rather than scoring them.
5. Fix the self-check 522 (skip own origin, or use a service binding).
6. Only then triage the 5 × 530 as real deploy failures.
