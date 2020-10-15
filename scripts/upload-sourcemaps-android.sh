#!/bin/bash

echo "Generating and uploading Android source maps"
npx bugsnag-sourcemaps upload \
    --api-key=$BUGSNAG_API_KEY \
    --app-version=$APPCENTER_BUILD_ID \
    --minifiedFile=android/app/build/generated/assets/react/$APP_ENVIRONMENT/index.android.bundle \
    --source-map=android/app/build/generated/sourcemaps/react/$APP_ENVIRONMENT/index.android.bundle.map \
    --minified-url=index.android.bundle \
    --upload-sources \
    --overwrite