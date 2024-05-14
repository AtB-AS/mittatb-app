#!/bin/bash

if [[
    -z "${BUGSNAG_API_KEY}"
    || -z "${BUILD_ID}"
    || -z "${APP_VERSION}"
    || -z "${ANDROID_APPLICATION_ID}"
   ]]; then
    echo "Argument error!"
    echo "Expected three env variables:
  - BUGSNAG_API_KEY
  - APP_VERSION
  - BUILD_ID
  - ANDROID_APPLICATION_ID"

    exit 1
else
    echo "Generating and uploading Android source maps"
    curl --http1.1 https://upload.bugsnag.com/ \
      -F "proguard=@./bundle/mapping.txt" \
      -F "apiKey=$BUGSNAG_API_KEY" \
      -F "versionCode=$BUILD_ID" \
      -F "appId=$ANDROID_APPLICATION_ID" \
      -F "versionName=$APP_VERSION" \
      -F "overwrite="

    npx bugsnag-source-maps upload-react-native \
        --api-key=$BUGSNAG_API_KEY \
        --app-version=$APP_VERSION \
        --app-version-code=$BUILD_ID \
        --platform=android \
        --bundle=bundle/index.android.bundle \
        --source-map=bundle/index.android.bundle.map \
        --overwrite
fi