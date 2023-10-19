#!/bin/sh

envprop() { awk -F= "\/^$1=/ {print \$2;exit}" ./.env; }

react-native run-android --appId "$(envprop 'ANDROID_APPLICATION_ID')"