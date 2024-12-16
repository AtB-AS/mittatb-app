import {useEffect, useState} from 'react';
import {type StorageService} from '@atb/storage';

export const usePersistedBoolState = (
  storage: StorageService,
  storageKey: string,
): [boolean, (b: boolean) => void] => {
  const [state, setState] = useState(false);

  useEffect(() => {
    storage.get(storageKey).then((v) => {
      if (v) {
        setState(v === 'true');
      }
    });
  }, [storage, storageKey]);

  return [
    state,
    (b: boolean) => {
      setState(b);
      storage.set(storageKey, String(b));
    },
  ];
};