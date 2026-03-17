#!/bin/bash

if [[
    -z "${BUGSNAG_API_KEY}"
    || -z "${BUILD_ID}"
    || -z "${APP_VERSION}"
   ]]; then
    echo "Argument error!"
    echo "Expected three env variables:
  - BUGSNAG_API_KEY
  - APP_VERSION
  - BUILD_ID"

    exit 1
else
    echo "Uploading iOS source maps for ${APP_VERSION}, ${BUILD_ID}"
    # project-root is hardcoded to the CI runner workspace. Local builds don't need sourcemap uploads.
    bugsnag-cli upload react-native-sourcemaps \
        --api-key="${BUGSNAG_API_KEY}" \
        --version-name="${APP_VERSION}" \
        --bundle-version="${BUILD_ID}" \
        --source-map="ios/bundle/main.jsbundle.packager.map" \
        --bundle="ios/bundle/main.jsbundle.packager" \
        --platform=ios \
        --project-root="/Users/runner/work/mittatb-app/mittatb-app" \
        --verbose
fi
