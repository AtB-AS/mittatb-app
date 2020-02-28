echo "Installing git-crypt dependencies"
brew install openssl
brew install git-crypt

echo "Decoding git-crypt key"
echo $GIT_CRYPT_KEY | openssl base64 -d -A -out mittatb.key

echo "Unlocking repository sensitive files"
git-crypt unlock mittatb.key

cat <<EOT >> .env
BUGSNAG_API_KEY=$BUGSNAG_API_KEY
API_BASE_URL=$API_BASE_URL
APP_VERSION=1.0
APP_BUILD_NUMBER=$APPCENTER_BUILD_ID
EOT

echo "Adding badge to icons"
gem install badge --no-document
brew install librsvg
brew unlink pango  
brew install https://raw.githubusercontent.com/Homebrew/homebrew-core/7cf3b63be191cb2ce4cd86f4406915128ec97432/Formula/pango.rb
brew switch pango 1.42.4_1 

export CURRENT_COMMIT_HASH=$(git rev-parse --short HEAD)
badge --shield "beta-$CURRENT_COMMIT_HASH-orange" --no_badge

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