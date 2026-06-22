#!/bin/sh

org=$1

if [ -z "$org" ]; then
    echo "Usage: pnpm switch <org>"
    echo "Available organisations: atb, nfk, fram, troms"
    exit 1
fi

pnpm store prune && pnpm clean && pnpm install && pnpm setup dev "$org" && pnpm start
