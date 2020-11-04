#!/bin/bash

mkdir -p bundle

# iOS doesn't output source maps when bundling normally 
npx react-native bundle --platform ios --dev false --reset-cache --entry-file index.js --bundle-output bundle/main.jsbundle --sourcemap-output bundle/main.jsbundle.map