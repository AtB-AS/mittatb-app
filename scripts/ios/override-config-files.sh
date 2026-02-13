#!/bin/bash

# copy file mapbox api download token
echo "Copy .netrc file for mapbox api token"
cat .netrc >> ~/.netrc
chmod 600 ~/.netrc

echo "Loading all env variables from .env file"
export $(grep -v '^#' .env | xargs -0 -n1 echo) > /dev/null 2>&1

echo "Currently set ios bundle id: $IOS_BUNDLE_IDENTIFIER"

echo "Deleting all reCAPTCHA reversed client ids"
/usr/libexec/PlistBuddy -c "Delete :CFBundleURLTypes:1:CFBundleURLSchemes" ./ios/atb/Info.plist
echo "Creating array to store correct reCAPTCHA reversed client id"
/usr/libexec/PlistBuddy -c "Add :CFBundleURLTypes:1:CFBundleURLSchemes array" ./ios/atb/Info.plist
echo "Adding correct reversed client into array as custom URL scheme"
REVERSED_CLIENT_ID=`/usr/libexec/PlistBuddy -c "Print :REVERSED_CLIENT_ID" ./ios/atb/GoogleService-Info.plist`
/usr/libexec/PlistBuddy -c "Add :CFBundleURLTypes:1:CFBundleURLSchemes:0 string $REVERSED_CLIENT_ID" ./ios/atb/Info.plist