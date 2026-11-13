#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEV_TOOLS="$ROOT/dev-tools"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

if [ -f "$DEV_TOOLS/.env" ]; then
  set -a
  source "$DEV_TOOLS/.env"
  set +a
fi

if [ -f "$BACKEND/.env" ]; then
  set -a
  source "$BACKEND/.env"
  set +a
fi

if [ -z "${SONAR_TOKEN:-}" ]; then
  echo "SONAR_TOKEN not set. Run sonar-setup.sh first."
  exit 1
fi

echo "[1/6] Starting SonarQube..."
cd "$DEV_TOOLS"
docker compose up -d sonarqube

echo "Waiting for SonarQube to be ready..."
until curl -sf http://localhost:9000/api/system/status | grep -q '"status":"UP"'; do
  sleep 5; printf "."
done
echo ""

echo "[2/6] Installing dependencies..."
cd "$BACKEND" && [ -d node_modules ] || npm ci
cd "$FRONTEND" && [ -d node_modules ] || npm ci

echo "[3/6] Generating backend test coverage..."
cd "$BACKEND"
npm run test:unit -- \
  --coverage \
  --coverageReporters=lcov \
  --coverageReporters=text-summary

echo "[4/6] Generating frontend test coverage..."
cd "$FRONTEND"
npm test -- \
  --coverage \
  --coverageReporters=lcov \
  --coverageReporters=text-summary \
  --runInBand

echo "[5/6] Scanning backend..."
cd "$ROOT"
docker run --rm \
  --network host \
  -e SONAR_TOKEN="$SONAR_TOKEN" \
  -v "$ROOT:/usr/src" \
  sonarsource/sonar-scanner-cli \
  -Dproject.settings=/usr/src/dev-tools/sonar/backend.properties \
  -Dsonar.projectBaseDir=/usr/src

echo "[6/6] Scanning frontend..."
docker run --rm \
  --network host \
  -e SONAR_TOKEN="$SONAR_TOKEN" \
  -v "$ROOT:/usr/src" \
  sonarsource/sonar-scanner-cli \
  -Dproject.settings=/usr/src/dev-tools/sonar/frontend.properties \
  -Dsonar.projectBaseDir=/usr/src

echo ""
echo "Done."
echo "  Backend:  http://localhost:9000/dashboard?id=manutencao-conectada-backend"
echo "  Frontend: http://localhost:9000/dashboard?id=manutencao-conectada-frontend"
