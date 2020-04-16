branch=$(git rev-parse --abbrev-ref HEAD)
if [[ "$branch" != "master" ]]; then
  echo 'You have to be on master to do a new release';
  exit 1;
fi

read -p "This will create a Pull Request on Github, are you sure you want to do release? (n/Y) " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
  exit 0;
fi


echo 'Gathering commits and creating changelog'
message=`yarn --silent conventional-changelog -p angular -n ./tools/release/changelog.config.js`

if [ $? -eq 0 ]; then
  gh pr create -B alpha-release -b "$message" -t '[Sync] New release to alpha channel'
else
  echo 'Could not create changelog'
  exit 1;
fi
