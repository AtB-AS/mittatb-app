#!/bin/bash

echo "Uploading iOS source maps"
curl --http1.1 https://upload.bugsnag.com/react-native-source-map \
    -F apiKey=$BUGSNAG_API_KEY \
    -F appVersion=1.0 \
    -F appBundleVersion=$BUILD_ID \
    -F dev=false \
    -F platform=ios \
    -F sourceMap=@ios-release.bundle.map \
    -F bundle=@ios-release.bundle \
    -F projectRoot=`pwd`