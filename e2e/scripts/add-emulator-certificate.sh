#!/bin/bash

# https://github.com/AppiumTestDistribution/appium-interceptor-plugin/blob/master/docs/certificate-installation.md

# Start emulator with options:
# $ emulator ... -writable-system -wipe-data

# This script works ONLY for emulators on Android 13 and below
curl -o $PWD/ca.pem https://raw.githubusercontent.com/AppiumTestDistribution/appium-interceptor-plugin/master/certificate/certs/ca.pem
file=$PWD/ca.pem
filename=$(openssl x509 -noout -subject_hash_old -in $file)
echo "Received certificate"
openssl x509 -in $file > $filename.0
openssl x509 -in $file  -text -fingerprint -noout >> $filename.0
adb root
echo "Start remount"
adb remount
echo "Start reboot"
adb reboot
echo "Wait for the device"
adb wait-for-device shell 'while [[ -z $(getprop sys.boot_completed) ]]; do sleep 1; done;'
adb root
echo "Start remount"
adb remount
echo "Push certificate"
adb push $filename.0 /system/etc/security/cacerts
echo "Start remount"
adb remount
echo "Done"