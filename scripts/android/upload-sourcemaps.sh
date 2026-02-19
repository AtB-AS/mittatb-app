#!/bin/bash

if [[
    -z "${BUGSNAG_API_KEY}"
    || -z "${BUILD_ID}"
    || -z "${APP_VERSION}"
    || -z "${APP_FLAVOR}"
   ]]; then
    echo "Argument error!"
    echo "Expected env variables:
  - APP_VERSION
  - BUILD_ID
  - APP_FLAVOR"

    exit 1
else
    VARIANT="$APP_FLAVOR${APP_ENVIRONMENT^}"
    echo "Uploading bugsnag mapping files for ${APP_VERSION}, ${BUILD_ID}, $APP_FLAVOR${APP_ENVIRONMENT^} ..."
    echo "Uploading React Native source maps..."
    npx bugsnag-cli upload react-native-android \
      --version-name="{$APP_VERSION}" \
      --version-code=$BUILD_ID \
      --api-key=$BUGSNAG_API_KEY \
      --variant=$VARIANT

    echo "Uploading Android NDK symbols..."
    npx bugsnag-cli upload android-ndk \
      --api-key="${BUGSNAG_API_KEY}" \
      --version-name="${APP_VERSION}" \
      --version-code="${BUILD_ID}" \
      --variant="${VARIANT}"

    if [[ "${APP_ENVIRONMENT}" == "store" ]]; then
      echo "Uploading ProGuard/R8 mappings"
      npx bugsnag-cli upload android-proguard \
        --api-key="${BUGSNAG_API_KEY}" \
        --version-name="${APP_VERSION}" \
        --version-code="${BUILD_ID}" \
        --variant="${VARIANT}"
    fi
fi