import base64
import os
import sys
import requests
import json
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
    print("[INFO] Authenticate")
    service_account_info = json.loads(CREDENTIALS_APITESTER)
    access_token = authenticate(service_account_info)
    print("[INFO] List releases")
    apk_url, appVersion, appBuildId = list_releases(access_token)
    print("[INFO] Release found")
    download_release(apk_url, access_token)
    print("[INFO] App version: {}".format(appVersion))
    print("[INFO] App build ID: {}".format(appBuildId))

    # Set apk details in env file to access it (only on GitHub)
    if os.environ.get('IS_GITHUB', 'False') == 'True':
        github_env_file = os.getenv('GITHUB_ENV')
        with open(github_env_file, "a") as env_file:
            print("[INFO] Export env parameter TESTED_VERSION={}-{}".format(appVersion, appBuildId))
            env_file.write("TESTED_VERSION={}-{}".format(appVersion, appBuildId))


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


# Function to list all releases
def list_releases(access_token: str):
    LIST_URL = f"https://firebaseappdistribution.googleapis.com/v1/projects/{PROJECT_ID}/apps/{APP_ID}/releases"
    headers = {
        "Authorization": f"Bearer {access_token}",
    }
    response = requests.get(LIST_URL, headers=headers)
    if response.status_code == 200:
        releases = response.json().get("releases", [])
        if not releases:
            print("[WARN] No releases found")
            sys.exit()
        else:
            #for release in releases:
            #    print(f"- Release ID: {release.get('name', 'N/A')} | Display Version: {release.get('displayVersion', 'N/A')} | Build Version: {release.get('buildVersion', 'N/A')}")
            return releases[0].get('binaryDownloadUri'), releases[0].get('displayVersion'), releases[0].get('buildVersion')
    else:
        print(f"[ERROR] Failed to list releases")
        print(f"[ERROR] HTTP {response.status_code}. Response: {response.text}")
        sys.exit()


def download_release(apk_url: str, access_token: str):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/octet-stream",
    }
    response = requests.get(apk_url, headers=headers, stream=True)

    # Check if the request was successful
    if response.status_code == 200:
        print("[INFO] Downloading release")
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