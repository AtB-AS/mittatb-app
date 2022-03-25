#!/bin/bash

# This is a simple script for registering the local version of the app
# Used for mobile-token. Currently only adapted for atb, mostly because of the
# use of gcloud secrets and the project name to get ABT client credentials

echo "Loading all env variables from .env file"
export $(grep -v '^#' .env | gxargs -d '\n') > /dev/null 2>&1

credentials=$(gcloud secrets versions access --project atb-mobility-platform-staging --secret=client-credentials-abt latest)

export APP_ENVIRONMENT=staging
export ENTUR_CLIENT_ID=$(echo $credentials | jq '.clientId' -r)
export ENTUR_CLIENT_SECRET=$(echo $credentials | jq '.clientSecret' -r)
export BUILD_ID=1

sh scripts/ios/register-app-version.sh
sh scripts/android/register-app-version.sh