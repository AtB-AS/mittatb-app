#!/bin/bash

# Security wise trying to avoid secrets being sent in via command line to the script
# Safer to do it by env variable according to Github Actions docs

if [[
    -z "${IPA_FILE_NAME}"
    || -z "${APP_NAME}"
    || -z "${IOS_CODE_SIGN_IDENTITY}"
    || -z "${BUILD_ID}"
    || -z "${MATCH_PASSWORD}"
    || -z "${KEYCHAIN_NAME}"
   ]]; then
    echo "Argument error!"
    echo "Expected four env variables: 
  - BUILD_ID
  - IPA_FILE_NAME
  - APP_NAME
  - IOS_CODE_SIGN_IDENTITY
  - MATCH_PASSWORD
  - KEYCHAIN_NAME"
    exit 1
else 
    mkdir -p bundle

    echo "Re-generate bundle"
    npx react-native bundle --platform ios --dev false --reset-cache --entry-file index.js --bundle-output bundle/main.jsbundle --sourcemap-output bundle/main.jsbundle.map

    unzip $IPA_FILE_NAME

    echo "Delete old signature"
    rm -rf Payload/$APP_NAME/\_CodeSignature

    echo "Replace bundle"
    rm Payload/$APP_NAME/main.jsbundle
    cp bundle/main.jsbundle Payload/$APP_NAME/

    echo "Set CFBundleVersion to build id: $BUILD_ID"
    plutil -replace CFBundleVersion -string "${BUILD_ID}" "Payload/$APP_NAME/Info.plist"

    echo "Set up the correct keychain"
    KEYCHAIN_PATH=~/Library/Keychains/$KEYCHAIN_NAME-db
    security list-keychains -s "$KEYCHAIN_PATH"
    security unlock-keychain -p "$MATCH_PASSWORD" "$KEYCHAIN_PATH"
    security default-keychain -s "$KEYCHAIN_PATH"

    echo "Generated entitlements file from ipa content"
    codesign -d --entitlements :- "Payload/$APP_NAME" > entitlements.plist

    echo "Re-sign new Payload"
    codesign -vvvv -f -s "$IOS_CODE_SIGN_IDENTITY" --entitlements entitlements.plist Payload/$APP_NAME/

    echo "Generate new ipa"
    zip -qr $IPA_FILE_NAME Payload/

    echo "Check integrity"
    codesign -dvvvv Payload/$APP_NAME/
fi