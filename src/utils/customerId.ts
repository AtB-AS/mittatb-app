import {v4 as uuid} from 'uuid';
import storage from '../storage';
import {useState, useEffect} from 'react';

let cached_id: string | null = null;

export function useCustomerId() {
  const [id, setId] = useState<string | null>(cached_id);

  useEffect(() => {
    async function run() {
      const customerId = await getCustomerId();
      setId(customerId);
    }

    run();
  }, []);

  return id;
}

export async function getCustomerId() {
  try {
    if (cached_id) return cached_id;

    const id = await storage.get('customer_id');
    if (!id) {
      return await createCustomerId();
    } else {
      cached_id = id;
      return id;
    }
  } catch {
    return await createCustomerId();
  }
}

async function createCustomerId() {
  const id = uuid();
  await storage.set('customer_id', id);
  cached_id = id;
  return id;
}
