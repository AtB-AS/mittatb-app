#!/bin/sh

org=$1

if [ -z "$org" ]; then
    echo "Usage: yarn switch <org>"
    echo "Available organisations: atb, nfk, fram, troms"
    exit 1
fi

yarn cache clean && yarn clean && yarn install && yarn setup dev "$org" && yarn start
