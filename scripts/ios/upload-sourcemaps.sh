#!/bin/bash

if [[
    -z "${BUGSNAG_API_KEY}"
    || -z "${BUILD_ID}"
   ]]; then
    echo "Argument error!"
    echo "Expected two env variables: 
  - BUGSNAG_API_KEY
  - BUILD_ID"

    exit 1
else 
echo "Uploading iOS source maps"
    curl --http1.1 https://upload.bugsnag.com/react-native-source-map \
        -F apiKey=$BUGSNAG_API_KEY \
        -F appVersion=1.4 \
        -F appBundleVersion=$BUILD_ID \
        -F dev=false \
        -F platform=ios \
        -F sourceMap=@bundle/main.jsbundle.map \
        -F bundle=@bundle/main.jsbundle \
        -F projectRoot=`pwd`
fi