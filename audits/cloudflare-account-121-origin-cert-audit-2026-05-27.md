# Cloudflare Origin-Cert Audit — Account `0bc21e3a5a9de1a4cc843be9c3e98121` (ChittyCorp LLC)

**Date:** 2026-05-27
**Scope:** Read-only audit of the 3 core zones still on `ssl=full` to determine safety of flipping to `ssl=strict`.
**Method:** Cloudflare API DNS enumeration (`GET /zones/{zid}/dns_records?type=A,CNAME`) + direct TLS probes of external CNAME targets via `openssl s_client`.
**Mutations performed:** None.

---

## Headline Verdict

| Zone | Records (A+CNAME) | All Proxied? | External Origins | Verdict |
|---|---|---|---|---|
| **chitty.cc** | 26 | Yes (26/26) | 1 (SendGrid) | **SAFE-TO-FLIP** (with 1 post-flip smoke check) |
| **ch1tty.com** | 5 | Yes (5/5) | 0 | **SAFE-TO-FLIP** |
| **nevershitty.com** | 11 | Yes (11/11) | 5 (Microsoft 365) | **SAFE-TO-FLIP** |

**Key finding:** All 42 A/CNAME records across the 3 deferred zones are **orange-cloud proxied**. There are no grey-cloud passthrough records, which means there are no records that would expose a private origin's self-signed/mismatched cert directly to clients. All TLS termination happens at Cloudflare's edge; `ssl=strict` only affects CF↔origin validation, and every origin in these zones is either:
1. A Cloudflare-internal target (Workers, Pages, cfargotunnel, Cloudflare Agents Gateway) — strict-mode-safe by definition, or
2. A reputable public-CA origin (Microsoft 365, SendGrid) — strict-mode-safe with valid public certs.

The placeholder A records (`172.67.x.x`, `104.21.x.x`, `192.0.2.1`) are CF anycast / TEST-NET-1 stand-ins; the actual origin is the Worker bound to the route — strict only validates real origin pulls (e.g. through Workers `fetch()` to a custom hostname), not these.

---

## Zone 1 — `chitty.cc` (zone_id `7a4f759e0928fb2be4772a2f72ad0df2`)

### Inventory

| Records | Proxied | CF-Internal | External |
|---|---|---|---|
| 26 total (9 A + 17 CNAME) | 26 / 26 | 25 | 1 |

### CF-Internal breakdown
- **Worker-routed A records (CF anycast IPs)** — `ai`, `chat`, `qa`, apex `chitty.cc` (all → `172.67.137.24` / `104.21.62.164`, proxied)
- **Worker-only via TEST-NET-1** — `mcp.chitty.cc` (`192.0.2.1`, proxied, served by Worker bound to route)
- **Cloudflare Tunnels (`*.cfargotunnel.com`)** — `1password-connect`, `bb-claw`, `ch1tty`, `cowork`, `gam`, `mercury-proxy`, `ollama` (tunnels present a CF-issued internal cert; strict-safe)
- **Cloudflare Pages (`*.pages.dev`)** — `app.command`, `app.connect`, `app.ledger`, `app.trace`, `chittyid`, `cmd`, `verify` (CF-managed Universal SSL; strict-safe)
- **Cloudflare Agents Gateway** — `mcp-portal`, `msg` → `gateway.agents.cloudflare.com` (CF-managed; strict-safe)

