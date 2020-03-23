# MittAtb app

React Native POC.

[![iOS build status](https://build.appcenter.ms/v0.1/apps/ae9e8aeb-77a8-4071-937e-61a0e3cab5d3/branches/master/badge)](https://appcenter.ms)
[![Android build status](https://build.appcenter.ms/v0.1/apps/f737d38e-497f-413d-9d44-be78ac1b25c0/branches/master/badge)](https://appcenter.ms)

## Getting started

### Requirements

1. See [React Native requirements](https://reactnative.dev/docs/getting-started). (Click the `React Native CLI Quickstart` tab)
1. yarn (https://yarnpkg.com/getting-started/install)
1. git-crypt: `brew install git-crypt`

### Starting locally

#### First time setup

1. Install dependencies:
   1. React Native: `yarn`
   1. iOS specific: `cd ios/` and `pod install`
1. Decrypt sensitive files `git-crypt unlock <path/to/key>` (Key given to internal members)

For external contributors, we need to fix [#35](https://github.com/AtB-AS/mittatb-app/issues/35) before they are able to run the app.

#### Starting projects

1. iOS Simulator: `yarn ios`
1. Android Emulator: `yarn android`

### Common errors

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
