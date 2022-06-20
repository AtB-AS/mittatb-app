set -e

if [ $# -eq 0 ]
  then
    echo
    echo "Usage: ./setup-npm-artifactory.sh <artifactory user> <artifactory api key>"
    echo
    exit 1
fi


ARTIFACTORY_URL=https://entur2.jfrog.io/entur2/api/npm/
# Replace with your entur.org email
ARTIFACTORY_USER=$1
# Replace xxxx with your APIKey
ARTIFACTORY_APIKEY=$2
NPM_REPOSITORY=npm-local
# Adjust this to the scope you want to use in package.json
NPM_SCOPE=entur-private
CURL_PARAMS="-u$ARTIFACTORY_USER:$ARTIFACTORY_APIKEY $ARTIFACTORY_URL$NPM_REPOSITORY/auth/$NPM_SCOPE"
curl $CURL_PARAMS > .npmrc
