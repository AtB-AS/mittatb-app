# React Native New Architecture Upgrade Guide

This document outlines the process and considerations for upgrading the AtB app to React Native's new architecture when the necessary issues are resolved. This will need to happen at some point to align with React Native's long-term roadmap.

## Current Status

As of React Native 0.81 upgrade (PR [#5419](https://github.com/AtB-AS/mittatb-app/pull/5419)), the new architecture is **not yet enabled** due to visual bugs that need to be addressed first. The main blocker is related to two things:

1. `overflow: 'visible'` styling in `ScrollChildrenIOS` component used under `ParallaxScroll`, which causes content to be squished on certain screens under the new architecture.
2. The horizontal `ScrollView`s used in `FavoriteChips` and `Announcments` under `Travel`-tab which for some reason behaves janky and scrolls in every direction.

The first one is fixed by just removing `overflow: 'visible'`, but according to a comment might affect VoiceOver on iOS.

The second one is really weird, it happens only on iOS, and just if you log in with SMS first. If you log in anonymously it will not happen. Seemingly there is some race condition there, and it does not happen on for example `Departure` which also uses `FavoriteChips`. It does not happen if you restart the app.

## Applying the New Architecture

When ready to enable the new architecture, apply the `new-architecture.patch` file which contains all necessary configuration changes, from root directory:

```bash
git apply docs/architecture/new-architecture.patch
```

### What the Patch Does

The `new-architecture.patch` modifies the following:

#### 1. **Enable New Architecture Flags**

- **Android**: Sets `newArchEnabled=true` in `android/gradle.properties`
- **iOS**: Sets `RCTNewArchEnabled=true` in all relevant Info.plist files:
  - `ios/atb/Info.plist`
  - `ios/AtbAppIntent/Info.plist`
  - `ios/departureWidget/Info.plist`
- **iOS Podfile**: Removes the explicit disabling of new architecture

#### 2. **Babel Configuration Update**

- Replaces `react-native-reanimated/plugin` with `react-native-worklets/plugin` to support the new worklets system.

#### 3. **Dependency Upgrades**

Essential for new architecture compatibility:

- **react-native-kettle-module**: `1.2.0` → `2.0.0`
- **react-native-reanimated**: `3.19.1` → `^4.1.0`
- **@react-native-community/slider**: `^4.5.2` → `5.0.1`
- **Adds**: `react-native-worklets: ^0.5.0`

#### 4. **Kettle SDK 2.0.0 Synchronous Changes**

Updates Beacons module to handle the fact that Kettle SDK 2.0.0 functions are now synchronous instead of returning Promises:

```typescript
// Before (1.2.0 - async)
const consents = await Kettle.getGrantedConsents();
const isStarted = await Kettle.isStarted();

// After (2.0.0 - sync)
const consents = Kettle.getGrantedConsents();
const isStarted = Kettle.isStarted();
```

#### 5. **Visual Bug Fixes**

- **ParallaxScroll**: Removes `overflow: 'visible'` from `childrenIOS` style as it causes content squishing under new architecture. :warning: Need to test that this does not negatively affect VoiceOver!

### Installation Steps

After applying the patch:

1. **Regenerate JavaScript dependencies**:

   ```bash
   yarn install
   ```

2. **Regenerate iOS pods** (critical order):

   ```bash
   cd ios
   pod install
   cd ..
   ```

3. **Build the app**:
   ```bash
   yarn ios  # or yarn android
   ```

> **Important**: Run `pod install` in the iOS directory **before** running `yarn ios` from the root. The recommended `yarn ios` command may fail without a prior manual pod install.

### Why Lock Files Are Excluded

The patch intentionally excludes `yarn.lock` and `Podfile.lock` changes to prevent merge conflicts when applying the patch in the future. These files will be regenerated during the installation steps above.

## Known Issues

### Visual Bugs

The main reason the new architecture is not currently enabled are visual bugs, particularly:

- **Overflow Issues**: Components using `overflow: 'visible'` (like ParallaxScroll) cause content to be compressed or positioned incorrectly
- **Layout Inconsistencies**: Some screens may have layout issues that need individual investigation and fixes.

See issue comments [#21229](https://github.com/AtB-AS/kundevendt/issues/21229#issuecomment-3269589722) for more info.
