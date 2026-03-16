#!/bin/bash

if [[
    -z "${BUGSNAG_API_KEY}"
   ]]; then
    echo "Argument error!"
    echo "Expected one env variables: 
  - BUGSNAG_API_KEY"

    exit 1
else 
    echo "Uploading Android Proguard mapping"
    bugsnag-cli upload android-proguard \
        --api-key="${BUGSNAG_API_KEY}" \
        --application-id="${ANDROID_APPLICATION_ID}" \
        --version-name="${APP_VERSION}" \
        --version-code="${BUILD_ID}" \
        android/app/bundle/mapping.txt \
        --verbose
fi