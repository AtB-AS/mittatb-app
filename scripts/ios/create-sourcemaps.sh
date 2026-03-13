#!/bin/bash

BUNDLE_DIR="${GITHUB_WORKSPACE:-.}/bundle"
mkdir -p "$BUNDLE_DIR"

# Generate the JS bundle and sourcemap from React Native
npx react-native bundle --platform ios --dev false --reset-cache --entry-file index.js --bundle-output "$BUNDLE_DIR/main.jsbundle" --sourcemap-output "$BUNDLE_DIR/main.jsbundle.packager.map"

# Compile the JS bundle to Hermes bytecode
node_modules/hermes-compiler/hermesc/osx-bin/hermesc \
  -O -emit-binary \
  -output-source-map \
  -out="$BUNDLE_DIR/main.jsbundle.hbc" \
  "$BUNDLE_DIR/main.jsbundle"

# Compose the final sourcemap
node node_modules/react-native/scripts/compose-source-maps.js \
  "$BUNDLE_DIR/main.jsbundle.packager.map" \
  "$BUNDLE_DIR/main.jsbundle.hbc.map" \
  -o "$BUNDLE_DIR/main.jsbundle.map"