#!/bin/bash

# Updates the app version in all .env and package.json files.
# See Release.md for more information on making releases of the app.

if [ -z "$1" ]; then
  echo "Updates the app version in all .env and package.json files."
  echo "See Release.md for more information on making releases of the app."
  echo ""
  echo "Usage:	$0 <version>"
  exit 1
fi

# If version string does not have a patch number, append ".0"
withPatch=$1
if [[ $withPatch != *.*.* ]]; then
  withPatch="$1.0"
  echo -e "\033[33mUsing \"$withPatch\" for package.json\033[0m"
fi

# .env
echo "Updating version in .env"
sed -i '' "s/APP_VERSION=.*/APP_VERSION=$1/" .env

find env -name .env | while read -r file; do
  echo "Updating version in $file"
  sed -i '' "s/APP_VERSION=.*/APP_VERSION=$1/" "$file"
done

# package.json
echo "Updating version in package.json"
sed -i '' "s/\"version\": \".*\"/\"version\": \"$withPatch\"/" package.json

echo "Updating version in e2e/package.json"
sed -i '' "s/\"version\": \".*\"/\"version\": \"$withPatch\"/" e2e/package.json
