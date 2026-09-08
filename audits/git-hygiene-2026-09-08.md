# Git Hygiene Audit — chittyregistry — 2026-09-08

## Headline: the repo was cloned single-branch

`remote.origin.fetch` was `+refs/heads/main:refs/remotes/origin/main` and the repo was
**shallow**. Consequences, all now fixed:

- `git branch -r` showed 2 branches; the remote has 20.
- `git fetch --prune` could not detect `[gone]` branches, so `clean_gone` was inert here.
- No local branch had an upstream — every "not stored as a remote-tracking branch" error
  was a symptom of this one line, not an independent defect.
- `git merge-base` / `git cherry` ancestry results were unreliable while shallow.

Every session working in this clone has been judging branch state against a
2-of-20 view of the remote.

## Applied (local, reversible)

| Action | Result |
|---|---|
| `remote.origin.fetch` → `+refs/heads/*:refs/remotes/origin/*` | 21 remote-tracking refs |
| `git fetch --unshallow --prune` | full history; ancestry tests now trustworthy |
| FF local `main` 0ae32e0 → 75c62cc | was 2 behind |
| Removed worktree + branch `fix/dependabot-auto-merge-gate` | PR #186 MERGED, **zero content diff vs origin/main** |
| Set upstreams on `main`, `audit/…`, `feat/chittysecrets-migration`, `feat/v0.1-…` | tracking restored |
| Pruned diagnostic `refs/remotes/origin-all/*` | no stray refs remain |

**Tool defect:** `git wt --rm fix/dependabot-auto-merge-gate` printed
`removed worktree + branch` but removed neither. Silent failure in `~/.local/bin/git-wt`.
Worked around with `git worktree remove` + `git branch -D`. Worth fixing at the source —
a cleanup tool that reports success without acting is the failure mode that lets cruft
accumulate invisibly.

## Not touched — deliberately

**Uncommitted `wrangler.jsonc` in `/home/ubuntu/projects/worktrees/migration-chittyregistry`.**
Disables observability (`enabled: false`, `head_sampling_rate: 0`), removes the
`chittytrack` tail_consumer, and leaves mangled comment indentation. Observability-off may
be *correcting* drift toward the ratified standard, but the tail_consumer removal is a
separate call and this is live work in another session's worktree. Not mine to resolve.

## Open items requiring a decision

### Local branches with unrouted work
- **`feat/chittysecrets-migration`** — 2 commits, **8 files / +15 −15** (the "39 ahead" is
  squash-merge history divergence, not real content). Pushed to origin. **No PR ever opened.**
- **`audit/ingestion-topology-2026-07-13`** — local is exactly 1 commit ahead of remote
  ("promote to CANONICAL after P0 remediation"). PR #141 still titled **(PENDING)** because
  that commit was never pushed. Clean fast-forward.
- **`feat/v0.1-servers-binding-bypass`** — local == remote. PR #112 open since 2026-06-12.

### Orphan remote branches (7)
Ancestry is inconclusive for all of them — this repo squash-merges, so a landed branch is
never an ancestor of main. PR state is the reliable signal:

| Branch | Last commit | PR | Class |
|---|---|---|---|
| `update_worker_name_to_chittyregistry` | 2026-01-07 | #1 MERGED | content landed — safe |
| `fix/sync-endpoint-semantics-i68` | 2026-05-27 | #103 MERGED | content landed — safe |
| `chore/wrangler-jsonc-migration` | 2026-03-12 | #23 CLOSED | work **rejected** — deletion discards it |
| `chore/wrangler-audit-2026-03-16` | 2026-03-16 | #24 CLOSED | work **rejected** — deletion discards it |
| `fix/eslint-parser-version` | 2026-03-17 | #34 CLOSED | work **rejected** — deletion discards it |
| `chore/governance-bootstrap-83a7d1d-20260417` | 2026-04-18 | #53 CLOSED | work **rejected** — deletion discards it |
| `governance/cloudflare-phase-0` | 2026-08-02 | **none** | 4 commits, never routed to a PR |

### Dependabot backlog — the gate fix did NOT unblock it

PR #186 (auto-merge gate) merged 2026-09-05. The question was whether the 8 open dependabot
PRs were blocked by a broken gate or genuinely failing. Answer: **genuinely failing.**

| PR | Mergeable | Checks |
|---|---|---|
| #187 (post-fix) | MERGEABLE / CLEAN | 12 pass, 0 fail |
| #114 | CONFLICTING / DIRTY | 2 fail |
| #123 | CONFLICTING / DIRTY | 7 fail |
| #149 | MERGEABLE / UNSTABLE | 7 fail |
| #176–#180 | UNKNOWN | 3–4 fail each |

Only #187 — the one created *after* the gate landed — is clean. The other 8 are based on
stale main and fail on merit. They need dependabot to recreate them, not merging.

### #114 is obsolete, not mergeable-later

`chore(deps): bump 1password/install-cli-action from 3 to 4` edits
`.github/workflows/onepassword-rotation-audit.yml` — **a file that no longer exists on main**,
deleted in `f8f3ec7 chore: remove retired 1password workflows`. 1Password is retired
ecosystem-wide (`op account list` is empty on this host). The PR bumps a dependency of a lane
that does not exist. Close as obsolete; do not merge, do not rebase.

### `schema.json` — untracked, orphan

358 bytes, dated 2026-08-04, not gitignored. Grep finds **no reference to it** anywhere in
the repo (the two `schema.json` hits are the unrelated MCP `server.schema.json` URL). It
describes a 3-field health-response shape that the worker does not validate against.
Scratch output, not a missing commit. Recommend delete.

