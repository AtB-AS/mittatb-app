# App release process

## Releasing to TestFlight / Play Store Alpha

These are the steps for releasing a new major version to TestFlight / Play Store Alpha. This may be done as soon as the old version is deployed to production.

Skip the first step of bumping the project files if the release is a new release candidate on an existing major version.

### Bump version number in project files

There are some project files where the version number must be bumped. This is a candidate for later automation, bus as of now it is a manual process.

Bump the version number in these files:
  - All .env-files
  - package.json
  - ios/atb.xcodeproj/project.pbxproj
  - ios/atbTests/Info.plist
  - scripts/ios/upload-sourcemaps.sh

Do this in a commit with message "chore: Bump to version x.xx". 
    
Tip: You can check earlier commits with the message "chore: Bump to version x.xx" to see if all necessary files are bumped.

### Create release candidate with the command line

This will create a draft release in GitHub.

- `git fetch` to locally pull all existing tags
- `yarn release-draft` to create a tag for the new release. This should be done on the master branch.
- You are asked to specify version. This should be the major-version with a release candidate version suffix, for example `v1.16-rc2`.
- If this is the first release for the current major version use `rc1` as suffix like this: `v1.16-rc1`.
- If a release candidate already exists, increment the suffix number. If `v1.16-rc2` exists, the next version should be `v1.16-rc3`.

### Release in GitHub

Follow these steps in GitHub:
- Go to this repository in GitHub and select _Releases_. 
- Find the previously created draft release with the correct release candidate version and click _Edit_. 
- Click _Publish release_.

This makes GitHub Actions build the release and send it to TestFlight / Play Store Alpha. This is configured with [fastlane](https://fastlane.tools/). The build itself will take approximately an hour, and there may be additional review time at Apple / Google. The exception is if the release is an update to an existing major version, then TestFlight will automatically accept the release without a new review.  


