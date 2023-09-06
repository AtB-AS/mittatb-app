#!/bin/bash

echo "- Install Flashlight"
curl https://get.flashlight.dev | bash

echo "- Add Flashlight"
source /Users/runner/.profile
#export PATH="/Users/runner/.flashlight/bin:$PATH"

echo "- Test Flashlight"
flashlight -v

echo "- LS profile"
less /Users/runner/.profile

echo "- Test Flashlight 2"
/Users/runner/.flashlight/bin/flashlight -v

echo "- Restart adb"
adb kill-server
sleep 20
adb start-server