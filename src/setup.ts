import auth from '@react-native-firebase/auth';
import Bugsnag from '@bugsnag/react-native';
import {v4 as uuid} from 'uuid';

import {setInstallId as setApiInstallId} from './api/client';
import {loadLocalConfig} from './local-config';
import storage from './storage';

export async function setupConfig() {
  await ensureFirstTimeSetup();
  const {installId} = await loadLocalConfig();
  Bugsnag.setUser(installId);
  setApiInstallId(installId);
}

export async function ensureFirstTimeSetup() {
  let installId = await storage.get('install_id');
  if (!installId) {
    await cleanUpAuthUser();
    installId = uuid();
    await storage.set('install_id', installId);
  }
}

async function cleanUpAuthUser() {
  const currentUser = auth().currentUser;
  if (currentUser) {
    if (currentUser.isAnonymous) {
      // Deleting the the anonymous user from the last install
      currentUser.delete();
    } else {
      // Logging out of the previously signed in user
      await auth().signInAnonymously();
    }
  }
}
