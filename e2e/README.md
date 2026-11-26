# E2E-tests with Maestro

Maestro is an open-source UI automation framework for mobile and web with built-in tolerance, zero-wait intelligence,
and declarative YAML syntax. Read more on [meastro.dev](https://docs.maestro.dev/get-started/what-is-maestro).

## Install

```bash
e2e$ curl -fsSL "https://get.maestro.mobile.dev" | bash
```

## Tests

All tests are located in `/maestro/tests` with `/maestro/tests/run.yaml` to run all. Common flows are located in
`/maestro/common`. Most of the tests use test ids from the app. All test ids used are mapped in
`/maestro/elements`, where `/maestro/elements/loadElements.yaml` is run from each test script so that these
test ids are available at run time for a test.

_NB!_ The native date/time picker renders without any children in the accessibility tree.
Maestro therefor `swipe` based on raw screen coordinates rather than elements. This might therefore be a bit 
flaky if tested on other emulators.

## Test locally

Two alternatives.

0. Pre-requisite: Android emulator with a ready to go AVD
1. Start the app in developer mode with Metro. To avoid error messages, the `index.js` should be replaced (see `e2e/index_noLogs/index.js`)

```bash
## remove error messages in the app
$ ./e2e/scripts/removeLogsFromDevApp.sh

## set dev mode
$ pnpm setup dev atb

## start emulator (name of the AVD is here 'Pixel_5_API_30')
$ emulator -netdelay none -netspeed full -no-snapshot-load -avd Pixel_5_API_30

## start app locally
$ pnpm android

## run all tests
e2e$ maestro test -e APP_ID=no.mittatb.debug -e PHONE_NUMBER=<phoneNumber> -e OTP=<otp> tests/runAll.yaml
## run smoke tests
e2e$ maestro test -e APP_ID=no.mittatb.debug -e PHONE_NUMBER=<phoneNumber> -e OTP=<otp> tests/smoke.yaml
```

## Errors and reporting

Add outputs and debug

```bash
-e APP_ID=no.mittatb.debug --debug-output=results --format junit --output results/results.xml
```

## Flashlight performance measure

Created a test script that can be run along with Flashlight (`./tests/performance.yaml`):
- do a simple travel search and open the first result
- open the map
- open departures and open the first departure
- open the ticket purchase history

### Commands

Note that by default `iterationCount` and `maxRetries` is set to 1, i.e. only 1 iteration is run and if there is any errors
in the test script, the test is run with 1 retry.

```bash
## Install Flashlight
$ curl https://get.flashlight.dev | bash

## Start local server with manual start/stop
$ flashlight measure

## Start measurements with test script
$ flashlight test --bundleId no.mittatb.debug --testCommand "maestro test -e APP_ID=no.mittatb.debug -e PHONE_NUMBER=${PHONE_NUMBER} -e OTP=${OTP} --test-output-dir results tests/performance.yaml" --resultsTitle performance_measures --iterationCount 1 --maxRetries 1

## Generate HTML-report after test
$ flashlight report <path-to-file>/<test-results>.json
```


## Resources

- [Maestro CLI](https://docs.maestro.dev/maestro-cli)
