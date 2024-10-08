#!/bin/bash

envprop() { grep "^${1}=" ./.env | cut -d'=' -f2 | head -n 1; }

source ./scripts/set-app-flavor.sh

# Export env vars from .env file
echo "APP_VERSION=$(envprop APP_VERSION)" >>$GITHUB_ENV
echo "AUTHORITY=$(envprop AUTHORITY)" >>$GITHUB_ENV
echo "IOS_BUNDLE_IDENTIFIER=$(envprop IOS_BUNDLE_IDENTIFIER)" >>$GITHUB_ENV
echo "IOS_DEVELOPMENT_TEAM_ID=$(envprop IOS_DEVELOPMENT_TEAM_ID)" >>$GITHUB_ENV
echo "ANDROID_APPLICATION_ID=$(envprop ANDROID_APPLICATION_ID)" >>$GITHUB_ENV
echo "ANDROID_SIGNING_CERTIFICATE_FINGERPRINT=$(envprop ANDROID_SIGNING_CERTIFICATE_FINGERPRINT)" >>$GITHUB_ENV
echo "IOS_CODE_SIGN_IDENTITY=$(envprop IOS_CODE_SIGN_IDENTITY)" >>$GITHUB_ENV
echo "ENABLE_WIDGET=$(envprop ENABLE_WIDGET)" >>$GITHUB_ENV
echo "KETTLE_API_KEY=$(envprop KETTLE_API_KEY)" >>$GITHUB_ENV
echo "APP_FLAVOR=$APP_FLAVOR" >>$GITHUB_ENV
echo "APP_DISTRIBUTION_GROUP_NAME=$(envprop APP_DISTRIBUTION_GROUP_NAME)" >>$GITHUB_ENV
echo "ENABLE_APPLE_PASS_SUPPRESSION=$(envprop ENABLE_APPLE_PASS_SUPPRESSION)" >>$GITHUB_ENV
