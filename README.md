<img width="500px" src="https://github.com/user-attachments/assets/ba3d33f5-58a1-4d17-b097-7bf6b589d7e1">

# AtB app

This repo contains code for the AtB app, a travel assistant and ticketing app for public transportation and mobility in Norway. In addition to AtB in Trøndelag, the app is also used by [FRAM](https://frammr.no/) (Møre og Romsdal), [Reis Nordland](https://www.reisnordland.no/) and [Svipper](https://svipper.no/) (Troms).

You can submit a new bug report or feature proposal by [creating a new issue](https://github.com/AtB-AS/mittatb-app/issues/new/choose).

## Contribution

We love feedback and suggestions. The AtB app is continously improved over time by working with users and observing real usage. If you have any issues or suggestions for improvement we would also love Pull Requests. See our [contribution guide](./CONTRIBUTING.md).

## Getting started

> [!NOTE]
> For external contributors, we should set up default environment files to make it easier to run the app without access to git-crypt secrets and Firebase.

Since iOS development is only supported on MacOS, using MacOS for development is recommended. However, there are some workarounds to get the Android app running on Windows with WSL and Git Bash, that are documented in [docs/WindowsSetup.md](./docs/WindowsSetup.md).

### Requirements

1. Ruby v3.1.0: With something like [rbenv](https://github.com/rbenv/rbenv)
2. See [React Native: Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment)
   > ⓘ If bundler fails or not installed, use `gem install bundler -v <version>`, where `<version>` is the one listed at the bottom of [Podfile.lock](./ios/Podfile.lock) (`BUNDLED WITH: 2.x.x`).
   > If encountering errors, following the suggested gem installs might solve it.
   >
   > If you experience various mysterious errors when running `yarn android` you probably have the wrong JDK. See **Common errors**** below for fix. 
3. [yarn](https://yarnpkg.com/getting-started/install) v1.22 (Currently yarn 2.0 is not supported)
4. git-crypt: `brew install git-crypt` on MacOS, and `apt install git-crypt` on Linux.

### Starting locally

#### First time setup

0. Before cloning the project, make sure that the path you clone it into has no spaces (" ") in it.

1. Setup Entur private registry in `.npmrc` and `gradle.properties`.

   a. Get access to Entur jfrog registry (https://entur2.jfrog.io/) for your mittatb account

   b. Create an identity token for your jfrog user in jfrog user setting

   c. Run this script:

   > ⚠ Make sure to run this only once. This script appends to the token files and does not overwrite its contents.

   ```
   ENTUR_REGISTRY_USER=<USER_EMAIL> ENTUR_REGISTRY_TOKEN=<IDENTITY_TOKEN> ./scripts/add-entur-private-registry.sh
   ```

   > ⓘ Access token from jfrog has a one-year expiry

2. Install dependencies:

   a. React Native: `yarn`

   b. Install Ruby dependencies `bundle install`

   c. Install ImageMagick `brew install imagemagick`

3. Decrypt sensitive files `git-crypt unlock <path/to/key>` (Key given to internal members)

4. Install iOS Pods:

   a. Mapbox v6 requires token for installing dependencies. This means you need to set proper auth on curl for MapBox API. `git-crypt` should decrypt a `.netrc` file in root. You can copy this to set user info:
   `   cp .netrc ~/`

   b. Pod install: `cd ios/` and `pod install`

5. From root folder run: `yarn setup dev <organization>` where organization is either `atb`, `fram`, `nfk` or `troms`, to set root .env for local development and generate all icons and launch screens for iOS and Android.

6. Run `yarn get_ios_certs` to install certificates.
   > ⓘ In order to be able to set up this step you must have access to the certificates's repo for the organization you are working on.

#### Building and running the app

- iOS: Run `yarn ios --list-devices`
- Android: Run `yarn android`
  - You may select which device/emulator to use from Android Studio. You may also use Android Debug Bridge (adb).
  - When deploying on device you should check that the device is listed as `device` with `adb devices`. You may also need to use the command `adb -s <device-id> reverse tcp:8081 tcp:8081` to reverse the port needed for metro.

### Common errors

#### Missing `ANDROID_SDK_ROOT`

By following [React Native Guide](https://reactnative.dev/docs/getting-started) you can get an error saying ANDROID_SDK_ROOT is undefined. Set this in addition to your bashrc (or similar), such as:

```sh
export ANDROID_SDK_ROOT=$HOME/Library/Android/sdk
```

You may also add relevant tools to your path:

```
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

#### Mysterious, unexplainable build errors when building the android app
 *Example:* `Could not resolve all files for configuration ':adrianso_react-native-device-brightness:androidJdkImage'.`

 Run this command to check if you have the correct JDK: 
```sh
npx react-native doctor
```

If it tells you that the JDK is wrong (probably too new) follow this guide to correctly set up your environment:

[Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment)

The `doctor` command can also help you troubleshoot other problems.

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

## Design system and assets

Assets such as icons, logos, and illustrations are set up by running `yarn setup` in the terminal. Assets will be outputted in `./assets/design-assets` and converted from SVGs to TypeScript React Native files.

When adding or changing assets in the design system, run setup again:

```
yarn setup dev <organization>
```

Then restart metro and clear cache:

```
yarn start --reset-cache
```

See the [design system](https://github.com/AtB-AS/design-system) and [`@atb-as/generate-assets`](https://github.com/AtB-AS/design-system/tree/main/packages/assets) for more details.

## Distributing new app versions (deploy)

For test devices and developer devices we do continuous distribution through direct groups on Firebase App Distribution, which is built on commits to master. When a GitHub release is made, a new version is distributed to TestFlight and Google Play. More details on the release process can be found in the [here](./docs/Release.md).

## Storybook

Storybook for the app can be viewed in debug build of the app through the developer section in 'My profile'.

When adding or removing stories, the command `yarn storybook-generate` must be used to update the references in the `storybook.requires.js` file.

## Using with other organizations

See documentation on setting up other environments.

- [Configuration for different organizations](./docs/OrgConfig.md)

## Find unused dependencies

`yarn unimported`

## License

The contents of this repository is licensed as [EUPL-1.2](./LICENSE). See [RFC](https://github.com/AtB-AS/org/blob/master/rfc/0015_License/index.md).
