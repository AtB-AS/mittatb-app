#!/bin/bash

BUNDLE_DIR="${GITHUB_WORKSPACE:-.}/bundle"
mkdir -p "$BUNDLE_DIR"

# iOS doesn't output source maps when bundling normally
npx react-native bundle --platform ios --dev false --reset-cache --entry-file index.js --bundle-output "$BUNDLE_DIR/main.jsbundle" --sourcemap-output "$BUNDLE_DIR/main.jsbundle.map"