#!/bin/bash

# Security wise trying to avoid secrets being sent in via command line to the script
# Safer to do it by env variable according to Github Actions docs

if [[
    -z "${IPA_FILE_NAME}"
    || -z "${APP_NAME}"
    || -z "${CODE_SIGN_IDENTITY}"
   ]]; then
    echo "Argument error!"
    echo "Expected five env variables: 
  - IPA_FILE_NAME
  - APP_NAME
  - CODE_SIGN_IDENTITY"
    exit 1
else 
    mkdir -p bundle

    echo "Re-generate bundle"
    npx react-native bundle --platform ios --dev false --reset-cache --entry-file index.js --bundle-output bundle/main.jsbundle

    unzip $IPA_FILE_NAME

    echo "Delete old signature"
    rm -rf Payload/$APP_NAME/\_CodeSignature

    echo "Replace bundle"
    rm Payload/$APP_NAME/main.jsbundle
    cp bundle/main.jsbundle Payload/$APP_NAME/

    echo "Set CFBundleVersion to build id: $BUILD_ID"
    plutil -replace CFBundleVersion -string "${BUILD_ID}" "Payload/$APP_NAME/Info.plist"

    echo "Generated entitlements file from ipa content"
    codesign -d --entitlements :- "Payload/$APP_NAME" > entitlements.plist

    echo "Re-sign new Payload"
    codesign -f -s "$CODE_SIGN_IDENTITY" --entitlements entitlements.plist Payload/$APP_NAME/

    echo "Generate new ipa"
    zip -qr $IPA_FILE_NAME Payload/
fi