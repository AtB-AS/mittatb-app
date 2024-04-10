# AtB - Application Mobile

[![iOS build status](https://build.appcenter.ms/v0.1/apps/ae9e8aeb-77a8-4071-937e-61a0e3cab5d3/branches/master/badge)](https://appcenter.ms)
[![Android build status](https://build.appcenter.ms/v0.1/apps/f737d38e-497f-413d-9d44-be78ac1b25c0/branches/master/badge)](https://appcenter.ms)

![AtB Illustration](https://atbeta-git-new-landingpage.atb.vercel.app/illustration.svg)

This repo contains documentation and code for the AtB app with travel assistance and ticketing.

Read more on AtB development, blogposts and projects at [the AtBeta page and blog](https://beta.atb.no).

You can submit a new bug report or feature proposal by [creating a new issue](https://github.com/AtB-AS/mittatb-app/issues/new/choose).

## Contribution

We love feedback and suggestions. The AtB app and service is continously improved over time by working with users and observing real usage. If you have any issues or suggestions for improvement we would also love Pull Requests. See our [contribution guide](./CONTRIBUTING.md).

## Getting started

### Requirements

1. See [React Native: setting up the development environment](https://reactnative.dev/docs/environment-setup). (Click the `React Native CLI Quickstart` tab)
2. yarn (https://yarnpkg.com/getting-started/install). Currently yarn 2.0 not supported, install `v1.22.0` or similar
3. git-crypt: MacOS: `brew install git-crypt`, Linux: `apt install git-crypt`, Windows: Use [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) terminal on Windows file system and follow Linux steps
4. Ruby: Windows: [Run installer](https://github.com/oneclick/rubyinstaller2/releases/download/RubyInstaller-2.7.6-1/rubyinstaller-devkit-2.7.6-1-x64.exe) and add `C:\Ruby27-x64\bin` (or similar) to PATH.

### Starting locally

#### First time setup

> 🪟 Windows users: use Git Bash to run .sh scripts 

1. Setup Entur private registry in `.npmrc` and `gradle.properties`.
   a. Get access to Entur jfrog registry (https://entur2.jfrog.io/) for your mittatb account
   b. Create an identity token for your jfrog user in jfrog user setting
   c. Run this script:
   > ⚠ Make sure to run this only once. This script appends to the token files and does not overwrite its contents.
   ```
   ENTUR_REGISTRY_USER=<USER_EMAIL> ENTUR_REGISTRY_TOKEN=<IDENTITY_TOKEN> ./scripts/add-entur-private-registry.sh
   ```
   Note: Access token from jfrog has a one-year expiry
2. Install dependencies:
   a. React Native: `yarn`
   b. Install Ruby dependencies `bundle install`

   > 🪟 Windows users: install [ImageMagick](https://imagemagick.org/script/download.php) and check `Install legacy utilities (e.g. convert)` during the installation. 
   > Add `C:\Program Files\ImageMagick-7.1.1-Q16-HDRI` (or similar) to PATH

   c. Install ImageMagick `brew install imagemagick`

> 🪟 Windows users: run in WSL (Windows Subsystem for Linux). 
3. Decrypt sensitive files `git-crypt unlock <path/to/key>` (Key given to internal members)

> 🪟 Windows users: skip this step
4. Install iOS Pods:
   a. Mapbox v6 requires token for installing dependencies. This means you need to set proper auth on curl for MapBox API. `git-crypt` should decrypt a `.netrc` file in root. You can copy this to set user info:
       ```
       cp .netrc ~/
       ```
   b. Pod install: `cd ios/` and `pod install`

> 🪟 Windows users: run in Git Bash
5. From root folder run: `yarn setup dev <organization>` where organization is either `atb` or `nfk`, to set root .env for local development and generate all icons and launch screens for iOS and Android

> 🪟 Windows users: skip this step
6. Run `yarn get_ios_certs` to install certificates. NOTE: In order to be able to set up this step you must have access to the certificates's repo for the organization you are working on.

For external contributors, we need to fix [#35](https://github.com/AtB-AS/mittatb-app/issues/35) before they are able to run the app.

#### Starting projects

1. iOS: `yarn ios`

You may select which simulator/device the application will be deployed on in xcode.

2. Android: `yarn android`

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

### Building on Windows

Scripts for developing for and building the app do not support Windows natively. Expect to run into issues when using Windows. 

Using `Git Bash` and `WSL` it _is possible_ to work around these issues. These steps are described in the setup with the `🪟 Windows users` tag.

### Common errors

#### Missing `ANDROID_SDK_ROOT`

By following [React Native Guide](https://reactnative.dev/docs/getting-started) you can get an error saying ANDROID_SDK_ROOT is undefined. Set this in addition to your bashrc (or similar), such as:

```sh
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
```

You may also add relevant tools to your path:

```                                                                                                                                                                      │    at ThemeProvider (http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=no.mittatb.debug&modulesOnly=false&runModule=true:145236:21)
export PATH=$PATH:$ANDROID_HOME/emulator                                                                                                                                                                              │    at NavigationContainerInner (http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=no.mittatb.debug&modulesOnly=false&runModule=true:145129:26)
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### Command failed: `xcrun simctl list --json devices`

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

### Building and running on Apple Silicon Macs with Rosetta enabled

Some steps may fail when building on an Apple Silicon Mac.
We got it building on a Macbook pro M1 by doing a few extra steps:

#### Set xcode to run with Rosetta

Open finder, navigate to Applications, right click xcode and select "get info", tick checkbox "Open using Rosetta".

#### Set Terminal to run with Rosetta

Open finder, navigate to Applications/Utilities , right click Terminal and select "get info", tick checkbox "Open using Rosetta".
Restart your terminals.

#### Update LibFFI

Run `sudo gem install ffi -- --enable-system-libffi`

Running `yarn ios` should now build and start the app in the ios simulator.

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

### Debugging
- [Debugging](./docs/Debugging.md)

## Storybook
Storybook for the app can be enabled in the developer menu in 'My profile'.

When adding or removing stories, the command `yarn storybook-generate` must be used to update the references in the `storybook.requires.js` file.

## Using with other organizations

See documentation on setting up other environments.

- [Configuration for different organizations](./docs/OrgConfig.md)

## Find unused dependencies

`yarn unimported`

## License

The contents of this repository is licensed as [EUPL-1.2](./LICENSE). See [RFC](https://github.com/AtB-AS/org/blob/master/rfc/0015_License/index.md).
