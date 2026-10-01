#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DEV_TOOLS="$ROOT/dev-tools"

SONAR_URL="http://localhost:9000"
ADMIN_USER="admin"
DEFAULT_PASS="admin"
PROJECT_KEY="manutencao-conectada"
PROJECT_NAME="Manutencao Conectada"

NEW_PASS="${1:-}"
if [ -z "$NEW_PASS" ]; then
  read -rsp "New admin password: " NEW_PASS
  echo ""
fi

echo "[1/4] Starting SonarQube..."
cd "$DEV_TOOLS"
docker compose up -d sonarqube

echo "Waiting for SonarQube to be ready..."
until curl -sf "$SONAR_URL/api/system/status" | grep -q '"status":"UP"'; do
  sleep 5; printf "."
done
echo ""

echo "[2/4] Changing default password..."
curl -sf -u "$ADMIN_USER:$DEFAULT_PASS" -X POST "$SONAR_URL/api/users/change_password" \
  -d "login=$ADMIN_USER&previousPassword=$DEFAULT_PASS&password=$NEW_PASS" > /dev/null
echo "Password updated."

echo "[3/4] Creating project '$PROJECT_KEY'..."
curl -sf -u "$ADMIN_USER:$NEW_PASS" -X POST "$SONAR_URL/api/projects/create" \
  -d "project=$PROJECT_KEY&name=$PROJECT_NAME" > /dev/null
echo "Project created."

echo "[4/4] Generating token and saving to dev-tools/.env..."
TOKEN_RESPONSE=$(curl -sf -u "$ADMIN_USER:$NEW_PASS" -X POST "$SONAR_URL/api/user_tokens/generate" \
  -d "name=manutencao-conectada-token")
TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo "SONAR_TOKEN=$TOKEN" > "$DEV_TOOLS/.env"
echo "Token saved to dev-tools/.env"

echo ""
echo "Setup complete. Run the scan:"
echo "  bash dev-tools/scripts/sonar-scan.sh"