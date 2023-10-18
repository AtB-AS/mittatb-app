#!/bin/sh

source ./scripts/utils.sh

echo "Generating app icons"
yarn icons
 
echo "Generating native bootsplash"
yarn react-native generate-bootsplash assets/bootsplash_logo_original.png --assets-path=assets/ --background-color="$(envprop 'BOOTSPLASH_BACKGROUND_COLOR')"
