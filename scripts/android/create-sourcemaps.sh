#!/bin/bash

BUNDLE_DIR="${GITHUB_WORKSPACE:-.}/bundle"
mkdir -p "$BUNDLE_DIR"

npx react-native bundle --platform android --dev false --reset-cache --entry-file index.js --bundle-output "$BUNDLE_DIR/index.android.bundle" --sourcemap-output "$BUNDLE_DIR/index.android.bundle.map"
