#!/bin/bash

echo "Install Flashlight"
curl https://get.flashlight.dev | bash

echo "Add Flashlight"
source /Users/runner/.profile

echo "Test Flashlight"
flashlight -v