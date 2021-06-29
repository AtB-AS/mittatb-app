if [ "$#" -ne 2 ]
then
    echo "Argument error!"
    echo "First argument should be the environment name."
    echo "Available environment names:
 - store"
    echo "Second argument should be the app variant name."
    echo "Available app variant names:
-AtB
-NFK"

    echo "Example:
./override-environment.sh store AtB"
    exit 1
else
    APP_ENVIRONMENT=$1
    APP_VARIANT=$2
    ENV_FOLDER=env/$APP_VARIANT/$APP_ENVIRONMENT
    echo "Copying $APP_ENVIRONMENT .env file to root"
    cp $ENV_FOLDER/.env .

    echo "Copying $APP_ENVIRONMENT GoogleService-Info.plist to iOS folder"
    cp $ENV_FOLDER/GoogleService-Info.plist ios/atb
fi