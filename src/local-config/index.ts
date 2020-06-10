import storage from '../storage';
import {v4 as uuid} from 'uuid';
import bugsnag from '../diagnostics/bugsnag';
import {setInstallId as setApiInstallId} from '../api/client';

type Config = {
  installId: string;
};

export async function loadLocalConfig(): Promise<Config> {
  let installId = await storage.get('install_id');
  if (!installId) {
    installId = uuid();
    await storage.set('install_id', installId);
  }

  configBugsnagUser(installId);
  configApi(installId);

  return {installId};
}

function configBugsnagUser(installId: string) {
  bugsnag.setUser(installId);
}

function configApi(installId: string) {
  setApiInstallId(installId);
}
