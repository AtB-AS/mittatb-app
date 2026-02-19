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
    npx bugsnag-source-maps upload-react-native \
        --api-key=$BUGSNAG_API_KEY \
        --app-version="{$APP_VERSION}" \
        --app-bundle-version=$BUILD_ID \
        --platform=ios \
        --source-map=bundle/main.jsbundle.map \
        --bundle=bundle/main.jsbundle
fi
