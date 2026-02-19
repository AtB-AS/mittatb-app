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
    bugsnag-cli upload react-native-ios \
        --api-key="${BUGSNAG_API_KEY}" \
        --version-name="${APP_VERSION}" \
        --bundle-version="${BUILD_ID}" \
        --source-map=bundle/main.jsbundle.map \
        --bundle=bundle/main.jsbundle \
        --verbose
fi
