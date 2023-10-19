#!/bin/sh

# Get the directory of the currently executing script
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source utils.sh from the same directory as this script
source "${DIR}/utils.sh"

echo "Generating app icons"
yarn icons
 
echo "Generating native bootsplash"
yarn react-native generate-bootsplash assets/bootsplash_logo_original.png --assets-path=assets/ --background-color="$(envprop 'BOOTSPLASH_BACKGROUND_COLOR')"
