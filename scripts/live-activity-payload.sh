#!/bin/bash

# Prints a Live Activity APNs payload with a fresh timestamp and eventTime, for
# pasting into Apple's Push Notifications Console.

set -euo pipefail

REFERENCE_DATE_OFFSET=978307200 # 2001-01-01T00:00:00Z, in unix seconds
EVENT_IN_SECONDS=600            # how far ahead eventTime should be

message=${2:-Hello from push}
message=${message//\"/\\\"}

now=$(date +%s)
event_time=$((now + EVENT_IN_SECONDS - REFERENCE_DATE_OFFSET))

jq <<JSON
{
  "aps": {
    "timestamp": $now,
    "event": "update",
    "content-state": {
      "mode": "bus",
      "lineNumber": "3",
      "lineName": "Lohove",
      "title": "6 stopp igjen",
      "subtitle": "Du skal av på Nidarosdomen",
      "footnote": "Ankommer Nidarosdomen",
      "eventTime": $event_time,
      "eventIsCountdown": false,
      "pushMessage": "$message"
    }
  }
}
JSON
