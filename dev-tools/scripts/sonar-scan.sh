#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEV_TOOLS="$ROOT/dev-tools"
BACKEND="$ROOT/backend"

if [ -f "$DEV_TOOLS/.env" ]; then
  set -a; source "$DEV_TOOLS/.env"; set +a
fi

if [ -z "$SONAR_TOKEN" ]; then
  echo "SONAR_TOKEN not set. Run sonar-setup.sh first."
  exit 1
fi

echo "[1/3] Starting SonarQube..."
cd "$DEV_TOOLS"
docker compose up -d sonarqube

echo "Waiting for SonarQube to be ready..."
until curl -sf http://localhost:9000/api/system/status | grep -q '"status":"UP"'; do
  sleep 5; printf "."
done
echo ""

echo "[2/3] Generating test coverage..."
cd "$BACKEND"
npm test -- --coverage --coverageReporters=lcov --passWithNoTests 2>/dev/null || true

echo "[3/3] Running scanner..."
cd "$ROOT"
docker run --rm \
  --network host \
  -e SONAR_TOKEN="$SONAR_TOKEN" \
  -v "$ROOT:/usr/src" \
  sonarsource/sonar-scanner-cli \
  -Dproject.settings=/usr/src/dev-tools/sonar/sonar-project.properties \
  -Dsonar.projectBaseDir=/usr/src

echo "Done. Dashboard: http://localhost:9000/dashboard?id=manutencao-conectada"