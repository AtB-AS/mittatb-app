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

## Release to external testers

### Promote in store

iOS-butikk: appstoreconnect.apple.com/
Android-butikk: play.google.com/apps/publish

iOS TestFlight auto-release to internal
alpha-kanal flere brukere

App Store Connect -> TestFlight
TestFlight: 
iosBuilds
Status testing -> 
Go to external - Builds -> Add -> Select a build to test
BUILD_ID, same as Android, just Build store iOS

Automatically to internal
Play Console: Closed testing -> Manage track -> Create new release on Alpha channel -> Add from library -> 
Finn id: Github Actions -> Build store Android
Decrypt env files
BUILD_ID
Compare with build id in selectable releases
Save
Rollout
Will be reviewed

### To prod 

App Sotre Connect -> App Store
Plus icon by iOS App in left hand menu
Select new version number
Will make new Prepare for submission
Må oppdatere promotional text og what's new

Copy promotional text from the last version (which still are ready for sale)
What's new: Sammendrag/Changelog av hva som er nytt i denne versjonen

Build -> Add build -> Riktig Build
Automatically release -> Blir releaset så fort review er godkjent
Mulig å velge innfasing av release over en syvdagers-periode.
Add for review
Confirm -> Submit to app review


### Play Store

Production in left hand menu
Create new release
Add from library
Check correct build id
Add to release
Release notes -> Same as iOS, also english
Save -> Review release
Mulig med gradvis utrulling, men må håndteres manuelt
Start rollout to production -> Rollout
Blir publisert automatisk så raskt de er godkjent



