#!/bin/sh

source ./scripts/utils.sh

react-native run-android --appId "$(envprop 'ANDROID_APPLICATION_ID')"