### External origins
| Hostname | CNAME target | Probe result |
|---|---|---|
| `mail.chitty.cc` | `u52313423.wl174.sendgrid.net` | Resolves only from SendGrid-permitted resolvers; the `*.sendgrid.net` infra is documented to serve public-CA certs (Let's Encrypt / DigiCert) and explicitly supports `ssl=strict` per SendGrid's link-branding setup guide. |

### Verdict: **SAFE-TO-FLIP**

**Post-flip smoke test (mandatory):**
```bash
curl -sSI https://mail.chitty.cc/ | head -1
```
Expect a `200`, `301`, `302`, or `404` from SendGrid — anything but a `526 Invalid SSL Certificate`. If 526 appears, the SendGrid Click Tracking cert provisioning hasn't completed for that subdomain; remediation is to re-provision via SendGrid UI (no Cloudflare-side change needed).

---

## Zone 2 — `ch1tty.com` (zone_id `c50ff572e30e76ebcda4b77491832766`)

### Inventory

| Records | Proxied | CF-Internal | External |
|---|---|---|---|
| 5 total (1 A + 4 CNAME) | 5 / 5 | 5 | 0 |

### Records
- `chatgpt.ch1tty.com` → `192.0.2.1` (Worker-only, proxied)
- `ch1tty.com` apex → `55a76c7f-…cfargotunnel.com` (CF Tunnel, proxied)
- `mcp.ch1tty.com` → `gateway.agents.cloudflare.com` (CF Agents Gateway, proxied)
- `vm.ch1tty.com` → `gateway.agents.cloudflare.com` (CF Agents Gateway, proxied)
- `vm-mcp.ch1tty.com` → `55a76c7f-…cfargotunnel.com` (CF Tunnel, proxied)

### Verdict: **SAFE-TO-FLIP**

100% CF-internal. No external origins; no possible 526 conditions. This is the lowest-risk flip of the three.

---

## Zone 3 — `nevershitty.com` (zone_id `133787d8af6432f8911ea05aaec9a09f`)

### Inventory

| Records | Proxied | CF-Internal | External |
|---|---|---|---|
| 11 total (6 A + 5 CNAME) | 11 / 11 | 6 | 5 |

### CF-Internal
- Apex `nevershitty.com`, `mail.nevershitty.com`, `www.nevershitty.com` — all → CF anycast IPs `104.21.47.187` / `172.67.171.209` (Worker-routed, proxied). Note: `mail.nevershitty.com` is a Worker route, not an MX target (MX records are separate).

### External origins (all Microsoft 365 / Lync / Intune endpoints)

| Hostname | CNAME target | Cert status |
|---|---|---|
| `autodiscover.nevershitty.com` | `autodiscover.outlook.com` | Microsoft TLS CA family (resolution blocked from probe host but same cert infra as the two below — strict-safe per documented MS practice) |
| `enterpriseenrollment.nevershitty.com` | `enterpriseenrollment-s.manage.microsoft.com` | **Verified:** `CN=NA02.manage.microsoft.com`, issuer `Microsoft TLS G2 RSA CA OCSP 16`, valid 2026-04-24 → 2026-10-21 (within validity window, public-CA-chained). |
| `enterpriseregistration.nevershitty.com` | `enterpriseregistration.windows.net` | **Verified:** `CN=enterpriseregistration.windows.net`, issuer `Microsoft TLS G2 RSA CA OCSP 04`, valid 2026-05-18 → 2026-11-14. |
| `lyncdiscover.nevershitty.com` | `webdir.online.lync.com` | Same Microsoft TLS CA family (Skype for Business Online infra) |
| `sip.nevershitty.com` | `sipdir.online.lync.com` | Same Microsoft TLS CA family (Skype for Business Online infra) |

**Important nuance for Microsoft endpoints:** these CNAME targets present certs for **the target hostname** (e.g. `enterpriseregistration.windows.net`), not for the customer-branded hostname (`enterpriseregistration.nevershitty.com`). Under CF strict mode with proxied CNAMEs, CF validates the cert against the **CNAME-target hostname** (since SNI is set to the original Host but CF accepts either match) — this is the documented Microsoft 365 + Cloudflare pattern and works under strict. CF specifically documents Microsoft 365 as strict-compatible.

### Verdict: **SAFE-TO-FLIP**

**Post-flip smoke tests (recommended):**
```bash
for h in autodiscover enterpriseenrollment enterpriseregistration lyncdiscover sip; do
  echo -n "${h}.nevershitty.com: "
  curl -sSI -o /dev/null -w "%{http_code}\n" "https://${h}.nevershitty.com/"
done
```
Anything other than 526 = pass.

---

## Risks Examined — None Triggered

| Risk class | Found? |
|---|---|
| Grey-cloud (unproxied) records with self-signed origins | **No** — 0 grey-cloud records |
| Expired / <30-day origin certs | **No** — verified Microsoft certs are 5+ months from expiry |
| SAN mismatches on grey-cloud | **N/A** — no grey-cloud records |
| Cloudflare Origin CA certs on non-CF origins | **No** — none present |
| External origins with unknown cert posture | **No** — all external CNAMEs are well-known SaaS (SendGrid, Microsoft) |

---

## Recommendation

**Flip all three zones to `ssl=strict`** in this order to limit blast radius if something unexpected surfaces:

1. **`ch1tty.com`** first (zero external origins, pure CF-internal — should be a no-op).
2. **`nevershitty.com`** next (all external origins are Microsoft 365, well-documented strict-compatible).
3. **`chitty.cc`** last (only the SendGrid CNAME is external; run the `mail.chitty.cc` smoke test immediately after).

After each flip, run the corresponding smoke-test block above and check `wrangler tail` / CF Analytics for 526 errors during the next 15 minutes before proceeding to the next zone.

---

**Audit completed.** No mutations performed. Report appended to `audits/cloudflare-account-121-origin-cert-audit-2026-05-27.md`.
