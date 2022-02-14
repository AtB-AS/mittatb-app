#!/bin/bash

# Read a property safely from config file, instead of sourcing the file
envprop() {
  grep -e "^${1}=" ./.env | cut -d'=' -f2 | head -n 1;
}

# Export env vars from .env file
echo "APP_VERSION=$(envprop APP_VERSION)" >> $GITHUB_ENV
echo "AUTHORITY=$(envprop AUTHORITY)" >> $GITHUB_ENV
echo "IOS_BUNDLE_IDENTIFIER=$(envprop IOS_BUNDLE_IDENTIFIER)" >> $GITHUB_ENV
echo "IOS_DEVELOPMENT_TEAM_ID=$(envprop IOS_DEVELOPMENT_TEAM_ID)" >> $GITHUB_ENV
echo "IOS_PROVISIONING_PROFILE_SPECIFIER=$(envprop IOS_PROVISIONING_PROFILE_SPECIFIER)" >> $GITHUB_ENV
echo "ANDROID_APPLICATION_ID=$(envprop ANDROID_APPLICATION_ID)" >> $GITHUB_ENV
echo "IOS_CODE_SIGN_IDENTITY=$(envprop IOS_CODE_SIGN_IDENTITY)" >> $GITHUB_ENV