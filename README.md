# AtB - Application Mobile

[![iOS build status](https://build.appcenter.ms/v0.1/apps/ae9e8aeb-77a8-4071-937e-61a0e3cab5d3/branches/master/badge)](https://appcenter.ms)
[![Android build status](https://build.appcenter.ms/v0.1/apps/f737d38e-497f-413d-9d44-be78ac1b25c0/branches/master/badge)](https://appcenter.ms)

![AtB Illustration](https://atbeta-git-new-landingpage.atb.vercel.app/illustration.svg)

This repo contains all planning, documentation, discussions and code for the AtB travel assistant (and eventually ticketing).

Read more on AtB development, blogposts and projects at [the AtBeta page and blog](https://beta.atb.no).

## Links and planning

- See ongoing tasks at [Progress](https://github.com/AtB-AS/mittatb-app/projects/6).
- Follow design work and feature refinements at [Feature refinements](https://github.com/AtB-AS/mittatb-app/projects/5)
- [Follow different milestones](https://github.com/AtB-AS/mittatb-app/milestones)
- [Report new bug of feature proposal](https://github.com/AtB-AS/mittatb-app/issues/new/choose)

## Contribution

We love feedback and suggestions. The AtB app and service is continously improved over time by working with users and observing real usage. If you have any issues or suggestions for improvement we would also love Pull Requests. See our [contribution guide](./CONTRIBUTING.md).

## Getting started

### Requirements

1. See [React Native: setting up the development environment](https://reactnative.dev/docs/environment-setup). (Click the `React Native CLI Quickstart` tab)
1. yarn (https://yarnpkg.com/getting-started/install). Currently yarn 2.0 not supported, install `v1.22.0` or similar
1. git-crypt: MacOS: `brew install git-crypt`, Linux: `apt install git-crypt`

### Starting locally

#### First time setup

1. Setup Entur private registry in `.npmrc` and `gradle.properties`.
   1. Get access to Entur jfrog registry (https://entur2.jfrog.io/) for your mittatb account
   1. Create an identity token for your jfrog user in jfrog user setting
   1. Run this script:
   ```
   ENTUR_REGISTRY_USER=<USER_EMAIL> ENTUR_REGISTRY_TOKEN=<IDENTITY_TOKEN> ./scripts/add-entur-private-registry.sh
   ```
   Note: Access token from jfrog has a one-year expiry
1. Install dependencies:
   1. React Native: `yarn`
   1. Install Ruby dependencies `bundle install`
   1. iOS specific: `cd ios/` and `pod install`
      > If there is an issue related to Mapbox please refer to the `Common errors section` below.
1. Decrypt sensitive files `git-crypt unlock <path/to/key>` (Key given to internal members)
1. From root folder run: `yarn setup dev <organization>` where organization is either `atb` or `nfk`, to set root .env for local development and generate all icons and launch screens for iOS and Android

For external contributors, we need to fix [#35](https://github.com/AtB-AS/mittatb-app/issues/35) before they are able to run the app.

#### Starting projects

1. iOS: `yarn ios`

You may select which simulator/device the application will be deployed on in xcode.

1. Android: `yarn android`

You may select which device/emulator to use from Android Studio. You may also use Android Debug Bridge (adb).

When deploying on device you should check that the device is listed as `device` with `adb devices`. You may also need to use the command `adb -s <device-id> reverse tcp:8081 tcp:8081` to reverse the port needed for metro.

### External design system and assets

Assets such as icons, logos, and illustrations are copied into the static folder of the application when the application in build time.
For development assets can be copied manually by running `yarn setup dev atb` in the terminal. This is also triggered on CIs.

When adding or changing assets in the design system, run setup again:

```
# Example
yarn setup dev atb
```

See [`@atb-as/generate-assets`](https://github.com/AtB-AS/design-system/tree/main/packages/assets) in design system for more details. Assets will be outputted in `./assets/design-assets` and converted from SVGs to TypeScript React Native files.

### Common errors

#### `401` When running `pod install`

Mapbox v6 requires token for installing dependencies. This means you need to set proper auth on curl for MapBox API. `git-crypt` should decrypt a `.netrc` file in root. You can copy this to set user info:

```
cp .netrc ~/
```

If you don't have access to `git-crypt` you can use your own `.netrc` with the following info:

```
machine api.mapbox.com
login mapbox
password <YOUR_TOKEN_HERE>
```

#### Missing `ANDROID_SDK_ROOT`

By following [React Native Guide](https://reactnative.dev/docs/getting-started) you can get an error saying ANDROID_SDK_ROOT is undefined. Set this in addition to your bashrc (or similar), such as:

```sh
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
```

#### `Command failed: xcrun simctl list --json devices`

You might have Command Line Tools set without Xcode (eg. when using homebrew without xcode). Change Command Line Tool to Xcode:

```sh
sudo xcode-select -s /Applications/Xcode.app
```

#### `We ran "xcodebuild" command but it exited with error code 65.`

With errors:

```
...
error: /mittatb-app/ios/Pods/Target Support Files/Pods-atb/Pods-atb.debug.xcconfig: unable to open file (in target "atb" in project "atb") (in target 'atb' from project 'atb')
...
```

You might be missing iOS dependencies (Cocopods). See dependency step in [Starting locally](#starting-locally).

### Building and running on Apple Silicon Macs

Some steps may fail when building on an Apple Silicon Mac.
We got it building on a Macbook pro M1 by doing a few extra steps:

#### Set xcode to run with Rosetta

open finder, navigate to Applications, right click xcode and select "get info", tick checkbox "Open using Rosetta"

#### Set Terminal to run with Rosetta

open finder, navigate to Applications/Utilities , right click Terminal and select "get info", tick checkbox "Open using Rosetta".
Restart your terminals.

#### Update LibFFI

run `sudo gem install ffi -- --enable-system-libffi`

running `yarn ios` should now build and start the app in the ios simulator

## Distributing new app versions (deploy)

For test devices and developer devices we do continuous distribution through direct groups on AppCenter. For an internal alpha version release we do periodic deploy through syncing the `alpha-release` branch which distributes the build to TestFlight/Google Play Alpha-channel.

### Requirements

- `gh` (Github CLI): https://cli.github.com/
- `bash` 😬

### Steps

1. `yarn release-draft` (from project root, on `master`)
1. Revise and review PR on Github, making sure all checks pass.

This will eventually (after review in the Stores) distribute a new app version. See [more details](./tools/release/README.md).

### QA

Before distributing a new app version to the `alpha-release` channels, we have to QA the new features and fixes.

Specific notes on QA:

- [QA Ticketing](./docs/TicketingQA.md)

## Using with other organizations

See documentation on setting up other environments.

- [QA Ticketing](./docs/OrgConfig.md)

## License

The contents of this repository is licensed as [EUPL-1.2](./LICENSE). See [RFC](https://github.com/AtB-AS/org/blob/master/rfc/0015_License/index.md).
