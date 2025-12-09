#!/usr/bin/env bash
set -euo pipefail

BASE_URL="http://localhost:4000"

LOGIN="rs-test-$(date +%s)"
PASS="rs-pass"

echo "=== 1) SIGNUP ==="
curl -i -X POST "$BASE_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"login\":\"$LOGIN\",\"password\":\"$PASS\"}"

echo
echo
echo "=== 2) LOGIN ==="
LOGIN_RES=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"login\":\"$LOGIN\",\"password\":\"$PASS\"}")

echo "Login response: $LOGIN_RES"
ACCESS_TOKEN=$(node -e "const d = JSON.parse(process.argv[1]); console.log(d.accessToken)" "$LOGIN_RES")
REFRESH_TOKEN=$(node -e "const d = JSON.parse(process.argv[1]); console.log(d.refreshToken)" "$LOGIN_RES")

echo "ACCESS_TOKEN: $ACCESS_TOKEN"
echo "REFRESH_TOKEN: $REFRESH_TOKEN"

echo
echo "=== 3) REFRESH: валидный refreshToken (ожидаем 200) ==="
REFRESH_OK=$(curl -s -i -X POST "$BASE_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN\"}")
echo "$REFRESH_OK"

echo
echo "=== 4) REFRESH: невалидный refreshToken (ожидаем 403) ==="
curl -i -X POST "$BASE_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"totally-invalid-token"}'

echo
echo
echo "=== 5) REFRESH: без refreshToken (ожидаем 401) ==="
curl -i -X POST "$BASE_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{}'

echo
echo
echo "=== 6) REFRESH: вообще без тела (ожидаем 401) ==="
curl -i -X POST "$BASE_URL/auth/refresh"

echo
echo
echo "=== 7) GET /artist без Authorization (ожидаем 401 или 403) ==="
curl -i "$BASE_URL/artist"

echo
echo
echo "=== 8) GET /artist c Authorization: Bearer <accessToken> ==="
curl -i "$BASE_URL/artist" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
