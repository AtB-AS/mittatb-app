#!/bin/sh

envprop() { grep "^${1}=" ./.env | cut -d'=' -f2 | head -n 1; }

echo "Generating app icons"
pnpm icons
 
echo "Generating native bootsplash"
pnpm react-native generate-bootsplash assets/bootsplash_logo_original.png --assets-output=assets/bootsplash --background="$(envprop 'BOOTSPLASH_BACKGROUND_COLOR')" --platforms=android,ios --flavor=app
