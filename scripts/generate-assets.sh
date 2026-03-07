#!/bin/sh


if [ "$#" -ne 1 ]
then
    echo "Argument error!"
    echo "First argument should be the app organisation name."
    echo "Available app variant names:
-atb
-nfk"

    echo "Example:
./generate-assets.sh atb"
    exit 1
else
  APP_ORG=$1

  echo "Installing generated assets from design system (SVGs only)"
  npx @atb-as/generate-assets all $APP_ORG -o assets/design-assets -g "**.svg" -nm

  echo "Installing photo background"
  npx @atb-as/generate-assets all $APP_ORG -o assets/design-assets -g "**/PhotoBackground.jpg" -nm
  yarn generate-svgs
fi