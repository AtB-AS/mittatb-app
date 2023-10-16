#!/bin/sh

# Read a property safely from config file, instead of sourcing the file
prop() {
  grep -e "^${1}=" ./.env | cut -d'=' -f2 | head -n 1;
}

echo "Generating app icons"
yarn icons
 
echo "Generating native bootsplash"
yarn react-native generate-bootsplash assets/bootsplash_logo_original.png --assets-path=assets/ --background-color="$(prop 'BOOTSPLASH_BACKGROUND_COLOR')"
