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
