#!/usr/bin/env bash
# Backfill chittyregistry from live Cloudflare account 121 worker/route inventory.
# Read-only against CF; write requests must route through ChittyConnect or
# chittyagent-cloudflare proxy (this script's --apply only uses the registry write API).
#
# Produces:
#   /tmp/registry-backfill-manifest.jsonl
#   /tmp/registry-current-state.json
#   /tmp/registry-backfill-diff.csv

set -euo pipefail

REGISTRY_BASE="https://registry.chitty.cc"
ACCOUNT_ID="0bc21e3a5a9de1a4cc843be9c3e98121"

APPLY=""
REG_TOKEN=""
if [[ "${1:-}" == "--apply" ]]; then
  APPLY="true"
  REG_TOKEN="${2:-${CHITTY_REGISTRY_TOKEN:-}}"
  [[ -z "$REG_TOKEN" ]] && { echo "--apply requires registry token (must contain 'chitty')" >&2; exit 2; }
fi

# CF read auth (prefer Bearer; fall back to Global API Key)
cf_get() {
  local path="$1"
  if [[ -n "${CLOUDFLARE_EMAIL:-}" && -n "${CLOUDFLARE_API_KEY:-}" ]]; then
    curl -sS "https://api.cloudflare.com/client/v4${path}" \
      -H "X-Auth-Email: ${CLOUDFLARE_EMAIL}" \
      -H "X-Auth-Key: ${CLOUDFLARE_API_KEY}"
  elif [[ -n "${CLOUDFLARE_API_TOKEN:-}" ]]; then
    curl -sS "https://api.cloudflare.com/client/v4${path}" \
      -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}"
  else
    echo '{"success":false,"errors":["no CF credentials"]}'
  fi
}

# ---------- Current registry state ----------
echo "Fetching current registry state..."
curl -sS "${REGISTRY_BASE}/v0.1/servers?limit=500" > /tmp/registry-mcp-servers.json
curl -sS "${REGISTRY_BASE}/api/v1/tools?limit=500" > /tmp/registry-tools.json
tool_names=$(jq -r '(.tools // []) | .[] | .name // empty' /tmp/registry-tools.json | sort -u)
mcp_names=$(jq -r '(.servers // []) | .[] | (.server.name // empty) | sub("^cc\\.chitty/"; "")' /tmp/registry-mcp-servers.json | sort -u)
{ echo "$tool_names"; echo "$mcp_names"; } | sort -u > /tmp/registry-known-names.txt
known_count=$(wc -l < /tmp/registry-known-names.txt)
echo "  Already in registry (tools+mcp): ${known_count}"

# ---------- Pull all workers in this CF account ----------
echo "Fetching CF workers list..."
cf_get "/accounts/${ACCOUNT_ID}/workers/scripts" | jq -r '.result[]?.id' | sort -u > /tmp/cf-all-workers.txt
worker_count=$(wc -l < /tmp/cf-all-workers.txt)
echo "  CF workers: ${worker_count}"

# ---------- Pull all custom domains in this account ----------
echo "Fetching CF Workers Custom Domains..."
cf_get "/accounts/${ACCOUNT_ID}/workers/domains" \
  | jq -r '.result[]? | "\(.service)\t\(.hostname)"' > /tmp/cf-domains.tsv

# ---------- Pull all zones + their worker routes ----------
echo "Fetching zones + worker routes..."
> /tmp/cf-routes.tsv
cf_get "/accounts/${ACCOUNT_ID}/zones?per_page=50" | jq -r '.result[]? | "\(.id)\t\(.name)"' > /tmp/cf-zones.tsv
while IFS=$'\t' read -r zid zname; do
  cf_get "/zones/${zid}/workers/routes" \
    | jq -r --arg z "$zname" '.result[]? | "\(.script)\t\(.pattern)"' >> /tmp/cf-routes.tsv
done < /tmp/cf-zones.tsv

# Build worker -> primary hostname map (custom domain preferred, else first route host)
awk -F'\t' '{print $1"\t"$2}' /tmp/cf-domains.tsv > /tmp/cf-worker-host.tsv
awk -F'\t' '!seen[$1]++ {
  host=$2; sub(/\/.*$/, "", host); print $1"\t"host
}' /tmp/cf-routes.tsv >> /tmp/cf-worker-host.tsv
# Dedup, keep first occurrence (custom domains come first → preferred)
awk -F'\t' '!seen[$1]++' /tmp/cf-worker-host.tsv | sort -u > /tmp/cf-worker-host-final.tsv
mapped=$(wc -l < /tmp/cf-worker-host-final.tsv)
echo "  Workers with a public hostname: ${mapped}"

# ---------- Build manifest ----------
echo "Generating backfill manifest..."
> /tmp/registry-backfill-manifest.jsonl
echo "worker,hostname,in_registry,action" > /tmp/registry-backfill-diff.csv

while IFS=$'\t' read -r worker host; do
  [[ -z "$worker" || -z "$host" ]] && continue
  if grep -qxF "$worker" /tmp/registry-known-names.txt; then
    echo "${worker},${host},yes,skip" >> /tmp/registry-backfill-diff.csv
    continue
  fi
  jq -nc \
    --arg name "$worker" \
    --arg host "$host" \
    --arg account "$ACCOUNT_ID" \
    '{
      name: $name,
      category: "service",
      url: ("https://" + $host),
      hostname: $host,
      account_id: $account,
      source: "cloudflare-inventory-2026-05-27",
      auto_registered: true,
      capabilities: [],
      metadata: { runtime: "cloudflare-worker" }
    }' >> /tmp/registry-backfill-manifest.jsonl
  echo "${worker},${host},no,create" >> /tmp/registry-backfill-diff.csv
done < /tmp/cf-worker-host-final.tsv

# Workers with NO public hostname (orphans / internal-only) — track for separate registration as internal-only
comm -23 <(sort /tmp/cf-all-workers.txt) <(cut -f1 /tmp/cf-worker-host-final.tsv | sort -u) > /tmp/cf-workers-no-host.txt
no_host=$(wc -l < /tmp/cf-workers-no-host.txt)
to_create=$(grep -c ",no,create$" /tmp/registry-backfill-diff.csv || true)
already=$(grep -c ",yes,skip$" /tmp/registry-backfill-diff.csv || true)
echo
echo "Summary:"
echo "  Total CF workers:                    ${worker_count}"
echo "  With public hostname:                ${mapped}"
echo "  Already in registry:                 ${already}"
echo "  To create (public service):          ${to_create}"
echo "  Internal-only (no public hostname):  ${no_host}"
echo "  Manifest:  /tmp/registry-backfill-manifest.jsonl"
echo "  Diff CSV:  /tmp/registry-backfill-diff.csv"
echo "  No-host:   /tmp/cf-workers-no-host.txt"

# ---------- Apply (optional) ----------
if [[ -z "$APPLY" ]]; then
  echo
  echo "Dry-run complete. Review then re-run with: --apply <chitty-registry-token>"
  exit 0
fi

echo
echo "Applying ${to_create} new registry entries..."
ok=0; err=0
while IFS= read -r entry; do
  result=$(curl -sS -X POST "${REGISTRY_BASE}/api/v1/tools" \
    -H "Authorization: Bearer ${REG_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "$entry")
  if echo "$result" | jq -e '.success // .id // .name' >/dev/null 2>&1; then
    ok=$((ok+1))
  else
    err=$((err+1))
    echo "  ERR: $(echo "$entry" | jq -c '.name') → $result"
  fi
done < /tmp/registry-backfill-manifest.jsonl
echo "Applied: ${ok} success, ${err} errors"
