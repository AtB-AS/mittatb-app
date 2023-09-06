#!/bin/bash

echo "Install Flashlight"
curl https://get.flashlight.dev | bash

echo "Add Flashlight"
source /Users/runner/.profile
#export PATH="/Users/runner/.flashlight/bin:$PATH"

echo "Test Flashlight"
flashlight -v

echo "Restart adb"
adb kill-server
sleep 20
adb start-server