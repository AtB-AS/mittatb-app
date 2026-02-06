#!/bin/bash

# This script will register a specific Android application version with Entur's
# MobileApplicationRegistryService API.
# a base64 encoded SHA256 fingerprint as bytes of the signing certificate for the APK must be provided as an environment variable,
# in addition to a base64 encoded Entur ABT OAuth client configuration JSON object.

# Check for secrets from env vars
if [[
  -z ${ENTUR_PUBLISH_CLIENT}
  || -z ${APP_ENVIRONMENT}
  || -z ${AUTHORITY}
  || -z ${ANDROID_APPLICATION_ID}
  || -z ${ANDROID_SIGNING_CERTIFICATE_FINGERPRINT}
  || -z ${APP_VERSION}
  || -z ${BUILD_ID}
  || -z ${DISABLE_LISTED_ON_PLAY_STORE}
]]; then
  echo "Argument error!"
  echo "Expected environment variables:
  - ENTUR_PUBLISH_CLIENT
  - APP_ENVIRONMENT
  - AUTHORITY
  - ANDROID_APPLICATION_ID
  - ANDROID_SIGNING_CERTIFICATE_FINGERPRINT
  - APP_VERSION
  - BUILD_ID
  - DISABLE_LISTED_ON_PLAY_STORE
  "
  exit 2
fi

# Get values based on environment
case ${APP_ENVIRONMENT} in
  staging)
    abt_url="https://core-abt.staging.entur.io"
    ;;
  store)
    abt_url="https://core-abt.entur.io"
    ;;
  *)
    echo "Unrecognized environment '${APP_ENVIRONMENT}'"
    exit 3
    ;;
esac

DECODED_ENTUR_PUBLISH_CLIENT=$(echo $ENTUR_PUBLISH_CLIENT | base64 --decode)
ENTUR_CLIENT_ID=$(echo $DECODED_ENTUR_PUBLISH_CLIENT | jq -r '.clientId')
ENTUR_CLIENT_SECRET=$(echo $DECODED_ENTUR_PUBLISH_CLIENT | jq -r '.clientSecret')
AUDIENCE=$(echo $DECODED_ENTUR_PUBLISH_CLIENT | jq -r '.endpointParams.audience[0]')
TOKEN_URL=$(echo $DECODED_ENTUR_PUBLISH_CLIENT | jq -r '.tokenUrl')

echo "Fetching access token"
# App login for register call
login=$(curl --silent \
  --request POST \
  --url "$TOKEN_URL" \
  --header 'content-type: application/x-www-form-urlencoded' \
  --data grant_type="client_credentials" \
  --data client_id="$ENTUR_CLIENT_ID" \
  --data client_secret="$ENTUR_CLIENT_SECRET" \
  --data audience="$AUDIENCE")

login_status=$?
if [ $login_status -ne 0 ]; then
    echo "Login failed"
    exit 5
fi

access_token=$(echo $login | jq -j '.access_token')

certificate_digest=$(echo $ANDROID_SIGNING_CERTIFICATE_FINGERPRINT | xxd -p -r | base64)

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
      "ref": "${AUTHORITY}"
    },
    android: {
      "apk_package_name": "$ANDROID_APPLICATION_ID",
      "version_name": "$APP_VERSION",
      "version_code": "$BUILD_ID",
      "certificate_digests": [
        "$certificate_digest"
      ],
      "disable_listed_on_play_store": "$DISABLE_LISTED_ON_PLAY_STORE"
    },
    "active": true
  }
}
EOJ
)

echo "Registering app"
# Register app
echo "Registering mitt-atb version $APP_VERSION, version code: $BUILD_ID, command_id / x-correlation-id: $request_id"
register=$(curl -v --header "Content-Type: application/json" \
  --header "Authorization: Bearer $access_token" \
  --header "X-Correlation-Id: $request_id" \
  --user-agent "mittatb-app build script" \
  --data "$json"\
  ${abt_url}/no.entur.abt.core.mobileapplication.v1.MobileApplicationRegistryService/AddOrUpdateMobileApplication)

register_status=$?

if [ $register_status -ne 0 ]; then
    echo "Register version failed: $register_status"
    exit 7
fi

if [[ $register != {} ]]; then
  echo "Unexpected response from register: $register"
  exit 8
fi

echo "Registration complete for version $APP_VERSION with version code $BUILD_ID with checksum"
