# abt-mobile-client-sdk

## 📦 Dependencies

You need to set up a local `.npmrc` file with access rights for **@entur-private:registry=https://entur2.jfrog.io/entur2/api/npm/partner-npm-local/**. This is needed to download all **@entur-private** dependencies.

Here is an example of the `.npmrc` file:

```
@entur-private:registry=https://entur2.jfrog.io/entur2/api/npm/partner-npm-local/
//entur2.jfrog.io/entur2/api/npm/partner-npm-local/:_authToken=*******
```

1. Place this file in the **root** folder of the project.
2. Log into [entur2.jfrog](https://entur2.jfrog.io/) and generate an **Identity Token** for your account.
3. Copy and paste the token where it says "**authToken=**" in the `.npmrc` file.

You can then install all dependencies from the **root** folder, by running:
```bash
npm install
```

❗ All dependencies should be downloaded while you are in the **root** folder. There's no need to install anything from the underlying workspaces.

-----

## 🎮 Running the example code

You will need 3 separate terminal windows or tabs open to run the example code.

#### 1.  🏭  Running the example server
Before running the example server locally, you will have to set up some local **config** values. See the [**example-server README**](example-server/README.md) for more info.

Then, in a new terminal, navigate to the `example-server` folder, and run:
```bash
npm start
```

See the **start.sh** script for info about additional options that can be passed to this command.


#### 2. 💻 Running the example client
In a seperate terminal, navigate to the `example-client` folder, and run:
```bash
npm start
```

You might need to supply a `--reset-cache` option, if there are any issues due to larger code changes.

#### 3. 📱 Running on emulator or device
In a third terminal or tab, navigate to the `example-client` folder again.

Start your **Android emulator**, or connect your **Android** or **iOS** device to the laptop and ensure that you have a connection.  To see a list of attached **Android devices** or **Android emulators**, you can run:
```bash
adb devices
```

You might also need to run the following commands to open up for communication with an **Android device / emulator**:
```bash
adb reverse tcp:8080 tcp:8080
adb reverse tcp:3000 tcp:3000
```

While you are still in the `example-client` folder, with an **Android device / emulator** prepared, run:
```bash
npm run android
```
or with an **iOS emulator** run:
```bash
npm run ios
```

> NOTE: For mode details on iOS please follow the instructions on [iOS example-client Readme](example-client/README.md)

-----


## 🏓 Type checks and testing
####  ♻️ Typescript & linting
You can do typescript checks with:
```bash
npm run ts
```
and lint checks with:
```bash
npm run lint
```
They can be run from each individual workspace folder, or from the root folder if you want to check the entire project. Both of these actions are also available under a single command:
```bash
npm run tsint
```

####  📈 Unit tests
Typescript unit tests can be run from each individual folder, or from the root folder if you want to run all of them at once:
```
npm test
```


####  🎢 Integration tests (TODO)
Automatic end-to-end testing is currently not implemented.

Some manual test routines are described in [TESTING](TESTING.md) to test the integration by hand. These might be useful to use as a recipe when implementing the automatic integration tests.

-----


## 🏗️ Code structure

Repository is organized into folders by function.

**Name conventions:**

Regular native libraries

-   xxx-javascript-lib
-   xxx-java-lib
-   xxx-swift-lib

Libraries for mobile devices

-   xxx-android-lib
-   xxx-ios-lib

Libraries for react Native:

-   xxx-react-native-lib
