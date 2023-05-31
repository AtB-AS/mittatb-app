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
    mkdir -p bundle

    echo "Re-generate bundle"
    npx react-native bundle --platform android --dev false --reset-cache --entry-file index.js --bundle-output bundle/temp.bundle --sourcemap-output bundle/temp.bundle.map

    echo "Compile JS to Hermes Bytecode"
    ./node_modules/react-native/sdks/hermesc/linux64-bin/hermesc -emit-binary -source-map=bundle/temp.bundle.map -output-source-map -out bundle/index.android.bundle bundle/temp.bundle

    # Temporary brew update until Ubuntu runner image uses brew >= 4.0.19
    brew update

    brew install apktool
    brew install yq

    echo "Decompile Android APK"
    apktool d $APK_FILE_NAME --output decompiled-apk

    echo "Replace bundle in decompiled APK"
    rm decompiled-apk/assets/index.android.bundle
    cp bundle/index.android.bundle decompiled-apk/assets/

    echo "Set version code to build id: $BUILD_ID"
    yq e ".versionInfo.versionCode = env(BUILD_ID)" -i decompiled-apk/apktool.yml

    echo "Re-compile Android APK"
    apktool b decompiled-apk -o temp-$APK_FILE_NAME

    echo "The APK must be aligned to 4 byte boundaries to work on Android"
    /usr/local/lib/android/sdk/build-tools/33.0.0/zipalign -p -f 4 temp-$APK_FILE_NAME $APK_FILE_NAME

    echo "Re-sign APK"
    /usr/local/lib/android/sdk/build-tools/33.0.0/apksigner sign --ks $KEYSTORE_PATH --ks-pass pass:"$KEYSTORE_PASS" --key-pass pass:"$KEY_PASS" --ks-key-alias $KEY_ALIAS $APK_FILE_NAME
fi
