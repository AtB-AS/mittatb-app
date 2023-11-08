#!/bin/sh

envprop() { grep "^${1}=" ./.env | cut -d'=' -f2 | head -n 1; }

react-native run-android --appId "$(envprop 'ANDROID_APPLICATION_ID')"