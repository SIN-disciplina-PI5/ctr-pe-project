#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEV_TOOLS="$ROOT/dev-tools"
ENV_FILE="$DEV_TOOLS/.env"
COMPOSE_FILE="$DEV_TOOLS/beef/docker-compose.yml"
PANEL_URL="http://127.0.0.1:3000/ui/panel"
HOOK_URL="http://127.0.0.1:6789/hook.js"
MAX_ATTEMPTS="${BEEF_READY_ATTEMPTS:-60}"

if [ ! -f "$ENV_FILE" ]; then
  echo "Local BeEF configuration not found. Run beef-setup.sh first."
  exit 1
fi

enabled="$(sed -n 's/^BEEF_LOCAL_ENABLED=//p' "$ENV_FILE" | tail -n 1)"
if [ "$enabled" != "true" ]; then
  echo "BeEF is disabled. Run beef-setup.sh to opt in locally."
  exit 1
fi

if ! grep -q '^BEEF_PASS=.' "$ENV_FILE"; then
  echo "BEEF_PASS is missing. Run beef-setup.sh again."
  exit 1
fi

if ! [[ "$MAX_ATTEMPTS" =~ ^[1-9][0-9]*$ ]]; then
  echo "BEEF_READY_ATTEMPTS must be a positive integer."
  exit 1
fi

"$DEV_TOOLS/scripts/beef-verify.sh"

docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" --profile beef-local up -d beef

echo "Waiting for the local BeEF panel..."
for ((attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1)); do
  if curl -sf "$PANEL_URL" >/dev/null 2>&1; then
    echo "Panel: $PANEL_URL (user: beef)"
    echo "Hook for an authorized local test page only: $HOOK_URL"
    exit 0
  fi
  sleep 2
done

echo "BeEF did not become ready after $((MAX_ATTEMPTS * 2)) seconds."
docker compose --env-file "$ENV_FILE" -f "$COMPOSE_FILE" --profile beef-local logs --tail=50 beef
exit 1
