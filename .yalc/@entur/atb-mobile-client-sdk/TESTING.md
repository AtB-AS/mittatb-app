# Testing functionality and error handling

This is description of how to manually test the SDK's base functionality and the various error-handling use cases.

You will need to have the example code up and running to perform these tests. Follow the instructions in the [README](README.md) to get the code up and running on an **Android** or **iOS** device, before proceeding with the test cases below.

💡 Some of the error-handling cases are based on communication failure between the client and server lib, or between the SDK and backend service. To simulate these, you will need to make some changes to the code during the test.

---

## 🆕 New token

1. Press `Create token`.
    - Initiation of token succeeds.
    - Activation of token succeeds.
2. New **token ID** and **validity** should be visible on screen.
3. Pressing `Show secure container` should bring up a modal showing a QR code.

---

## ♻️ Token renewal

1. Press `Renew token`.
    - Initialization of renewal succeeds.
    - Completion of renewal succeeds.
2. New **token ID** and **validity** should be visible on screen.
3. Previous token should be **REMOVED** in backoffice.
4. Pressing `Show secure container` should bring up a modal showing a QR code, based on the new token.

### 🛠️ Error case #1 : Failure before completion
> Simulate a failure in the client before completion. Client should complete the renewal on the second try.

1. Comment out code in **example-client/src/remoteTokenService.ts** to prevent the `/complete` REQUEST from being sent to the server lib.
2. Press `Renew token`.
    - Initialization of renewal succeeds.
    - Completion of renewal is never started due to `step 1`.
3. Remove all code changes made in `step 1`.
4. Press `Renew token` again.
    - Initialization of renewal skipped.
    - Completion of renewal based on pending token from `step 2`.
5. New **token ID** and validity info should be visible on screen.

### 🛠️ Error case #2 : Failure after completion on server-side
> Simulate a failure in the client right before getting a response from the server after completion of renewal. Client should get activated token details on second try.

1. Comment out code in **example-client/src/remoteTokenService.ts** to prevent the `/complete` RESPONSE from being received by the client.
2. Press `Renew token`.
    - Initialization of renewal succeeds.
    - Completion of renewal is completed on the server, but client doesn't know due to `step 1`.
3. Remove all code changes made in `step 1`.
4. Press `Renew token` again.
    - Initialization of renewal skipped.
    - Tries to complete renewal based on pending token from `step 2`, but fails because token must be replaced.
    - Gets token details from server for already activated token.
5. New **token ID** and validity info should be visible on screen.

### 🛠️ Error case #3 : Reattestation required during initialization of renewal
> Simulate a reattestation requirement when trying to renew a token. Client should automatically retry renewal with reattestation.

1. Require reattestation on currently active token, via backoffice.
2. Press `Renew token`.
    - Initialization of renewal fails and requires reattestation due to `step 1`.
    - Initialization of renewal retried with reattestation, and succeeds.
    - Completion of renewal succeeds.
3. New **token ID** and validity info should be visible on screen.

### 🛠️ Error case #4 : Reattestation required during completion of renewal
> Simulate a reattestation requirement when trying to complete token renewal. Client should automatically retry completion with reattestation.

1. Comment out code in **example-client/src/remoteTokenService.ts** to prevent the `/complete` REQUEST from being sent to the server lib.
2. Press `Renew token`.
    - Initialization of renewal succeeds.
    - Completion of renewal is never started due to `step 1`.
3. Require reattestation on currently active token, via backoffice.
4. Remove all code changes made in `step 1`.
5. Press `Renew token` again.
    - Initialization of renewal skipped.
    - Completion of renewal fails and requires reattestation due to `step 3`.
    - Completion of renewal retried with reattestation, and succeeds.
6. New **token ID** and validity info should be visible on screen.

### 🛠️ Error case #5 : Reattestation required during get token details after renewal completion error (see error case #2).
> Simulate a reattestation requirement when trying to get the activated token details of a token that has already been activated on server-side. Client should automatically retry getting activated token details with reattestation.

1. Comment out code in **example-client/src/remoteTokenService.ts** to prevent the `/complete` RESPONSE from being received by the client.
2. Press `Renew token`.
    - Initialization of renewal succeeds.
    - Completion of renewal is completed on the server, but client doesn't know due to `step 1`.
3. Require reattestation on currently active token, via backoffice.
4. Remove all code changes made in `step 1`.
5. Press `Renew token` again.
    - Initialization of renewal skipped.
    - Tries to complete renewal based on pending token from `step 2`, but fails because token must be replaced.
    - Tries to get token details from server for already activated token, but fails and requires reattestation due to `step 3`.
    - Gets token details from server with reattestation.
6. New **token ID** and validity info should be visible on screen.

---

## 📜 Get fare contracts

1. Press `Get fare contracts`.
    - Gets fare contracts from server.
2. Currently no visible sign in the app of success. TODO?

### 🛠️ Error case #1 : Reattestation required
> Simulate a reattestation requirement when trying to get fare contracts. Client should automatically retry with reattestation.

1. Require reattestation on currently active token, via backoffice.
2. Press `Get fare contracts`.
    - Tries to get fare contracts from server, but fails and requires reattestation due to `step 1`.
    - Gets fare contracts from server with reattestation.
3. Currently no visible sign in the app of success. TODO?
---

## 🤷‍♂️ Other use cases
TODO...
