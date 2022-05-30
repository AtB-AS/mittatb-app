# App release process

## Releasing to TestFlight Internal / Play Store Alpha

These are the steps for releasing a new major version to TestFlight / Play Store Alpha. This may be done as soon as the old version is deployed to production.

If you want to release only for a given organization, the release tag must include the orgId specifier for the organization. The uploading jobs for other organizations will then exit and fail. An example tag for an NFK-only release is the tag `v1.20-rc3-nfk`.

Skip the first step of bumping the project files if the release is a new release candidate on an existing major version.

### Bump version number in project files

There are some project files where the version number must be bumped. This is a candidate for later automation, bus as of now it is a manual process.

Bump the version number in these files:

  - All .env-files
  - package.json

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

### iOS

- Go to https://appstoreconnect.apple.com/, login and select AtB as the app
- Select TestFlight in top menu
- Select Alpha under External Testing in left menu
- Add build
- [Select the build to test](#finding-build-number)

### Android

- Go to https://play.google.com/apps/publish, login and select AtB as the app
- Select Closed testing in left menu
- Select Manage track, and then Create new release on Alpha channel
- Select Add from library
- [Select the build to test](#finding-build-number)
- Save and rollout. Will be reviewed.

## Release to production

### iOS

- Go to https://appstoreconnect.apple.com/, login and select AtB as the app
- Select App Store in top menu
- Select plus icon by iOS App in left hand menu
- Set new version number
- On prepare for submission page set the promotional text (copied from last release) and what's new (short summary of what's new in the relase).
- Select build -> Add build
- [Select the build to test](#finding-build-number)
- Possible to choose delayed rollout over 7 days
- Add for review -> Confirm
- Will be automatically rolled out after review

### Android

- Go to https://play.google.com/apps/publish, login and select AtB as the app
- Select Production in left menu
- Select Create new release
- Select Add form library
- [Select the build to test](#finding-build-number)
- Add release notes, same as what's new on iOS. Should also be in English
- Save -> Review release
- Possible with delayed rollout, manually handled
- Start rollout to production -> Rollout
- Will be automatically rolled out after review

## Finding build number

Go and find the build you want to deploy in GitHub Actions. Either 'Build store iOS' or 'Build store Android'. Check the step 'Decrypt env files' where you should find the 'BUILD_ID'. This may be matched with the build id presented in App Store / Play Store.
