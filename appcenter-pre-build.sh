cat <<EOT >> .env
BUGSNAG_API_KEY=$BUGSNAG_API_KEY
API_BASE_URL=$API_BASE_URL
EOT

brew tap wix/brew
brew update
brew install applesimutils

echo "Install pods "
cd ios; pod install; cd ..

npx detox build

npx detox test --cleanup