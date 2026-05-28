#!/usr/bin/env bash
# Probe each missing service's /health and gather auto-derivable metadata
# for Gatekeeper-compliant registration. Outputs a per-service stub JSON
# the operator can complete and submit to register.chitty.cc.

set -euo pipefail
DIFF_CSV="/tmp/registry-backfill-diff.csv"
STUB_DIR="/tmp/registry-stubs"
mkdir -p "$STUB_DIR"

[[ -f "$DIFF_CSV" ]] || { echo "Run registry-backfill-from-cf-inventory.sh first" >&2; exit 1; }

echo "Probing /health on services flagged for registration..."
ok=0; nohealth=0; err=0
grep ",no,create$" "$DIFF_CSV" | while IFS=, read -r worker host _ _; do
  out=$(curl -sS -m 8 "https://${host}/health" 2>&1)
  body_first200="${out:0:200}"
  if echo "$out" | jq -e . >/dev/null 2>&1; then
    version=$(echo "$out" | jq -r '.version // .data.version // empty')
    service=$(echo "$out" | jq -r '.service // .data.service // empty')
    status=$(echo "$out" | jq -r '.status // .data.status // empty')
    cat > "${STUB_DIR}/${worker}.json" <<EOF
{
  "name": "${worker}",
  "hostname": "${host}",
  "url": "https://${host}",
  "description": "TODO: 1-line description for ${worker}",
  "version": "${version:-0.1.0}",
  "endpoints": {
    "health": "/health",
    "status": "/api/v1/status"
  },
  "schema": {
    "version": "1.0.0",
    "entities": [],
    "relationships": []
  },
  "security": {
    "auth_required": null,
    "scopes": []
  },
  "metadata": {
    "maintainer": "TODO",
    "category": "service",
    "runtime": "cloudflare-worker",
    "account_id": "0bc21e3a5a9de1a4cc843be9c3e98121",
    "probed_health": {
      "version": "${version}",
      "service": "${service}",
      "status": "${status}"
    },
    "source": "cloudflare-inventory-2026-05-27"
  }
}
EOF
    echo "  OK   ${worker} → version=${version:-?} service=${service:-?}"
  elif [[ -z "$out" ]]; then
    echo "  NORESP ${worker} (${host}) — empty response"
  else
    echo "  NOHEALTH ${worker} (${host}) — first 80 chars: ${body_first200:0:80}"
  fi
done

count=$(ls "$STUB_DIR"/*.json 2>/dev/null | wc -l)
echo
echo "Stubs written: ${count} in ${STUB_DIR}/"
echo "Each stub still requires: description, maintainer, schema (entities/relationships), security/scopes."
echo "Submit each (after completion) to: POST https://register.chitty.cc/api/v1/register"
