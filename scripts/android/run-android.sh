#!/bin/sh

envprop() { grep "^${1}=" ./.env | cut -d'=' -f2 | head -n 1; }

appId=$(envprop 'ANDROID_APPLICATION_ID')

react-native run-android --appId "$appId" --mode=appDebug --active-arch-only