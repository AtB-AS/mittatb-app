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
echo "Generating and uploading Android source maps"
    npx bugsnag-source-maps upload-react-native \
        --api-key=$BUGSNAG_API_KEY \
        --app-version=$APP_VERSION \
        --app-version-code=$BUILD_ID \
        --platform=android \
        --bundle=bundle/index.android.bundle \
        --source-map=bundle/index.android.bundle.map \
        --overwrite
fi