import {getServerNowGlobal} from '@atb/modules/time';
import {ONE_MINUTE_MS} from '@atb/utils/durations';
import {useInterval} from '@atb/utils/use-interval';
import {useState, useCallback} from 'react';

// Use case: filter out features with expired data
export const useMapTimeUtc = (isFocusedAndActive: boolean) => {
  const [mapTimeUtc, setMapTimeUtc] = useState(getServerNowGlobal());

  const updateMapTimeUtc = useCallback((isFocusedAndActive: boolean) => {
    isFocusedAndActive && setMapTimeUtc(getServerNowGlobal());
  }, []);

  useInterval(
    () => updateMapTimeUtc(isFocusedAndActive),
    [updateMapTimeUtc, isFocusedAndActive], // the isFocusedAndActive dependency triggers updates when important
    5 * ONE_MINUTE_MS, // frequent updates are bad for performance, and should only make a difference when tile requests fail, so keep the interval long
    false,
    true,
  );

  return mapTimeUtc;
};
