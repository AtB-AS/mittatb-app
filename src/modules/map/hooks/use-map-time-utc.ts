import {getServerNowGlobal} from '@atb/modules/time';
import {ONE_SECOND_MS} from '@atb/utils/durations';
import {useInterval} from '@atb/utils/use-interval';
import {useState, useCallback, useEffect} from 'react';

// this should not be too low, as it is not good for performance to change this often
const MAP_TIME_UTC_UPDATE_INTERVAL = 30 * ONE_SECOND_MS;

// timestamp used for filtering tiles with outdated data
export const useMapTimeUtc = (isFocused: boolean) => {
  const [mapTimeUtc, setMapTimeUtc] = useState(getServerNowGlobal());

  const updateMapTimeUtc = useCallback(
    (isFocused: boolean) => {
      const now = getServerNowGlobal();
      if (isFocused && now > mapTimeUtc + MAP_TIME_UTC_UPDATE_INTERVAL) {
        setMapTimeUtc(now);
      }
    },
    [mapTimeUtc],
  );

  // update when isFocused changes
  useEffect(() => updateMapTimeUtc(isFocused), [isFocused, updateMapTimeUtc]);

  // update every 30s
  useInterval(
    () => updateMapTimeUtc(isFocused),
    [updateMapTimeUtc, isFocused],
    MAP_TIME_UTC_UPDATE_INTERVAL,
  );

  return mapTimeUtc;
};
