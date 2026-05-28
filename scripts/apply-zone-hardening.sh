#!/usr/bin/env bash
# Apply Cloudflare zone TLS/HSTS/HTTPS hardening per manifest.
# Default mode: DRY-RUN (shows current vs desired diff, mutates nothing).
# Apply mode (--apply) REQUIRES routing through ChittyConnect per the
# system-wide sensitive-intent contract. Direct CF API mutation is BLOCKED.
#
# Usage:
#   ./apply-zone-hardening.sh                  # dry-run all tiers, all zones
#   ./apply-zone-hardening.sh --tier parked    # dry-run one tier
#   ./apply-zone-hardening.sh --apply --tier parked  # apply via ChittyConnect (broker required)
#
# Audit source: audits/cloudflare-account-121-full-inventory-2026-05-27.md
# Manifest:     audits/cloudflare-zone-hardening-manifest.json

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MANIFEST="${REPO_ROOT}/audits/cloudflare-zone-hardening-manifest.json"
ACCOUNT_ID="0bc21e3a5a9de1a4cc843be9c3e98121"

MODE="dry-run"
TIER_FILTER=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --apply) MODE="apply"; shift ;;
    --tier)  TIER_FILTER="$2"; shift 2 ;;
    --dry-run) MODE="dry-run"; shift ;;
    -h|--help)
      sed -n '2,15p' "$0"; exit 0 ;;
    *) echo "Unknown arg: $1" >&2; exit 2 ;;
  esac
done

[[ -f "$MANIFEST" ]] || { echo "Manifest not found: $MANIFEST" >&2; exit 1; }
command -v jq >/dev/null || { echo "jq required" >&2; exit 1; }

echo "=== Cloudflare Zone Hardening ==="
echo "Mode:    $MODE"
echo "Account: $ACCOUNT_ID"
echo "Tier:    ${TIER_FILTER:-<all>}"
echo "Manifest: $MANIFEST"
echo

# ---------- Apply mode: enforce broker path ----------
if [[ "$MODE" == "apply" ]]; then
  if [[ -z "${CHITTYCONNECT_BROKER_URL:-}" || -z "${CHITTYCONNECT_BROKER_TOKEN:-}" ]]; then
    cat <<EOF >&2
POLICY_BLOCKED_CHITTYCONNECT_UNAVAILABLE

Apply mode requires CHITTYCONNECT_BROKER_URL and CHITTYCONNECT_BROKER_TOKEN.
Per /home/ubuntu/.ch1tty/canon/system-wide-sensitive-intent-contract-v1.md,
Cloudflare zone-setting mutations MUST route through ch1tty -> ChittyConnect.

Direct \$CLOUDFLARE_API_TOKEN usage in apply mode is explicitly forbidden
by this script. To proceed:
  1. Provision a ChittyConnect-issued broker token
  2. Re-run with CHITTYCONNECT_BROKER_URL and CHITTYCONNECT_BROKER_TOKEN set

Failing closed.
EOF
    exit 3
  fi
fi

# Read-only credentials. Prefer Bearer token; fall back to Global API Key
# (which the Pass-2 audit confirmed has zone-settings:read where the token does not).
CF_READ_TOKEN="${CLOUDFLARE_API_TOKEN:-${CF_API_TOKEN:-}}"
CF_READ_EMAIL="${CLOUDFLARE_EMAIL:-}"
CF_READ_KEY="${CLOUDFLARE_API_KEY:-}"
cf_auth_args() {
  if [[ -n "$CF_READ_EMAIL" && -n "$CF_READ_KEY" ]]; then
    printf -- "-H X-Auth-Email: %s -H X-Auth-Key: %s" "$CF_READ_EMAIL" "$CF_READ_KEY"
  elif [[ -n "$CF_READ_TOKEN" ]]; then
    printf -- "-H Authorization: Bearer %s" "$CF_READ_TOKEN"
  fi
}
if [[ -z "$CF_READ_TOKEN" && ( -z "$CF_READ_EMAIL" || -z "$CF_READ_KEY" ) ]]; then
  echo "WARN: no CF read credentials — current-state probe will be skipped." >&2
fi

cf_get() {
  local path="$1"
  if [[ -n "$CF_READ_EMAIL" && -n "$CF_READ_KEY" ]]; then
    curl -sS "https://api.cloudflare.com/client/v4${path}" \
      -H "X-Auth-Email: ${CF_READ_EMAIL}" \
      -H "X-Auth-Key: ${CF_READ_KEY}"
  elif [[ -n "$CF_READ_TOKEN" ]]; then
    curl -sS "https://api.cloudflare.com/client/v4${path}" \
      -H "Authorization: Bearer ${CF_READ_TOKEN}"
  else
    echo '{}'
  fi
}

