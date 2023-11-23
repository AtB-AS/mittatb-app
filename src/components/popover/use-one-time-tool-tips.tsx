import {useCallback, useEffect, useState} from 'react';
import {storage, StorageModelKeysEnum} from '@atb/storage';
import {ToolTipKey} from './types';

export const useOneTimeToolTips = () => {
  const [toolTips, setToolTips] = useState<string[]>([]);

  useEffect(() => {
    getSeenToolTips().then(setToolTips);
  }, []);

  /**
   * Fetches from storage the list of one time tool tips already seen by the user
   */
  const getSeenToolTips = () =>
    storage
      .get(StorageModelKeysEnum.OneTimeToolTip)
      .then((stored) => JSON.parse(stored ?? '[]') as string[]);

  const isSeen = useCallback(
    (oneTimeKey: ToolTipKey) => toolTips?.includes(oneTimeKey),
    [toolTips],
  );

  const setToolTipSeen = useCallback(
    (oneTimeKey: ToolTipKey) =>
      getSeenToolTips().then((seen) => {
        const newSeen = seen.filter((f) => f !== oneTimeKey).concat(oneTimeKey);
        storage.set(
          StorageModelKeysEnum.OneTimeToolTip,
          JSON.stringify(newSeen),
        );
        setToolTips(newSeen);
      }),
    [],
  );

  return {toolTips, setToolTipSeen, isSeen};
};
