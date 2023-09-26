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

    echo "Copying AndroidManifest.xm file to android folder"
    cp $ORG_FOLDER/AndroidManifest-Debug.xml android/app/src/debug/AndroidManifest.xml

    # Get KETTLE_API_KEY value
    KETTLE_API_KEY="$(envprop 'KETTLE_API_KEY')"
    if [[ -n "${KETTLE_API_KEY}" ]]; then
        # NOTE: `brew` is a dependency, refer to README.md for more details
        # Check if xmlstarlet is available, if not and brew is available, install xmlstarlet
        command -v brew >/dev/null 2>&1 && echo "Installing xmlstarlet dependency" && brew install xmlstarlet

        command -v xmlstarlet >/dev/null 2>&1 && \
        echo "Adding [Kettle] API Key to android/app/src/debug/AndroidManifest.xml" && \
        xmlstarlet edit --inplace --omit-decl \
            -s //manifest/application -t elem -n "kettlekey" \
            -i //manifest/application/kettlekey -t attr -n "android:name" -v "com.kogenta.kettle.sdk.API_KEY" \
            -i //manifest/application/kettlekey -t attr -n "android:value" -v "$KETTLE_API_KEY" \
            -r //manifest/application/kettlekey -v meta-data \
            android/app/src/debug/AndroidManifest.xml || \
        echo "xmlstarlet is not available. Cannot add [Kettle] API Key to AndroidManifest.xml."
    else
        echo "Skipping [Kettle] API Key to AndroidManifest.xml"
    fi

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

    sh ./scripts/generate-assets.sh $APP_ORG
fi