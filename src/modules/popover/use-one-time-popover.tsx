import {useCallback, useEffect, useState} from 'react';
import {storage, StorageModelKeysEnum} from '@atb/modules/storage';
import {PopOverKey} from './types';

export const useOneTimePopover = () => {
  const [seenPopovers, setSeenPopOvers] = useState<string[]>([]);

  useEffect(() => {
    getSeenPopOvers().then(setSeenPopOvers);
  }, []);

  /**
   * Fetches from storage the list of one time popovers already seen by the user
   */
  const getSeenPopOvers = () =>
    storage
      .get(StorageModelKeysEnum.OneTimePopOver)
      .then((stored) => JSON.parse(stored ?? '[]') as string[]);

  const isPopOverSeen = useCallback(
    (oneTimeKey: PopOverKey) => seenPopovers?.includes(oneTimeKey),
    [seenPopovers],
  );

  const setPopOverSeen = useCallback(
    (oneTimeKey: PopOverKey) =>
      getSeenPopOvers().then((seen) => {
        const newSeen = seen.filter((f) => f !== oneTimeKey).concat(oneTimeKey);
        storage.set(
          StorageModelKeysEnum.OneTimePopOver,
          JSON.stringify(newSeen),
        );
        setSeenPopOvers(newSeen);
      }),
    [],
  );

  return {setPopOverSeen, isPopOverSeen};
};
