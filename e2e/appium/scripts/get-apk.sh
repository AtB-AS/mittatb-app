#!/bin/bash

# This script will register a specific Android application version with Entur's
# MobileApplicationRegistryService API.
# a base64 encoded SHA256 fingerprint as bytes of the signing certificate for the APK must be provided as an environment variable,
# in addition to client ID and client secret for Entur ABT OAuth login.

# Check for secrets from env vars
if [[
  -z ${APP_VERSION}
  || -z ${BUILD_ID}
  || -z ${APPCENTER_API_KEY}
  || -z ${APPCENTER_APP_SECRET}
]]; then
  echo "Argument error!"
  echo "Expected environment variables:
  - APP_VERSION
  - BUILD_ID
  - APPCENTER_API_KEY
  - APPCENTER_APP_SECRET
  "
  exit 2
fi

concat_app_version="${APP_VERSION}-${BUILD_ID}"
appcenter_url="https://api.appcenter.ms"


# Get APK
echo "Get APK for mitt-atb version $concat_app_version"
#register=$(curl -v --header "Content-Type: application/json" \
#  --header "Authorization: Bearer $access_token" \
#  --header "X-Correlation-Id: $request_id" \
#  --user-agent "mittatb-app build script" \
#  --data "$json"\
#  ${appcenter_url}/a/publikasjoner/pdf/rapp_9617/rapp_9617.pdf)

apk=$(curl -v \
  --header "X-API-Token: ${APPCENTER_API_KEY}" \
  --create-dirs\
  --output apk/app-staging.apk\
  ${appcenter_url}/v0.1/public/sdk/apps/${APPCENTER_APP_SECRET}/releases/latest)

apk_status=$?

if [ $apk_status -ne 0 ]; then
    echo "Get APK failed: $apk_status"
    exit 7
fi

#if [[ $register != {} ]]; then
#  echo "Unexpected response from register: $register"
#  exit 8
#fi

echo "Get APK complete for version $concat_app_version"
