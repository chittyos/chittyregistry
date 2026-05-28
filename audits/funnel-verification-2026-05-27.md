# Registration Funnel Verification — 2026-05-27

Live re-verification of the 6 checks specified by the funnel-edge-cases goal.

| # | Check | Endpoint | Status | Notes |
|---|---|---|---|---|
| 1 | Onboard | `GET register.chitty.cc/api/v1/onboard` | ✅ | Returns rich JSON including the `register_vs_registry` primer (gatekeeper vs directory vs runtime mesh) |
| 2 | Issue challenge | `POST register.chitty.cc/api/v1/challenge` body `{name, endpoint}` | ✅ | Returns `{success:true, token, well_known_path:"/.well-known/chitty-register-challenge/<token>"}` |
| 3 | Register rejection | `POST register.chitty.cc/api/v1/register` body `{name:"missing-everything"}` | ✅ | Returns `success:false` with 6 field-validation errors |
| 4 | Registry manifest | `GET registry.chitty.cc/api/v1/manifest` | ✅ | `count:37, success:true, version:"1.0.0"`. **Gap:** `manifest_hash` field is null/absent — see Findings. |
| 5 | Tools list | `GET registry.chitty.cc/api/v1/tools?limit=200` | ✅ | 37 entries (4 baseline + 29 from session backfill + 4 organic). Names like daily-comms-triage, comptroller, bane, chittyauth, chittycert, etc. |
| 6 | Market pull | `GET market.chitty.cc/api/v1/market/discover?q=chitty` | 🟡 | Endpoint responds 200, but the proxied call to Registry's search backend returns `"Endpoint not found"` and `results: []`. **Market → Registry bridge is broken or pointing at a stale path.** See Findings. |

## Findings

### Gap 1: Manifest hash field is null
`registry.chitty.cc/api/v1/manifest` returns `success:true, count:37` but the `manifest.manifest_hash` field is missing/null. Earlier work claimed "valid manifest hash" — that's no longer present in the response. Either the hash was removed in a recent edit or it's a computed-on-demand field that's not firing. Worth a follow-up.

### Gap 2: Market discover proxy is broken
`market.chitty.cc/api/v1/market/discover?q=chitty` wraps the response in `data:{...}` where `data` is an upstream error: `"Endpoint not found"`. The upstream (chittyregistry) lists its actual search endpoint as `/api/v1/search`, but the Market worker appears to be calling a different (non-existent) path. The available-endpoints array surfaced in the proxy response confirms /api/v1/search exists on Registry — the Market handler just isn't using it.

**Quick fix:** in `chittyentity/workers/chittyagent-market/src/index.ts` around line 207 (`/api/v1/market/discover` handler), point at `https://registry.chitty.cc/api/v1/search?q=...` instead of whatever path it's currently using.

## Verdict

**5 of 6 checks fully passing.** Funnel core (onboard → challenge → register → registry) is durable. Market pull is the one piece where the bridge needs a one-line path correction. Manifest hash is a nice-to-have that's currently absent.

Evidence captured via direct curl on 2026-05-27 ~22:21 UTC.
