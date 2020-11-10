#!/bin/bash

if [[
    -z "${BUGSNAG_API_KEY}"
   ]]; then
    echo "Argument error!"
    echo "Expected one env variables: 
  - BUGSNAG_API_KEY"

    exit 1
else 
    echo "Uploading iOS dsyms"
    curl --http1.1 https://upload.bugsnag.com/ \
    -F apiKey=$BUGSNAG_API_KEY \
    -F dsym=@AtB.app.dSYM.zip
fi