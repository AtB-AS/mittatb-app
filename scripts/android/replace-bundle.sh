#!/bin/bash

# Security wise trying to avoid secrets being sent in via command line to the script
# Safer to do it by env variable according to Github Actions docs

if [[
    -z "${APK_FILE_NAME}"
    || -z "${KEYSTORE_FILE}"
    || -z "${KEYSTORE_PASS}"
    || -z "${KEY_PASS}"
    || -z "${KEY_ALIAS}"
   ]]; then
    echo "Argument error!"
    echo "Expected five env variables: 
  - APK_FILE_NAME
  - KEYSTORE_FILE
  - KEYSTORE_PASS
  - KEY_PASS
  - KEY_ALIAS"

    exit 1
else 
    mkdir -p bundle

    echo "Re-generate bundle"
    npx react-native bundle --platform android --dev false --reset-cache --entry-file index.js --bundle-output bundle/android.bundle

    echo "Compile JS to Hermes Bytecode"
    ./node_modules/hermes-engine/osx-bin/hermesc -emit-binary -output-source-map -out bundle/index.android.bundle bundle/android.bundle

    brew install apktool yq

    echo "Decompile Android APK"
    apktool d $APK_FILE_NAME --output decompiled-apk

    echo "Replace bundle in decompiled APK"
    rm decompiled-apk/assets/index.android.bundle
    cp bundle/index.android.bundle decompiled-apk/assets/

    echo "Set version code to build id: $BUILD_ID"
    yq write decompiled-apk/apktool.yml versionInfo.versionCode $BUILD_ID

    echo "Re-compile Android APK"
    apktool b decompiled-apk -o temp-$APK_FILE_NAME

    echo "Re-sign APK"
    jarsigner -keystore $KEYSTORE_FILE -storepass "$KEYSTORE_PASS" -keypass "$KEY_PASS" -verbose -sigalg MD5withRSA -digestalg SHA1 -signedjar temp-$APK_FILE_NAME temp-$APK_FILE_NAME $KEY_ALIAS

    echo "The APK must be aligned to 4 byte boundaries to work on Android"
    ~/Library/Android/sdk/build-tools/29.0.2/zipalign -f 4 temp-$APK_FILE_NAME $APK_FILE_NAME
fi