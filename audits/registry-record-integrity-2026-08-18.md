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

## ~~Latent corruption~~ — SEVERITY CORRECTED 2026-08-18

The original draft claimed that backfilling `entity_type` without `chitty_id`
"would destroy 28 of the 29 records." **That was wrong**, and the error was mine.

`listAllToolIds()` (:738-748) lists by KV key prefix and derives each id from the
**key name** (`key.name.slice("tools:item:".length)`), not from the record body.
`getTools()` (:750) then fetches `tools:item:${id}`. Per the account-121
execution report (see Origin, below), the 29 were written at keys
`tools:item:did:chitty:foundation:{name}`.

So a sweep write of `tools:item:${tool.chitty_id}` with an undefined `chitty_id`
creates ONE new orphan key, `tools:item:undefined`. It does not overwrite any of
the 29 DID-keyed records. Nothing is destroyed.

The real (milder) consequence, had the filters been "fixed" naively: each
record's health update would silently land on the orphan key instead of on the
record, so health would never persist for those 29 and one junk entry would
appear in the catalog listing.

Even that requires TWO changes, not one: the records would also have to get
array-shaped `endpoints`, because `pickHealthUrl()` returns null on their object
shape and skips them before the write is reached.

The `!tool.chitty_id` guard shipped in PR #181 is still correct and worth having
— it is cheap, it prevents the orphan key, and it makes the invariant explicit.
But it is defensive hygiene, not the defusing of a data-loss bomb.

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

## Origin — IDENTIFIED 2026-08-18 (no longer unknown)

The write vehicle is documented in this repository, in
`audits/cloudflare-account-121-execution-report-2026-05-27.md`, Step 7:

> **Step 7 — Backfill chittyregistry (29/29 registered via KV bypass)**
>
> "Gatekeeper rejected initial submissions (DB-error on first 9, rate-limit on
> rest). Pivoted to direct KV write on the registry's REGISTRY_STORE namespace
> `b4518a6db20640ea990099f6e8497771` using Global API Key. Wrote canonical key
> format `tools:item:did:chitty:foundation:{name}` (item payload) +
> `tools:by-subtype:service:did:chitty:foundation:{name}` (index pointer)."

Count (29/29), namespace, and date (2026-05-27) all match the seed cohort
exactly. This was an **authorized operator action**, disclosed at the time — not
an intrusion. There is no hostile party with KV write access, and the earlier
framing of an "unidentified write vector" as a standing security risk is
withdrawn.

The DID-style key format also explains the missing `chitty_id`: records were
keyed by `did:chitty:foundation:{name}` and the bodies simply never carried a
ChittyID field.

`scripts/registry-backfill-from-cf-inventory.sh` was separately suspected and is
ruled out: commit `030f6a1` (2026-05-26 14:31) added the `chitty_id`-required
validation a day before the seed, and the script emits no `endpoints` field at
all, so its payload shape cannot produce these records.

### The actual root cause, still open

That same report lists three operator follow-ups that were never done. The first
is the root cause of this entire audit:

> 1. Investigate Gatekeeper "Database operation failed" at
>    `register.chitty.cc/api/v1/register` so future registrations don't need KV bypass
> 2. Raise rate-limit ceiling for bulk operations
> 3. The 29 backfilled entries used auto-derived descriptions — refine per service

The bypass happened because the front door was broken under bulk load. Until
item 1 is resolved, any future bulk registration has the same incentive to
bypass again.

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

---

# RESOLVED 2026-08-18: the 29 split three ways, and most already have identities

The gating question — "do these services already have canonical ChittyIDs, or
must they be minted?" — is now answered from the authoritative source, and the
answer is **most of them already do**.

ChittyRegister exposes `GET /api/v1/compliance/{serviceName}`, unauthenticated,
reading its Neon `chittyos-core` store directly. Queried for all 29 seed names.
Full results: `audits/seed29-registration-reconciliation-2026-08-18.csv`.

| | count |
|---|---|
| already registered in ChittyRegister (Neon), with a ChittyID | **13** |
| not present at all | 16 |
| of the 13 — `active` with a certificate | 10 |
| of the 13 — `pending_cert`, no certificate | 3 |

## This kills the "mint 29 new IDs" plan

For 13 services, minting would have created a **second, competing identity** for
a service that already has one. That is the identity-duplication failure the
remediation plan was explicitly trying to avoid, and it would have been walked
straight into.

Correct action for those 13 is a **backfill of the existing ChittyID into
registry KV** — not registration, not minting.

## Correction: chittymint's ChittyID is real, not an example

An earlier note in this audit warned against reading
`chittymint/CHARTER.md:110-119` — `03-1-USA-0970-P-2603-0-54` — as chittymint's
own identity, calling it a documented example `/mint` response.

**That warning was wrong.** ChittyRegister returns exactly
`03-1-USA-0970-P-2603-0-54` as chittymint's `chitty_id`. It is its real
registered identity and the CHARTER is self-describing. The warning is withdrawn.

(Note for whoever handles it: that ID carries entity_type **P**, while
chittycommand, chittydlvr, and chittyledger are **T**. Whether a minting service
is canonically a Person or a Thing is a governance question, not a data bug —
but the inconsistency is real and lives in the authoritative store.)

## Two ID formats coexist in the authoritative store

| format | count | example |
|---|---|---|
| legacy `did:chitty:REG-*` | 9 | `did:chitty:REG-XE65QU` (chittyauth) |
| canonical `VV-G-LLL-SSSS-T-YYMM-C-XX` | 4 | `03-1-USA-9002-T-2602-0-81` (chittyledger) |

ChittyRegister's own Neon store holds both. Any backfill must decide whether to
carry the legacy DIDs across as-is or migrate them — carrying them across
propagates the inconsistency into a second store.

## The trust anchors that are genuinely absent

`chittyid`, `chittycert`, and `chittygov` are **not** in ChittyRegister. This is
consistent with their own repos: `chittyid/AGENTS.md` and `chittycert/AGENTS.md`
both self-declare `service_chittyid: "TBD-pending-canonical-mint"`. Those really
do need first-time registration — the headline claim holds for them.

## Revised remediation

1. **Backfill 13** existing ChittyIDs from ChittyRegister into registry KV.
   No minting. Resolve the DID-vs-canonical format question first.
2. **Complete certification** for the 3 `pending_cert` records
   (chittycommand, chittydlvr, chittymint).
3. **Register 16** genuinely-absent services through the Gatekeeper — the only
   group where the original "re-register properly" plan applies unchanged.
4. **Fix the Gatekeeper before step 3.** Follow-up #1 from the 2026-05-27 report
   was never done. Note that the Gatekeeper demonstrably worked for these 13 at
   some point, so it is not universally broken — the 2026-05-27 failure was
   load- or data-shaped, which is what needs diagnosing.
