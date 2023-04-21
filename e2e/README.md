# E2E-tests app

The e2e-tests are run on an Android emulator with the test automation protocol [WebdriverIO](https://webdriver.io/docs/gettingstarted/)
as the underlying protocol for mobile automation with [Appium](http://appium.io/). The WebdriverIO interaction is
through APIs defined in [WebdriverIO API](https://webdriver.io/docs/api).

## Install

```bash
## install WebdriverIO and dependencies
$ yarn install

## install WebdriverIO and dependencies (from root)
$ yarn --cwd e2e install
```

## Test on GH action

The GH action described in `test-e2e-android.yml` downloads the latest Android staging build from AppCenter and run 
tests against it. The Android APK will be downloaded to `e2e/apk/app-staging.apk`.
```bash
## run tests
$ APP_PATH=<absolute-path-to-root> yarn test:android
```

## Test locally

Two alternatives.

0) Pre-requisite: Android emulator with a ready to go AVD
1) As for the GH action, an Android APK can be downloaded from AppCenter to `e2e/apk/app-staging.apk`
```bash
## start emulator (name of the AVD is here 'Pixel_5_API_30')
$ emulator -netdelay none -netspeed full -no-snapshot-load -avd Pixel_5_API_30

## run tests
$ yarn test:android:local:appcenter
```
2) Start the app in developer mode with Metro. To avoid error messages, the `index.js` should be replaced
```bash
## remove error messages in the app
$ ./e2e/scripts/removeLogsFromDevApp.sh

## Set dev mode
$ yarn setup dev atb

## Start app locally
$ yarn android

## start emulator (name of the AVD is here 'Pixel_5_API_30')
$ emulator -netdelay none -netspeed full -no-snapshot-load -avd Pixel_5_API_30

## run tests
yarn test:android:local:dev
```

## Errors and reporting

The test results are stored as JUnit XML-files and as a Mochawesome JSON-file in `e2e/results/`. Also, any if any errors
happens, a screenshot is taken of the app at the time of failure. This is stored as PNG-files with the name of the test in
`e2e/screenshots/`.

## Resources

* [WebdriverIO](https://webdriver.io)
* [WebdriverIO API](https://webdriver.io/docs/api)
* [Appium](http://appium.io/)

