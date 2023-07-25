import {useEffect, useState} from 'react';
import {storage, StorageModelKeysEnum} from '@atb/storage';
import {parseBoolean} from '@atb/utils/parse-boolean';

export type UseDebugOverride = [
  boolean | undefined,
  (v?: boolean) => void,
  boolean,
];

export const useDebugOverride = (
  key: StorageModelKeysEnum,
): UseDebugOverride => {
  const [debugOverride, setDebugOverride] = useState<boolean | undefined>(
    false,
  );
  const [debugOverrideReady, setDebugOverrideReady] = useState(false);

  useEffect(() => {
    storage
      .get(key)
      .then(parseBoolean)
      .then((val) => {
        setDebugOverride(val);
        setDebugOverrideReady(true);
      });
  }, []);

  const updateDebugOverride = (val?: boolean) => {
    storage.set(key, JSON.stringify(val === undefined ? null : val));
    setDebugOverride(val);
  };

  return [debugOverride, updateDebugOverride, debugOverrideReady];
};
