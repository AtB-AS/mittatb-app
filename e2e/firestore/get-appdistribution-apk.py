import os
import requests


## Set the required variables
# AtB Firebase IDs
PROJECT_ID = "939812594010"
APP_ID = "1:939812594010:android:e6721549bec728c3069363"
OUTPUT_FILE = "../apk/app-staging.apk"


def main():
    # ENV parameters exist
    TESTED_VERSION = os.getenv("TESTED_VERSION")
    APK_DOWNLOAD_URL = os.getenv("APK_DOWNLOAD_URL")

    print(f"[INFO] Download build {TESTED_VERSION}")
    download_release(APK_DOWNLOAD_URL)


def download_release(apk_url: str):
    headers = {
        "Accept": "application/octet-stream"
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