#!/bin/bash

echo "Installing pre-build dependencies"
brew install openssl git-crypt findutils xmlstarlet # for git-crypt
# git-crypt + openssl for decryption
# findutils for gxargs which is used to load environment variables from .env file
# xmlstarlet to edit androidmanifest

echo "Decoding git-crypt key"
echo $GIT_CRYPT_KEY | openssl base64 -d -A -out mittatb.key

echo "Unlocking repository sensitive files"
git-crypt unlock mittatb.key

echo "Attempting to override environment: $APP_ENVIRONMENT"
sh ./override-environment.sh $APP_ENVIRONMENT

echo "Loading all env variables from .env file"
export $(grep -v '^#' .env | gxargs -d '\n')

echo "Setting BundleIdentifier in Info.plist to $IOS_BUNDLE_IDENTIFIER"
/usr/libexec/PlistBuddy -c "Set :CFBundleIdentifier $IOS_BUNDLE_IDENTIFIER" ./ios/atb/Info.plist
echo "Adding Bugsnag API key to Info.plist"
/usr/libexec/PlistBuddy -c "Add :BugsnagAPIKey string $BUGSNAG_API_KEY" ./ios/atb/Info.plist
echo "Adding Bugsnag API key to AndroidManifest.xml"
xmlstarlet edit --inplace --omit-decl -s //manifest/application -t elem -n "bugsnagkey" \
  -i //manifest/application/bugsnagkey -t attr -n "android:name" -v "com.bugsnag.android.API_KEY" \
  -i //manifest/application/bugsnagkey -t attr -n "android:value" -v "$BUGSNAG_API_KEY" \
  -r //manifest/application/bugsnagkey -v meta-data \
   android/app/src/main/AndroidManifest.xml

echo "Install icon dependencies"
brew install imagemagick
yarn icons

echo "Adding badge to icons"
gem install badge --no-document
brew install librsvg
brew unlink pango  
brew install https://raw.githubusercontent.com/Homebrew/homebrew-core/7cf3b63be191cb2ce4cd86f4406915128ec97432/Formula/pango.rb
brew switch pango 1.42.4_1 

export CURRENT_COMMIT_HASH=$(git rev-parse --short HEAD)
echo "Adding badge to Android icons"
badge --shield "beta-$CURRENT_COMMIT_HASH-orange" --no_badge  --glob "/android/app/src/main/res/*/*.{png,PNG}"
echo "Adding badge to iOS icons"
badge --shield "beta-$CURRENT_COMMIT_HASH-orange" --no_badge  --glob "/ios/atb/Images.xcassets/AppIcon.appiconset/*.{png,PNG}"

if [ "$ENABLE_E2E" = true ]; then
    echo "Install E2E tools"
    brew tap wix/brew
    brew update
    brew install applesimutils

    echo "Install pods"
    cd ios; pod install; cd ..

    echo "Build detox E2E tests"
    npx detox build --configuration ios.sim.release

    echo "Run detox E2E tests"
    npx detox test --configuration ios.sim.release --cleanup
fi