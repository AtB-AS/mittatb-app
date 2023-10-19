#!/bin/sh

# Get root directory from GitHub Actions environment variable or use a custom one
ROOT_DIR="${GITHUB_WORKSPACE:-${ROOT_DIR:-$(pwd)}}"

# Source utils.sh
source "${ROOT_DIR}/scripts/utils.sh"

react-native run-android --appId "$(envprop 'ANDROID_APPLICATION_ID')"