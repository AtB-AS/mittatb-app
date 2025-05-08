import {v4 as uuid} from 'uuid';
import {storage} from '@atb/modules/storage';

export type LocalConfig = {
  installId: string;
};

export async function loadLocalConfig(): Promise<LocalConfig> {
  let installId = await storage.get('install_id');
  if (!installId) {
    installId = uuid();
    await storage.set('install_id', installId);
  }

  return {installId};
}
