#!/bin/bash

# Prints a Live Activity APNs payload with a fresh timestamp and eventTime, for
# pasting into Apple's Push Notifications Console.
#
# Usage: scripts/live-activity-payload.sh ["<title>"] | pbcopy

set -euo pipefail

EVENT_IN_SECONDS=600 # how far ahead eventTime should be

title=${1:-6 stopp igjen}
title=${title//\"/\\\"}

now=$(date +%s)
event_time=$((now + EVENT_IN_SECONDS))

jq <<JSON
{
  "aps": {
    "timestamp": $now,
    "event": "update",
    "content-state": {
      "mode": "bus",
      "lineNumber": "3",
      "lineName": "Lohove",
      "title": "$title",
      "eventTime": $event_time
    }
  }
}
JSON
