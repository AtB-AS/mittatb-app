#!/bin/bash

if [[
    -z "${KEYSTORE}"
   ]]; then
    echo "Argument error!"
    echo "Expected env variable:
  - KEYSTORE"
    exit 1
else
    echo $KEYSTORE | base64 -d > android/app/keystore.jks
fi