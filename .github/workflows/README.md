# Managing new releases
## Build staging android workflow
Each organisation with internal access must setup an [environment](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment) on Github
 with secrets required for the workflow.

---

### Secrets required for Firebase App Distribution:

 `FIREBASE_APP_ID` - Your app's Firebase App ID e.g. `app: "1:1234567890:android:0a1b2c3d4e5f67890"`

 `FIREBASE_DISTRIBUTION_CREDENTIALS` - base64 encoded service account with `Firebase App Distribution Admin role`


### Secrets required for App Center Distribution:

 `APPCENTER_ANDROID_API_KEY`


### Secrets required for all

 `KEYSTORE` - base64 encoded keystore with signing key

 `KEYSTORE_PASS` - password for keystore with signing key

 `KEYSTORE_KEY_ALIAS` - alias of key used for signing

 `KEYSTORE_KEY_PASS` - password for key used for signing

 `GIT_CRYPT_KEY`


 `BUGSNAG_API_KEY`
