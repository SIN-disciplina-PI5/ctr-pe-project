#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
FRONTEND="$ROOT/frontend"
PATTERN='(/hook\.js|:6789|[Bb][Ee][Ee][Ff])'

sources=("$FRONTEND/app" "$FRONTEND/src" "$FRONTEND/app.json")
bundles=("$FRONTEND/dist" "$FRONTEND/web-build" "$FRONTEND/.expo/web")

for target in "${sources[@]}" "${bundles[@]}"; do
  if [ ! -e "$target" ]; then
    continue
  fi
  if grep -R -n -E "$PATTERN" "$target"; then
    echo "BeEF marker found in frontend source or a normal build. Remove it before continuing."
    exit 1
  fi
done

COMPOSE_FILE="$ROOT/dev-tools/beef/docker-compose.yml"

if ! grep -q 'profiles: \["beef-local"\]' "$COMPOSE_FILE"; then
  echo "The BeEF service must remain behind the beef-local Docker profile."
  exit 1
fi
if ! grep -q '127.0.0.1:3000:3000' "$COMPOSE_FILE" ||
  ! grep -q '127.0.0.1:6789:6789' "$COMPOSE_FILE"; then
  echo "BeEF ports must remain bound to loopback."
  exit 1
fi

echo "BeEF local isolation check passed."
