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
    SOURCEMAP_ARGS=""
    if [[ "${BUNDLE_ONLY}" == "true" ]]; then
      MANIFEST_DIR="android/app/build/intermediates/merged_manifests/${VARIANT}"
      mkdir -p "${MANIFEST_DIR}"
      cat > "${MANIFEST_DIR}/AndroidManifest.xml" << EOF
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.your.package.name"
    android:versionCode="${BUILD_ID}"
    android:versionName="${APP_VERSION}">
    <application>
        <meta-data android:name="com.bugsnag.android.API_KEY" android:value="${BUGSNAG_API_KEY}"/>
    </application>
</manifest>
EOF
      echo "Uploading sourcemaps from replaced bundle"
      SOURCEMAP_ARGS="--bundle=${BUNDLE_PATH} --source-map=${SOURCEMAP_PATH}"
      echo "${SOURCEMAP_ARGS}"
    fi
    echo "Uploading bugsnag mapping files for ${APP_VERSION}, ${BUILD_ID}, $APP_FLAVOR${APP_ENVIRONMENT^} ..."
    echo "Uploading React Native source maps..."
    bugsnag-cli upload react-native-android \
      --verbose \
      --version-name="${APP_VERSION}" \
      --version-code="${BUILD_ID}" \
      --api-key="${BUGSNAG_API_KEY}" \
      --variant="${VARIANT}" \
      ${SOURCEMAP_ARGS}

    if [[ "${APP_ENVIRONMENT}" == "store" ]]; then
      echo "Uploading ProGuard/R8 mappings"
      bugsnag-cli upload android-proguard \
        --api-key="${BUGSNAG_API_KEY}" \
        --version-name="${APP_VERSION}" \
        --version-code="${BUILD_ID}" \
        --variant="${VARIANT}" \
        --verbose
    fi
fi