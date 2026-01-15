#!/bin/bash
branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$branch" != "master" && "$branch" != "release/"* ]]; then
  echo 'You have to be on master or release branch to do a new release';
  exit 1;
fi

releaseVersion=$1

# If no argument is provided, fall back to interactive mode
if [ -z "$releaseVersion" ]; then
  read -p "What do you want the release tag to be? The usual format is v1.x, for example v1.5. Can also suffix with -rc or similar:
" -r
  echo
  releaseVersion=$REPLY

  if [[ ! $releaseVersion =~ ^v[0-9]+\.[0-9]+.*$ ]]; then
    echo "The format has to start with 'v1.x' "
    exit 1;
  fi

  read -p "This will create a draft release $releaseVersion on Github, are you sure you want to do release? (N/y) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 0;
  fi
else
  if [[ ! $releaseVersion =~ ^v[0-9]+\.[0-9]+.*$ ]]; then
    echo "The format has to start with 'v1.x' "
    exit 1;
  fi
  echo "Creating draft release for $releaseVersion"
fi


echo 'Gathering commits and creating changelog'
message=$(yarn --silent conventional-changelog -p angular -n ./tools/release/changelog.config.js)

if [ $? -eq 0 ]; then
  gh release create "$releaseVersion" --draft --title "$releaseVersion release draft" --notes "$message" --target "$branch"
else
  echo 'Could not create changelog'
  exit 1;
fi
