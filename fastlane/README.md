fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## iOS
### ios update_devices
```
fastlane ios update_devices
```
Update ad hoc devices
### ios get_cert
```
fastlane ios get_cert
```
Match certificates
### ios build
```
fastlane ios build
```
Build the iOS application.
### ios appcenter_staging
```
fastlane ios appcenter_staging
```
Upload the build to AppCenter
### ios appcenter_testflight
```
fastlane ios appcenter_testflight
```
Upload the build to AppCenter for distribution to TestFlight

----

## Android
### android build
```
fastlane android build
```
Upload the build to AppCenter
### android appcenter_staging
```
fastlane android appcenter_staging
```

### android appcenter_alpha
```
fastlane android appcenter_alpha
```


----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
