#!/bin/bash

adb shell settings put global http_proxy :0
pkill mitmdump
rm mitm_temp.log
