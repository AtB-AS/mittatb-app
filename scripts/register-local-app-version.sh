#!/bin/bash

# This is a simple script for registering the local version of the app
# Used for mobile-token. Currently only adapted for atb, mostly because of the
# use of gcloud secrets and the project name to get ABT client credentials

echo "Loading all env variables from .env file"
export $(grep -v '^#' .env | xargs -0 -n1 echo) > /dev/null 2>&1

credentials=$(gcloud secrets versions access --project atb-staging-c420 --secret=entur-client-credentials-publish latest)

export APP_ENVIRONMENT=staging
export ENTUR_PUBLISH_CLIENT=$(echo $credentials | base64)
export BUILD_ID=1
export DISABLE_LISTED_ON_PLAY_STORE=true

sh scripts/ios/register-app-version.sh
sh scripts/android/register-app-version.sh
