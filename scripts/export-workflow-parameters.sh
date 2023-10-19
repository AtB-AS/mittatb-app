#!/bin/bash

# Get the directory of the currently executing script
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source utils.sh from the same directory as this script
source "${DIR}/utils.sh"

# Export env vars from .env file
echo "APP_VERSION=$(envprop APP_VERSION)" >> $GITHUB_ENV
echo "AUTHORITY=$(envprop AUTHORITY)" >> $GITHUB_ENV
echo "IOS_BUNDLE_IDENTIFIER=$(envprop IOS_BUNDLE_IDENTIFIER)" >> $GITHUB_ENV
echo "IOS_DEVELOPMENT_TEAM_ID=$(envprop IOS_DEVELOPMENT_TEAM_ID)" >> $GITHUB_ENV
echo "ANDROID_APPLICATION_ID=$(envprop ANDROID_APPLICATION_ID)" >> $GITHUB_ENV
echo "ANDROID_SIGNING_CERTIFICATE_FINGERPRINT=$(envprop ANDROID_SIGNING_CERTIFICATE_FINGERPRINT)" >> $GITHUB_ENV
echo "IOS_CODE_SIGN_IDENTITY=$(envprop IOS_CODE_SIGN_IDENTITY)" >> $GITHUB_ENV
echo "ENABLE_WIDGET=$(envprop ENABLE_WIDGET)" >> $GITHUB_ENV
echo "APP_DISTRIBUTION_GROUP_NAME=$(envprop APP_DISTRIBUTION_GROUP_NAME)" >> $GITHUB_ENV
echo "ENABLE_APPLE_PASS_SUPPRESSION=$(envprop ENABLE_APPLE_PASS_SUPPRESSION)" >> $GITHUB_ENV