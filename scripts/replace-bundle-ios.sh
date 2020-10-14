#!/bin/bash

if [ "$#" -ne 3 ]; then
    echo "Argument error!"
    echo "Expected three arguments: ipa-file-name, app-name, code-sign-identity"
    echo "Example:"
    echo "./replace-bundle-ios.sh app.ipa myapp.app 'My Code Sign Identity From Keychain'"
    exit 1
else 
    IPA_FILE_NAME=$1
    APP_NAME=$2
    CODE_SIGN_IDENTITY=$3

    mkdir -p bundle

    echo "Re-generate bundle"
    npx react-native bundle --platform ios --dev false --reset-cache --entry-file index.js --bundle-output bundle/main.jsbundle

    unzip $IPA_FILE_NAME

    echo "Delete old signature"
    rm -rf Payload/$APP_NAME/\_CodeSignature

    echo "Replace bundle"

    rm Payload/$APP_NAME/main.jsbundle
    cp bundle/main.jsbundle Payload/$APP_NAME/

    echo "Generated entitlements file from ipa content"
    codesign -d --entitlements :- "Payload/$APP_NAME" > entitlements.plist

    echo "Re-sign new Payload"
    codesign -f -s "$CODE_SIGN_IDENTITY" --entitlements entitlements.plist Payload/$APP_NAME/

    echo "Generate new ipa"
    zip -qr $IPA_FILE_NAME Payload/
fi