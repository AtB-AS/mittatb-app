#!/bin/bash

# copy file mapbox api download token
echo "Copy .netrc file for mapbox api token"
cat .netrc >> ~/.netrc
chmod 600 ~/.netrc

echo "Installing pre-build dependencies"
sudo apt-get install -y xmlstarlet # for git-crypt
# xmlstarlet to edit androidmanifest

echo "Loading all env variables from .env file"
export $(grep -v '^#' .env | xargs -d '\n') > /dev/null 2>&1


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


echo "Set Intercom API key and App ID in Intercom.xml"
sed -i "s|<string name=\"IntercomApiKey\">.*</string>|<string name=\"IntercomApiKey\">$INTERCOM_ANDROID_API_KEY</string>|" android/app/src/main/res/values/Intercom.xml
sed -i "s|<string name=\"IntercomAppId\">.*</string>|<string name=\"IntercomAppId\">$INTERCOM_APP_ID</string>|" android/app/src/main/res/values/Intercom.xml
