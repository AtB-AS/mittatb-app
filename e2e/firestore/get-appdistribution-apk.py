import base64
import os
import sys
import requests
import json
from datetime import datetime, timezone
from google.auth.transport.requests import Request
from google.oauth2 import service_account


## Set the required variables
CREDENTIALS_APITESTER = base64.b64decode(os.environ.get('CREDENTIALS_APITESTER', '{}'))
if not CREDENTIALS_APITESTER:
    raise ValueError("CREDENTIALS_APITESTER environment variable is not set")
# AtB Firebase IDs
PROJECT_ID = "939812594010"
APP_ID = "1:939812594010:android:e6721549bec728c3069363"
OUTPUT_FILE = "../apk/app-staging.apk"


def main():
    # ENV parameters exist
    TESTED_VERSION = os.getenv("TESTED_VERSION")
    APK_DOWNLOAD_URL = os.getenv("APK_DOWNLOAD_URL")

    print("[INFO] Authenticate")
    service_account_info = json.loads(CREDENTIALS_APITESTER)
    access_token = authenticate(service_account_info)
    print(f"[INFO] Download build {TESTED_VERSION}")
    download_release(APK_DOWNLOAD_URL, access_token)


# Authenticate using the service account
def authenticate(service_account_info):
    credentials = service_account.Credentials.from_service_account_info(
        service_account_info,
        scopes=["https://www.googleapis.com/auth/cloud-platform"],
    )
    auth_request = Request()
    credentials.refresh(auth_request)

    # Get the access token
    access_token = credentials.token
    return access_token


def download_release(apk_url: str, access_token: str):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/octet-stream",
    }
    response = requests.get(apk_url, headers=headers, stream=True)

    # Check if the request was successful
    if response.status_code == 200:
        # Save the release to the specified file
        with open(OUTPUT_FILE, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        print(f"[INFO] APK saved to {OUTPUT_FILE}")
    else:
        print(f"[ERROR] Failed to download release")
        print(f"[ERROR] HTTP {response.status_code}. Response: {response.text}")


if __name__ == '__main__':
    main()