#!/bin/bash

if [[
    -z "${KEYSTORE}" ||
    -z "${KEYSTORE_PATH}"
   ]]; then
    echo "Argument error!"
    echo "Expected env variable:
  - KEYSTORE
  - KEYSTORE_PATH"
    exit 1
else
    echo $KEYSTORE | base64 -d > $KEYSTORE_PATH
fi