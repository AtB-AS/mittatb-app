#!/bin/bash

# Security wise trying to avoid secrets being sent in via command line to the script
# Safer to do it by env variable according to Github Actions docs

if [[
  -z "${APK_FILE_NAME}" ||
  -z "${KEYSTORE_PATH}" ||
  -z "${KEYSTORE_PASS}" ||
  -z "${KEY_PASS}" ||
  -z "${KEY_ALIAS}" ||
  -z "${BUILD_ID}"
   ]]; then
    echo "Argument error!"
    echo "Expected six env variables:
  - BUILD_ID
  - APK_FILE_NAME
  - KEYSTORE_PATH
  - KEYSTORE_PASS
  - KEY_PASS
  - KEY_ALIAS"

    exit 1
else

    BUNDLE_DIR="android/app/build/generated/assets/createBundle$(echo ${APP_FLAVOR^}${APP_ENVIRONMENT^})JsAndAssets"
    SOURCEMAP_DIR="android/app/build/generated/sourcemaps/react/$(echo $APP_FLAVOR${APP_ENVIRONMENT^})"

    mkdir -p $BUNDLE_DIR
    mkdir -p $SOURCEMAP_DIR

    BUNDLE_PATH="$BUNDLE_DIR/index.android.bundle"
    SOURCEMAP_PATH="$SOURCEMAP_DIR/index.android.bundle.map"

    echo "Re-generate bundle"
    npx react-native bundle --platform android --dev false --reset-cache --entry-file index.js --bundle-output $BUNDLE_PATH --sourcemap-output $SOURCEMAP_PATH

    # Temporary brew update until Ubuntu runner image uses brew >= 4.0.19
    brew update

    brew install apktool
    brew install yq

    echo "Decompile Android APK"
    apktool d $APK_FILE_NAME --output decompiled-apk

    echo "Replace bundle in decompiled APK"
    rm decompiled-apk/assets/index.android.bundle
    cp $BUNDLE_PATH decompiled-apk/assets/

    echo "Set version code to build id: $BUILD_ID"
    yq e ".versionInfo.versionCode = env(BUILD_ID)" -i decompiled-apk/apktool.yml

    # Add a timestamp file
    TIMESTAMP=$(date +%s)
    echo $TIMESTAMP > decompiled-apk/assets/timestamp.txt
    yq e '.doNotCompress += ["assets/timestamp.txt"]' -i decompiled-apk/apktool.yml

    # Verify the file is included
    unzip -l temp-$APK_FILE_NAME | grep "timestamp.txt"

    echo "Re-compile Android APK"
    apktool b decompiled-apk -o temp-$APK_FILE_NAME

    echo "The APK must be aligned to 4 byte boundaries to work on Android"
    /usr/local/lib/android/sdk/build-tools/34.0.0/zipalign -p -f 4 temp-$APK_FILE_NAME $APK_FILE_NAME

    echo "Re-sign APK"
    /usr/local/lib/android/sdk/build-tools/34.0.0/apksigner sign --ks $KEYSTORE_PATH --ks-pass pass:"$KEYSTORE_PASS" --key-pass pass:"$KEY_PASS" --ks-key-alias $KEY_ALIAS $APK_FILE_NAME
fi
