import auth from '@react-native-firebase/auth';
import Bugsnag from '@bugsnag/react-native';
import {v4 as uuid} from 'uuid';

import {APP_GROUP_NAME, IOS_APP_CHECK_DEBUG_TOKEN, ANDROID_APP_CHECK_DEBUG_TOKEN} from '@env';

import {setInstallId as setApiInstallId} from './api/client';
import {loadLocalConfig} from './local-config';
import {storage} from '@atb/storage';
import {firebase} from '@react-native-firebase/app-check';

export async function setupConfig() {
  await storage.setAppGroupName(APP_GROUP_NAME);
  await ensureFirstTimeSetup();
  const {installId} = await loadLocalConfig();
  Bugsnag.setUser(installId);
  setApiInstallId(installId);
  await setupAppCheck();
}

export async function setupAppCheck() {
  const appCheck = firebase.appCheck();
  const rnfbProvider = appCheck.newReactNativeFirebaseAppCheckProvider();
  rnfbProvider.configure({
    android: {
      provider: __DEV__ ? 'debug' : 'playIntegrity',
      debugToken: ANDROID_APP_CHECK_DEBUG_TOKEN
    },
    apple: {
      provider: __DEV__ ? 'debug' : 'appAttestWithDeviceCheckFallback',
      debugToken: IOS_APP_CHECK_DEBUG_TOKEN
    }
  });
  await appCheck.initializeAppCheck({
    provider: rnfbProvider,
    isTokenAutoRefreshEnabled: true
  });
}

export async function ensureFirstTimeSetup() {
  let installId = await storage.get('install_id');
  if (!installId) {
    await cleanUpAuthUser();
    installId = uuid();
    await storage.set('install_id', installId);
  }
}

/**
 * If a user exists in memory from a previous installation, the user should be
 * deleted (anonymous user) or logged out.
 */
async function cleanUpAuthUser() {
  const user = auth().currentUser;
  if (user) {
    if (user.isAnonymous) {
      await user.delete();
    } else {
      await auth().signOut();
    }
  }
}
