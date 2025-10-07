# Android app

Some assorted notes that could be useful when setting up and working with the Android app.

## Environment configuration in Android Studio

If you have issues with your environment settings not being picked up by Android Studio, you can launch it from the command line.

```sh
open -a "Android Studio"
```

## Building from the command line

Set up dependencies (from the ./android directory)

```sh
./gradlew clean
```

Then run `yarn android` to build and launch the app on a connected device or emulator. To list connected devices, run `adb devices`.

### Generate .apk

To generate a APK locally, run this command:

```sh
npx react-native build-android --tasks assembleBeacons
```

Use the `assembleApp` task to build without beacons. Run `./gradlew tasks` to see all available tasks.

The APK will be located in `android/app/build/outputs/apk/beacons/debug/app-beacons-debug.apk`

## Create dependency graph

To see a tree of all dependencies, run this command from the `android` directory. The output is quite large, so this will save it to a file.

```sh
./gradlew app:dependencies > dependencies.txt
```
