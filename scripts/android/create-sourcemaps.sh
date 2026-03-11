#!/bin/bash

mkdir -p bundle

npx react-native bundle --platform android --dev false --reset-cache --entry-file index.js --bundle-output bundle/index.android.bundle --sourcemap-output bundle/index.android.bundle.map
