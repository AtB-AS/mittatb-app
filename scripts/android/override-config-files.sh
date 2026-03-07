#!/bin/bash

# copy file mapbox api download token
echo "Copy .netrc file for mapbox api token"
cat .netrc >> ~/.netrc
chmod 600 ~/.netrc

echo "Installing pre-build dependencies"
brew install xmlstarlet # for git-crypt
# xmlstarlet to edit androidmanifest

echo "Loading all env variables from .env file"
export $(grep -v '^#' .env | xargs -d '\n') > /dev/null 2>&1


echo "Set Intercom API key and App ID in Intercom.xml"
xmlstarlet edit --inplace --omit-decl \
  -u "//resources/string[@name='IntercomApiKey']" -v "$INTERCOM_ANDROID_API_KEY" \
  -u "//resources/string[@name='IntercomAppId']" -v "$INTERCOM_APP_ID" \
   android/app/src/main/res/values/Intercom.xml
