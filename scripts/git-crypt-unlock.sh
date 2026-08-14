#!/bin/bash
set -e

if [[
    -z "${GIT_CRYPT_KEY}"
   ]]; then
    echo "Argument error!"
    echo "Expected one env variables:
  - GIT_CRYPT_KEY"
    exit 1
else
    echo "Installing pre-build dependencies"
    if [[ "$(uname)" == "Linux" ]]; then
        sudo apt-get update
        sudo apt-get install -y git-crypt
    else
        brew install git-crypt
    fi
    # git-crypt for decryption

    echo "Decoding git-crypt key"
    echo $GIT_CRYPT_KEY | openssl base64 -d -A -out mittatb.key

    echo "Unlocking repository sensitive files"
    git-crypt unlock mittatb.key

    echo "Delete key"
    rm mittatb.key
fi