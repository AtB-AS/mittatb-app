#!/bin/bash

if [[
    -z "${GIT_CRYPT_KEY}"
   ]]; then
    echo "Argument error!"
    echo "Expected one env variables: 
  - GIT_CRYPT_KEY"
    exit 1
else 
    echo "Installing pre-build dependencies"
    brew install git-crypt 
    # git-crypt for decryption

    echo $GIT_CRYPT_KEY

    echo "Decoding git-crypt key"
    echo $GIT_CRYPT_KEY | openssl base64 -d -A -out mittatb.key

    echo "Unlocking repository sensitive files"
    git-crypt unlock mittatb.key

    echo "Delete key"
    rm mittatb.key
fi