#!/bin/sh

envprop() { grep "^${1}=" ./.env | cut -d'=' -f2 | head -n 1; }

appId=$(envprop 'ANDROID_APPLICATION_ID')

# Check if KETTLE_API_KEY is set in the .env file
if [ "$(envprop 'KETTLE_API_KEY')" ]; then
  react-native run-android --appId "$appId" --mode=beaconsDebug
else
  react-native run-android --appId "$appId" --mode=appDebug
fi