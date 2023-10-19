#!/bin/sh

# Get root directory from GitHub Actions environment variable or use a custom one
ROOT_DIR="${GITHUB_WORKSPACE:-${ROOT_DIR:-$(pwd)}}"

# Source utils.sh
source "${ROOT_DIR}/scripts/utils.sh"

echo "Generating app icons"
yarn icons
 
echo "Generating native bootsplash"
yarn react-native generate-bootsplash assets/bootsplash_logo_original.png --assets-path=assets/ --background-color="$(envprop 'BOOTSPLASH_BACKGROUND_COLOR')"
