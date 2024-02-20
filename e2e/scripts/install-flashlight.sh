#!/bin/bash

echo "Install Flashlight"
curl https://get.flashlight.dev | bash

echo "Add Flashlight"
# macos
# source /Users/runner/.profile
# ubuntu
source /home/runner/.bashrc

echo "Test Flashlight"
flashlight -v