---

## Closing out: three corrections and a new finding

### 1. The dependabot backlog splits cleanly in two

I wrote above that the 8 stale PRs "fail on merit." After `@dependabot recreate` rebased
them onto current `main`, the picture resolves — and it is two distinct groups, not one:

| PRs | Failing checks | Read |
|---|---|---|
| #177, #189, #191 | `gates / dependency-audit` only | blocked purely on the shared gate |
| #176, #178, #179, #180 | `gates / dependency-audit` + `dependabot` | same, plus the auto-merge job |
| **#123, #149** | **7 distinct checks** — Lint and Type Check, Validate Dependencies, Test Configuration Files, Security Audit, Integration Test (Mock), Validate Documentation, and the shared gate | **genuinely broken on their own** |

#123 and #149 bump `actions/checkout` 6→7 and `actions/setup-node` 6→7 — major action
bumps that break six jobs beyond the shared gate. They are real work, not gate noise.
Recreate did clear their earlier `CONFLICTING/DIRTY` state; the failures are what remain.

Everything else drains the moment the gate decision below lands.

### 2. The failing gate is org-owned — but the fix is local and already precedented

This repo's `governance-gates.yml` is a 3-line shim delegating to
`CHITTYOS/chittycommand/.github/workflows/reusable-governance-gates.yml@main`. The failing
step is:

```yaml
- name: Dependency Audit (High+)
  run: npm audit --audit-level=high ${{ inputs.audit_omit_dev && '--omit=dev' || '' }}
```

**The reusable workflow already exposes an `audit_omit_dev` input** (default `false`), and
**`chittycommand` — the repo that owns the gate — sets it `true` for itself.** So scoping
the audit to shipped dependencies is a two-line `with:` block here, matching what the
gate's own author already does. Not an org-level change.

(Note: the `npm audit` in this repo's `test-sync-daemon.yml` is `|| true` and cannot fail —
it is not the source of the red check.)

### 3. The vulnerability itself — do not "fix" it

`npm audit --audit-level=high` fails against `main`'s own tree with 4 high-severity
findings:

| Package | Path | Fix npm proposes |
|---|---|---|
| `js-yaml` | direct | genuine, non-major — Dependabot opened #189 / #191 |
| `sharp` | `wrangler → miniflare → sharp` | `wrangler@4.15.2` |
| `miniflare` | `wrangler → miniflare` | `wrangler@4.15.2` |
| `wrangler` | direct devDependency | `wrangler@4.15.2` |

**Do not run `npm audit fix --force`.** Installed `wrangler` is `^4.120.0`; the advisory
range is `<=0.0.0-7ae5dd357 || >=4.16.0`, so npm's "fix" is a downgrade of ~105 minor
versions, which it correctly labels `isSemVerMajor`. That breaks the build to satisfy a
scanner. The CVEs (`GHSA-g89c-p67h-r497`, `GHSA-2jg2-4ch7-h545`) are in libheif via
`sharp`, reached only through `miniflare` — devDependency tooling for local Workers
emulation that never reaches the deployed Worker.

Recommendation: set `audit_omit_dev: true` (option 2 above), and merge js-yaml separately —
that one is real and cheap. Left for the operator: it is a CI-policy call, not housekeeping.

### 4. NEW — PR #188 should not be merged as written

I opened #188 during this sweep for the previously-unrouted `feat/chittysecrets-migration`
branch, predicting one conflict. **That understated it, and the branch has a worse problem
than conflicts.**

`main` has already deleted the entire 1Password lane. `git merge-tree` reports **three**
conflicts, all delete-side:

- `.1password/environments.toml → .chittysecrets/environments.toml` — rename/delete; main
  deleted the file outright
- `.github/workflows/deploy-worker.yml` — modify/delete
- `.github/workflows/onepassword-rotation-audit.yml` — modify/delete

So the migration branch renames files that main has since removed entirely. It is
**superseded**, not merely stale.

**More seriously, its remaining non-conflicting content is a blind find/replace of
"1Password" → "chittysecrets" across four historical audit documents**, which corrupts
them:

- `chittyconnect-1password` → `chittyconnect-chittysecrets` — **falsifies the name of a
  live Cloudflare tunnel** in an infrastructure inventory
- `1password-connect` → `chittysecrets-connect` — same, in the cfargotunnel list
- "provisioned in 1Password `ChittyOS-Core` vault" → "provisioned in chittysecrets
  `ChittyOS-Core` vault" — a 1Password vault name attributed to the wrong system
- "the 1Password Desktop app" → "the chittysecrets Desktop app" — no such application
- "1Password item-create is environmentally impossible" → describes `op item create`

These are **records of what happened on 2026-05-27**, when 1Password *was* the authority.
Correcting a doc that still asserts current policy is right; rewriting history so a past
event reads as having used a system that did not yet hold that role makes the audit lie —
and renaming live infrastructure in an inventory makes it actively misleading.

`.chittyconnect.yml` is also left half-migrated: `vault:` becomes `chittysecrets` while
`paths.production` keeps the `op://ChittyOS/chittyregistry-prod` URI.

Recommendation: **close #188 without merging.** The workflow/config half is obsolete
(main deleted those files) and the docs half is damaging. If any of it is wanted, it is a
fresh, hand-written change to `.chittyconnect.yml` only. I have flagged this on the PR
rather than closing it, since I opened it on your instruction.
