#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONTAINER="${1:-wiremock}"
CERT_PATH="$SCRIPT_DIR/../wiremock/wiremock-ca.pem"

docker exec "$CONTAINER" keytool \
  -exportcert \
  -alias wiremock-ca \
  -keystore /root/.wiremock/ca-keystore.jks \
  -storepass password \
  -rfc 2>/dev/null > "$CERT_PATH"
