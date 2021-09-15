export $(grep -v '^#' .env | gxargs -d '\n') > /dev/null 2>&1

echo "Generating app icons"
yarn icons
 
echo "Generating native bootsplash"
yarn react-native generate-bootsplash assets/bootsplash_logo_original.png --assets-path=assets/ --background-color=$BOOTSPLASH_BACKGROUND_COLOR
