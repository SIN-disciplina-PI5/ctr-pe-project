#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEV_TOOLS="$ROOT/dev-tools"
ENV_FILE="$DEV_TOOLS/.env"

umask 077

new_password="${BEEF_PASS:-}"
if [ -z "$new_password" ]; then
  read -rsp "BeEF local password (12+ safe characters): " new_password
  echo ""
fi

if [[ ! "$new_password" =~ ^[A-Za-z0-9_@%+=:,!.\-]{12,128}$ ]]; then
  echo "Use 12-128 characters from: letters, numbers, _ @ % + = : , ! . -"
  exit 1
fi

touch "$ENV_FILE"
chmod 600 "$ENV_FILE"
temporary_file="$(mktemp "$DEV_TOOLS/.env.beef.XXXXXX")"
trap 'rm -f "$temporary_file"' EXIT

grep -vE '^BEEF_(PASS|LOCAL_ENABLED)=' "$ENV_FILE" > "$temporary_file" || true
printf 'BEEF_LOCAL_ENABLED=true\nBEEF_PASS=%s\n' "$new_password" >> "$temporary_file"
mv "$temporary_file" "$ENV_FILE"
trap - EXIT

echo "Local opt-in saved to dev-tools/.env."
exec "$DEV_TOOLS/scripts/beef-start.sh"
