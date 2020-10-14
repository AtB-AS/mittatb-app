#!/bin/bash

if [ "$#" -ne 5 ]; then
    echo "Argument error!"
    echo "Expected five arguments: apk-name keystore-location keystore-pass key-pass key-alias"
    echo "Example:"
    echo "./replace-bundle-android.sh app-staging.apk ../keystore/mykeys.jks my_store_pass my_key_pass key_alias"
    exit 1
else 
    APK_FILE_NAME=$1
    KEYSTORE_FILE=$2
    KEYSTORE_PASS=$3
    KEY_PASS=$4
    KEY_ALIAS=$5

    mkdir -p bundle

    # Re-generate bundle
    npx react-native bundle --platform android --dev false --reset-cache --entry-file index.js --bundle-output bundle/android.bundle

    # Compile JS to Hermes Bytecode
    ./node_modules/hermes-engine/osx-bin/hermesc -emit-binary -out bundle/index.android.bundle bundle/android.bundle

    brew install apktool

    # Decompile Android APK
    apktool d $APK_FILE_NAME --output decompiled-apk

    # Replace bundle in decompiled APK
    rm decompiled-apk/assets/index.android.bundle
    cp bundle/index.android.bundle decompiled-apk/assets/

    # Re-compile Android APK
    apktool b decompiled-apk -o temp-$APK_FILE_NAME

    # Re-sign APK
    jarsigner -keystore $KEYSTORE_FILE -storepass "$KEYSTORE_PASS" -keypass "$KEY_PASS" -verbose -sigalg MD5withRSA -digestalg SHA1 -signedjar temp-$APK_FILE_NAME temp-$APK_FILE_NAME $KEY_ALIAS

    # The APK must be aligned to 4 byte boundaries to work on Android
    ~/Library/Android/sdk/build-tools/29.0.2/zipalign -f 4 temp-$APK_FILE_NAME $APK_FILE_NAME
fi