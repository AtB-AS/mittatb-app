#!/bin/bash

if [[
    -z "${GPG_KEYSTORE_FILE}"
    || -z "${GPG_KEYSTORE_PASS}"
   ]]; then
    echo "Argument error!"
    echo "Expected two env variables: 
  - GPG_KEYSTORE_FILE
  - GPG_KEYSTORE_PASS"
    exit 1
else 
    echo "$GPG_KEYSTORE_FILE" > atb.keystore.asc
    gpg -d --passphrase "$GPG_KEYSTORE_PASS" --batch atb.keystore.asc > keystore.jks
    cp keystore.jks android/app/keystore.jks
fi