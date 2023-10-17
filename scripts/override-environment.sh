#!/bin/sh

source ./scripts/utils.sh

if [ "$#" -ne 2 ]
then
    echo "Argument error!"
    echo "First argument should be the environment name."
    echo "Available environment names:
 - dev
 - prodstaging
 - staging
 - store"
    echo "Second argument should be the app organisation name."
    echo "Available app variant names:
-atb
-nfk"

    echo "Example:
./override-environment.sh store atb"
    exit 1
else
    APP_ENVIRONMENT=$1
    APP_ORG=$2
    ENV_FOLDER=env/$APP_ORG/$APP_ENVIRONMENT
    ORG_FOLDER=env/$APP_ORG
    echo "Copying $APP_ENVIRONMENT .env file to root"
    cp $ENV_FOLDER/.env .

    echo "Copying $APP_ENVIRONMENT .env file to fastlane"
    cp $ENV_FOLDER/.env fastlane/.env.default

    echo "Copying $APP_ENVIRONMENT ios devices text file to ios folder"
    cp $ORG_FOLDER/ios-devices.txt ios/ios-devices.txt

    echo "Copying $APP_ENVIRONMENT icons to icons folder"
    cp -a $ENV_FOLDER/icons/. icons/

    echo "Copying $APP_ENVIRONMENT .env file to Config file in ios"
    cp $ENV_FOLDER/.env ios/Configs/Config.xcconfig
    #replace urls containing :// with :/$()/ to be compatiable with xcconfig format
    sed -i '' -e "s,://,:/\$()/,g" ios/Configs/Config.xcconfig

    echo "Copying $APP_ENVIRONMENT google-services.json to android folder"
    cp $ENV_FOLDER/google-services.json android/app

    echo "Copying $APP_ENVIRONMENT GoogleService-Info.plist to iOS folder"
    cp $ENV_FOLDER/GoogleService-Info.plist ios/atb

    echo "Copying boot splash image to assets/"
    cp $ORG_FOLDER/bootsplash_logo_original.png assets/

    # Check if ORG_FOLDER/manifests exists and is a directory
    if [ -d "$ORG_FOLDER/manifests" ]
    then
        # Iterate through all subfolders of ORG_FOLDER/manifests
        for folder in "$ORG_FOLDER/manifests"/*;
        do
            # Check if the folder contains XML files with 'Manifest' in the name
            if [ -n "$(find "$folder" -iname '*manifest*.xml' -type f)" ]
            then
                # Get the name of the folder
                FOLDER_NAME=$(basename "$folder")

                # Define target folder path
                TARGET_FOLDER="android/app/src/$FOLDER_NAME"

                echo "Copying XML files with 'Manifest' from $FOLDER_NAME to $TARGET_FOLDER/"

                # Create target folder if not exists
                mkdir -p "$TARGET_FOLDER"

                # Copy only XML files with 'Manifest' in the name (case-insensitive)
                find "$folder" -iname '*manifest*.xml' -type f -exec cp {} "$TARGET_FOLDER/" \;
            fi
        done
    fi

    sh ./scripts/generate-assets.sh $APP_ORG
fi