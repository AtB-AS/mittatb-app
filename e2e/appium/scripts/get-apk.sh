#!/bin/bash

# This script will register a specific Android application version with Entur's
# MobileApplicationRegistryService API.
# a base64 encoded SHA256 fingerprint as bytes of the signing certificate for the APK must be provided as an environment variable,
# in addition to client ID and client secret for Entur ABT OAuth login.

# Check for secrets from env vars
if [[
  -z ${APPCENTER_API_KEY}
  || -z ${APPCENTER_APP_SECRET}
  || -z ${APPCENTER_USER_API_TOKEN}
]]; then
  echo "Argument error!"
  echo "Expected environment variables:
  - APPCENTER_API_KEY
  - APPCENTER_APP_SECRET
  - APPCENTER_USER_API_TOKEN
  "
  exit 2
fi

appcenter_url="https://api.appcenter.ms"

# Get APK
echo "Get APK for latest mitt-atb android"
#register=$(curl -v --header "Content-Type: application/json" \
#  --header "Authorization: Bearer $access_token" \
#  --header "X-Correlation-Id: $request_id" \
#  --user-agent "mittatb-app build script" \
#  --data "$json"\
#  ${appcenter_url}/a/publikasjoner/pdf/rapp_9617/rapp_9617.pdf)

latest=$(curl -v \
  --header "X-API-Token: ${APPCENTER_USER_API_TOKEN}" \
  --create-dirs\
  --output apk/app-staging.apk\
  ${appcenter_url}/v0.1/sdk/apps/${APPCENTER_APP_SECRET}/releases/latest)

latest_status=$?
if [ $latest_status -ne 0 ]; then
    echo "Get APK failed: $apk_status"
    exit 7
fi

download_url=$(echo $latest | jq -j '.download_url')
latest_id=$(echo $latest | jq -j '.id')
version=$(echo $latest | jq -j '.version')

echo "URL: $download_url"
echo "ID: $latest_id"
echo "VERSION: $version"

echo "Response: $latest"

#if [[ $register != {} ]]; then
#  echo "Unexpected response from register: $register"
#  exit 8
#fi

concat_app_version="${version}-${latest_id}"

echo "Get APK complete for version $concat_app_version"
