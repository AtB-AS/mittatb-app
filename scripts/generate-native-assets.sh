#!/bin/sh

envprop() { awk -F= "\/^$1=/ {print \$2;exit}" ./.env; }

echo "Generating app icons"
yarn icons
 
echo "Generating native bootsplash"
yarn react-native generate-bootsplash assets/bootsplash_logo_original.png --assets-path=assets/ --background-color="$(envprop 'BOOTSPLASH_BACKGROUND_COLOR')"
