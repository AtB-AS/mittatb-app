#!/bin/bash

# openssl x509 -inform PEM -in ~/.mitmproxy/mitmproxy-ca-cert.pem -outform DER -out mitmproxy-ca-cert.der
adb wait-for-device
echo "=== Step 1 ==="
adb push mitmproxy-ca-cert.der /sdcard/
echo "=== Step 2 ==="
adb root
echo "=== Step 3 ==="
adb remount
echo "=== Step 4 ==="
# CERT_HASH=$(openssl x509 -inform PEM -subject_hash_old -in ~/.mitmproxy/mitmproxy-ca-cert.pem | head -1)
CERT_HASH=$(openssl x509 -inform DER -subject_hash_old -in mitmproxy-ca-cert.der | head -1)
echo "=== CERT_HASH: ${CERT_HASH} ==="
echo "=== Step 5 ==="
adb shell mv /sdcard/mitmproxy-ca-cert.der /system/etc/security/cacerts/${CERT_HASH}.0
echo "=== Step 6 ==="
adb shell chmod 644 /system/etc/security/cacerts/${CERT_HASH}.0
# adb reboot
# adb wait-for-device
# sleep 10