# Carry Ledger — 2026-05-27

Synthesized from this session + audits + TaskList. Updated as items close.

**Classification:**
- `SAFE_REPO` — repo-only, no deploy, no secret, no third-party
- `NEEDS_OPERATOR` — needs explicit human decision/approval
- `NEEDS_SECRET` — mutates a credential/secret
- `NEEDS_DEPLOY` — requires wrangler deploy
- `BLOCKED` — externally gated (rate limit, broken upstream, etc.)
- `DONE` — closed

---

## A. Registration-funnel carries

| ID | Item | Class | Status | Evidence |
|----|------|-------|--------|----------|
| A1 | manifest_hash alias on /api/v1/manifest | SAFE_REPO | **DONE** | `src/universal-registry-worker.js` line 821: `manifest.manifest_hash = manifest.content_hash;` added |
| A2 | Market discover proxy → /api/v1/search | SAFE_REPO | **DONE** | `chittyentity/workers/chittyagent-market/src/index.ts` line 60: path corrected |
| A3 | External-MCP intake design doc | SAFE_REPO | **DONE** | `chittyregister/docs/EXTERNAL_MCP_INTAKE.md` |
| A4 | External-MCP bridge implementation in register-worker | SAFE_REPO | IN PROGRESS | operator-approved this session |
| A5 | register_challenges schema/code parity verified | SAFE_REPO | **DONE** | Neon `restless-grass-40598426` matches migration 002 |
| A6 | CHITTY_AUTH_CALLBACK_SECRET bound on deployed Register | NEEDS_OPERATOR | **DONE — verified bound** | Live probe returned 401 (HMAC ran) not 503 (unset) |
| A7 | ChittyHelper Register/Registry primer backport | SAFE_REPO | **DONE** | upstream `chittyagent-helper` `docs/REGISTRATION.md` + `NAV.md` |
| A8 | /health service-identity drift fix | SAFE_REPO | **DONE** | `chittyregistry-universal` → `chittyregistry` |
| A9 | Live funnel re-verification | SAFE_REPO | **DONE** | 5/6 checks pass + 2 gaps surfaced (now both fixed via A1, A2) |

## B. ChittyMarket — skills + connectors cleanup

| ID | Item | Class | Status |
|----|------|-------|--------|
| B1 | Identify skill+connector mixed PRs needing split | SAFE_REPO | PENDING |
| B2 | Verify ch1tty/servers.json TODO endpoints stay disabled | SAFE_REPO | PENDING |

## C. Ch1tty servers.json hygiene

| ID | Item | Class | Status |
|----|------|-------|--------|
| C1 | Audit `_comment` and `enabled:false` entries — confirm TODOs stay off | SAFE_REPO | PENDING |
| C2 | Servers schema doc updated for external-MCP fields (from A3) | SAFE_REPO | PENDING |

## D. ChittyFinance engine vs ChittyBooks UI contracts

| ID | Item | Class | Status |
|----|------|-------|--------|
| D1 | Define engine/UI contract boundary in docs | SAFE_REPO | PENDING |

## E. ChittyLedger substrate/projection docs

| ID | Item | Class | Status |
|----|------|-------|--------|
| E1 | Substrate (canonical) vs projections (Finance, Evidence) doc | SAFE_REPO | PENDING |

## F. Phase 4 / GATE 3 readiness (no cron enable)

| ID | Item | Class | Status |
|----|------|-------|--------|
| F1 | Inventory Phase 4 services + their health stubs | SAFE_REPO | PENDING |
| F2 | Convert stubs toward real readiness checks (no cron) | SAFE_REPO | PENDING |

## G. Open security & infra carries (from prior sessions)

| ID | Item | Class | Status |
|----|------|-------|--------|
| G1 | TaskList #12 — HSTS preload=true after 24-48h soak | NEEDS_OPERATOR | DEFERRED (soak window) |
| G2 | TaskList #15 — Reissue admin token | NEEDS_SECRET | IN PROGRESS (operator-approved, brokered rotation in flight) |
| G3 | TaskList #16 — Stagger 4 *-connect tokens | NEEDS_SECRET | IN PROGRESS (same agent) |
| G4 | TaskList #19 — resolution.chitty.cc not routed | SAFE_REPO | PENDING — verify if intentionally internal or restore route |
| G5 | TaskList #20 — 2 unbound pooled Hyperdrives | NEEDS_OPERATOR | PENDING — confirm safe-to-delete |

## H. ChittyRegister F2 — migration runner

