#!/bin/sh

# Get the directory of the currently executing script
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Source utils.sh from the same directory as this script
source "${DIR}/utils.sh"

react-native run-android --appId "$(envprop 'ANDROID_APPLICATION_ID')"
