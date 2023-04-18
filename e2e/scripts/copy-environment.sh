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
./override-environment.sh staging atb"
    exit 1
else
    APP_ENVIRONMENT=$1
    APP_ORG=$2
    ENV_FOLDER=env/$APP_ORG/$APP_ENVIRONMENT
    echo "Copying $APP_ENVIRONMENT .env file to root"
    cp $ENV_FOLDER/.env .

fi