| ID | Item | Class | Status |
|----|------|-------|--------|
| H1 | Prove deploy.yml/deploy-optimized.sh/package.json don't apply migrations | SAFE_REPO | **DONE** — confirmed all 3 run only `wrangler deploy` |
| H2 | Check schema_migrations table | SAFE_REPO | **DONE** — does NOT exist in ChittyOS-Core |
| H3 | Propose minimal schema_migrations DDL | SAFE_REPO | **DONE** — `migrations/001_schema_migrations.sql` |
| H4 | Build migration runner with checksum drift detection + backfill | SAFE_REPO | **DONE** — `scripts/migrate.sh` (modes: list/dry-run/verify/apply) |
| H5 | Wire runner into deploy.yml before wrangler deploy | SAFE_REPO | **DONE** — psql install + 3-step run-migrations job before deploy |
| H6 | Docs: migrations are release artifacts, not documentation | SAFE_REPO | **DONE** — `migrations/README.md` |
| H7 | DDL approval to create schema_migrations table | NEEDS_OPERATOR | **PENDING** (Task #28) |
| H8 | GitHub secret `CHITTY_REGISTER_DB_URL` on chittyregister repo | NEEDS_OPERATOR | **PENDING** |
| H9 | First deploy with migration step | NEEDS_DEPLOY | gated on H7 + H8 |

## Live in-flight

- Token rotation agent (G2 + G3): HALTED SAFELY — consumer attribution unreliable from CF API + repo grep returned 0 hits for all 5 client_ids. Re-classified G2/G3 → NEEDS_OPERATOR (mapping must come from operator's knowledge of which workers consume which CHITTYCONNECT_* binding).

## Updates 2026-05-27 22:50

- A4 (External-MCP bridge): COMPLETED — `pullExternalMCPsFromCh1tty()` added to register-worker + `/internal/upsert` route added to registry worker. Off by default (env-gated). Test fixture at `tests/fixtures/external-mcp-bridge.servers.json`.
- G2 / G3: reclassified NEEDS_OPERATOR (see attribution issue)
- H1–H6 (F2 migration runner): SAFE_REPO complete; H7 (DDL approval) + H8 (DB URL secret) + H9 (first deploy) remain operator-gated

## Updates 2026-05-27 23:05

- **H7 (schema_migrations DDL):** APPROVED + APPLIED via Neon MCP. Table created in restless-grass-40598426, backfill rows for 001+002+003 inserted (`backfill-2026-05-27-neon-mcp`).
- **H8 (GitHub DB URL secret):** Operator preference: route via "ch1tty/neon/cloudflare MCP for Hyperdrive" — i.e. avoid raw DB URL in CI. Designed Path A `/admin/migrate` Worker endpoint pattern. Documented at `docs/MIGRATION_PIPELINE.md`. Deploy.yml updated to skip-if-secret-unset (graceful fallback B).
- **C (ch1tty servers.json):** AUDITED — 14 enabled, 8 disabled-with-TODO-reason. Hygiene matches goal "keeping TODO endpoints disabled". No action.
- **B/D/E/F inventory:** Read-only inventory returned. Findings:
  - B (Market split): 4 SAFE_REPO actions identified (frontmatter tags, lint scripts, doc). No immediate-blocker.
  - D (Finance/Books contract): Contract doc EXISTS (`CHITTYAPPS/chittyfinance/docs/contracts/chittybooks-chittyfinance.md`). 5 SAFE_REPO improvements identified (canonical frontmatter, error envelope, OpenAPI stub).
  - E (Ledger substrate/projection docs): GAP — `CHITTYOS/chittyledger/CHARTER.md` + `CHITTY.md` missing; substrate/projection model not documented anywhere canonical. 5 SAFE_REPO actions queued.
  - F (Phase 4 GATE 3): **Inventory was stale.** All 4 workers have real implementations + scheduled handlers + `mode` fields. NOT health-only stubs. F1 cron-contradiction was false; F2 mode-field was already done.

## Final state

**SAFE_REPO completed this session:**
- manifest_hash alias (A1)
- market discover proxy path (A2)
- external-MCP bridge design + impl + test fixture (A3+A4)
- register_challenges schema verification (A5)
- ChittyHelper primer backport (A7)
- /health service identity fix (A8)
- Funnel re-verification (A9)
- Migration runner system end-to-end (H1–H6)
- schema_migrations table created + backfilled (H7)
- Carry ledger doc

**NEEDS_OPERATOR carried forward:**
- G1: HSTS preload=true after soak
- G2/G3: Token rotation consumer mapping (rotation halted safely; attribution unmappable from source)
- G4 (resolution.chitty.cc not routed): SAFE_REPO — verify intentional vs restore route
- G5: 2 unbound pooled Hyperdrives — confirm safe-to-delete
- H8: DB URL secret OR /admin/migrate endpoint implementation (Path A vs Path B decision)
- B/D/E priority items per inventory

**No deploys executed. No secrets mutated. No third-party MCPs registered. No prod data written.**

---

**Ledger live; updated as items close.**
