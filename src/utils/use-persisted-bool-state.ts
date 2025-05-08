import {useEffect, useState} from 'react';
import {type StorageService} from '@atb/modules/storage';

export const usePersistedBoolState = (
  storage: StorageService,
  storageKey: string,
  initialState: boolean,
): [boolean, (b: boolean) => void] => {
  const [state, setState] = useState(initialState);

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
