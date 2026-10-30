#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEV_TOOLS="$ROOT/dev-tools"

BEEF_USER="beef"

NEW_PASS="${1:-}"
if [ -z "$NEW_PASS" ]; then
  read -rsp "BeEF password: " NEW_PASS
  echo ""
fi

if grep -q '^BEEF_PASS=' "$DEV_TOOLS/.env" 2>/dev/null; then
  sed -i.bak "/^BEEF_PASS=/d" "$DEV_TOOLS/.env" && rm -f "$DEV_TOOLS/.env.bak"
fi
echo "BEEF_PASS=$NEW_PASS" >> "$DEV_TOOLS/.env"
echo "Password saved to dev-tools/.env"

echo "[1/2] Starting BeEF..."
cd "$DEV_TOOLS"
set -a; source .env; set +a
docker compose up -d beef

echo "Waiting for BeEF to be ready..."
until curl -sf http://localhost:3000/ui/panel >/dev/null 2>&1; do
  sleep 2; printf "."
done
echo ""

echo "[2/2] Done."
echo "  Panel: http://localhost:3000/ui/panel (user: $BEEF_USER)"
echo "  Hook:  http://localhost:6789/hook.js"
