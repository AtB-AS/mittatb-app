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

### ios remove_use_of_beacons

```sh
[bundle exec] fastlane ios remove_use_of_beacons
```

Removes the use of beacons from the app

### ios generate_new_certificates

```sh
[bundle exec] fastlane ios generate_new_certificates
```

Generate new certificates

### ios generate_new_certificates_without_nuke

```sh
[bundle exec] fastlane ios generate_new_certificates_without_nuke
```

Generate new certificates without nuking old ones

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

Upload the build to AppCenter

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

### android appcenter_alpha

```sh
[bundle exec] fastlane android appcenter_alpha
```

----

This README.md is auto-generated and will be re-generated every time [_fastlane_](https://fastlane.tools) is run.

More information about _fastlane_ can be found on [fastlane.tools](https://fastlane.tools).

The documentation of _fastlane_ can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