# ---------- Resolve zone IDs by name ----------
resolve_zone_id() {
  local name="$1"
  cf_get "/zones?name=${name}&account.id=${ACCOUNT_ID}" | jq -r '.result[0].id // ""'
}

# ---------- Fetch current zone setting ----------
get_setting() {
  local zone_id="$1" setting="$2"
  [[ -z "$zone_id" ]] && { echo "unknown"; return; }
  cf_get "/zones/${zone_id}/settings/${setting}" | jq -c '.result.value // "unknown"'
}

# ---------- Broker call (apply mode only) ----------
broker_patch() {
  local zone_id="$1" setting="$2" desired="$3"
  curl -sS -X POST "${CHITTYCONNECT_BROKER_URL%/}/api/v1/cloudflare/zone/${zone_id}/settings/${setting}" \
    -H "Authorization: Bearer ${CHITTYCONNECT_BROKER_TOKEN}" \
    -H "X-Chitty-Intent: zone-hardening" \
    -H "Content-Type: application/json" \
    -d "{\"value\": ${desired}}" \
    | jq -c '{ok: .success, errors: .errors}'
}

# ---------- Iterate tiers ----------
TIERS=$(jq -r '.tiers | keys[]' "$MANIFEST")
SUMMARY_FILE="$(mktemp)"
echo "tier,zone,zone_id,setting,current,desired,action" > "$SUMMARY_FILE"

for tier in $TIERS; do
  [[ -n "$TIER_FILTER" && "$tier" != "$TIER_FILTER" ]] && continue
  echo "## Tier: $tier"
  ZONES=$(jq -r ".tiers[\"$tier\"].zones[]" "$MANIFEST")
  DESIRED=$(jq -c ".desired_settings[\"$tier\"]" "$MANIFEST")

  for zone in $ZONES; do
    zid=$(resolve_zone_id "$zone")
    echo "  Zone: $zone  (id=${zid:-<unresolved>})"

    # Settings checked one-by-one
    for setting in min_tls_version tls_1_3 always_use_https automatic_https_rewrites opportunistic_encryption ssl 0rtt; do
      current=$(get_setting "$zid" "$setting")
      desired=$(echo "$DESIRED" | jq -c ".[\"$setting\"] // \"unset\"")
      action="noop"
      if [[ "$current" != "$desired" && "$desired" != "\"unset\"" ]]; then
        action="patch"
        if [[ "$MODE" == "apply" ]]; then
          result=$(broker_patch "$zid" "$setting" "$desired")
          action="applied: $result"
        fi
      fi
      printf "    %-30s current=%-18s desired=%-18s action=%s\n" \
        "$setting" "$current" "$desired" "$action"
      echo "$tier,$zone,$zid,$setting,$current,$desired,$action" >> "$SUMMARY_FILE"
    done

    # HSTS is a compound setting under security_header
    if [[ -n "$zid" ]]; then
      hsts_current=$(cf_get "/zones/${zid}/settings/security_header" | jq -c '.result.value.strict_transport_security // {}')
    else
      hsts_current="unknown"
    fi
    hsts_desired=$(echo "$DESIRED" | jq -c '.security_header.strict_transport_security')
    hsts_action="noop"
    if [[ "$hsts_current" != "$hsts_desired" ]]; then
      hsts_action="patch"
      if [[ "$MODE" == "apply" ]]; then
        payload=$(echo "$DESIRED" | jq -c '{value: {strict_transport_security: .security_header.strict_transport_security}}')
        result=$(curl -sS -X POST "${CHITTYCONNECT_BROKER_URL%/}/api/v1/cloudflare/zone/${zid}/settings/security_header" \
          -H "Authorization: Bearer ${CHITTYCONNECT_BROKER_TOKEN}" \
          -H "X-Chitty-Intent: zone-hardening" \
          -H "Content-Type: application/json" \
          -d "$payload" | jq -c '{ok: .success, errors: .errors}')
        hsts_action="applied: $result"
      fi
    fi
    printf "    %-30s current=%s\n" "hsts" "$hsts_current"
    printf "    %-30s desired=%s\n" "hsts" "$hsts_desired"
    printf "    %-30s action=%s\n" "hsts" "$hsts_action"
    echo "$tier,$zone,$zid,security_header.hsts,$(echo "$hsts_current" | tr ',' ';'),$(echo "$hsts_desired" | tr ',' ';'),$hsts_action" >> "$SUMMARY_FILE"
    echo
  done
done

echo "=== Summary CSV (top 20 rows) ==="
head -21 "$SUMMARY_FILE"
echo
echo "Full summary at: $SUMMARY_FILE"
echo
if [[ "$MODE" == "dry-run" ]]; then
  echo "DRY-RUN complete. Nothing was mutated."
  echo "To apply via ChittyConnect: ./apply-zone-hardening.sh --apply --tier parked  (rollout: parked -> active -> core)"
fi
