#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEV_TOOLS="$ROOT/dev-tools"

cd "$DEV_TOOLS"

if [ ! -f .env ] || ! grep -q '^BEEF_PASS=' .env; then
  echo "BEEF_PASS not set. Run scripts/beef-setup.sh first."
  exit 1
fi

set -a; source .env; set +a

echo "Starting BeEF..."
docker compose up -d beef

echo "Waiting for BeEF to be ready..."
until curl -sf http://localhost:3000/ui/panel >/dev/null 2>&1; do
  sleep 2; printf "."
done
echo ""

echo "Panel: http://localhost:3000/ui/panel (user: beef)"
echo "Hook:  http://localhost:6789/hook.js"
