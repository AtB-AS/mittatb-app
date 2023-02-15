import {useIsFocused} from '@react-navigation/native';
import {differenceInSeconds} from 'date-fns';
import {useEffect} from 'react';

export function useRefreshOnFocus(
  lastUpdate: Date | undefined,
  hardRefreshLimitInSeconds: number,
  hardRefresh: () => void,
  softRefresh: () => void,
) {
  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused || !lastUpdate) return;
    const timeSinceLastTick = differenceInSeconds(Date.now(), lastUpdate);

    if (timeSinceLastTick >= hardRefreshLimitInSeconds) {
      hardRefresh();
    } else {
      softRefresh();
    }
  }, [isFocused, hardRefreshLimitInSeconds, hardRefresh, softRefresh]);
}
