fastlane documentation
----

# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```sh
xcode-select --install
```

For _fastlane_ installation instructions, see [Installing _fastlane_](https://docs.fastlane.tools/#installing-fastlane)

# Available Actions

## iOS

### ios update_devices

```sh
[bundle exec] fastlane ios update_devices
```

Update new devices and provisioning profiles

### ios nuke_certificates

```sh
[bundle exec] fastlane ios nuke_certificates
```

Nuke certificates

### ios generate_new_certs

```sh
[bundle exec] fastlane ios generate_new_certs
```

Generate new certificate

### ios get_certs

```sh
[bundle exec] fastlane ios get_certs
```

Match certificates

### ios enable_pass_presentation_suppression_entitlement

```sh
[bundle exec] fastlane ios enable_pass_presentation_suppression_entitlement
```

Enable Apple pass presentation suppression entitlement

### ios verify_installed_certificates

```sh
[bundle exec] fastlane ios verify_installed_certificates
```



### ios setup_certificates

```sh
[bundle exec] fastlane ios setup_certificates
```

Setup certificates

### ios build

```sh
[bundle exec] fastlane ios build
```

Build the iOS application.

### ios pods

```sh
[bundle exec] fastlane ios pods
```

Install pods.

### ios firebase_distribution_staging

```sh
[bundle exec] fastlane ios firebase_distribution_staging
```

Upload the build to Firebase App Distribution

### ios testflight_prod

```sh
[bundle exec] fastlane ios testflight_prod
```

Upload app to testflight

----


## Android

### android build

```sh
[bundle exec] fastlane android build
```

Upload the build to Firebase app distribution

### android build_aab

```sh
[bundle exec] fastlane android build_aab
```



### android firebase_distribution_staging

```sh
[bundle exec] fastlane android firebase_distribution_staging
```



### android playstore_internal

```sh
[bundle exec] fastlane android playstore_internal
```



### android playstore_internal_aab

```sh
[bundle exec] fastlane android playstore_internal_aab
```



----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
