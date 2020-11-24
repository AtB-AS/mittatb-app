#!/bin/bash

echo "Attempting to decrypt env"
sh ./scripts/git-crypt-unlock.sh $GIT_CRYPT_KEY

# copy file mapbox api download token
cat .netrc >> ~/.netrc

echo "Installing pre-build dependencies"
brew install findutils xmlstarlet 
# findutils for gxargs which is used to load environment variables from .env file
# xmlstarlet to edit androidmanifest

echo "Attempting to override environment: $APP_ENVIRONMENT"
sh ./scripts/override-environment.sh $APP_ENVIRONMENT

echo "Loading all env variables from .env file"
export $(grep -v '^#' .env | gxargs -d '\n')

echo "Setting BundleIdentifier in Info.plist to $IOS_BUNDLE_IDENTIFIER"
/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier $IOS_BUNDLE_IDENTIFIER" ./ios/atb/Info.plist

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

echo "Install icon dependencies"
brew install imagemagick
yarn icons

export CURRENT_COMMIT_HASH=$(git rev-parse --short HEAD)

echo "Adding app badges to icons"
if [[ "$APP_ENVIRONMENT" = "staging" || "$APP_ENVIRONMENT" = "prodstaging" ]]; then
  gem install badge --no-document
  brew install librsvg
  brew unlink pango  
  brew install https://raw.githubusercontent.com/Homebrew/homebrew-core/7cf3b63be191cb2ce4cd86f4406915128ec97432/Formula/pango.rb
  brew switch pango 1.42.4_1 

  if [ "$APP_ENVIRONMENT" = "staging" ]; then
    badge --shield "1.1-QA-orange" --no_badge  --glob "/android/app/src/staging/res/*/*.{png,PNG}"
    badge --shield "1.1-QA-orange" --no_badge  --glob "/ios/atb/Images.xcassets/AppIcon.appiconset/*.{png,PNG}"
  fi
  if [ "$APP_ENVIRONMENT" = "prodstaging" ]; then
    badge --shield "1.1-Prod-blue" --no_badge  --glob "/android/app/src/staging/res/*/*.{png,PNG}"
    badge --shield "1.1-Prod-blue" --no_badge  --glob "/ios/atb/Images.xcassets/AppIcon.appiconset/*.{png,PNG}"
  fi
fi 

# if [ "$ENABLE_E2E" = true ]; then
#     echo "Install E2E tools"
#     brew tap wix/brew
#     brew update
#     brew install applesimutils

#     echo "Install pods"
#     cd ios; pod install; cd ..

#     echo "Build detox E2E tests"
#     npx detox build --configuration ios.sim.release

#     echo "Run detox E2E tests"
#     npx detox test --configuration ios.sim.release --cleanup
# fi