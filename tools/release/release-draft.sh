branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$branch" != "master" && "$branch" != "release/"* ]]; then
  echo 'You have to be on master or release branch to do a new release';
  exit 1;
fi

read -p "What do you want the release tag to be? The usual format is v1.x, for example v1.5. Can also suffix with -rc or similar:
" -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^v[0-9]+\.[0-9]+.*$ ]]
then
  echo "The format has to start with 'v1.x' "
  exit 0;
fi
releaseVersion=$REPLY

read -p "This will create a draft release $releaseVersion on Github, are you sure you want to do release? (N/y) " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
  exit 0;
fi

echo 'Gathering commits and creating changelog'
message=`yarn --silent conventional-changelog -p angular -n ./tools/release/changelog.config.js`

if [ $? -eq 0 ]; then
  gh release create $releaseVersion --draft --title "$releaseVersion release draft" --notes "$message" 
else
  echo 'Could not create changelog'
  exit 1;
fi
