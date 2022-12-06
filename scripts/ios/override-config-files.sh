#!/bin/bash

# copy file mapbox api download token
echo "Copy .netrc file for mapbox api token"
cat .netrc >> ~/.netrc
chmod 600 ~/.netrc

echo "Installing pre-build dependencies"
brew install findutils # for git-crypt
# findutils for gxargs which is used to load environment variables from .env file

echo "Loading all env variables from .env file"
export $(grep -v '^#' .env | gxargs -d '\n') > /dev/null 2>&1

echo "Currently set ios bundle id: $IOS_BUNDLE_IDENTIFIER"

echo "Adding Bugsnag API key and release stage to Info.plist"
/usr/libexec/PlistBuddy -c "Add :BugsnagAPIKey string $BUGSNAG_API_KEY" ./ios/atb/Info.plist
/usr/libexec/PlistBuddy -c "Add :BugsnagReleaseStage string $BUGSNAG_RELEASE_STAGE" ./ios/atb/Info.plist

echo "Adding reversed client id as custom URL scheme to enable reCAPTCHA"
REVERSED_CLIENT_ID=`/usr/libexec/PlistBuddy -c "Print :REVERSED_CLIENT_ID" ./ios/atb/GoogleService-Info.plist`
/usr/libexec/PlistBuddy -c "Set :CFBundleURLTypes:1:CFBundleURLSchemes:0 $REVERSED_CLIENT_ID" ./ios/atb/Info.plist

echo "Set Intercom API key and App ID in Intercom.plist"
/usr/libexec/PlistBuddy -c "Set :IntercomApiKey $INTERCOM_IOS_API_KEY" ./ios/atb/Intercom.plist
/usr/libexec/PlistBuddy -c "Set :IntercomAppId $INTERCOM_APP_ID" ./ios/atb/Intercom.plist
