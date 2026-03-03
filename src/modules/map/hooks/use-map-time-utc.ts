import {getServerNowGlobal} from '@atb/modules/time';
import {ONE_SECOND_MS} from '@atb/utils/durations';
import {useInterval} from '@atb/utils/use-interval';
import {useState, useCallback, useEffect} from 'react';

// this should not be too low, as it is not good for performance to change this often
const MAP_TIME_UTC_UPDATE_INTERVAL = 30 * ONE_SECOND_MS;

// timestamp used for filtering tiles with outdated data
export const useMapTimeUtc = (isFocusedAndActive: boolean) => {
  const [mapTimeUtc, setMapTimeUtc] = useState(getServerNowGlobal());

  const updateMapTimeUtc = useCallback(
    (isFocusedAndActive: boolean) => {
      const now = getServerNowGlobal();
      if (
        isFocusedAndActive &&
        now > mapTimeUtc + MAP_TIME_UTC_UPDATE_INTERVAL
      ) {
        setMapTimeUtc(now);
      }
    },
    [mapTimeUtc],
  );

  // update when isFocusedAndActive changes
  useEffect(
    () => updateMapTimeUtc(isFocusedAndActive),
    [isFocusedAndActive, updateMapTimeUtc],
  );

  // update every 30s
  useInterval(
    () => updateMapTimeUtc(isFocusedAndActive),
    [updateMapTimeUtc, isFocusedAndActive],
    MAP_TIME_UTC_UPDATE_INTERVAL,
  );

  return mapTimeUtc;
};
