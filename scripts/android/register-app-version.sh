#!/bin/bash

# This script will register a specific Android application version with Entur's
# MobileApplicationRegistryService API.
# The SHA256 hash of the signing key for the APK must be provided as an environment variable,
# in addition to client ID and client secret for Entur ABT OAuth login.

# Sanity check for number of parameters
if [[ $# -ne 3 ]]; then
    echo "Usage: <environment> <apk file> <version>"
    exit 1
fi

app_file=$2
app_version=$3

# Check for secrets from env vars
# if [[
#    -z "${SIGNING_CERTIFICATE_HASH}"
#    || -z "${ENTUR_CLIENT_ID}"
#    || -z "${ENTUR_CLIENT_SECRET}"
#   ]]; then
#    echo "Argument error!"
#    echo "Expected three env variables:
#  - SIGNING_CERTIFICATE_HASH
#  - ENTUR_CLIENT_ID
#  - ENTUR_CLIENT_SECRET"
#    exit 2
#fi
# hardcode mocks
SIGNING_CERTIFICATE_HASH="RkE6QzY6MTc6NDU6REM6MDk6MDM6Nzg6NkY6Qjk6RUQ6RTY6MkE6OTY6MkI6Mzk6OUY6NzM6NDg6RjA6QkI6NkY6ODk6OUI6ODM6MzI6NjY6NzU6OTE6MDM6M0I6OUM="
ENTUR_CLIENT_ID="zeDBV3EW3SSSbOPq62GXYJSBz5SHiAm4"
ENTUR_CLIENT_SECRET="OmX7E4aSH_pV4RcA3OLj2_ShAxcWnelAI5o6KnEMUzer5quiL-oLxmr0K5YgUV3h"

# echo -n FA:C6 | xxd -r -p | base64


# Get values based on environment
case $1 in
  atb-staging)
    authority="ATB:Authority:2"
    app_id="app-staging"
    token_url="https://partner-abt.staging.entur.org/oauth/token"
    abt_url="https://core-abt-abt.staging.entur.io"
    ;;
  atb-prod)
    authority="ATB:Authority:2"
    app_id="app-store"
    token_url="https://partner-abt.entur.org/oauth/token"
    abt_url="https://core-abt.entur.io"
    ;;

  *)
    echo "Unrecognized environment '$1'"
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
        "$SIGNING_CERTIFICATE_HASH"
      ],
      "active": true
    }
  }
}
EOJ
)

echo "sending payload"
echo $json

echo "Registering app"
# Register app
echo "Registering $app_id version $app_version, command_id $request_id"
register=$(curl -v --header "Content-Type: application/json" \
  --header "Authorization: Bearer $access_token" \
  --user-agent "mittatb-app build script" \
  --data "$json"\
  ${abt_url}/no.entur.abt.core.mobileapplication.v1.MobileApplicationRegistryService/AddOrUpdateMobileApplication)

register_status=$?

echo "register: $register"

if [ $register_status -ne 0 ]; then
    echo "Register version failed: $register_status"
    exit 7
fi

if [[ $register != {} ]]; then
  echo "Unexpected response from register: $register"
  exit 8
fi

echo "Registration complete for version $app_version with checksum $app_hash"
