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
    bugsnag-cli upload xcode-build \
        --api-key="${BUGSNAG_API_KEY}" \
        AtB.app.dSYM.zip \
        --verbose
fi