#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
unzip -o "$SCRIPT_DIR/../wiremock/mappings.zip" -d "$SCRIPT_DIR/../wiremock"
