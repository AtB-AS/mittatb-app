import auth from '@react-native-firebase/auth';
import Bugsnag from '@bugsnag/react-native';
import {v4 as uuid} from 'uuid';

import {APP_GROUP_NAME} from '@env';

import {setInstallId as setApiInstallId} from './api/client';
import {loadLocalConfig} from './local-config';
import {storage} from '@atb/modules/storage';

export async function setupConfig() {
  await storage.setAppGroupName(APP_GROUP_NAME);
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
