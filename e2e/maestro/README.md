# E2E-tests with Maestro

Maestro is an open-source UI automation framework for mobile and web with built-in tolerance, zero-wait intelligence, 
and declarative YAML syntax. Read more on [meastro.dev](https://docs.maestro.dev/get-started/what-is-maestro).

_This folder is a PoC of testing with Maestro_

## Install

```bash
e2e$ curl -fsSL "https://get.maestro.mobile.dev" | bash
```

## Test locally

Two alternatives.

0) Pre-requisite: Android emulator with a ready to go AVD
1) Start the app in developer mode with Metro. To avoid error messages, the `index.js` should be replaced
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
e2e/maestro$ maestro -e APP_ID=no.mittatb.debug test tests/*
```

## Errors and reporting

Add outputs and debug
```bash
e2e/maestro$ maestro test -e APP_ID=no.mittatb.debug --debug-output=results --format junit --output results/results.xml tests/*
```

## Resources

* [Maestro CLI](https://docs.maestro.dev/maestro-cli)

