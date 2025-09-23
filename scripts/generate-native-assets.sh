#!/bin/sh

envprop() { grep "^${1}=" ./.env | cut -d'=' -f2 | head -n 1; }

source ./scripts/set-app-flavor.sh

echo "Generating app icons"
yarn icons
 
echo "Generating native bootsplash"
yarn react-native generate-bootsplash assets/bootsplash_logo_original.png --assets-output=assets/bootsplash --background="$(envprop 'BOOTSPLASH_BACKGROUND_COLOR')" --platforms=android,ios --flavor=beacons
yarn react-native generate-bootsplash assets/bootsplash_logo_original.png --assets-output=assets/bootsplash --background="$(envprop 'BOOTSPLASH_BACKGROUND_COLOR')" --platforms=android,ios --flavor=app
