#!/bin/bash

# NOTE! Current emulator used has path: /home/runner/.android/avd/emulator-api30.avd/config.ini
# NOTE! 'hw.mainKeys=yes' hides the navigation bar (https://stackoverflow.com/questions/8476275/disable-menubutton-in-the-android-emulator)

sh -c \\"printf 'hw.mainKeys=yes\n' >> /home/runner/.android/avd/emulator-api30.avd/config.ini"
sh -c \\"printf 'hw.keyboard=yes\n' >> /home/runner/.android/avd/emulator-api30.avd/config.ini"