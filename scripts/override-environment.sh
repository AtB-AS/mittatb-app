if [ -z "$1" ]; then
    echo "Argument error!"
    echo "First argument should be the environment name."
    echo "Available environment names: 
 - store
    
Example: 
./override-environment.sh store"
    exit 1
else 
    APP_ENVIRONMENT=$1
    ENV_FOLDER=env/$APP_ENVIRONMENT
    echo "Copying $APP_ENVIRONMENT .env file to root"
    cp $ENV_FOLDER/.env .

    echo "Copying $APP_ENVIRONMENT GoogleService-Info.plist to iOS folder"
    cp $ENV_FOLDER/GoogleService-Info.plist ios/atb
fi