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
  - APP_FLAVOR
  - BUGSNAG_API_KEY"

    exit 1
else
    # project-root is hardcoded to the CI runner workspace. Local builds don't need sourcemap uploads.
    bugsnag-cli upload react-native-sourcemaps \
    --api-key="${BUGSNAG_API_KEY}" \
    --version-name="${APP_VERSION}" \
    --version-code="${BUILD_ID}" \
    --source-map="${SOURCEMAP_PATH}" \
    --bundle="${BUNDLE_PATH}" \
    --platform=android \
    --project-root="/home/runner/work/mittatb-app/mittatb-app" \
    --verbose
fi
