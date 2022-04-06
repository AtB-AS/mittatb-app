# Test on local iOS device

If you want to test functionality related to accessability, this is often done on a device.
This guide takes you through the steps needed to build a local version of our app on your device.
These are the steps for releasing a new major version to TestFlight / Play Store Alpha. This may be done as soon as the old version is deployed to production.

## iOS

You will need XCode installed on your Mac to be able to test the app on an iOS device.

### Grant access in App Store Connect

A team admin will need to:

At developer.apple.com:
- Give your iCloud account status as a developer in the AtB Apple Developer team

At appstoreconnect.apple.com:
- Click `Users and Access`
- Click the user account of the developer.
- Navigate to `Developer Resources`.
- Check the box `Access to Certificates, Identifiers & Profile.`
- Press `Save`.

### Select the AtB AS team in XCode

After getting the necessary permissions you will need to update your XCode configuration.

First, check that your account is added correctly to XCode:
- Open the XCode menu in the upper left corner of your screen.
- Select `Preferences`.
- Go to `Accounts` and check that the ATB AS team is present, and that your role is "Developer" or higher.
- If the info above is not present, you will need to add your iCloud account by pressing the `+` in the bottom left corner.

Finally, set ATB team as the relevant team for the app:
- Find the ATB target
- Go to Signing & Capabilities
- Check `Automaically manage signing`
- Select ATB AS as your team

Then you should be ready to test your app.

### Actually test the app

There are two ways to actually install the test build of the app in your iOS Device:

Through XCode:
- Just press the Play button in the upper left corner

Through CLI:
- `npx react-native run-ios --device "name of your connected iOS device"`

## Android

To be continued...