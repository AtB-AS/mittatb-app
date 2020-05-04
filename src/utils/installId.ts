import {v4 as uuid} from 'uuid';
import storage from '../storage';

let cached_id: string | null = null;

export async function getInstallId() {
  try {
    if (cached_id) return cached_id;

    const id = await storage.get('install_id');
    if (!id) {
      return await createId();
    } else {
      cached_id = id;
      return id;
    }
  } catch {
    return await createId();
  }
}

async function createId() {
  const id = uuid();
  await storage.set('install_id', id);
  cached_id = id;
  return id;
}
