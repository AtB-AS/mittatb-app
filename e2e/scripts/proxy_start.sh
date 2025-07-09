#!/bin/bash

mitmdump --mode regular --listen-port 8182 --set console_eventlog_verbosity=error -s scripts/log_url.py > scripts/mitm_temp.log 2>&1 &
adb shell settings put global http_proxy 10.0.2.2:8182
