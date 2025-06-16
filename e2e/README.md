# E2E-tests app

The e2e-tests are run on an Android emulator with the test automation protocol [WebdriverIO](https://webdriver.io/docs/gettingstarted/)
as the underlying protocol for mobile automation with [Appium](http://appium.io/). The WebdriverIO interaction is
through APIs defined in [WebdriverIO API](https://webdriver.io/docs/api).

In order to measure the app's performance, there is also added a script for this that relies on [Flashlight](https://docs.flashlight.dev/). 
Flashlight is a stand-alone command line tool that will measure FPS, CPU, CPU per thread and memory usage while the app
is used. It supports either manual start and stop while the app is used, or it can be started with a testscript like
WebdriverIO/Appium. Read more about it [here](#flashlight-performance-measure).

## Install

```bash
## install WebdriverIO and dependencies
$ yarn install
```

## Test on GH action

The GH action described in `test-e2e-android.yml` downloads the latest Android staging build from 
Firebase App Distribution and run tests against it. The Android APK will be downloaded to 
`e2e/apk/app-staging.apk`.
```bash
## run tests
$ APP_PATH=<absolute-path-to-root> yarn test:android
```

## Test locally

Two alternatives.

0) Pre-requisite: Android emulator with a ready to go AVD
1) As for the GH action, an Android APK can be downloaded from Firebase App Distribution to `e2e/apk/app-staging.apk`
```bash
## start emulator (name of the AVD is here 'Pixel_5_API_30')
$ emulator -netdelay none -netspeed full -no-snapshot-load -avd Pixel_5_API_30

## run tests
$ yarn test:android:local:firebase
```
2) Start the app in developer mode with Metro. To avoid error messages, the `index.js` should be replaced
```bash
## remove error messages in the app
$ ./e2e/scripts/removeLogsFromDevApp.sh

## set dev mode
$ yarn setup dev atb

## start emulator (name of the AVD is here 'Pixel_5_API_30')
$ emulator -netdelay none -netspeed full -no-snapshot-load -avd Pixel_5_API_30

## start app locally
$ yarn android

## run tests
yarn test:android:local:dev
```

## Errors and reporting

The test results are stored as JUnit XML-files and as a Mochawesome JSON-file in `e2e/results/`. Also, any if any errors
happens, a screenshot is taken of the app at the time of failure. This is stored as PNG-files with the name of the test in
`e2e/screenshots/`.

## Flashlight performance measure

Created a test script that can be run along with Flashlight (`./test/flashlight/performanceMeasures.e2e.ts`):
- do a simple travel search and open the first result
- open the map
- open departures and open the first departure
- open the ticket overview
- open profile
- put the app in the background for x seconds and activate it again

### Commands

Note that by default `iterationCount` and `maxRetries` is set to 1, i.e. only 1 iteration is run and if there is any errors
in the test script, the test is run with 1 retry.

```bash
## Install Flashlight
$ curl https://get.flashlight.dev | bash

## Start local server with manual start/stop
$ flashlight measure

## Start measurements with test script
$ flashlight test --bundleId no.mittatb.debug --testCommand "yarn test:android:local:dev --spec e2e/test/flashlight/performanceMeasures.e2e.ts" --resultsTitle performanceMeasures --iterationCount 1 --maxRetries 1

## Start measurements with yarn
$ yarn test:android:local:perfMeasure

## Generate HTML-report after test
$ flashlight report <path-to-file>/<test-results>.json
```

## Resources

* [WebdriverIO](https://webdriver.io)
* [WebdriverIO API](https://webdriver.io/docs/api)
* [Appium](http://appium.io/)
* [Flashlight](https://docs.flashlight.dev)

