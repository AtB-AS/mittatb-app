#!/bin/bash

echo "Installing pre-build dependencies"
brew install findutils xmlstarlet # for git-crypt
# findutils for gxargs which is used to load environment variables from .env file
# xmlstarlet to edit androidmanifest

echo "Loading all env variables from .env file"
export $(grep -v '^#' .env | gxargs -d '\n') > /dev/null 2>&1

# needed for later when uploading source maps
echo "BUGSNAG_API_KEY=$BUGSNAG_API_KEY" >> $GITHUB_ENV

echo "Currently set ios bundle id: $IOS_BUNDLE_IDENTIFIER"

echo "Adding Bugsnag API key and release stage to Info.plist"
/usr/libexec/PlistBuddy -c "Add :BugsnagAPIKey string $BUGSNAG_API_KEY" ./ios/atb/Info.plist
/usr/libexec/PlistBuddy -c "Add :BugsnagReleaseStage string $BUGSNAG_RELEASE_STAGE" ./ios/atb/Info.plist

echo "Adding Bugsnag API key and release stage to AndroidManifest.xml"
xmlstarlet edit --inplace --omit-decl \
  -s //manifest/application -t elem -n "bugsnagkey" \
  -i //manifest/application/bugsnagkey -t attr -n "android:name" -v "com.bugsnag.android.API_KEY" \
  -i //manifest/application/bugsnagkey -t attr -n "android:value" -v "$BUGSNAG_API_KEY" \
  -r //manifest/application/bugsnagkey -v meta-data \
  -s //manifest/application -t elem -n "bugsnagreleasestage" \
  -i //manifest/application/bugsnagreleasestage -t attr -n "android:name" -v "com.bugsnag.android.RELEASE_STAGE" \
  -i //manifest/application/bugsnagreleasestage -t attr -n "android:value" -v "$BUGSNAG_RELEASE_STAGE" \
  -r //manifest/application/bugsnagreleasestage -v meta-data \
   android/app/src/main/AndroidManifest.xml

echo "Set Intercom API key and App ID in Intercom.plist"
/usr/libexec/PlistBuddy -c "Set :IntercomApiKey $INTERCOM_IOS_API_KEY" ./ios/atb/Intercom.plist
/usr/libexec/PlistBuddy -c "Set :IntercomAppId $INTERCOM_APP_ID" ./ios/atb/Intercom.plist

echo "Set Intercom API key and App ID in Intercom.xml"
xmlstarlet edit --inplace --omit-decl \
  -u "//resources/string[@name='IntercomApiKey']" -v "$INTERCOM_ANDROID_API_KEY" \
  -u "//resources/string[@name='IntercomAppId']" -v "$INTERCOM_APP_ID" \
   android/app/src/main/res/values/Intercom.xml
