#!/bin/bash

if [[
    -z "${BUGSNAG_API_KEY}"
    || -z "${BUILD_ID}"
   ]]; then
    echo "Argument error!"
    echo "Expected two env variables:
  - BUGSNAG_API_KEY
  - BUILD_ID"

    exit 1
else
echo "Generating and uploading Android source maps"
    npx bugsnag-source-maps upload-react-native \
        --api-key=$BUGSNAG_API_KEY \
        --app-version=$BUILD_ID \
        --platform=android \
        --bundle=bundle/index.android.bundle \
        --source-map=bundle/index.android.bundle.map \
        --overwrite
fi