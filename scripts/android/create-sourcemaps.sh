#!/bin/bash

BUNDLE_DIR="${GITHUB_WORKSPACE:-.}/bundle"
mkdir -p "$BUNDLE_DIR"

# Generate the JS bundle and sourcemap from React Native
npx react-native bundle --platform android --dev false --reset-cache --entry-file index.js --bundle-output "$BUNDLE_DIR/index.android.bundle" --sourcemap-output "$BUNDLE_DIR/index.android.bundle.packager.map"

# Compile the JS bundle to Hermes bytecode
node_modules/hermes-compiler/hermesc/linux64-bin/hermesc \
  -O -emit-binary \
  -output-source-map \
  -out="$BUNDLE_DIR/index.android.bundle.hbc" \
  "$BUNDLE_DIR/index.android.bundle"

# Compose the final sourcemap
node node_modules/react-native/scripts/compose-source-maps.js \
  "$BUNDLE_DIR/index.android.bundle.packager.map" \
  "$BUNDLE_DIR/index.android.bundle.hbc.map" \
  -o "$BUNDLE_DIR/index.android.bundle.map"
