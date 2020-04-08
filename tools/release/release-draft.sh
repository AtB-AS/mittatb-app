branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$branch" != "master" ]]; then
  echo 'You have to be on master to do a new release';
  exit 1;
fi

echo 'Gathering commits and creating changelog'
message=`yarn --silent conventional-changelog -p angular -n ./tools/release/changelog.config.js`

if [ $? -eq 0 ]; then
  echo 'Creating pull requests'
  gh pr create -B alpha-release -b "$message" -t '[Sync] New release to alpha channel'
else
  echo 'Could not create changelog'
  exit 1;
fi
