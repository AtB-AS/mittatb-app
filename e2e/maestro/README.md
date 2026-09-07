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

## run tests
e2e/maestro$ maestro test -e APP_ID=no.mittatb.debug -e PHONE_NUMBER=<phoneNumber> -e OTP=<otp> tests/run.yaml
```

## Errors and reporting

Add outputs and debug

```bash
-e APP_ID=no.mittatb.debug --debug-output=results --format junit --output results/results.xml
```

## Resources

- [Maestro CLI](https://docs.maestro.dev/maestro-cli)
