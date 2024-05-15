#!/bin/bash

if [[
    -z "${BUGSNAG_API_KEY}"
    || -z "${BUILD_ID}"
    || -z "${APP_VERSION}"
    || -z "${APP_FLAVOR}"
   ]]; then
    echo "Argument error!"
    echo "Expected env variables:
  - BUGSNAG_API_KEY
  - APP_VERSION
  - BUILD_ID
  - APP_FLAVOR"

    exit 1
else
    echo "Uploading Android source maps"
    npx bugsnag-cli upload react-native-android \
      --version-name=$APP_VERSION \
      --version-code=$BUILD_ID \
      --variant=$(echo $APP_FLAVOR${APP_ENVIRONMENT^})

    npx bugsnag-cli upload android-proguard ./bundle/mapping.txt \
      --api-key=$BUGSNAG_API_KEY \
      --version-name=$APP_VERSION \
      --version-code=$BUILD_ID
fi