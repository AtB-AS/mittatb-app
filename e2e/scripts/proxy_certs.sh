#!/bin/bash

# openssl x509 -inform PEM -in ~/.mitmproxy/mitmproxy-ca-cert.pem -outform DER -out mitmproxy-ca-cert.der
adb wait-for-device
adb push mitmproxy-ca-cert.der /sdcard/
adb root
adb remount
# CERT_HASH=$(openssl x509 -inform PEM -subject_hash_old -in ~/.mitmproxy/mitmproxy-ca-cert.pem | head -1)
CERT_HASH=$(openssl x509 -inform DER -subject_hash_old -in mitmproxy-ca-cert.der | head -1)
adb shell mv /sdcard/mitmproxy-ca-cert.der /system/etc/security/cacerts/${CERT_HASH}.0
adb shell chmod 644 /system/etc/security/cacerts/${CERT_HASH}.0
adb reboot
adb wait-for-device
sleep 10