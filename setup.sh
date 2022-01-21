if [ "$#" -lt 2 ]
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
    echo "Third argument is optional an can be used to set BFF host to localhost."
    echo "For android this would normally be 'http://10.0.2.2:8080' since the emulator redirects this to you dev localhost"
    echo "Example:
./setup.sh dev atb "
    exit 1
else
    sh ./scripts/override-environment.sh $1 $2 $3
    sh ./scripts/generate-native-assets.sh
fi