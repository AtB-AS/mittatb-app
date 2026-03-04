#!/bin/bash

if [[
    -z "${BUGSNAG_API_KEY}"
   ]]; then
    echo "Argument error!"
    echo "Expected one env variables: 
  - BUGSNAG_API_KEY"

    exit 1
else 
    echo "Uploading Android NDK symbols (so files)"
    bugsnag-cli upload android-ndk \
        android/ \
        --api-key="${BUGSNAG_API_KEY}" \
        --application-id="${ANDROID_APPLICATION_ID}" \
        --version-name="${APP_VERSION}" \
        --version-code="${BUILD_ID}" \
        --project-root="${GITHUB_WORKSPACE:-.}" \
        --verbose
fi