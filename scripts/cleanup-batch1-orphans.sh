#!/usr/bin/env bash
# Batch 1 — Low-risk orphan Worker deletions for ChittyCorp LLC account
# Audit evidence: zero inbound bindings, zero crons, zero queue consumers, no routes, no domains.
# Run with: CLOUDFLARE_API_TOKEN=... ./cleanup-batch1-orphans.sh [--dry-run]
# Or hand to chittyagent-cloudflare as a manifest.

set -euo pipefail

ACCOUNT_ID="0bc21e3a5a9de1a4cc843be9c3e98121"
DRY_RUN="${1:-}"

WORKERS=(
  chittyauth-prod
  chittyid-production
  chittymint-production
  chittymcp-gateway-production
  chittyregistry-staging
  chittyevidence-frontend
  chittycases
  chittyrental
  chittysync
  chittyledger-api
  chittycommand-ui
  divorcio-asistente
  flow-analyzer
  house-on-paulina
  chatgptmcp-gateway
  chittyagent-kondoclean
  chittyschema-api
)

: "${CLOUDFLARE_API_TOKEN:?CLOUDFLARE_API_TOKEN required}"

for w in "${WORKERS[@]}"; do
  url="https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${w}"
  if [[ "$DRY_RUN" == "--dry-run" ]]; then
    echo "DRY-RUN delete $w"
    continue
  fi
  echo "Deleting $w..."
  curl -sS -X DELETE "$url" \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json" \
    | jq -c '{worker: "'"$w"'", success, errors}'
done
