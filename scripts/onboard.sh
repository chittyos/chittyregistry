#!/bin/bash
set -euo pipefail
echo "=== chittyregistry Onboarding ==="
curl -s -X POST "${GETCHITTY_ENDPOINT:-https://get.chitty.cc/api/onboard}" \
  -H "Content-Type: application/json" \
  -d '{"service_name":"chittyregistry","organization":"CHITTYOS","type":"service","tier":2,"domains":["registry.chitty.cc"]}' | jq .
