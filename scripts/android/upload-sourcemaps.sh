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
    npx bugsnag-sourcemaps upload \
        --api-key=$BUGSNAG_API_KEY \
        --app-version=$BUILD_ID \
        --minifiedFile=bundle/index.android.bundle \
        --source-map=bundle/index.android.bundle.map \
        --minified-url=index.android.bundle \
        --upload-sources \
        --overwrite
fi