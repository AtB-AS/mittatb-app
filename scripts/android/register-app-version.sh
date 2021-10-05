#!/bin/bash

# This script will register a specific Android application version with Entur's
# MobileApplicationRegistryService API.
# a base64 encoded SHA256 fingerprint as bytes of the signing certificate for the APK must be provided as an environment variable,
# in addition to client ID and client secret for Entur ABT OAuth login.

# Check for secrets from env vars
if [[
  -z ${SIGNING_CERTIFICATE_DIGEST}
  || -z ${ENTUR_CLIENT_ID}
  || -z ${ENTUR_CLIENT_SECRET}
]]; then
  echo "Expected environment variables:
  - SIGNING_CERTIFICATE_DIGEST
  - ENTUR_CLIENT_ID
  - ENTUR_CLIENT_SECRET"
  exit 2
fi

# Read a property safely from config file, instead of sourcing the file
envprop() {
  grep -e "^${1}=" ./.env | cut -d'=' -f2 | head -n 1;
}

environment="${APP_ENVIRONMENT-debug}"
authority="${AUTHORITY}"
app_file="${APK_FILE_NAME}"
app_version="$(envprop APP_VERSION)-${BUILD_ID}"
signing_certificate_digest="${SIGNING_CERTIFICATE_DIGEST}"

# Get values based on environment
case $environment in
  staging)
    token_url="https://partner-abt.staging.entur.org/oauth/token"
    abt_url="https://core-abt-abt.staging.entur.io"
    ;;
  store)
    token_url="https://partner-abt.entur.org/oauth/token"
    abt_url="https://core-abt.entur.io"
    ;;
  debug)
    token_url="https://partner-abt.dev.entur.org/oauth/token"
    abt_url="https://core-abt-abt.dev.entur.io"
    ;;
  *)
    echo "Unrecognized environment '$environment'"
    exit 3
    ;;
esac

echo "getting hash for file"
# Get hash for file
if ! [[ -f $app_file ]]; then
    echo "File '$app_file' does not exist."
    exit 4
fi

app_hash=$(sha256sum "$app_file" | cut -d ' ' -f 1)

echo "Fetching access token"
# App login for register call
login=$(curl --silent \
  --request POST \
  --url "$token_url" \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data grant_type="client_credentials" \
  --data client_id="$ENTUR_CLIENT_ID" \
  --data client_secret="$ENTUR_CLIENT_SECRET" \
  --data audience="https://v2.api.entur.no")

login_status=$?
if [ $login_status -ne 0 ]; then
    echo "Login failed"
    exit 5
fi

access_token=$(echo "$login" | grep "access_token" | sed 's/^.*access_token\":\s*\"\([-a-zA-Z0-9\._=]\+\).*$/\1/')

if ! [[ $access_token =~ ^ey[-a-zA-Z0-9\._=]+ ]]; then
  echo "Failed to find access token in response"
  echo $login
  exit 6
fi

# Data for register call
request_id=$(uuidgen)
json=$(cat <<EOJ
{
  "command_id": {
    "id": "$request_id"
  },
  "application": {
      "authority_ref": {
      "ref": "$authority"
    },
    android: {
      "apk_package_name": "no.mittatb",
      "application_version_id": "$app_version",
      "application_version_digest": "$app_hash",
      "certificate_digests": [
        "$signing_certificate_digest"
      ],
      "active": true
    }
  }
}
EOJ
)

echo "Registering app"
# Register app
echo "Registering mitt-atb version $app_version, command_id $request_id"
register=$(curl -v --header "Content-Type: application/json" \
  --header "Authorization: Bearer $access_token" \
  --user-agent "mittatb-app build script" \
  --data "$json"\
  ${abt_url}/no.entur.abt.core.mobileapplication.v1.MobileApplicationRegistryService/AddOrUpdateMobileApplication)

register_status=$?

if [ $register_status -ne 0 ]; then
    echo "Register version failed: $register_status"
    exit 7
fi

if [[ $register != {} ]]; then
  echo "Unexpected response from register: $register"
  exit 8
fi

echo "Registration complete for version $app_version with checksum $app_hash"
