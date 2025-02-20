#!/bin/sh

envprop() { grep "^${1}=" ./.env | cut -d'=' -f2 | head -n 1; }

source ./scripts/set-app-flavor.sh

echo "Setting up android icons"
yarn android-icons

echo "Setting up ios icons"
if [ ! -e "icons/icon.png" ]; then
  echo "Error: icons/icon.png does not exist. Setup assets before running this script."
  exit 1
fi
echo "  Copying default icon"
cp icons/icon.png ios/atb/Images.xcassets/AppIcon.appiconset/icon.png

# Copy dark and tinted variant of the icon if they exist, else fallback to default icon
if [ -e "icons/icon.dark.png" ]; then
  echo "  Copying dark icon"
  cp icons/icon.dark.png ios/atb/Images.xcassets/AppIcon.appiconset/icon.dark.png
else
  echo "  No dark icon found, using default icon"
  cp icons/icon.png ios/atb/Images.xcassets/AppIcon.appiconset/icon.dark.png
fi
if [ -e "icons/icon.tinted.png" ]; then
  echo "  Copying tinted icon"
  cp icons/icon.tinted.png ios/atb/Images.xcassets/AppIcon.appiconset/icon.tinted.png
else
  echo "  No tinted icon found, using default icon"
  cp icons/icon.png ios/atb/Images.xcassets/AppIcon.appiconset/icon.tinted.png
fi

echo "Generating native bootsplash"
yarn react-native generate-bootsplash assets/bootsplash_logo_original.png --assets-output=assets/bootsplash --background="$(envprop 'BOOTSPLASH_BACKGROUND_COLOR')" --platforms=android,ios --flavor=$APP_FLAVOR
