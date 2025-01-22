# Managing new releases

## Build staging android workflow

Each organisation with internal access must setup an [environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) on Github
with secrets required for the workflow.

---

### Secrets required for Firebase App Distribution:

`FIREBASE_APP_ID` - Your Android app's Firebase App ID e.g. `1:1234567890:android:0a1b2c3d4e5f67890`

`FIREBASE_APP_ID_IOS` - Your iOS app's Firebase App ID e.g. `1:1234567890:ios:0a1b2c3d4e5f67890`

`FIREBASE_DISTRIBUTION_CREDENTIALS` - base64 encoded JSON service account with `Firebase App Distribution Admin role`

### Secrets required for all

`KEYSTORE` - base64 encoded keystore with signing key

`KEYSTORE_PASS` - password for keystore with signing key

`KEYSTORE_KEY_ALIAS` - alias of key used for signing

`KEYSTORE_KEY_PASS` - password for key used for signing

`GIT_CRYPT_KEY`

`BUGSNAG_API_KEY`

### App Store Connect API Key for uploading to TestFlight

We use Fastlanes `upload_to_testflight` to push the app to TestFlight: https://docs.fastlane.tools/actions/pilot/

This requires an API-key per organization, which is encoded into a JSON-file. Ref `app-store-connect-api-key.json` in the `build-store-ios.yml` workflow.

The following docs explain how to generate a an API-key: https://developer.apple.com/documentation/appstoreconnectapi/creating_api_keys_for_app_store_connect_api

This key must be added to a JSON-file with the following format (this is an example, not a real key):

```json
{
  "key_id": "D383SF739",
  "issuer_id": "6053b7fe-68a8-4acb-89be-165aa6465141",
  "key": "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHknlhdlYdLu\n-----END PRIVATE KEY-----",
  "duration": 1200, # optional (maximum 1200)
  "in_house": false # optional but may be required if using match/sigh
}
```

The `key_id`, and `issues_id` is available in the `Users and Access -> Keys -> App Store Connect API`-tab on App Store Connect.

The `key` is a `.p8`-file which you have to download when generating the key. You will need to manually add `\n` instead of line breaks in the key. Also remove all whitespaces.

This JSON-file must be base64-encoded and added as a `APP_STORE_CONNECT_API_KEY`-secret on Github Actions for the given organization/environment.

The command for base64-encoding (note the `-A` to output the string in a single line):
`openssl base64 -e -A -in app-store-connect-api-key.json`
