#!/bin/bash

# This script will register a specific iOS application version with Entur's
# MobileApplicationRegistryService API.


# Check for config and secrets from env vars
if [[
    -z "${ENTUR_CLIENT_ID}"
    || -z "${ENTUR_CLIENT_SECRET}"
    || -z "${APP_ENVIRONMENT}"
    || -z "${IOS_BUNDLE_IDENTIFIER}"
    || -z "${IOS_DEVELOPMENT_TEAM_ID}"
    || -z "${APP_VERSION}"
    || -z "${AUTHORITY}"
   ]]; then
    echo "Argument error!"
    echo "Expected the following 7 env variables to be set:
  - ENTUR_CLIENT_ID
  - ENTUR_CLIENT_SECRET
  - APP_ENVIRONMENT
  - IOS_BUNDLE_IDENTIFIER
  - IOS_DEVELOPMENT_TEAM_ID
  - APP_VERSION
  - AUTHORITY"
    exit 2
fi

# Get values based on environment
case $APP_ENVIRONMENT in
  staging)
    token_url="https://partner-abt.staging.entur.org/oauth/token"
    abt_url="https://core-abt-abt.staging.entur.io"
    ;;
  store)
    token_url="https://partner.entur.org/oauth/token"
    abt_url="https://core-abt.entur.io"
    ;;
  *)
    echo "Unrecognized environment '$1'"
    exit 3
    ;;
esac

# App login for register call
login=$(curl --silent \
  --request POST \
  --url "$token_url" \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data grant_type="client_credentials" \
  --data client_id="$ENTUR_CLIENT_ID" \
  --data client_secret="$ENTUR_CLIENT_SECRET" \
  --data audience="https://v2.api.entur.no")

login_status=$?
if [ $login_status -ne 0 ]; then
    echo "Login failed"
    exit 5
fi

# Get access token from response
access_token=$(echo $login | jq -j '.access_token')

if ! [[ $access_token =~ ^ey[-a-zA-Z0-9\._=]+ ]]; then
  echo "Failed to find access token in response"
  exit 6
fi

# Data for register call
request_id=$(uuidgen)
json=$(cat <<EOJ
{
  "command_id": {
    "id": "$request_id"
  },
  "application": {
    "authority_ref": {
      "ref": "$AUTHORITY"
    },
    "ios": {
      "team_identifiers": ["$IOS_DEVELOPMENT_TEAM_ID"],
      "bundle_id": "$IOS_BUNDLE_IDENTIFIER",
      "version_name": "$APP_VERSION"
    },
    "active": true
  }
}
EOJ
)

# Register app
echo "Registering $IOS_BUNDLE_IDENTIFIER version $APP_VERSION, command_id / x-correlation-id: $request_id"
register=$(curl -v --silent \
  --header "Content-Type: application/json" \
  --header "Authorization: Bearer $access_token" \
  --header "X-Correlation-Id: $request_id" \
  --user-agent "mittatb-app build script" \
  --data "$json"\
  ${abt_url}/no.entur.abt.core.mobileapplication.v1.MobileApplicationRegistryService/AddOrUpdateMobileApplication)

register_status=$?

if [ $register_status -ne 0 ]; then
    echo "Register version failed with curl status code $register_status"
    exit 7
fi

if [[ $register != "{}" ]]; then
  echo "Unexpected response from register: $register"
  exit 8
fi

echo "Registration complete for version $app_version"
