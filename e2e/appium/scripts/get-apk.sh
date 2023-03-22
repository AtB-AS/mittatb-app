#!/bin/bash

# This script downloads the latest APK build from Appcenter
# and places it in folder 'apk' relative to 'e2e/appium'

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

# Get latest APK info
echo "Get info about latest APK in mitt-atb android"
latest=$(curl --silent \
  --header "X-API-Token: ${APPCENTER_USER_API_TOKEN}" \
  --header "Accept: application/json" \
  --create-dirs\
  ${appcenter_url}/v0.1/sdk/apps/${APPCENTER_APP_SECRET}/releases/latest)

latest_status=$?
if [ $latest_status -ne 0 ]; then
    echo "Get APK info failed: ${latest_status}"
    exit 7
fi
if [[ $latest == {} ]]; then
  echo "Unexpected response from APK info: ${latest}"
  exit 8
fi

# Get information from the response
download_url=$(echo ${latest} | jq -j '.download_url')
latest_id=$(echo ${latest} | jq -j '.version')
version=$(echo ${latest} | jq -j '.short_version')
concat_app_version="${version}-${latest_id}"

if ! [[ $download_url =~ ^http ]]; then
  echo "Failed to find download url in response"
  exit 6
fi

# Download APK
echo "Download APK version ${concat_app_version}"
apk=$(curl \
  --output apk/app-staging.apk\
  --create-dirs\
  ${download_url})

apk_status=$?
if [ $apk_status -ne 0 ]; then
    echo "Get APK download failed: ${apk_status}"
    exit 7
fi

echo "Get APK complete for version ${concat_app_version}"
